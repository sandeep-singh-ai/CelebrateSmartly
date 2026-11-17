
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Vendor } from '@/types/vendor';

const jsonToStringArray = (json: any): string[] => {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [json];
    }
  }
  return [];
};

export const useVendorCaching = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getVendorsByCategory = async (categoryName: string, location: string) => {
    setLoading(true);
    
    try {
      // First, try to get vendors from database
      console.log('Checking database for vendors...');
      const { data: existingVendors, error: dbError } = await supabase
        .from('vendors')
        .select('*')
        .eq('business_type', categoryName)
        .limit(20);

      if (dbError) {
        console.error('Database error:', dbError);
      }

      if (existingVendors && existingVendors.length > 0) {
        console.log(`Found ${existingVendors.length} vendors in database`);
        
        // Transform database vendors to match Vendor interface
        const transformedVendors: Vendor[] = existingVendors.map(vendor => ({
          id: vendor.id,
          business_name: vendor.business_name,
          business_type: vendor.business_type,
          description: vendor.description || '',
          address: vendor.address || '',
          phone: vendor.phone || '',
          email: vendor.email || '',
          website: vendor.website || '',
          rating: Number(vendor.rating) || 0,
          review_count: vendor.review_count || 0,
          images: jsonToStringArray(vendor.images),
          is_premium: vendor.is_premium || false,
          slug: vendor.slug || '',
          google_place_id: vendor.google_place_id || '',
          user_id: vendor.user_id,
          created_at: vendor.created_at,
          updated_at: vendor.updated_at
        }));
        
        setVendors(transformedVendors);
        setLoading(false);
        return transformedVendors;
      }

      // If no vendors in database, search Google Places
      console.log('No vendors in database, searching Google Places...');
      const { data, error } = await supabase.functions.invoke('search-vendors-places', {
        body: {
          query: categoryName,
          location: location,
          radius: 25000,
          type: 'establishment'
        }
      });

      if (error) {
        console.error('Error searching vendors:', error);
        throw error;
      }

      if (data?.vendors) {
        console.log(`Found ${data.vendors.length} vendors from Google Places`);
        setVendors(data.vendors);
        
        // Cache vendors in database for future use
        await cacheVendorsInDatabase(data.vendors, categoryName);
        
        return data.vendors;
      } else {
        setVendors([]);
        return [];
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors. Please try again.",
        variant: "destructive",
      });
      setVendors([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const cacheVendorsInDatabase = async (vendorsData: any[], categoryName: string) => {
    try {
      console.log('Caching vendors in database...');
      
      // Get current user to associate vendors
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const vendorsToInsert = vendorsData.map(vendor => ({
        business_name: vendor.business_name || vendor.name,
        business_type: categoryName,
        address: vendor.address || vendor.formatted_address,
        phone: vendor.phone || vendor.formatted_phone_number,
        website: vendor.website,
        rating: vendor.rating || 0,
        review_count: vendor.review_count || vendor.user_ratings_total || 0,
        images: vendor.images || [],
        google_place_id: vendor.google_place_id || vendor.place_id,
        description: vendor.description || '',
        user_id: user.id
      }));

      const { error } = await supabase
        .from('vendors')
        .upsert(vendorsToInsert, { 
          onConflict: 'google_place_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error caching vendors:', error);
      } else {
        console.log('Successfully cached vendors in database');
      }
    } catch (error) {
      console.error('Error caching vendors:', error);
    }
  };

  return {
    vendors,
    loading,
    getVendorsByCategory
  };
};
