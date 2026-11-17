
import { serve } from "jsr:@std/http@0.224.0/server"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { S3Client, HeadObjectCommand, PutObjectCommand } from "npm:@aws-sdk/client-s3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location, category, radius } = await req.json()
    
    console.log('Search request received:', { location, category, radius })
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Initialize S3 (required)
    const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID')
    const awsSecretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY')
    const awsRegion = Deno.env.get('AWS_REGION') || 'us-east-1'
    const s3Bucket = Deno.env.get('AWS_S3_BUCKET') || Deno.env.get('AWS_S3_BUCKET_NAME') || ''
    const s3 = (awsAccessKeyId && awsSecretAccessKey && s3Bucket) ? new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    }) : null

    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
    if (!googleApiKey) {
      console.error('Google Places API key not configured')
      throw new Error('Google Places API key not configured')
    }

    console.log('Google API key found:', googleApiKey ? 'Yes' : 'No')

    if (!s3 || !s3Bucket) {
      console.error('S3 not configured')
      return new Response(JSON.stringify({ error: 'S3 is not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION and AWS_S3_BUCKET or AWS_S3_BUCKET_NAME.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }})
    }

    // Build search query
    let query = location
    if (category && category.trim()) {
      query = `${category} in ${location}`
    } else {
      query = `event vendors in ${location}`
    }

    console.log('Searching Google Places with query:', query)

    // First, check if we have recent vendors for this location (within 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    try {
      const { data: existingVendors } = await supabaseClient
        .from('vendors')
        .select('*')
        .ilike('address', `%${location}%`)
        .gte('last_google_update', thirtyDaysAgo.toISOString())

      if (existingVendors && existingVendors.length > 0) {
        console.log('Found', existingVendors.length, 'cached vendors for location:', location)
        return new Response(
          JSON.stringify({ vendors: existingVendors, total: existingVendors.length, cached: true }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } catch (dbError) {
      console.error('Database error when checking cached vendors:', dbError)
      // Continue with Google search even if cache check fails
    }

    // Search Google Places
    const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&radius=${radius * 1609}&key=${googleApiKey}`
    console.log('Making Google Places API request to:', placesUrl.replace(googleApiKey, '[REDACTED]'))
    
    const placesResponse = await fetch(placesUrl)

    if (!placesResponse.ok) {
      console.error('Google Places API response not ok:', placesResponse.status, placesResponse.statusText)
      const errorText = await placesResponse.text()
      console.error('Google Places API error response:', errorText)
      throw new Error(`Google Places API error: ${placesResponse.status} ${placesResponse.statusText}`)
    }

    const placesData = await placesResponse.json()
    console.log('Google Places API response status:', placesData.status)
    console.log('Google Places returned:', placesData.results?.length || 0, 'results')
    
    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error status:', placesData.status, placesData.error_message)
      throw new Error(`Google Places API error: ${placesData.status} - ${placesData.error_message || 'Unknown error'}`)
    }

    if (!placesData.results || placesData.results.length === 0) {
      console.log('No results from Google Places API')
      return new Response(
        JSON.stringify({ vendors: [], total: 0, cached: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const vendors = []

    for (const place of placesData.results.slice(0, 10)) { // Limit to 10 results for performance
      try {
        console.log('Processing place:', place.name)
        
        // Get detailed information for each place
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,photos,reviews,business_status,types&key=${googleApiKey}`
        const detailsResponse = await fetch(detailsUrl)

        if (!detailsResponse.ok) {
          console.log('Failed to get details for place:', place.name)
          continue
        }

        const detailsData = await detailsResponse.json()
        
        if (detailsData.status !== 'OK') {
          console.log('Details API error for place:', place.name, detailsData.status)
          continue
        }

        const details = detailsData.result

        // Check if we already have this vendor
        const { data: existingVendor } = await supabaseClient
          .from('vendors')
          .select('*')
          .eq('google_place_id', place.place_id)
          .single()

        let images = []
        
        // Process images if available
        if (details.photos && details.photos.length > 0) {
          console.log('Processing', Math.min(details.photos.length, 3), 'images for:', details.name)
          
          for (const photo of details.photos.slice(0, 3)) {
            const fileName = `vendor-${place.place_id}-${photo.photo_reference}.jpg`
            
            try {
              let imageUrl: string | null = null
              const key = `vendors/${place.place_id}/${photo.photo_reference}.jpg`

              if (s3) {
                try {
                  // Check if object exists
                  try {
                    await s3.send(new HeadObjectCommand({ Bucket: s3Bucket, Key: key }))
                    imageUrl = `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${key}`
                    console.log('Using existing S3 image:', key)
                  } catch (_headErr) {
                    // Upload to S3
                    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${googleApiKey}`
                    const imageResponse = await fetch(photoUrl)
                    if (imageResponse.ok) {
                      const arrayBuffer = await imageResponse.arrayBuffer()
                      await s3.send(new PutObjectCommand({
                        Bucket: s3Bucket,
                        Key: key,
                        Body: new Uint8Array(arrayBuffer),
                        ContentType: 'image/jpeg'
                      }))
                      imageUrl = `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${key}`
                      console.log('Uploaded image to S3:', key)
                    } else {
                      console.error('Failed to download image from Google for S3 upload')
                    }
                  }
                } catch (s3err) {
                  console.error('S3 error, falling back to Supabase storage:', s3err)
                }
              }


              if (imageUrl) {
                images.push(imageUrl)
              }
            } catch(e) {
              console.error("Error processing image for", details.name, ":", e)
            }
          }
        }

        // If no images were processed but existing vendor has images, keep existing ones
        if (images.length === 0 && existingVendor && existingVendor.images && existingVendor.images.length > 0) {
          images = existingVendor.images
          console.log('Keeping existing images for:', details.name)
        }

        // Determine business type based on Google Places types
        let businessType = 'Event Services'
        const types = details.types || []
        if (types.includes('restaurant') || types.includes('food')) businessType = 'Catering'
        else if (types.includes('florist')) businessType = 'Florist'
        else if (types.includes('photographer')) businessType = 'Photography'
        else if (types.includes('entertainment')) businessType = 'Entertainment'

        const vendorData = {
          business_name: details.name,
          business_type: businessType,
          description: details.name,
          address: details.formatted_address,
          phone: details.formatted_phone_number,
          website: details.website,
          rating: details.rating || 0,
          review_count: details.user_ratings_total || 0,
          google_place_id: place.place_id,
          google_data: details,
          images: images,
          last_google_update: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          is_premium: false,
          slug: `${details.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}-${details.formatted_address.split(',')[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`
        }

        if (existingVendor) {
          // Update existing vendor
          const { error: updateError } = await supabaseClient
            .from('vendors')
            .update(vendorData)
            .eq('google_place_id', place.place_id)

          if (!updateError) {
            vendors.push({ ...vendorData, id: existingVendor.id })
            console.log('Updated existing vendor:', details.name)
          } else {
            console.error('Update error for vendor:', details.name, updateError)
          }
        } else {
          // Insert new vendor - we need to find or create a system user first
          let systemUserId = null
          
          // Try to find an existing system user or use the first user
          const { data: anyUser } = await supabaseClient
            .from('profiles')
            .select('id')
            .limit(1)

          if (anyUser && anyUser.length > 0) {
            systemUserId = anyUser[0].id
          }

          if (systemUserId) {
            const { data: newVendor, error: insertError } = await supabaseClient
              .from('vendors')
              .insert({ ...vendorData, user_id: systemUserId })
              .select()
              .single()

            if (!insertError && newVendor) {
              vendors.push(newVendor)
              console.log('Created new vendor:', details.name)
            } else {
              console.error('Insert error for vendor:', details.name, insertError)
            }
          } else {
            console.log('No user found to associate with Google vendor, skipping:', details.name)
          }
        }
      } catch (placeError) {
        console.error('Error processing place:', place.name, placeError)
        // Continue with next place
      }
    }

    console.log('Successfully processed', vendors.length, 'vendors')

    return new Response(
      JSON.stringify({ vendors, total: vendors.length, cached: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
