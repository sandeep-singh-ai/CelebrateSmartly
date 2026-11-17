import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useVendorSearch } from '@/hooks/useVendorSearch';
import VendorSearchForm from '@/components/vendor-search/VendorSearchForm';
import { VendorsGrid } from '@/components/vendor-search/VendorsGrid';
import { AuthModal } from '@/components/AuthModal';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { VendorSearchResult } from '@/services/vendorSearchService';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define interfaces locally
interface RecentSearchResult {
  id: string;
  location: string;
  category: string;
  search_radius: number;
  search_date: string;
  results_count: number;
  user_id: string;
}

interface RecentSearchResponse {
  searches: RecentSearchResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

const Vendors: React.FC = () => {
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchRadius, setSearchRadius] = useState(25);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<RecentSearchResult[]>([]);
  const [recentSearchesLoading, setRecentSearchesLoading] = useState(false);
  const [recentSearchesPage, setRecentSearchesPage] = useState(1);
  const [recentSearchesTotalPages, setRecentSearchesTotalPages] = useState(1);
  const [recentSearchesTotalCount, setRecentSearchesTotalCount] = useState(0);
  const [recentSearchesHasMore, setRecentSearchesHasMore] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const locationState = useLocation().state;
  
  const { 
    vendors, 
    loading, 
    searchVendors, 
    searchResponse,
    clearResults 
  } = useVendorSearch();

  useEffect(() => {
    // Clear any previous search results when component mounts
    clearResults();
    
    // Load recent searches from database when page loads
    loadRecentSearchesFromDatabase();
  }, [clearResults]);

