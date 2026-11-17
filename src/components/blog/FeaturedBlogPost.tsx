
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface FeaturedBlogPostProps {
  post: BlogPost;
  formatDate: (dateString: string) => string;
  stripHtml: (html: string) => string;
  calculateReadTime: (content: string) => string;
}

export const FeaturedBlogPost = ({ 
  post, 
  formatDate, 
  stripHtml, 
  calculateReadTime 
}: FeaturedBlogPostProps) => {
  return (
    <Card className="mb-12 border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="md:flex">
        {post.featured_image_url && (
          <div className="md:w-1/2">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-64 md:h-full object-cover rounded-l-lg"
            />
          </div>
        )}
        <div className={`${post.featured_image_url ? 'md:w-1/2' : 'w-full'} p-8`}>
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
              Featured
            </Badge>
            {post.categories && post.categories.length > 0 && (
              <Badge variant="outline">
                {post.categories[0]}
              </Badge>
            )}
          </div>
          
          <Link to={`/blog/${post.slug}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-purple-600 cursor-pointer transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 mb-6 line-clamp-3">
            {post.excerpt || stripHtml(post.content).substring(0, 200) + '...'}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-4">
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
          
          <Link to={`/blog/${post.slug}`}>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              Read Full Article
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
