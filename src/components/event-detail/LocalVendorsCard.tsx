
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { MapPin, Phone, Mail, Globe, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Vendor {
  id: string;
  business_name: string;
  business_type: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  images: string[];
}

interface LocalVendorsCardProps {
  vendors: Vendor[];
  vendorsLoading: boolean;
  vendorStartIndex: number[];
  setVendorStartIndex: (value: number[]) => void;
  onSearchVendors: () => void;
  eventLocation: string;
  eventType: string;
}

export const LocalVendorsCard: React.FC<LocalVendorsCardProps> = ({
  vendors,
  vendorsLoading,
  vendorStartIndex,
  setVendorStartIndex,
  onSearchVendors,
  eventLocation,
  eventType
}) => {
  const vendorsPerPage = 5;
  const displayedVendors = vendors.slice(vendorStartIndex[0], vendorStartIndex[0] + vendorsPerPage);
  const totalPages = Math.ceil(vendors.length / vendorsPerPage);
  const currentPage = Math.floor(vendorStartIndex[0] / vendorsPerPage) + 1;

  const goToPreviousPage = () => {
    if (vendorStartIndex[0] > 0) {
      setVendorStartIndex([Math.max(0, vendorStartIndex[0] - vendorsPerPage)]);
    }
  };

  const goToNextPage = () => {
    if (vendorStartIndex[0] + vendorsPerPage < vendors.length) {
      setVendorStartIndex([Math.min(vendors.length - vendorsPerPage, vendorStartIndex[0] + vendorsPerPage)]);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Local Vendors</CardTitle>
          {vendors.length > vendorsPerPage && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={vendorStartIndex[0] === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500 min-w-[60px] text-center">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={vendorStartIndex[0] + vendorsPerPage >= vendors.length}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        {vendors.length > 0 && (
          <p className="text-sm text-gray-600">
            Found {vendors.length} vendors near {eventLocation}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {vendorsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading nearby vendors...</p>
          </div>
        ) : vendors.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-4">
              {displayedVendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-md transition-shadow border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-base line-clamp-1 flex-1 mr-2">
                        {vendor.business_name}
                      </h4>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {vendor.business_type}
                      </Badge>
                    </div>
                    
                    {vendor.rating && vendor.rating > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                        </div>
                        {vendor.review_count && vendor.review_count > 0 && (
                          <span>({vendor.review_count} reviews)</span>
                        )}
                      </div>
                    )}
                    
                    {vendor.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {vendor.description}
                      </p>
                    )}
                    
                    {vendor.address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{vendor.address}</span>
                      </div>
                    )}

                    <div className="flex gap-2 text-sm">
                      {vendor.phone && (
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      )}
                      {vendor.email && (
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                      )}
                      {vendor.website && (
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          Website
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Alternative Slider Navigation for more than 5 vendors */}
            {vendors.length > vendorsPerPage && (
              <div className="space-y-3 pt-2 border-t">
                <div className="text-xs text-center text-gray-500 mb-2">
                  Navigate vendors ({vendorStartIndex[0] + 1}-{Math.min(vendorStartIndex[0] + vendorsPerPage, vendors.length)} of {vendors.length})
                </div>
                <Slider
                  value={vendorStartIndex}
                  onValueChange={setVendorStartIndex}
                  max={Math.max(0, vendors.length - vendorsPerPage)}
                  min={0}
                  step={vendorsPerPage}
                  className="w-full"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No vendors found in your area yet.</p>
            <Button 
              onClick={onSearchVendors}
              disabled={vendorsLoading}
              size="sm"
            >
              Search for Vendors
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
