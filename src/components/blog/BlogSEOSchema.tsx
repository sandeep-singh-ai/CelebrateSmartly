
import React from 'react';

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

interface BlogSEOSchemaProps {
  posts: BlogPost[];
  stripHtml: (html: string) => string;
}

export const BlogSEOSchema = ({ posts, stripHtml }: BlogSEOSchemaProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Event Planning Blog",
          "description": "Expert tips, inspiration, and insights for creating unforgettable celebrations and events",
          "url": window.location.href,
          "blogPost": posts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt || stripHtml(post.content).substring(0, 200),
            "author": {
              "@type": "Person",
              "name": post.author_name
            },
            "datePublished": post.published_date,
            "image": post.featured_image_url
          }))
        })
      }}
    />
  );
};
