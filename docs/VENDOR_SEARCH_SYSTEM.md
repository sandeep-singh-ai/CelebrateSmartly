# Vendor Search System Documentation

## Overview

The Vendor Search System is a comprehensive solution that integrates Google Places API with intelligent caching and provides users with a powerful vendor discovery experience. The system automatically caches search results and refreshes data every 30 days to ensure optimal performance and data freshness.

## Features

### 🔍 **Mandatory Fields**
- **Location**: Required field for location-based searches
- **Category**: Required field for category-specific vendor discovery
- **Search Radius**: Optional field (10, 25, 50, 100 miles)

### 💾 **Intelligent Caching System**
- **30-Day Auto-Refresh**: Vendor data automatically refreshes every 30 days
- **Smart Fallback**: If cache has fewer than 10 results, system fetches from Google Places API
- **Performance Optimization**: Cached results load instantly for repeat searches
- **Postal Code Tracking**: System tracks postal codes for location-based caching

### 🚀 **Google Places API Integration**
- **Real-time Data**: Fresh vendor information from Google Places
- **Rich Vendor Details**: Business information, ratings, photos, opening hours
- **Geocoding**: Automatic location conversion to coordinates
- **Business Status**: Real-time business operational status

### 📱 **User Experience**
- **Search History**: Track user search patterns and preferences
- **Detailed Vendor Cards**: Rich vendor information with contact details
- **View More**: Comprehensive vendor detail pages
- **Contact Actions**: Direct phone calls, website visits, and directions

## System Architecture

### Database Tables

#### 1. `vendor_search_cache`
Stores search cache metadata and refresh information:
```sql
- id: UUID (Primary Key)
- location: TEXT (Search location)
- category_id: UUID (Event category reference)
- search_radius: INTEGER (Search radius in miles)
- postal_code: TEXT (Extracted postal code)
- latitude/longitude: DECIMAL (Geocoded coordinates)
- vendor_count: INTEGER (Number of vendors found)
- last_updated: TIMESTAMPTZ (Last cache update)
- next_refresh_date: TIMESTAMPTZ (Next refresh date)
```

#### 2. `vendor_search_results`
Stores individual vendor data from Google Places:
```sql
- id: UUID (Primary Key)
- cache_id: UUID (Cache reference)
- google_place_id: TEXT (Google Places unique ID)
- business_name: TEXT (Vendor name)
- business_type: TEXT (Category/type)
- description: TEXT (Business description)
- address: TEXT (Full address)
- phone: TEXT (Contact phone)
- website: TEXT (Business website)
- rating: DECIMAL (Google rating)
- review_count: INTEGER (Number of reviews)
- latitude/longitude: DECIMAL (Coordinates)
- google_data: JSONB (Full Google Places data)
- images: JSONB (Vendor photos)
- is_premium: BOOLEAN (Premium status)
- slug: TEXT (URL-friendly identifier)
- last_google_update: TIMESTAMPTZ (Last API update)
```

#### 3. `vendor_search_history`
Tracks user search behavior:
```sql
- id: UUID (Primary Key)
- user_id: UUID (User reference)
- cache_id: UUID (Cache reference)
- search_query: TEXT (Search terms)
- results_count: INTEGER (Results found)
- search_date: TIMESTAMPTZ (Search timestamp)
```

### Database Functions

#### 1. `should_refresh_vendor_cache()`
Determines if cache needs refresh based on 30-day rule.

#### 2. `get_cached_vendor_results()`
Retrieves cached vendor results with proper ordering.

#### 3. `update_cache_refresh_date()`
Updates cache refresh schedule after successful refresh.

#### 4. `extract_postal_code()`
Extracts postal codes from addresses for location tracking.

## API Integration

### Google Places API Endpoints

#### 1. **Geocoding API**
```typescript
// Convert location to coordinates
const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`;
```

#### 2. **Places Text Search API**
```typescript
// Search for vendors in category
const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${lat},${lng}&radius=${radius}&key=${apiKey}`;
```

#### 3. **Place Details API**
```typescript
// Get detailed vendor information
const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,phone,website,rating,photos,opening_hours&key=${apiKey}`;
```

### API Response Processing

The system processes Google Places API responses to:
- Extract business information
- Generate vendor slugs
- Process and store images
- Handle business status and hours
- Store coordinates for mapping

## Search Flow

### 1. **User Input Validation**
```typescript
const validateForm = (): boolean => {
  const errors: { location?: string; category?: string } = {};
  
  if (!location.trim()) {
    errors.location = 'Location is required';
  }
  
  if (!selectedCategory || selectedCategory === 'all') {
    errors.category = 'Please select a category';
  }
  
  return Object.keys(errors).length === 0;
};
```

### 2. **Cache Check**
```typescript
const needsRefresh = await this.checkCacheNeedsRefresh(
  location, 
  categoryId, 
  searchRadius
);
```

### 3. **Decision Logic**
- **Cache Sufficient**: Return cached results if ≥10 vendors and <30 days old
- **Cache Insufficient**: Fetch from Google Places API
- **No Cache**: Always fetch from Google Places API

### 4. **Data Storage**
```typescript
// Store vendor results
const storedCount = await this.storeVendorResults(
  cacheId, 
  googlePlaces, 
  categoryName
);

// Update cache metadata
await this.createOrUpdateCache(
  location, 
  categoryId, 
  searchRadius, 
  coordinates, 
  storedCount
);
```

## Configuration

### Environment Variables

#### Required
```bash
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

#### Optional
```bash
VITE_APP_URL=https://yourdomain.com
```

