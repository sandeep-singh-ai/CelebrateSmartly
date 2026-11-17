import { serve } from 'jsr:@std/http@0.224.0/server'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting sitemap update...')

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const baseUrl = 'https://www.celebratesmartly.com'

    // Static routes
    const getStaticRoutes = (): SitemapUrl[] => {
      const staticRoutes = [
        { path: '/', priority: 1.0, changefreq: 'daily' as const },
        { path: '/about', priority: 0.8, changefreq: 'monthly' as const },
        { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
        { path: '/blog', priority: 0.9, changefreq: 'daily' as const },
        { path: '/faq', priority: 0.6, changefreq: 'monthly' as const },
        { path: '/help', priority: 0.6, changefreq: 'monthly' as const },
        { path: '/pricing', priority: 0.8, changefreq: 'monthly' as const },
        { path: '/vendors', priority: 0.8, changefreq: 'daily' as const },
        { path: '/vendor-search', priority: 0.7, changefreq: 'daily' as const },
        { path: '/premium-vendors', priority: 0.7, changefreq: 'weekly' as const },
        { path: '/your-local-vendor', priority: 0.7, changefreq: 'weekly' as const },
      ];

      return staticRoutes.map(route => ({
        loc: `${baseUrl}${route.path}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: route.changefreq,
        priority: route.priority
      }));
    }

    // Get blog URLs from cached posts
    const getBlogUrls = async (): Promise<SitemapUrl[]> => {
      try {
        const { data: cachedPosts, error } = await supabase
          .from('blog_posts_cache')
          .select('slug, published_date, last_updated')
          .order('published_date', { ascending: false });

        if (error) {
          console.error('Error fetching cached blog posts:', error);
          return [];
        }

        return cachedPosts?.map((post: any) => ({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: new Date(post.last_updated || post.published_date).toISOString().split('T')[0],
          changefreq: 'weekly' as const,
          priority: 0.7
        })) || [];
      } catch (error) {
        console.error('Error getting blog URLs:', error);
        return [];
      }
    }

    // Get tag routes from cached posts
    const getTagRoutes = async (): Promise<SitemapUrl[]> => {
      const urls: SitemapUrl[] = [];
      const tags = new Set<string>();
      
      try {
        const { data: cachedPosts, error } = await supabase
          .from('blog_posts_cache')
          .select('tags');

        if (!error && cachedPosts) {
          cachedPosts.forEach((post: any) => {
            if (post.tags && Array.isArray(post.tags)) {
              post.tags.forEach((tag: string) => {
                const tagSlug = tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                if (tagSlug) {
                  tags.add(tagSlug);
                }
              });
            }
          });

          tags.forEach(tag => {
            urls.push({
              loc: `${baseUrl}/tag/${tag}`,
              lastmod: new Date().toISOString().split('T')[0],
              changefreq: 'weekly',
              priority: 0.6
            });
          });
        }
      } catch (error) {
        console.error('Error getting tag routes:', error);
      }

      return urls;
    }

    // Generate sitemap XML
    const generateSitemapXML = (urls: SitemapUrl[]): string => {
      const urlElements = urls.map(url => {
        return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
      }).join('\n');

      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
  <!-- Dynamic blog posts and tag search pages are automatically added by the sitemap service -->
</urlset>`;
    }

    // Generate complete sitemap
    const staticUrls = getStaticRoutes();
    const blogUrls = await getBlogUrls();
    const tagUrls = await getTagRoutes();
    
    const allUrls = [...staticUrls, ...blogUrls, ...tagUrls];
    const sitemapXML = generateSitemapXML(allUrls);

    console.log(`Generated sitemap with ${allUrls.length} URLs (${staticUrls.length} static, ${blogUrls.length} blog posts, ${tagUrls.length} tags)`)

    // In a production environment, you would save this to your web server's public directory
    // For now, we'll return the sitemap content for manual deployment or processing
    
    return new Response(JSON.stringify({ 
      success: true,
      sitemap: sitemapXML,
      url_count: allUrls.length,
      blog_posts: blogUrls.length,
      tags: tagUrls.length,
      message: `Sitemap generated successfully with ${allUrls.length} URLs`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
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