
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VendorImage } from '@/components/ui/vendor-image';

interface VendorDetailImagesProps {
  images: string[];
  businessName: string;
}

export const VendorDetailImages = ({ images, businessName }: VendorDetailImagesProps) => {
  // Filter out any broken or invalid image URLs
  // Show S3 images first, then Google images as fallback
  const validImages = images?.filter(img => 
    img && 
    typeof img === 'string' && 
    img.length > 0
  ) || [];

  if (validImages.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {validImages.slice(0, 6).map((image, index) => (
            <VendorImage
              key={index}
              src={image}
              alt={`${businessName} image ${index + 1}`}
              className="w-full h-48 rounded-lg object-cover"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
