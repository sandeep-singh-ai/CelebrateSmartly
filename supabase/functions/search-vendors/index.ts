
import { serve } from 'jsr:@std/http@0.224.0/server'
import { createClient } from 'jsr:@supabase/supabase-js@2'

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

    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // For demo purposes, I'll create some mock data since we don't have Google Places API key
    // In production, you would call Google Places API here
    const mockVendors = [
      {
        business_name: `${category || 'Event'} Specialists in ${location}`,
        business_type: category || 'Event Services',
        description: `Professional ${category?.toLowerCase() || 'event'} services in ${location}. High-quality service with attention to detail.`,
        address: `${location}, Local Area`,
        phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `info@${(category || 'event').toLowerCase().replace(/\s+/g, '')}specialists.com`,
        website: `www.${(category || 'event').toLowerCase().replace(/\s+/g, '')}specialists.com`,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
        review_count: Math.floor(Math.random() * 200) + 20,
        images: [],
        is_premium: Math.random() > 0.7,
        google_place_id: `place_${Math.random().toString(36).substr(2, 9)}`,
        google_data: {
          place_id: `place_${Math.random().toString(36).substr(2, 9)}`,
          types: ['establishment', 'point_of_interest'],
          formatted_address: `${location}, Local Area`
        }
      }
    ]

    // Generate more vendors based on category
    const additionalVendors = Array.from({ length: Math.floor(Math.random() * 8) + 2 }, (_, i) => ({
      ...mockVendors[0],
      business_name: `${category || 'Event'} Pro ${i + 2}`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      review_count: Math.floor(Math.random() * 150) + 15,
      phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      google_place_id: `place_${Math.random().toString(36).substr(2, 9)}`,
      is_premium: Math.random() > 0.8
    }))

    const allVendors = [...mockVendors, ...additionalVendors]

    // Store vendors in database
    for (const vendor of allVendors) {
      const slug = `${vendor.business_name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}-${vendor.address.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`
      
      await supabaseClient
        .from('vendors')
        .upsert({
          business_name: vendor.business_name,
          business_type: vendor.business_type,
          description: vendor.description,
          address: vendor.address,
          phone: vendor.phone,
          email: vendor.email,
          website: vendor.website,
          rating: vendor.rating,
          review_count: vendor.review_count,
          images: vendor.images,
          is_premium: vendor.is_premium,
          google_place_id: vendor.google_place_id,
          google_data: vendor.google_data,
          slug: slug,
          last_google_update: new Date().toISOString(),
          user_id: '00000000-0000-0000-0000-000000000000' // System user for Google-sourced vendors
        }, {
          onConflict: 'google_place_id'
        })
    }

    return new Response(JSON.stringify({ vendors: allVendors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