  // Load recent searches from database with pagination
  const loadRecentSearchesFromDatabase = async (page: number = 1) => {
    try {
      setRecentSearchesLoading(true);
      const limit = 20; // 20 items per page
      const offset = (page - 1) * limit;
      
      // Get total count
      const { count: totalCount, error: countError } = await supabase
        .from('vendor_searches')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error getting total count:', countError);
        return;
      }

      // Get paginated results for all users
      const { data: searches, error } = await supabase
        .from('vendor_searches')
        .select(`
          id,
          location,
          search_radius,
          created_at,
          search_query,
          category_id,
          event_categories(name)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error getting recent searches:', error);
        return;
      }

      // Transform the data to match our interface
      const transformedSearches: RecentSearchResult[] = searches.map(search => ({
        id: search.id,
        location: search.location,
        category: search.event_categories?.name || 'Unknown Category',
        search_radius: search.search_radius || 25,
        search_date: search.created_at,
        results_count: 0, // We'll need to get this from vendor results
        user_id: 'Unknown User'
      }));

      const totalPages = Math.ceil((totalCount || 0) / limit);
      const hasMore = page < totalPages;

      setRecentSearches(transformedSearches);
      setRecentSearchesTotalPages(totalPages);
      setRecentSearchesTotalCount(totalCount || 0);
      setRecentSearchesHasMore(hasMore);
      setRecentSearchesPage(page);

    } catch (error) {
      console.error('Error loading recent searches:', error);
    } finally {
      setRecentSearchesLoading(false);
    }
  };

  // Load more recent searches
  const loadMoreRecentSearches = () => {
    if (recentSearchesHasMore) {
      loadRecentSearchesFromDatabase(recentSearchesPage + 1);
    }
  };

  // Load previous page of recent searches
  const loadPreviousRecentSearches = () => {
    if (recentSearchesPage > 1) {
      loadRecentSearchesFromDatabase(recentSearchesPage - 1);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate zipcode
    if (!location.trim()) {
      newErrors.location = 'Zipcode is required';
    } else {
      const zipcodeRegex = /^\d{5}(-\d{4})?$/;
      if (!zipcodeRegex.test(location.trim())) {
        newErrors.location = 'Please enter a valid US zipcode (5 digits or 5+4 format)';
      }
    }

    // Validate category
    if (!selectedCategory) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    try {
      await searchVendors({
        location: location.trim(),
        categoryId: selectedCategory,
        categoryName: selectedCategory,
        searchRadius,
        userId: user.id
      });
      setSearchPerformed(true);
      
      // Store search in database
      await storeVendorSearchInDatabase();
      
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Store vendor search in database
  const storeVendorSearchInDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_searches')
        .insert({
          user_id: user?.id,
          location: location.trim(),
          category_id: selectedCategory,
          search_radius: searchRadius,
          search_query: `${selectedCategory} vendors near ${location.trim()}`,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing vendor search:', error);
      } else {
        console.log('✅ Vendor search stored in database');
        // Refresh recent searches to show the new search
        loadRecentSearchesFromDatabase(1);
      }
    } catch (error) {
      console.error('Error storing vendor search:', error);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleViewVendor = (vendor: VendorSearchResult) => {
    navigate(`/vendors/${vendor.slug}`, { 
      state: { vendor } 
    });
  };

  const handleRecentSearch = (search: RecentSearchResult) => {
    setLocation(search.location);
    setSelectedCategory(search.category);
    setSearchRadius(search.search_radius);
    
    // Trigger search with the recent search parameters
    if (user) {
      searchVendors({
        location: search.location,
        categoryId: search.category,
        categoryName: search.category,
        searchRadius: search.search_radius,
        userId: user.id
      });
      setSearchPerformed(true);
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Unknown time';
      }
      
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Unknown time';
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Find Local Event Vendors | Wedding & Party Vendors Near You | CelebrateSmartly</title>
        <meta 
          name="description" 
          content="Discover trusted local event vendors for weddings, parties, and celebrations. Search by location to find photographers, caterers, florists, venues, DJs, and more in your area." 
        />
        <meta name="keywords" content="local event vendors, wedding vendors near me, party vendors, event photographers, caterers, florists, venues, DJs, event planners, vendor search, vendor directory" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Find Local Event Vendors | Wedding & Party Vendors Near You" />
        <meta property="og:description" content="Connect with trusted local vendors for weddings, parties, and special events. Search photographers, caterers, florists, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/vendors`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Local Event Vendors - CelebrateSmartly" />
        <meta name="twitter:description" content="Find trusted vendors for weddings, parties, and celebrations in your area" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "CelebrateSmartly Vendor Directory",
              "description": "Connect with trusted local event vendors for weddings, parties, and celebrations",
              "url": `${window.location.origin}/vendors`,
              "serviceType": "Event Vendor Directory",
              "areaServed": "United States",
              "category": ["Event Planning", "Wedding Services", "Party Services"]
            })
          }}
        />
        
        <link rel="canonical" href={`${window.location.origin}/vendors`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Local Event Vendors
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover trusted vendors in your area for your next event. 
              Search by zipcode to find the perfect match for your needs.
            </p>
          </div>

          <VendorSearchForm
            location={location}
            setLocation={handleLocationChange}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
            onSearch={handleSearch}
            loading={loading}
            errors={errors}
          />

          {/* Search Results */}
          {searchPerformed && (
            <div className="mt-8">
              <VendorsGrid
                vendors={vendors}
                searchPerformed={searchPerformed}
                onViewVendor={handleViewVendor}
                searchResponse={searchResponse}
                loading={loading}
              />
            </div>
          )}

          {/* Recent Searches Section - Now at bottom of search results */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Recent Vendor Searches
                </CardTitle>
                <p className="text-muted-foreground text-center">
                  See what others are searching for in your area
                </p>
              </CardHeader>
              <CardContent>
                {recentSearchesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading recent searches...</p>
                  </div>
                ) : recentSearches.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                      {recentSearches.map((search) => (
                        <div
                          key={search.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => handleRecentSearch(search)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {search.category || 'Unknown Category'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(search.search_date)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            📍 {search.location || 'Unknown Location'} • {search.search_radius || 25} miles
                          </div>
                          <div className="text-xs text-gray-500">
                            Click to repeat this search
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-gray-600">
                        Showing {((recentSearchesPage - 1) * 20) + 1} to {Math.min(recentSearchesPage * 20, recentSearchesTotalCount)} of {recentSearchesTotalCount} searches
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={loadPreviousRecentSearches}
                          disabled={recentSearchesPage <= 1}
                        >
                          Previous
                        </Button>
                        <span className="px-3 py-2 text-sm text-gray-600">
                          Page {recentSearchesPage} of {recentSearchesTotalPages}
                        </span>
                        <Button
                          variant="outline"
                          onClick={loadMoreRecentSearches}
                          disabled={!recentSearchesHasMore}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No recent searches found. Be the first to search for vendors!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </Layout>
  );
};

export default Vendors;