### Google Cloud Console Setup

1. **Create Project**: Set up a new Google Cloud project
2. **Enable APIs**: Enable Places API service
3. **Create Credentials**: Generate API key with Places API restriction
4. **Set Quotas**: Configure appropriate usage limits
5. **Security**: Restrict API key to your domain

## Usage Examples

### Basic Search
```typescript
const vendorSearchService = new VendorSearchService();

const result = await vendorSearchService.searchVendors({
  location: "New York, NY",
  categoryId: "catering-uuid",
  categoryName: "Catering",
  searchRadius: 25,
  userId: "user-uuid"
});
```

### Using the Hook
```typescript
const { 
  searchVendors, 
  vendors, 
  loading, 
  searchResponse 
} = useVendorSearch();

await searchVendors({
  location: "Los Angeles, CA",
  categoryId: "photography-uuid",
  categoryName: "Photography",
  searchRadius: 50,
  userId: user.id
});
```

## Performance Optimizations

### 1. **Caching Strategy**
- **30-Day Refresh**: Balances data freshness with API costs
- **Smart Fallback**: Uses cache when sufficient results exist
- **Progressive Enhancement**: Cache-first, API-fallback approach

### 2. **Database Indexing**
```sql
-- Optimized indexes for fast queries
CREATE INDEX ON vendor_search_cache(location, category_id);
CREATE INDEX ON vendor_search_results(google_place_id);
CREATE INDEX ON vendor_search_cache(next_refresh_date);
```

### 3. **API Rate Limiting**
- **Batch Processing**: Process multiple vendors efficiently
- **Error Handling**: Graceful fallback on API failures
- **Request Optimization**: Minimize API calls through caching

## Error Handling

### Common Error Scenarios

#### 1. **API Key Issues**
```typescript
if (!this.isGoogleConfigured()) {
  throw new Error('Google Places API not configured');
}
```

#### 2. **Location Not Found**
```typescript
if (data.status !== 'OK' || !data.results) {
  throw new Error('Location not found');
}
```

#### 3. **Cache Fallback**
```typescript
try {
  // Try Google Places API
  const result = await this.searchGooglePlaces(...);
} catch (error) {
  // Fallback to cached results
  const cachedResults = await this.getCachedResults(...);
  if (cachedResults.length > 0) {
    return cachedResults;
  }
  throw error;
}
```

## Monitoring and Analytics

### Search Metrics
- **Cache Hit Rate**: Percentage of searches served from cache
- **API Usage**: Google Places API call frequency
- **Search Patterns**: Popular locations and categories
- **Performance**: Response times for cached vs. API results

### Database Monitoring
- **Cache Refresh**: Track automatic refresh success rates
- **Storage Growth**: Monitor vendor data storage usage
- **Query Performance**: Database query execution times

## Security Considerations

### 1. **API Key Security**
- **Environment Variables**: Never expose API keys in code
- **Domain Restrictions**: Restrict API keys to your domain
- **Usage Monitoring**: Monitor API key usage patterns

### 2. **Data Privacy**
- **User Search History**: Only accessible to authenticated users
- **Vendor Information**: Public vendor data from Google Places
- **Location Data**: Coordinates stored for mapping functionality

### 3. **Rate Limiting**
- **API Quotas**: Respect Google Places API limits
- **User Limits**: Implement per-user search rate limiting
- **Cache Protection**: Prevent cache abuse through validation

## Troubleshooting

### Common Issues

#### 1. **"Google Places API not configured"**
- Check `VITE_GOOGLE_PLACES_API_KEY` environment variable
- Verify API key is valid and has Places API enabled
- Restart development server after adding environment variable

#### 2. **"Location not found"**
- Verify location spelling and format
- Check if location exists in Google's geocoding database
- Try alternative location formats (city, state vs. ZIP code)

#### 3. **No vendors found**
- Expand search radius
- Try different category
- Check if category exists in the specified location
- Verify Google Places API quota hasn't been exceeded

#### 4. **Cache not working**
- Check database connection and permissions
- Verify RLS policies are correctly configured
- Check if cache tables exist and are properly indexed

### Debug Mode

Enable debug logging by setting:
```typescript
console.log('Starting vendor search:', params);
console.log('Cache check result:', needsRefresh);
console.log('Google Places results:', googleResults);
```

## Future Enhancements

### Planned Features
1. **Advanced Filtering**: Price range, availability, special services
2. **Vendor Reviews**: Integration with Google Reviews API
3. **Map Integration**: Interactive map view of vendor locations
4. **Recommendation Engine**: AI-powered vendor suggestions
5. **Multi-language Support**: International vendor search
6. **Mobile Optimization**: Enhanced mobile search experience

### Performance Improvements
1. **Redis Caching**: Faster cache layer for high-traffic scenarios
2. **CDN Integration**: Optimized image delivery
3. **Search Analytics**: Advanced search pattern analysis
4. **Predictive Caching**: Pre-cache popular search combinations

## Support and Maintenance

### Regular Maintenance Tasks
1. **Cache Cleanup**: Remove expired cache entries
2. **Performance Monitoring**: Track search response times
3. **API Usage Review**: Monitor Google Places API costs
4. **Database Optimization**: Regular index maintenance

### Support Resources
- **Configuration Guide**: `/vendor-search-config` page
- **API Documentation**: Google Places API documentation
- **Error Logs**: Browser console and server logs
- **Database Queries**: Supabase dashboard monitoring

---

This documentation provides a comprehensive overview of the Vendor Search System. For specific implementation details, refer to the source code and database schema files.
