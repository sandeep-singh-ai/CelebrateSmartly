
interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  business_status?: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
}

interface GooglePlacesResponse {
  results: GooglePlace[];
  status: string;
  next_page_token?: string;
}

import { VendorSearchParams } from '@/types/vendor';

class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchVendors(params: VendorSearchParams): Promise<GooglePlace[]> {
    const { location, category, radius } = params;
    
    // First, geocode the location to get coordinates
    const geocodeUrl = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(location)}&key=${this.apiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      throw new Error('Location not found');
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;
    
    // Search for vendors near the location
    const query = category ? `${category} near ${location}` : `event vendors near ${location}`;
    const searchUrl = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=${radius * 1609}&key=${this.apiKey}`;
    
    const response = await fetch(searchUrl);
    const data: GooglePlacesResponse = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }
    
    return data.results || [];
  }

  async getPlaceDetails(placeId: string): Promise<GooglePlace> {
    const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,photos,geometry,types,business_status,opening_hours&key=${this.apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }
    
    return data.result;
  }

  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  async uploadImageToS3(imageUrl: string, fileName: string, s3Service: any): Promise<string> {
    try {
      console.log(`Fetching image from Google: ${imageUrl}`);
      
      // Fetch the image from Google Photos API
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
      }
      
      const imageBlob = await imageResponse.blob();
      console.log(`Image fetched successfully, size: ${imageBlob.size} bytes`);
      
      if (!s3Service) {
        console.warn('S3 service not configured, skipping image upload');
        return '';
      }
      
      // Upload to S3
      const s3Url = await s3Service.uploadImage(imageBlob, fileName);
      return s3Url;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      // Return empty string instead of throwing to not break the flow
      return '';
    }
  }
}

export default GooglePlacesService;
