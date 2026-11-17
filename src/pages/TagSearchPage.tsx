import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import { BlogLoadingSkeleton } from '@/components/blog/BlogLoadingSkeleton';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { useSitemap } from '@/hooks/useSitemap';
import { supabase } from '@/integrations/supabase/client';

interface CachedBlogPost {
  id: string;
  wordpress_id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_image_url: string | null;
  author_name: string | null;
  published_date: string;
  categories: any;
  tags: any;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  last_updated: string;
}

const TagSearchPage = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const [posts, setPosts] = useState<CachedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
  const [cleanedTag, setCleanedTag] = useState('');

  // Auto-update sitemap when tag content changes
  const { updateSitemap } = useSitemap({ autoUpdate: true });

  // Clean tag name and extract keywords
  const processTagName = (tag: string): { cleaned: string; keywords: string[] } => {
    // Remove special characters and replace with spaces
    const cleaned = tag.replace(/[-_]/g, ' ').toLowerCase();
    // Split into keywords and filter out empty strings
    const keywords = cleaned.split(' ').filter(keyword => keyword.trim().length > 0);
    return { cleaned, keywords };
  };

  // Search blog posts based on keywords with relevance scoring
  const searchBlogPosts = (posts: CachedBlogPost[], keywords: string[]): CachedBlogPost[] => {
    if (!keywords.length) return [];

    console.log(`Searching ${posts.length} posts for keywords:`, keywords);

    // Score posts based on keyword matches
    const scoredPosts = posts.map(post => {
      const title = (post.title || '').toLowerCase();
      const content = (post.content || '').toLowerCase();
      const excerpt = (post.excerpt || '').toLowerCase();
      const categories = JSON.stringify(Array.isArray(post.categories) ? post.categories : []).toLowerCase();
      const tags = JSON.stringify(Array.isArray(post.tags) ? post.tags : []).toLowerCase();
      
      let score = 0;
      let hasMatch = false;
      
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase().trim();
        if (keywordLower.length === 0) return;
        
        // Title matches get highest score
        if (title.includes(keywordLower)) {
          score += 10;
          hasMatch = true;
        }
        
        // Tag and category matches get high score
        if (tags.includes(keywordLower) || categories.includes(keywordLower)) {
          score += 7;
          hasMatch = true;
        }
        
        // Excerpt matches get medium score
        if (excerpt.includes(keywordLower)) {
          score += 5;
          hasMatch = true;
        }
        
        // Content matches get lower score
        if (content.includes(keywordLower)) {
          score += 2;
          hasMatch = true;
        }
      });
      
      return { post, score, hasMatch };
    })
    .filter(item => item.hasMatch)
    .sort((a, b) => b.score - a.score)
    .map(item => item.post);

    console.log(`Search returned ${scoredPosts.length} results`);
    return scoredPosts;
  };

  const fetchBlogData = async () => {
    if (!tagName) return;

    const { cleaned, keywords } = processTagName(tagName);
    setCleanedTag(cleaned);
    setSearchKeywords(keywords);

    try {
      setLoading(true);

      // Fetch cached posts from database
      const { data: cachedPosts, error } = await supabase
        .from('blog_posts_cache')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) {
        console.error('Error fetching cached posts:', error);
        // Fallback to direct WordPress API call
        const response = await fetch('https://kthnwmgkdkuleuysobru.supabase.co/functions/v1/sync-wordpress-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.posts) {
            // Convert WordPress format to cached format for consistency
            const convertedPosts = data.posts.map((post: any) => ({
              id: post.wordpress_id?.toString() || post.id?.toString(),
              wordpress_id: post.wordpress_id || post.id,
              title: post.title?.rendered ? post.title.rendered : post.title,
              content: post.content?.rendered ? post.content.rendered : post.content,
              excerpt: post.excerpt?.rendered ? post.excerpt.rendered : post.excerpt,
              slug: post.slug,
              featured_image_url: post.featured_image_url,
              author_name: post.author_name,
              published_date: post.published_date || post.date,
              categories: post.categories || [],
              tags: post.tags || [],
              seo_title: post.seo_title,
              seo_description: post.seo_description,
              created_at: new Date().toISOString(),
              last_updated: new Date().toISOString()
            }));
            
            const filteredPosts = searchBlogPosts(convertedPosts, keywords);
            setPosts(filteredPosts);
          }
        }
      } else {
        // Filter cached posts based on tag keywords
        const filteredPosts = searchBlogPosts(cachedPosts || [], keywords);
        setPosts(filteredPosts);
      }
      
      // Update sitemap with new tag search pages
      updateSitemap();
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [tagName]);

  // Helper functions for blog post display
  const getAuthorName = (post: CachedBlogPost): string => {
    return post.author_name || 'Anonymous';
  };

  const getFeaturedImage = (post: CachedBlogPost): { url: string; alt: string } | null => {
    return post.featured_image_url ? { url: post.featured_image_url, alt: '' } : null;
  };

  const getPostCategories = (post: CachedBlogPost): string[] => {
    return Array.isArray(post.categories) ? post.categories : (post.categories ? [post.categories] : []);
  };

  const stripHtml = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = stripHtml(content).split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const generateTagSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      "name": `${cleanedTag} - Blog Posts`,
      "description": `Discover blog posts related to ${cleanedTag}. Find articles, tips, and insights about ${cleanedTag} on Celebrate Smartly.`,
      "url": `https://www.celebratesmartly.com/tag/${tagName}`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": posts.length,
        "itemListElement": posts.map((post, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "BlogPosting",
            "headline": stripHtml(post.title),
            "description": stripHtml(post.excerpt),
            "url": `https://www.celebratesmartly.com/blog/${post.slug}`,
            "datePublished": post.published_date,
            "author": {
              "@type": "Person",
              "name": getAuthorName(post)
            }
          }
        }))
      }
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <BlogLoadingSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{`${cleanedTag} - Blog Posts | Celebrate Smartly`}</title>
        <meta 
          name="description" 
          content={`Discover ${posts.length} blog posts related to ${cleanedTag}. Find articles, tips, and insights about ${cleanedTag} on Celebrate Smartly.`} 
        />
        <meta name="keywords" content={`${cleanedTag}, ${searchKeywords.join(', ')}, blog, articles, celebrate smartly`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${cleanedTag} - Blog Posts | Celebrate Smartly`} />
        <meta property="og:description" content={`Discover ${posts.length} blog posts related to ${cleanedTag}. Find articles, tips, and insights.`} />
        <meta property="og:url" content={`https://www.celebratesmartly.com/tag/${tagName}`} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${cleanedTag} - Blog Posts | Celebrate Smartly`} />
        <meta name="twitter:description" content={`Discover ${posts.length} blog posts related to ${cleanedTag}.`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://www.celebratesmartly.com/tag/${tagName}`} />
        
        {generateTagSchema()}
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Tag className="h-6 w-6 text-primary" />
                <Badge variant="secondary" className="text-sm">
                  Tag Search Results
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Posts about "{cleanedTag}"
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Found {posts.length} blog post{posts.length !== 1 ? 's' : ''} matching your search
              </p>
              
              {searchKeywords.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="text-sm text-muted-foreground mr-2">Search keywords:</span>
                  {searchKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}

              <Link to="/blog">
                <Button variant="outline" className="gap-2">
                  <Search className="h-4 w-4" />
                  Browse All Posts
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    post={{
                      id: post.id,
                      wordpress_id: post.wordpress_id,
                      title: stripHtml(post.title),
                      content: post.content,
                      excerpt: stripHtml(post.excerpt),
                      slug: post.slug,
                      featured_image_url: getFeaturedImage(post)?.url || '',
                      author_name: getAuthorName(post),
                      published_date: post.published_date,
                      categories: getPostCategories(post),
                      tags: Array.isArray(post.tags) ? post.tags : [],
                      seo_title: post.seo_title || stripHtml(post.title),
                      seo_description: post.seo_description || stripHtml(post.excerpt)
                    }}
                    formatDate={formatDate}
                    stripHtml={stripHtml}
                    calculateReadTime={calculateReadTime}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any blog posts matching "{cleanedTag}". 
                  Try browsing our recent posts or search for something else.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link to="/blog">
                    <Button className="gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Browse All Posts
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default TagSearchPage;