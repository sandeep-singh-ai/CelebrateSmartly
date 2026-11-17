
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Crown, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface RecentVendor {
  id: string;
  business_name: string;
  business_type: string;
  description: string;
  address: string;
  rating: number;
  review_count: number;
  images: string[];
  slug: string;
  is_premium: boolean;
}

const PremiumVendors = () => {
  const [vendors, setVendors] = useState<RecentVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      // Fetch all vendors from database, prioritizing premium ones
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('is_premium', { ascending: false })
        .order('rating', { ascending: false })
        .limit(24);

      if (error) throw error;
      
      const transformedVendors: RecentVendor[] = (data || []).map(vendor => ({
        ...vendor,
        images: Array.isArray(vendor.images) ? 
          (vendor.images as string[]).filter(img => 
            img && !img.includes('googleapis.com') // Only S3/Supabase images
          ) : [],
        is_premium: vendor.is_premium || false
      }));
      
      setVendors(transformedVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVendor = (vendor: RecentVendor) => {
    const slug = vendor.slug || `${vendor.business_name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}-${vendor.address.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`;
    navigate(`/vendor/${slug}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const premiumVendors = vendors.filter(vendor => vendor.is_premium);
  const regularVendors = vendors.filter(vendor => !vendor.is_premium);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <Crown className="h-12 w-12 text-yellow-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Premium & Featured Vendors
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover top-rated vendors with premium listings and high-quality services for your events.
              </p>
            </div>

            {/* Premium Vendors Section */}
            {premiumVendors.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  Premium Vendors ({premiumVendors.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiumVendors.map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-lg transition-all duration-300 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-bold">
                        <Crown className="w-3 h-3 inline mr-1" />
                        PREMIUM
                      </div>
                      
                      {vendor.images && vendor.images.length > 0 && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={vendor.images[0]}
                            alt={vendor.business_name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              console.log('Image failed to load:', vendor.images[0]);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <CardHeader>
                        <div>
                          <CardTitle className="text-lg">{vendor.business_name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {vendor.address}
                          </CardDescription>
                        </div>
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 w-fit">
                          {vendor.business_type}
                        </Badge>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 line-clamp-2">{vendor.description}</p>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
                          <span className="text-gray-600 text-sm ml-1">({vendor.review_count} reviews)</span>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleViewVendor(vendor)}
                          >
                            View Details
                          </Button>
                          <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Vendors Section */}
            {regularVendors.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Featured Vendors ({regularVendors.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularVendors.map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                      {vendor.images && vendor.images.length > 0 && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={vendor.images[0]}
                            alt={vendor.business_name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              console.log('Image failed to load:', vendor.images[0]);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <CardHeader>
                        <div>
                          <CardTitle className="text-lg">{vendor.business_name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {vendor.address}
                          </CardDescription>
                        </div>
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 w-fit">
                          {vendor.business_type}
                        </Badge>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-gray-600 line-clamp-2">{vendor.description}</p>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
                          <span className="text-gray-600 text-sm ml-1">({vendor.review_count} reviews)</span>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleViewVendor(vendor)}
                          >
                            View Details
                          </Button>
                          <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {vendors.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Vendors Found</h3>
                <p className="text-gray-500">Check back later for featured vendor listings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PremiumVendors;
