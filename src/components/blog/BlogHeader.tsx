
import React from 'react';

interface BlogHeaderProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  searchQuery: string;
  selectedCategory: string;
  onClearFilters: () => void;
}

export const BlogHeader = ({ 
  onSearch, 
  onCategoryFilter, 
  searchQuery, 
  selectedCategory, 
  onClearFilters 
}: BlogHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Event Planning Blog
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Expert tips, inspiration, and insights for creating unforgettable celebrations and events
      </p>
    </div>
  );
};
