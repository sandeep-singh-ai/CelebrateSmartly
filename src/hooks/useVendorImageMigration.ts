
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import S3Service from '@/services/s3Service';
import GooglePlacesService from '@/services/googlePlacesService';
import { VendorService } from '@/services/vendorService';
import { Vendor } from '@/types/vendor';
import { filterS3Images, filterGoogleImages, filterNonS3Images } from '@/utils/vendorImageUtils';

export const useVendorImageMigration = () => {
  const { toast } = useToast();
  const s3Service = S3Service.createInstance();
  const isS3Configured = !!s3Service;

  console.log('S3 Service availability:', {
    configured: S3Service.isConfigured(),
    instance: !!s3Service,
    accessKey: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretKey: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
    region: import.meta.env.VITE_AWS_REGION,
  });

  // Upload vendor images to S3
  const uploadVendorImages = useCallback(async (
    photos: any[] | undefined, 
    placeId: string, 
    googleService: GooglePlacesService
  ): Promise<string[]> => {
    if (!photos || photos.length === 0) {
      console.log('No photos available for upload');
      return [];
    }

    if (!s3Service) {
      console.log('S3 not configured, skipping image upload');
      return [];
    }

    console.log(`Uploading ${Math.min(photos.length, 3)} images to S3 for place: ${placeId}`);
    
    toast({
      title: "Processing Images",
      description: `Uploading ${Math.min(photos.length, 3)} images to secure storage...`,
    });

    const imageUrls: string[] = [];
    
    for (let i = 0; i < Math.min(photos.length, 3); i++) {
      const photo = photos[i];
      try {
        const photoUrl = googleService.getPhotoUrl(photo.photo_reference, 400);
        const fileName = `${placeId}-${photo.photo_reference}-${Date.now()}.jpg`;
        console.log(`Uploading image ${i + 1}: ${fileName}`);
        
        const s3Url = await googleService.uploadImageToS3(photoUrl, fileName, s3Service);
        if (s3Url) {
          imageUrls.push(s3Url);
          console.log(`✅ Successfully uploaded image ${i + 1} to S3: ${s3Url}`);
        }
      } catch (error) {
        console.error(`❌ Error uploading image ${i + 1} to S3:`, error);
      }
    }

    console.log(`Total images uploaded to S3: ${imageUrls.length}`);
    return imageUrls;
  }, [s3Service, toast]);

  // Migrate existing Google images to S3 and update database
  const migrateVendorImages = useCallback(async (
    vendor: Vendor, 
    placeId: string
  ): Promise<string[]> => {
    if (!s3Service) {
      console.log('S3 not configured, cannot migrate images');
      return [];
    }

    const googleImages = filterGoogleImages(vendor.images);
    if (googleImages.length === 0) {
      console.log('No Google images to migrate');
      return [];
    }

    console.log(`🔄 Starting migration of ${googleImages.length} Google images to S3 for vendor: ${vendor.business_name}`);
    
    toast({
      title: "Migrating Images",
      description: `Converting ${googleImages.length} images to secure storage...`,
    });

    const migratedImages: string[] = [];
    
    // Migrate each Google image to S3
    for (let i = 0; i < googleImages.length; i++) {
      try {
        const googleUrl = googleImages[i];
        const fileName = `${placeId || vendor.id}-migrated-${i + 1}-${Date.now()}.jpg`;
        console.log(`Migrating image ${i + 1}/${googleImages.length}: ${fileName}`);
        
        // Fetch the image from Google
        const response = await fetch(googleUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }
        
        const imageBlob = await response.blob();
        console.log(`Fetched image ${i + 1}, size: ${imageBlob.size} bytes`);
        
        // Upload to S3
        const s3Url = await s3Service.uploadImage(imageBlob, fileName);
        if (s3Url) {
          migratedImages.push(s3Url);
          console.log(`✅ Successfully migrated image ${i + 1} to S3: ${s3Url}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating image ${i + 1} to S3:`, error);
      }
    }

    // Update vendor in database with new S3 images (replace all images with S3 versions)
    if (migratedImages.length > 0) {
      const existingS3Images = filterS3Images(vendor.images);
      const allS3Images = [...existingS3Images, ...migratedImages];
      
      console.log(`Updating database for vendor ${vendor.business_name} with ${allS3Images.length} S3 images`);
      const success = await VendorService.updateVendorImages(vendor.id, allS3Images);
      
      if (success) {
        console.log(`✅ Updated vendor ${vendor.business_name} database with ${allS3Images.length} S3 images`);
        toast({
          title: "Migration Complete",
          description: `Successfully migrated ${migratedImages.length} images to secure storage.`,
        });
        return allS3Images;
      } else {
        console.error(`❌ Failed to update database for vendor ${vendor.business_name}`);
      }
    }

    console.log(`Migration complete: ${migratedImages.length} images migrated to S3`);
    return migratedImages;
  }, [s3Service, toast]);

  // Migrate any existing non-S3 images (e.g., Supabase storage) to S3 and update database
  const migrateNonS3Images = useCallback(async (
    vendor: Vendor
  ): Promise<string[]> => {
    if (!s3Service) {
      console.log('S3 not configured, cannot migrate images');
      return [];
    }

    const nonS3Images = filterNonS3Images(vendor.images);
    if (nonS3Images.length === 0) {
      console.log('No non-S3 images to migrate');
      return [];
    }

    console.log(`🔄 Starting migration of ${nonS3Images.length} non-S3 images to S3 for vendor: ${vendor.business_name}`);
    toast({
      title: 'Migrating Images',
      description: `Converting ${nonS3Images.length} images to secure storage...`,
    });

    const migratedImages: string[] = [];

    for (let i = 0; i < Math.min(nonS3Images.length, 3); i++) {
      try {
        const srcUrl = nonS3Images[i];
        const fileName = `${vendor.google_place_id || vendor.id}-migrated-existing-${i + 1}-${Date.now()}.jpg`;
        console.log(`Migrating existing image ${i + 1}/${nonS3Images.length}: ${fileName}`);

        const response = await fetch(srcUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const imageBlob = await response.blob();
        const s3Url = await s3Service.uploadImage(imageBlob, fileName);
        if (s3Url) {
          migratedImages.push(s3Url);
          console.log(`✅ Successfully migrated existing image ${i + 1} to S3: ${s3Url}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating existing image ${i + 1} to S3:`, error);
      }
    }

    if (migratedImages.length > 0) {
      const existingS3Images = filterS3Images(vendor.images);
      const allS3Images = [...existingS3Images, ...migratedImages];
      console.log(`Updating database for vendor ${vendor.business_name} with ${allS3Images.length} S3 images`);
      const success = await VendorService.updateVendorImages(vendor.id, allS3Images);
      if (success) {
        toast({
          title: 'Migration Complete',
          description: `Successfully migrated ${migratedImages.length} images to secure storage.`,
        });
        return allS3Images;
      }
    }

    console.log(`Migration complete: ${migratedImages.length} images migrated to S3`);
    return migratedImages;
  }, [s3Service, toast]);

  return {
    uploadVendorImages,
    migrateVendorImages,
    migrateNonS3Images,
    isS3Configured,
  };
};
