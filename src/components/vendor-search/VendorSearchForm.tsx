import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VendorSearchFormProps {
  location: string;
  setLocation: (location: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  onSearch: () => void;
  loading: boolean;
  errors: { [key: string]: string };
}

const VendorSearchForm: React.FC<VendorSearchFormProps> = ({
  location,
  setLocation,
  selectedCategory,
  setSelectedCategory,
  searchRadius,
  setSearchRadius,
  onSearch,
  loading,
  errors
}) => {
  const handleLocationChange = (value: string) => {
    // Only allow numbers and hyphens for zipcode
    const zipcode = value.replace(/[^0-9-]/g, '');
    setLocation(zipcode);
  };

  const validateZipcode = (zipcode: string): boolean => {
    // US zipcode format: 5 digits or 5+4 format (e.g., 12345 or 12345-6789)
    const zipcodeRegex = /^\d{5}(-\d{4})?$/;
    return zipcodeRegex.test(zipcode);
  };

  const isFormValid = () => {
    return location.trim() !== '' && 
           selectedCategory !== '' && 
           validateZipcode(location);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Find Local Event Vendors
        </CardTitle>
        <p className="text-muted-foreground text-center">
          Search for vendors in your area by zipcode and category
        </p>
      </CardHeader>
      <CardContent>
        {/* Horizontal Search Form */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          {/* Zipcode Field */}
          <div className="space-y-2">
            <Label htmlFor="zipcode" className="text-sm font-medium">
              Zipcode <span className="text-red-500">*</span>
            </Label>
            <Input
              id="zipcode"
              type="text"
              placeholder="e.g., 10001"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className={errors.location ? 'border-red-500' : ''}
              maxLength={10}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
            {location && !validateZipcode(location) && (
              <p className="text-sm text-amber-600">
                Please enter a valid US zipcode
              </p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="catering">Catering</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="music">Music & Entertainment</SelectItem>
                <SelectItem value="decorations">Decorations & Flowers</SelectItem>
                <SelectItem value="venues">Venues & Locations</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="planning">Event Planning</SelectItem>
                <SelectItem value="beauty">Beauty & Styling</SelectItem>
                <SelectItem value="rentals">Equipment & Rentals</SelectItem>
                <SelectItem value="other">Other Services</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Search Radius Field */}
          <div className="space-y-2">
            <Label htmlFor="radius" className="text-sm font-medium">
              Search Radius
            </Label>
            <Select value={searchRadius.toString()} onValueChange={(value) => setSearchRadius(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 miles</SelectItem>
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
                <SelectItem value="50">50 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-transparent">
              Search
            </Label>
            <Button
              onClick={onSearch}
              disabled={!isFormValid() || loading}
              className="w-full h-10"
            >
              {loading ? 'Searching...' : 'Search Vendors'}
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground text-center mt-4">
          <p>• Zipcode and Category are required fields</p>
          <p>• Search radius determines how far from your zipcode to look</p>
          <p>• Results are sorted by relevance and rating</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorSearchForm;
