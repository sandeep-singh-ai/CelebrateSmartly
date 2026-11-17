
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Heart, Share } from 'lucide-react';

interface VendorDetailHeaderProps {
  businessName: string;
  address: string;
  rating: number;
  reviewCount: number;
  businessType: string;
  isPremium: boolean;
}

export const VendorDetailHeader = ({
  businessName,
  address,
  rating,
  reviewCount,
  businessType,
  isPremium
}: VendorDetailHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {businessName}
          </h1>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{address}</span>
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-lg">{rating.toFixed(1)}</span>
              <span className="text-gray-600">({reviewCount} reviews)</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
          {businessType}
        </Badge>
        {isPremium && (
          <Badge className="bg-gradient-to-r from-gold-400 to-yellow-500">
            Premium Listing
          </Badge>
        )}
      </div>
    </div>
  );
};
