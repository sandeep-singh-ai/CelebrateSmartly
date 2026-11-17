
import React from 'react';
import { VendorCard } from './VendorCard';
import { VendorSearchResult } from '@/services/vendorSearchService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Database, RefreshCw, MapPin, Users } from 'lucide-react';

interface VendorsGridProps {
  vendors: VendorSearchResult[];
  searchPerformed: boolean;
  onViewVendor: (vendor: VendorSearchResult) => void;
  searchResponse?: {
    totalCount: number;
    fromCache: boolean;
    cacheAge: number;
    refreshed: boolean;
  };
  loading?: boolean;
}

export const VendorsGrid = ({ 
  vendors, 
  searchPerformed, 
  onViewVendor, 
  searchResponse,
  loading 
}: VendorsGridProps) => {
  const count = searchResponse?.totalCount ?? vendors.length;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Searching for vendors...</p>
      </div>
    );
  }

  return (
    <>
      {searchPerformed && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Search Results ({count} vendors found)
            </h2>
            
            {searchResponse && (
              <div className="flex items-center gap-2">
                {searchResponse.fromCache && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    From Cache
                  </Badge>
                )}
                {searchResponse.refreshed && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Fresh Results
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Search Status Information */}
          {searchResponse && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      <strong>Source:</strong> {searchResponse.fromCache ? 'Cached Database' : 'Google Places API'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      <strong>Cache Age:</strong> {searchResponse.cacheAge === 0 ? 'Just updated' : `${searchResponse.cacheAge} days`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      <strong>Results:</strong> {count} vendors found
                    </span>
                  </div>
                </div>
                
                {searchResponse.fromCache && (
                  <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                    💡 <strong>Tip:</strong> Results are from our cached database for faster loading. 
                    Data is automatically refreshed every 30 days from Google Places API.
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {vendors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <VendorCard 
              key={vendor.id} 
              vendor={vendor} 
              onViewVendor={onViewVendor}
            />
          ))}
        </div>
      ) : searchPerformed ? (
        <Card className="text-center py-12 bg-gray-50">
          <CardContent>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">No vendors found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any vendors matching your search criteria.
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Try these suggestions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Expand your search radius</li>
                <li>Try a different location or city</li>
                <li>Check if the category is available in your area</li>
                <li>Verify the spelling of your location</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Search Tips */}
      {searchPerformed && vendors.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              💡
            </div>
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Search Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Click "View More" on any vendor card to see detailed information</li>
                <li>• Results are automatically cached for faster future searches</li>
                <li>• Vendor data is refreshed from Google Places every 30 days</li>
                <li>• All vendors are verified businesses with ratings and reviews</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
