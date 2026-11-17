
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
    console.log('Starting WordPress sync...')

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Updated WordPress domain
    const baseUrl = 'https://celebratesmartly.uchik.com'
    
    // Function to fetch all posts with pagination
    const fetchAllPosts = async () => {
      let allPosts = []
      let page = 1
      let hasMore = true
      let lastSuccessUrl = null
      
      while (hasMore) {
        const endpoints = [
          `${baseUrl}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed`,
          `${baseUrl}/wp-json/wp/v2/posts?per_page=100&page=${page}&status=publish&_embed`,
          `${baseUrl}/wp-json/wp/v2/posts?per_page=100&page=${page}`,
          `${baseUrl}/wp-json/wp/v2/posts?page=${page}`
        ]

        let pagePosts = null
        let successUrl = null

        for (const wpUrl of endpoints) {
          try {
            console.log(`Trying endpoint (page ${page}):`, wpUrl)
            const response = await fetch(wpUrl)
            
            if (response.ok) {
              pagePosts = await response.json()
              successUrl = wpUrl
              lastSuccessUrl = wpUrl
              console.log(`Success with endpoint (page ${page}): ${wpUrl}`)
              console.log(`Fetched ${pagePosts.length} posts from page ${page}`)
              break
            } else {
              console.log(`Failed with ${wpUrl}: ${response.status} ${response.statusText}`)
            }
          } catch (endpointError) {
            console.log(`Error with ${wpUrl}:`, endpointError.message)
            continue
          }
        }

        if (!pagePosts || pagePosts.length === 0) {
          hasMore = false
          break
        }

        allPosts = allPosts.concat(pagePosts)
        
        // If we got less than 100 posts, we've reached the end
        if (pagePosts.length < 100) {
          hasMore = false
        } else {
          page++
        }
      }
      
      return { posts: allPosts, totalFetched: allPosts.length, successUrl: lastSuccessUrl }
    }

    const { posts: wordpressPosts, totalFetched, successUrl } = await fetchAllPosts()
    
    if (!wordpressPosts || wordpressPosts.length === 0) {

      // Try to check if WordPress REST API is available at all
      try {
        const apiCheck = await fetch(`${baseUrl}/wp-json/`)
        if (apiCheck.ok) {
          const apiInfo = await apiCheck.json()
          console.log('WordPress API is available:', apiInfo)
        } else {
          console.log('WordPress API check failed:', apiCheck.status, apiCheck.statusText)
        }
      } catch (apiError) {
        console.log('WordPress API completely unavailable:', apiError.message)
      }

      throw new Error('Failed to fetch WordPress posts from any endpoint')
    }
    
    console.log(`Total posts fetched across all pages: ${totalFetched}`)

    // Log first few post titles for debugging
    if (Array.isArray(wordpressPosts) && wordpressPosts.length > 0) {
      wordpressPosts.slice(0, 10).forEach((post: any, index: number) => {
        console.log(`Post ${index + 1}: "${post.title?.rendered || post.title}" (ID: ${post.id}, Status: ${post.status || 'unknown'})`)
      })
    }

    const posts = []

    for (const post of wordpressPosts) {
      try {
        // Extract featured image
        let featuredImageUrl = null
        if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          featuredImageUrl = post._embedded['wp:featuredmedia'][0].source_url
        } else if (post.featured_media && post.featured_media > 0) {
          // Try to get featured image URL from media ID
          try {
            const mediaResponse = await fetch(`${baseUrl}/wp-json/wp/v2/media/${post.featured_media}`)
            if (mediaResponse.ok) {
              const mediaData = await mediaResponse.json()
              featuredImageUrl = mediaData.source_url
            }
          } catch (mediaError) {
            console.log(`Could not fetch media for post ${post.id}:`, mediaError.message)
          }
        }

        // Extract author name
        let authorName = 'Admin'
        if (post._embedded?.author?.[0]?.name) {
          authorName = post._embedded.author[0].name
        }

        // Extract categories
        let categories = []
        if (post._embedded?.['wp:term']?.[0]) {
          categories = post._embedded['wp:term'][0].map((cat: any) => cat.name)
        }

        // Extract tags
        let tags = []
        if (post._embedded?.['wp:term']?.[1]) {
          tags = post._embedded['wp:term'][1].map((tag: any) => tag.name)
        }

        // Handle different title formats
        const title = typeof post.title === 'object' ? post.title.rendered : post.title
        const content = typeof post.content === 'object' ? post.content.rendered : post.content
        const excerpt = typeof post.excerpt === 'object' ? post.excerpt.rendered : post.excerpt

        const blogPost = {
          wordpress_id: post.id,
          title: title || 'Untitled',
          content: content || '',
          excerpt: excerpt || '',
          slug: post.slug || `post-${post.id}`,
          featured_image_url: featuredImageUrl,
          author_name: authorName,
          published_date: post.date || new Date().toISOString(),
          categories: categories,
          tags: tags,
          seo_title: post.yoast_head_json?.title || title || 'Untitled',
          seo_description: post.yoast_head_json?.description || (excerpt ? excerpt.replace(/<[^>]*>/g, '').substring(0, 160) : ''),
          last_updated: new Date().toISOString()
        }

        posts.push(blogPost)
        console.log(`Successfully processed post: "${title}"`)

      } catch (postError) {
        console.error(`Error processing post ${post.id}:`, postError)
        // Continue processing other posts even if one fails
      }
    }

    console.log(`Successfully processed ${posts.length} blog posts`)
    console.log(`Successfully used endpoint: ${successUrl}`)

    // Sync posts to database
    console.log('Syncing posts to database...')
    
    // Clear existing cached posts
    const { error: deleteError } = await supabase
      .from('blog_posts_cache')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows
    
    if (deleteError) {
      console.log('Warning: Could not clear existing posts:', deleteError.message)
    } else {
      console.log('Cleared existing cached posts')
    }

    // Insert new posts
    if (posts.length > 0) {
      const { error: insertError } = await supabase
        .from('blog_posts_cache')
        .insert(posts)

      if (insertError) {
        console.error('Error syncing posts to database:', insertError)
        throw new Error(`Failed to sync posts to database: ${insertError.message}`)
      }

      console.log(`Successfully synced ${posts.length} posts to database`)
    }

    // Automatically update sitemap after successful sync
    console.log('Triggering sitemap update...')
    try {
      const sitemapResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/update-sitemap`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (sitemapResponse.ok) {
        const sitemapData = await sitemapResponse.json()
        console.log('Sitemap updated successfully:', sitemapData.message)
      } else {
        console.error('Failed to update sitemap:', sitemapResponse.statusText)
      }
    } catch (sitemapError) {
      console.error('Error triggering sitemap update:', sitemapError)
      // Don't fail the main sync operation if sitemap update fails
    }

    return new Response(JSON.stringify({ 
      success: true, 
      posts: posts,
      fetched_count: wordpressPosts.length,
      processed_count: posts.length,
      endpoint_used: successUrl,
      message: `Successfully fetched and cached ${posts.length} posts from WordPress and triggered sitemap update`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in sync function:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      details: 'Check the function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
