
import React from 'react';
import { Button } from '@/components/ui/button';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const BlogPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: BlogPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center space-x-2">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      
      {[...Array(totalPages)].map((_, index) => (
        <Button
          key={index}
          variant={currentPage === index + 1 ? "default" : "outline"}
          onClick={() => onPageChange(index + 1)}
          className={currentPage === index + 1 ? "bg-gradient-to-r from-pink-500 to-purple-500" : ""}
        >
          {index + 1}
        </Button>
      ))}
      
      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};
