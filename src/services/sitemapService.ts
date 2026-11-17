interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

class SitemapService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://www.celebratesmartly.com';
  }

  // Static routes from the application
  private getStaticRoutes(): SitemapUrl[] {
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
      loc: `${this.baseUrl}${route.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: route.changefreq,
      priority: route.priority
    }));
  }

  // Fetch blog posts from cached database
  private async getBlogUrls(): Promise<SitemapUrl[]> {
    try {
      // First try to get from cached database
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: cachedPosts, error } = await supabase
        .from('blog_posts_cache')
        .select('slug, published_date, last_updated')
        .order('published_date', { ascending: false });

      if (!error && cachedPosts && cachedPosts.length > 0) {
        return cachedPosts.map((post: any) => ({
          loc: `${this.baseUrl}/blog/${post.slug}`,
          lastmod: new Date(post.last_updated || post.published_date).toISOString().split('T')[0],
          changefreq: 'weekly' as const,
          priority: 0.7
        }));
      }

      // Fallback to WordPress API if database is empty
      const response = await fetch(
        'https://celebratesmartly.uchik.com/wp-json/wp/v2/posts?per_page=100&orderby=date&order=desc'
      );
      
      if (!response.ok) {
        console.error('Failed to fetch blog posts for sitemap');
        return [];
      }

      const posts = await response.json();
      
      return posts.map((post: any) => ({
        loc: `${this.baseUrl}/blog/${post.slug}`,
        lastmod: new Date(post.modified || post.date).toISOString().split('T')[0],
        changefreq: 'weekly' as const,
        priority: 0.7
      }));
    } catch (error) {
      console.error('Error fetching blog posts for sitemap:', error);
      return [];
    }
  }

  // Generate sitemap XML content
  private generateSitemapXML(urls: SitemapUrl[]): string {
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
</urlset>`;
  }

  // Generate sitemap XML
  async generateSitemap(): Promise<string> {
    const staticUrls = this.getStaticRoutes();
    const blogUrls = await this.getBlogUrls();
    const tagUrls = await this.getTagRoutes();
    
    const allUrls = [...staticUrls, ...blogUrls, ...tagUrls];
    
    return this.generateSitemapXML(allUrls);
  }

  // Get tag routes from cached blog posts
  private async getTagRoutes(): Promise<SitemapUrl[]> {
    const urls: SitemapUrl[] = [];
    const tags = new Set<string>();
    
    try {
      // Get tags from cached database
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: cachedPosts, error } = await supabase
        .from('blog_posts_cache')
        .select('tags');

      if (!error && cachedPosts) {
        cachedPosts.forEach((post: any) => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => {
              // Convert tag to slug format
              const tagSlug = tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              if (tagSlug) {
                tags.add(tagSlug);
              }
            });
          }
        });

        // Create tag URLs
        tags.forEach(tag => {
          urls.push({
            loc: `${this.baseUrl}/tag/${tag}`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: 0.6
          });
        });
      }
    } catch (error) {
      console.error('Error fetching tags for sitemap:', error);
    }

    return urls;
  }

  // Update sitemap using the edge function
  async updateSitemap(): Promise<void> {
    try {
      const response = await fetch('https://kthnwmgkdkuleuysobru.supabase.co/functions/v1/update-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sitemap updated successfully:', data.message);
        
        // Store the generated sitemap locally for backup
        if (data.sitemap) {
          localStorage.setItem('sitemap_xml', data.sitemap);
          localStorage.setItem('sitemap_last_updated', new Date().toISOString());
        }
      } else {
        throw new Error(`Failed to update sitemap: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating sitemap:', error);
      
      // Fallback: generate sitemap locally
      const sitemapXML = await this.generateSitemap();
      localStorage.setItem('sitemap_xml', sitemapXML);
      localStorage.setItem('sitemap_last_updated', new Date().toISOString());
      console.log('Generated sitemap locally as fallback');
    }
  }

  // Get last update time
  getLastUpdateTime(): string | null {
    return localStorage.getItem('sitemap_last_updated');
  }

  // Get cached sitemap
  getCachedSitemap(): string | null {
    return localStorage.getItem('sitemap_xml');
  }
}

export const sitemapService = new SitemapService();