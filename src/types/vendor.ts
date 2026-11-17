export interface Vendor {
  id: string;
  business_name: string;
  business_type: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  review_count: number;
  images: string[];
  is_premium: boolean;
  slug: string;
  google_place_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorSearchParams {
  location: string;
  category: string;
  radius: number;
}

export interface VendorCreateData {
  business_name: string;
  business_type: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  review_count: number;
  images: string[];
  is_premium: boolean;
  slug: string;
  google_place_id: string;
  user_id: string;
}