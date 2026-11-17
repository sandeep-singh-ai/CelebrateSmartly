
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VendorImageCarousel } from '@/components/ui/vendor-image';
import { MapPin, Star, Phone, Mail, Globe, Clock, Database } from 'lucide-react';
import { VendorSearchResult } from '@/services/vendorSearchService';

interface VendorCardProps {
  vendor: VendorSearchResult;
  onViewVendor: (vendor: VendorSearchResult) => void;
}

export const VendorCard = ({ vendor, onViewVendor }: VendorCardProps) => {
  // Filter out any broken or invalid image URLs
  const validImages = vendor.images?.filter(img => 
    img && 
    typeof img === 'string' && 
    img.length > 0
  ) || [];

  // Calculate distance if coordinates are available
  const formatDistance = (distance?: number) => {
    if (!distance) return null;
    if (distance < 1) return `${Math.round(distance * 5280)} ft`;
    return `${distance.toFixed(1)} mi`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      {vendor.is_premium && (
        <div className="bg-gradient-to-r from-gold-400 to-yellow-500 text-white px-3 py-1 text-xs font-bold text-center">
          PREMIUM LISTING
        </div>
      )}
      
      {validImages.length > 0 && (
        <VendorImageCarousel
          images={validImages.slice(0, 3)}
          businessName={vendor.business_name}
        />
      )}

      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{vendor.business_name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{vendor.address}</span>
            </CardDescription>
          </div>
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0 ml-2">
            {vendor.business_type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {vendor.description && (
          <p className="text-gray-600 line-clamp-2 text-sm">{vendor.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          {vendor.rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
              <span className="text-gray-600 text-sm ml-1">({vendor.review_count} reviews)</span>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">No ratings yet</span>
          )}
          
          {vendor.distance && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {formatDistance(vendor.distance)}
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {vendor.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{vendor.phone}</span>
            </div>
          )}
          {vendor.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-blue-600 hover:underline">
                <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </span>
            </div>
          )}
        </div>

        {/* Google Places Data Indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <Database className="w-3 h-3" />
          <span>Data from Google Places</span>
          {vendor.last_google_update && (
            <span>• Updated {new Date(vendor.last_google_update).toLocaleDateString()}</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewVendor(vendor)}
          >
            View More
          </Button>
          {vendor.phone && (
            <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
