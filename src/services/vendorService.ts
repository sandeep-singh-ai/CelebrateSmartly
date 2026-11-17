
import { supabase } from '@/integrations/supabase/client';
import { Vendor, VendorCreateData } from '@/types/vendor';
import { jsonToStringArray, prioritizeS3Images, filterS3Images, filterGoogleImages } from '@/utils/vendorImageUtils';

export class VendorService {
  // Get vendor by Google Place ID
  static async getVendorByPlaceId(placeId: string): Promise<Vendor | null> {
    try {
      const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('google_place_id', placeId)
        .single();

      if (error || !vendor) {
        return null;
      }

      // Transform and prioritize S3 images over Google images
      const rawImages = jsonToStringArray(vendor.images);
      const prioritizedImages = prioritizeS3Images(rawImages);

      return {
        ...vendor,
        images: prioritizedImages,
      };
    } catch (error) {
      console.error('Error getting vendor by place ID:', error);
      return null;
    }
  }

  // Save new vendor to database
  static async saveVendor(vendorData: VendorCreateData): Promise<Vendor | null> {
    try {
      const { data: savedVendor, error } = await supabase
        .from('vendors')
        .insert([vendorData])
        .select()
        .single();

      if (error) {
        console.error('Error saving vendor:', error);
        return null;
      }

      // Transform saved vendor images
      const rawImages = jsonToStringArray(savedVendor.images);
      const prioritizedImages = prioritizeS3Images(rawImages);

      return {
        ...savedVendor,
        images: prioritizedImages,
      };
    } catch (error) {
      console.error('Error saving vendor:', error);
      return null;
    }
  }

  // Update vendor images
  static async updateVendorImages(vendorId: string, images: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ images })
        .eq('id', vendorId);

      if (error) {
        console.error('Error updating vendor images:', error);
        return false;
      }

      console.log(`Successfully updated vendor ${vendorId} with ${images.length} images`);
      return true;
    } catch (error) {
      console.error('Error updating vendor images:', error);
      return false;
    }
  }

  // Load local vendors from database - show all vendors but prioritize S3 images
  static async loadLocalVendors(): Promise<Vendor[]> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('is_premium', { ascending: false })
        .order('rating', { ascending: false })
        .limit(12);

      if (error) throw error;

      // Transform vendors and prioritize S3 images
      const transformedVendors: Vendor[] = [];
      
      for (const vendor of data || []) {
        const rawImages = jsonToStringArray(vendor.images);
        const prioritizedImages = prioritizeS3Images(rawImages);
        
        transformedVendors.push({
          ...vendor,
          images: prioritizedImages,
        });
      }
      
      console.log(`Loaded ${transformedVendors.length} local vendors`);
      return transformedVendors;
    } catch (error) {
      console.error('Error loading local vendors:', error);
      return [];
    }
  }

  // Analyze vendor images for debugging
  static async analyzeVendorImages(): Promise<void> {
    try {
      const { data: vendors, error } = await supabase
        .from('vendors')
        .select('id, business_name, images')
        .limit(10);

      if (error) throw error;

      console.log('=== Vendor Image Analysis ===');
      vendors?.forEach((vendor, index) => {
        const images = jsonToStringArray(vendor.images);
        const s3Images = images.filter(img => 
          img.includes('s3.amazonaws.com') || img.includes('celebratesmartly.s3')
        );
        const googleImages = images.filter(img => 
          img.includes('googleapis.com')
        );
        
        console.log(`${index + 1}. ${vendor.business_name}:`);
        console.log(`   - Total images: ${images.length}`);
        console.log(`   - S3 images: ${s3Images.length}`);
        console.log(`   - Google images: ${googleImages.length}`);
        if (googleImages.length > 0 && s3Images.length === 0) {
          console.log(`   - ⚠️  Has only Google images - should be migrated to S3`);
        }
      });
    } catch (error) {
      console.error('Error analyzing vendor images:', error);
    }
  }
}
