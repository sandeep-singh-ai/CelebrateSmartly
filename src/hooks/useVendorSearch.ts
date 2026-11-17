import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import VendorSearchService, { 
  VendorSearchParams, 
  VendorSearchResult, 
  VendorSearchResponse 
} from '@/services/vendorSearchService';

export const useVendorSearch = () => {
  const [vendors, setVendors] = useState<VendorSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchResponse, setSearchResponse] = useState<VendorSearchResponse | null>(null);
  const [lastSearchParams, setLastSearchParams] = useState<VendorSearchParams | null>(null);
  
  const { toast } = useToast();
  const vendorSearchService = new VendorSearchService();

  const searchVendors = useCallback(async (params: VendorSearchParams) => {
    try {
      setLoading(true);
      setSearchPerformed(false);

      console.log('Starting vendor search:', params);

      const result = await vendorSearchService.searchVendors(params);

      setVendors(result.vendors);
      setSearchResponse(result);
      setSearchPerformed(true);
      setLastSearchParams(params);

      // Show appropriate toast message
      if (result.fromCache) {
        toast({
          title: "Search Complete",
          description: `Found ${result.totalCount} vendors from cached results.`,
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${result.totalCount} vendors from Google Places API.`,
        });
      }

      return result;

    } catch (error: any) {
      console.error('Vendor search error:', error);
      
      toast({
        title: "Search Error",
        description: error.message || "Failed to search for vendors. Please try again.",
        variant: "destructive",
      });

      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshSearch = useCallback(async () => {
    if (!lastSearchParams) {
      toast({
        title: "No Search to Refresh",
        description: "Please perform a search first before refreshing.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Force refresh by clearing cache or using a different approach
      const result = await vendorSearchService.searchVendors({
        ...lastSearchParams,
        // Add a timestamp to force refresh
        location: `${lastSearchParams.location} ${Date.now()}`
      });

      // Update with fresh results
      setVendors(result.vendors);
      setSearchResponse(result);
      
      toast({
        title: "Search Refreshed",
        description: `Found ${result.totalCount} fresh vendor results.`,
      });

    } catch (error: any) {
      console.error('Refresh search error:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh search results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [lastSearchParams, toast]);

  const clearResults = useCallback(() => {
    setVendors([]);
    setSearchResponse(null);
    setSearchPerformed(false);
    setLastSearchParams(null);
  }, []);

  const getVendorDetails = useCallback(async (vendorId: string) => {
    try {
      return await vendorSearchService.getVendorDetails(vendorId);
    } catch (error) {
      console.error('Error getting vendor details:', error);
      toast({
        title: "Error",
        description: "Failed to load vendor details.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const getUserSearchHistory = useCallback(async (userId: string) => {
    try {
      return await vendorSearchService.getUserSearchHistory(userId);
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  }, []);

  return {
    // State
    vendors,
    loading,
    searchPerformed,
    searchResponse,
    lastSearchParams,
    
    // Actions
    searchVendors,
    refreshSearch,
    clearResults,
    getVendorDetails,
    getUserSearchHistory,
    
    // Computed
    hasResults: vendors.length > 0,
    resultCount: vendors.length,
    isFromCache: searchResponse?.fromCache || false,
    isRefreshed: searchResponse?.refreshed || false,
  };
};
