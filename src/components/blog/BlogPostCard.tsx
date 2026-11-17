
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';

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

interface BlogPostCardProps {
  post: BlogPost;
  formatDate: (dateString: string) => string;
  stripHtml: (html: string) => string;
  calculateReadTime: (content: string) => string;
}

export const BlogPostCard = ({ 
  post, 
  formatDate, 
  stripHtml, 
  calculateReadTime 
}: BlogPostCardProps) => {
  return (
    <article className="group">
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
        {post.featured_image_url && (
          <div className="overflow-hidden rounded-t-lg">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            {post.categories && post.categories.length > 0 && (
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
                {post.categories[0]}
              </Badge>
            )}
            <span className="text-sm text-gray-500">
              {calculateReadTime(post.content)}
            </span>
          </div>
          <Link to={`/blog/${post.slug}`}>
            <CardTitle className="text-xl hover:text-purple-600 cursor-pointer transition-colors line-clamp-2">
              {post.title}
            </CardTitle>
          </Link>
          <CardDescription className="line-clamp-3">
            {post.excerpt || stripHtml(post.content).substring(0, 150) + '...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_date)}</span>
              </div>
            </div>
            <Link to={`/blog/${post.slug}`}>
              <Button variant="ghost" className="text-purple-600 hover:text-purple-700 p-0">
                Read More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};
