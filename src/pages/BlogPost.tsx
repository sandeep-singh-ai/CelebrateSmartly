import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';
import { generateMetaDescription, enhanceKeywords } from '@/utils/seoUtils';
interface BlogPost {
  id: string;
  wordpress_id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_image_url: string;
  author_name: string;
  published_date: string;
  categories: string[];
  tags: string[];
  seo_title: string;
  seo_description: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const fetchBlogPost = async (postSlug: string) => {
    try {
      setLoading(true);
      console.log('Fetching blog post with slug:', postSlug);
      
      // Fetch all posts from WordPress and find the one with matching slug
      const { data, error } = await supabase.functions.invoke('sync-wordpress-posts');
      
      if (error) {
        console.error('Error calling sync function:', error);
        throw error;
      }
      
      console.log('WordPress sync response:', data);
      
      if (data.posts && data.posts.length > 0) {
        const foundPost = data.posts.find((p: BlogPost) => p.slug === postSlug);
        if (foundPost) {
          setPost(foundPost);
          console.log('Found post:', foundPost.title);
        } else {
          console.log('Post not found with slug:', postSlug);
          setPost(null);
        }
      } else {
        console.log('No posts received from WordPress');
        setPost(null);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const div = document.createElement('div');
    div.innerHTML = content;
    const wordCount = (div.textContent || div.innerText || '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Generate enhanced meta data for SEO
  const getEnhancedMetaData = (post: BlogPost) => {
    const metaDescription = post.seo_description || 
                           post.excerpt || 
                           generateMetaDescription(post.title, post.content);
    
    const keywords = post.tags && post.tags.length > 0 
      ? enhanceKeywords(post.tags, post.content)
      : enhanceKeywords(['event planning', 'celebration', 'party'], post.content);
    
    return { metaDescription, keywords };
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-64 bg-gray-300 rounded mb-8"></div>
                <div className="h-12 bg-gray-300 rounded mb-4"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
              <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
              <Link to="/blog">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const { metaDescription, keywords } = getEnhancedMetaData(post);

  return (
    <Layout>
      <Helmet>
        <title>{post.seo_title || post.title} | CelebrateSmartly Blog</title>
        <meta 
          name="description" 
          content={metaDescription} 
        />
        <meta name="keywords" content={keywords.join(', ')} />
        
        {/* Override default meta tags */}
        <meta property="og:site_name" content="CelebrateSmartly" />
        <meta name="author" content={post.author_name} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/blog/${post.slug}`} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        <meta property="article:published_time" content={post.published_date} />
        <meta property="article:author" content={post.author_name} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={metaDescription} />
        {post.featured_image_url && (
          <meta name="twitter:image" content={post.featured_image_url} />
        )}
        
        <link rel="canonical" href={`${window.location.origin}/blog/${post.slug}`} />
        
        {/* Enhanced Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": metaDescription,
              "image": post.featured_image_url || "https://celebratesmartly.uchik.com/wp-content/uploads/2025/07/celebrate.png",
              "author": {
                "@type": "Person",
                "name": post.author_name,
                "url": `${window.location.origin}/blog`
              },
              "publisher": {
                "@type": "Organization",
                "name": "CelebrateSmartly",
                "url": window.location.origin,
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://celebratesmartly.uchik.com/wp-content/uploads/2025/07/celebrate.png",
                  "width": 400,
                  "height": 400
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${window.location.origin}/blog/${post.slug}`
              },
              "url": `${window.location.origin}/blog/${post.slug}`,
              "datePublished": post.published_date,
              "dateModified": post.published_date,
              "articleSection": post.categories && post.categories.length > 0 ? post.categories[0] : "Event Planning",
              "keywords": keywords.join(", "),
              "wordCount": post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
              "articleBody": post.excerpt || metaDescription,
              "inLanguage": "en-US",
              "isPartOf": {
                "@type": "Blog",
                "@id": `${window.location.origin}/blog`,
                "name": "CelebrateSmartly Blog",
                "description": "Expert event planning tips, celebration ideas, and party inspiration"
              }
            })
          }}
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <div className="mb-8">
              <Link to="/blog">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>

            {/* Article header */}
            <article className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
              {post.featured_image_url && (
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              )}
              
              <div className="p-8">
                {/* Categories and meta info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {post.categories && post.categories.length > 0 && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
                      {post.categories[0]}
                    </Badge>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.published_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{calculateReadTime(post.content)}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Content with WordPress-specific styling */}
                <div 
                  className="wordpress-content prose prose-lg max-w-none 
                    prose-headings:text-gray-800 prose-headings:font-bold prose-headings:leading-tight
                    prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                    prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 
                    prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
                    prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-purple-600 prose-a:hover:text-purple-700 prose-a:underline
                    prose-strong:text-gray-800 prose-strong:font-semibold
                    prose-em:text-gray-700 prose-em:italic
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                    prose-li:mb-2 prose-li:text-gray-700
                    prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                    prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto prose-img:mb-6
                    prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                    prose-table:w-full prose-table:border-collapse
                    prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 prose-th:text-left
                    prose-td:border prose-td:border-gray-300 prose-td:p-2"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* SEO Schema - moved to Helmet */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
