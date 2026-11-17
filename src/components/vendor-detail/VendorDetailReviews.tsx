
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Review {
  rating: number;
  author_name: string;
  text: string;
}

interface VendorDetailReviewsProps {
  reviews: Review[];
}

export const VendorDetailReviews = ({ reviews }: VendorDetailReviewsProps) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.slice(0, 3).map((review, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {review.author_name}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{review.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
