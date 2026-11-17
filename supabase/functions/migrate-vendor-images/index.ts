import { serve } from "jsr:@std/http@0.224.0/server";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { S3Client, HeadObjectCommand, PutObjectCommand } from "npm:@aws-sdk/client-s3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Security: Only allow authenticated admin users
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  console.log('Starting vendor image migration with authentication...');

  try {
    const { limit = 50, offset = 0, dryRun = false, vendorId = null } = await req.json().catch(() => ({ }));

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user is authenticated and has admin role  
    const token = authHeader.replace('Bearer ', '');
    const { data: user, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user.user) {
      console.error('Authentication failed:', authError);
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Admin user verified:', user.user.email);

    // Configure S3
    const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const awsRegion = Deno.env.get('AWS_REGION') || 'us-east-1';
    const s3Bucket = Deno.env.get('AWS_S3_BUCKET') || Deno.env.get('AWS_S3_BUCKET_NAME') || '';

    if (!awsAccessKeyId || !awsSecretAccessKey || !s3Bucket) {
      console.error('S3 not configured');
      return new Response(
        JSON.stringify({ error: 'S3 is not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION and AWS_S3_BUCKET or AWS_S3_BUCKET_NAME.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const s3 = new S3Client({
      region: awsRegion,
      credentials: { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey },
    });

    const isS3Image = (url: string) => url.includes('s3.amazonaws.com') || url.includes(`${s3Bucket}.s3.`);

    // Load vendors
    let vendors: any[] = [];
    if (vendorId) {
      const { data } = await supabase
        .from('vendors')
        .select('id, google_place_id, images, business_name, slug')
        .eq('id', vendorId)
        .limit(1);
      vendors = data || [];
    } else {
      const { data } = await supabase
        .from('vendors')
        .select('id, google_place_id, images, business_name, slug')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      vendors = data || [];
    }

    let processed = 0;
    let updated = 0;
    let uploadedImages = 0;
    const updatedVendorIds: string[] = [];

    for (const v of vendors) {
      try {
        processed++;
        const imgs: string[] = Array.isArray(v.images) ? v.images.filter((i: any) => typeof i === 'string' && i.length) : [];
        const existingS3 = imgs.filter((u) => isS3Image(u));
        const nonS3 = imgs.filter((u) => !isS3Image(u));

        if (nonS3.length === 0) continue;

        const newS3Urls: string[] = [];
        if (!dryRun) {
          let index = 0;
          for (const url of nonS3) {
            try {
              const key = `vendors/${v.google_place_id || v.id}/${Date.now()}-${index}.jpg`;

              // Reuse if exists
              try {
                await s3.send(new HeadObjectCommand({ Bucket: s3Bucket, Key: key }));
                const s3Url = `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${key}`;
                newS3Urls.push(s3Url);
                index++;
                continue;
              } catch (_) {
                // proceed to upload
              }

              const resp = await fetch(url);
              if (!resp.ok) {
                console.warn('Failed to fetch image, skipping:', url, resp.status);
                continue;
              }
              const arrayBuffer = await resp.arrayBuffer();
              await s3.send(new PutObjectCommand({
                Bucket: s3Bucket,
                Key: key,
                Body: new Uint8Array(arrayBuffer),
                ContentType: 'image/jpeg',
                CacheControl: 'max-age=31536000',
              }));
              const s3Url = `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${key}`;
              newS3Urls.push(s3Url);
              uploadedImages++;
              index++;
            } catch (imgErr) {
              console.error('Error migrating image for vendor', v.id, imgErr);
            }
          }
        }

        const combined = Array.from(new Set([...existingS3, ...newS3Urls]));

        if (!dryRun && combined.length > existingS3.length) {
          const { error: updateError } = await supabase
            .from('vendors')
            .update({ images: combined, last_updated: new Date().toISOString() })
            .eq('id', v.id);
          if (!updateError) {
            updated++;
            updatedVendorIds.push(v.id);
          } else {
            console.error('Failed to update vendor images', v.id, updateError);
          }
        }
      } catch (vendorErr) {
        console.error('Vendor processing error', v?.id, vendorErr);
      }
    }

    return new Response(
      JSON.stringify({ processed, updated, uploadedImages, updatedVendorIds, offset, limit, dryRun }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e: any) {
    console.error('Migration function error:', e);
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
