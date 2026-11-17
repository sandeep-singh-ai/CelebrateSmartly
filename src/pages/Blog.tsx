
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSitemap } from '@/hooks/useSitemap';
import { generateBlogListingMetaDescription, extractKeywordsFromContent } from '@/utils/seoUtils';

interface WordPressBlogPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  slug: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    author: Array<{ name: string }>;
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<Array<{ name: string; taxonomy: string }>>;
  };
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<WordPressBlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Auto-update sitemap when blog content changes
  const { updateSitemap } = useSitemap({ autoUpdate: true });

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      
      // Fetch posts with embedded data
      const postsResponse = await fetch(
        'https://celebratesmartly.uchik.com/wp-json/wp/v2/posts?_embed&per_page=50&orderby=date&order=desc'
      );
      
      if (!postsResponse.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const postsData = await postsResponse.json();
      setPosts(postsData);
      
      // Update sitemap when blog posts are loaded
      updateSitemap();

      // Fetch categories
      const categoriesResponse = await fetch(
        'https://celebratesmartly.uchik.com/wp-json/wp/v2/categories'
      );
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }

    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthorName = (post: WordPressBlogPost): string => {
    if (post._embedded?.author?.[0]?.name) {
      return post._embedded.author[0].name;
    }
    return 'Celebrate Smartly Team';
  };

  const getFeaturedImage = (post: WordPressBlogPost): string => {
    if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    return '/placeholder.svg';
  };

  const getPostCategories = (post: WordPressBlogPost): string[] => {
    if (post._embedded?.['wp:term']?.[0]) {
      return post._embedded['wp:term'][0]
        .filter(term => term.taxonomy === 'category')
        .map(term => term.name);
    }
    return [];
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(post.excerpt.rendered).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || 
      getPostCategories(post).some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const generateBlogSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Celebrate Smartly Blog",
    "description": "Expert tips, trends, and inspiration for planning unforgettable celebrations and events",
    "url": `${window.location.origin}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "Celebrate Smartly",
      "url": window.location.origin
    },
    "blogPost": currentPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title.rendered,
      "description": stripHtml(post.excerpt.rendered),
      "url": `${window.location.origin}/blog/${post.slug}`,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": getAuthorName(post)
      },
      "publisher": {
        "@type": "Organization",
        "name": "Celebrate Smartly"
      },
      "image": getFeaturedImage(post)
    }))
  });

  // Generate dynamic meta description based on current posts
  const dynamicMetaDescription = generateBlogListingMetaDescription(filteredPosts);
  
  // Generate dynamic keywords from current posts
  const generateDynamicKeywords = (): string[] => {
    const baseKeywords = ['event planning', 'party ideas', 'celebration tips', 'wedding planning', 'birthday parties'];
    
    if (filteredPosts.length > 0) {
      const postContent = filteredPosts.slice(0, 3)
        .map(post => post.title.rendered + ' ' + stripHtml(post.excerpt.rendered))
        .join(' ');
      
      const extractedKeywords = extractKeywordsFromContent(postContent, 8);
      return [...baseKeywords, ...extractedKeywords].slice(0, 12);
    }
    
    return baseKeywords;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Celebrate Smartly Blog - Event Planning Tips & Celebration Ideas</title>
        <meta 
          name="description" 
          content={dynamicMetaDescription} 
        />
        <meta name="keywords" content={generateDynamicKeywords().join(', ')} />
        
        {/* Override default meta tags */}
        <meta property="og:site_name" content="CelebrateSmartly" />
        <meta name="author" content="CelebrateSmartly Team" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Celebrate Smartly Blog - Event Planning Tips & Celebration Ideas" />
        <meta property="og:description" content={dynamicMetaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/blog`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Celebrate Smartly Blog" />
        <meta name="twitter:description" content={dynamicMetaDescription} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateBlogSchema())}
        </script>
        
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Celebrate Smartly Blog</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Expert tips, trends, and inspiration for planning unforgettable celebrations and events
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mt-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-black"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-md border-0 text-black min-w-48"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="container mx-auto px-4 py-12">
          {currentPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No blog posts found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentPosts.map((post, index) => (
                  <Card key={post.id} className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={getFeaturedImage(post)}
                        alt={post.title.rendered}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading={index < 3 ? "eager" : "lazy"}
                      />
                    </div>
                    
                    <CardHeader className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getPostCategories(post).slice(0, 2).map(category => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <CardTitle className="text-xl line-clamp-2 hover:text-purple-600 transition-colors">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title.rendered}
                        </Link>
                      </CardTitle>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{getAuthorName(post)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-3">
                        {stripHtml(post.excerpt.rendered)}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full group hover:bg-purple-50 hover:border-purple-300"
                        asChild
                      >
                        <Link to={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
