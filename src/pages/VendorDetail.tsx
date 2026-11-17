import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VendorImageCarousel } from '@/components/ui/vendor-image';
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Calendar,
  ArrowLeft,
  Database,
  Navigation,
  MessageCircle,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VendorSearchResult } from '@/services/vendorSearchService';
import VendorSearchService from '@/services/vendorSearchService';

const VendorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vendor, setVendor] = useState<VendorSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Get vendor data from navigation state or fetch from service
    if (location.state?.vendor) {
      setVendor(location.state.vendor);
      setLoading(false);
    } else if (slug) {
      fetchVendorDetails(slug);
    }
  }, [slug, location.state]);

  const fetchVendorDetails = async (vendorSlug: string) => {
    try {
      setLoading(true);
      
      // Try to find vendor by slug in the search results
      const vendorSearchService = new VendorSearchService();
      
      // For now, we'll need to implement a way to get vendor by slug
      // This could be enhanced with a proper vendor lookup service
      
      // For demo purposes, show a placeholder
      setVendor(null);
      
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      toast({
        title: "Error",
        description: "Failed to load vendor details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (type: 'phone' | 'website' | 'directions') => {
    if (!vendor) return;

    switch (type) {
      case 'phone':
        if (vendor.phone) {
          window.open(`tel:${vendor.phone}`, '_self');
        }
        break;
      case 'website':
        if (vendor.website) {
          window.open(vendor.website, '_blank');
        }
        break;
      case 'directions':
        if (vendor.latitude && vendor.longitude) {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`;
          window.open(url, '_blank');
        }
        break;
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite ? "Vendor removed from your favorites." : "Vendor added to your favorites.",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vendor details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!vendor) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
            <p className="text-gray-600 mb-4">The vendor you're looking for could not be found.</p>
            <Button onClick={() => navigate('/vendors')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vendor Search
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{vendor.business_name} | CelebrateSmartly</title>
        <meta name="description" content={vendor.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/vendors')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>

          <div className="max-w-6xl mx-auto">
            {/* Vendor Header */}
            <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Vendor Images */}
                  <div className="lg:col-span-1">
                    {vendor.images && vendor.images.length > 0 ? (
                      <VendorImageCarousel
                        images={vendor.images}
                        businessName={vendor.business_name}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <MapPin className="w-16 h-16 mx-auto mb-2" />
                          <p>No images available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vendor Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {vendor.business_name}
                          </h1>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
                              {vendor.business_type}
                            </Badge>
                            {vendor.is_premium && (
                              <Badge className="bg-gradient-to-r from-gold-400 to-yellow-500">
                                PREMIUM
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleFavorite}
                          className={isFavorite ? 'text-red-500 border-red-500' : ''}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{vendor.address}</span>
                      </div>

                      {vendor.rating > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-lg">{vendor.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-gray-600">({vendor.review_count} reviews)</span>
                        </div>
                      )}

                      {vendor.description && (
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {vendor.description}
                        </p>
                      )}
                    </div>

                    {/* Contact Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {vendor.phone && (
                        <Button 
                          onClick={() => handleContact('phone')}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      )}
                      
                      {vendor.website && (
                        <Button 
                          onClick={() => handleContact('website')}
                          variant="outline"
                          className="w-full"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website
                        </Button>
                      )}
                      
                      <Button 
                        onClick={() => handleContact('directions')}
                        variant="outline"
                        className="w-full"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact & Business Details */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Contact & Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vendor.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{vendor.phone}</p>
                      </div>
                    </div>
                  )}

                  {vendor.website && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a 
                          href={vendor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {vendor.website}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">{vendor.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Database className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Data Source</p>
                      <p className="text-gray-600">Google Places API</p>
                      {vendor.last_google_update && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(vendor.last_google_update).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Map */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-3">{vendor.address}</p>
                      <Button 
                        onClick={() => handleContact('directions')}
                        className="w-full"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                    
                    {vendor.latitude && vendor.longitude && (
                      <div className="text-sm text-gray-500 text-center">
                        <p>Coordinates: {vendor.latitude.toFixed(6)}, {vendor.longitude.toFixed(6)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Google Places Data */}
            {vendor.google_data && (
              <Card className="mt-8 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Additional Information from Google Places
                  </CardTitle>
                  <CardDescription>
                    Detailed business information provided by Google Places API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Status */}
                    {vendor.google_data.business_status && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Business Status</h4>
                        <Badge variant={vendor.google_data.business_status === 'OPERATIONAL' ? 'default' : 'secondary'}>
                          {vendor.google_data.business_status}
                        </Badge>
                      </div>
                    )}

                    {/* Opening Hours */}
                    {vendor.google_data.opening_hours && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Opening Hours</h4>
                        <div className="space-y-1">
                          {vendor.google_data.opening_hours.weekday_text?.map((day: string, index: number) => (
                            <p key={index} className="text-sm text-gray-600">{day}</p>
                          ))}
                        </div>
                        {vendor.google_data.opening_hours.open_now !== undefined && (
                          <div className="mt-2">
                            <Badge variant={vendor.google_data.opening_hours.open_now ? 'default' : 'secondary'}>
                              {vendor.google_data.opening_hours.open_now ? 'Open Now' : 'Closed'}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Business Types */}
                    {vendor.google_data.types && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Business Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {vendor.google_data.types.slice(0, 5).map((type: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="mt-8 border-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to work with {vendor.business_name}?</h3>
                <p className="text-pink-100 mb-6">
                  Contact them directly or get directions to their location to start planning your event.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {vendor.phone && (
                    <Button 
                      size="lg"
                      onClick={() => handleContact('phone')}
                      className="bg-white text-pink-600 hover:bg-gray-100"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Call {vendor.business_name}
                    </Button>
                  )}
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => handleContact('directions')}
                    className="border-white text-white hover:bg-white hover:text-pink-600"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VendorDetail;
