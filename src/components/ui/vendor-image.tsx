import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface VendorImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const VendorImage: React.FC<VendorImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      console.log(`Image failed to load: ${imgSrc}, trying fallback: ${fallbackSrc}`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else {
      console.log(`Image failed to load: ${imgSrc}`);
      setHasError(true);
      onError?.(e);
    }
  };

  // Don't render if we've exhausted all fallbacks
  if (hasError && !fallbackSrc) {
    return null;
  }

  // Add loading indicator for S3 images
  const isS3Image = src.includes('s3.amazonaws.com') || src.includes('celebratesmartly.s3');
  const isGoogleImage = src.includes('googleapis.com');

  return (
    <div className="relative">
      <img
        src={imgSrc}
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
        loading="lazy"
        onError={handleError}
      />
      {isS3Image && (
        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
          S3
        </div>
      )}
      {isGoogleImage && (
        <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
          Google
        </div>
      )}
    </div>
  );
};

interface VendorImageCarouselProps {
  images: string[];
  businessName: string;
  className?: string;
}

export const VendorImageCarousel: React.FC<VendorImageCarouselProps> = ({
  images,
  businessName,
  className,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <VendorImage
          src={images[currentImageIndex]}
          alt={`${businessName} - Photo ${currentImageIndex + 1}`}
          className="w-full h-full"
        />
      </div>
      
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            →
          </button>
          
          {/* Image indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}; 