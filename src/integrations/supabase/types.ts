export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blog_posts_cache: {
        Row: {
          author_name: string | null
          categories: Json | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          last_updated: string
          published_date: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: Json | null
          title: string
          wordpress_id: number
        }
        Insert: {
          author_name?: string | null
          categories?: Json | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          last_updated?: string
          published_date: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: Json | null
          title: string
          wordpress_id: number
        }
        Update: {
          author_name?: string | null
          categories?: Json | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          last_updated?: string
          published_date?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: Json | null
          title?: string
          wordpress_id?: number
        }
        Relationships: []
      }
      counties: {
        Row: {
          created_at: string
          id: string
          name: string
          state_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          state_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          state_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "counties_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      event_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_pages: {
        Row: {
          created_at: string
          css_content: string
          custom_domain: string | null
          description: string | null
          event_name: string
          featured_image_url: string | null
          html_content: string
          id: string
          is_published: boolean | null
          meta_tags: Json | null
          template_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          css_content: string
          custom_domain?: string | null
          description?: string | null
          event_name: string
          featured_image_url?: string | null
          html_content: string
          id?: string
          is_published?: boolean | null
          meta_tags?: Json | null
          template_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          css_content?: string
          custom_domain?: string | null
          description?: string | null
          event_name?: string
          featured_image_url?: string | null
          html_content?: string
          id?: string
          is_published?: boolean | null
          meta_tags?: Json | null
          template_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          created_at: string
          dietary_restrictions: string | null
          event_id: string
          guest_email: string
          guest_message: string | null
          guest_name: string
          id: string
          plus_one: boolean | null
          qr_code: string | null
          response: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dietary_restrictions?: string | null
          event_id: string
          guest_email: string
          guest_message?: string | null
          guest_name: string
          id?: string
          plus_one?: boolean | null
          qr_code?: string | null
          response: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dietary_restrictions?: string | null
          event_id?: string
          guest_email?: string
          guest_message?: string | null
          guest_name?: string
          id?: string
          plus_one?: boolean | null
          qr_code?: string | null
          response?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_themes: {
        Row: {
          additional_recommendations: Json | null
          colors: Json
          created_at: string
          event_id: string | null
          food_recommendations: Json
          id: string
          party_suppliers: Json
          theme_name: string
        }
        Insert: {
          additional_recommendations?: Json | null
          colors: Json
          created_at?: string
          event_id?: string | null
          food_recommendations: Json
          id?: string
          party_suppliers: Json
          theme_name: string
        }
        Update: {
          additional_recommendations?: Json | null
          colors?: Json
          created_at?: string
          event_id?: string | null
          food_recommendations?: Json
          id?: string
          party_suppliers?: Json
          theme_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_themes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          budget_range: string | null
          category_id: string | null
          created_at: string
          custom_slug: string | null
          description: string | null
          event_date: string
          event_type: string
          expected_guests: number | null
          id: string
          is_public: boolean | null
          location: string | null
          number_of_people: number | null
          selected_theme: Json | null
          theme: string | null
          themes: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          category_id?: string | null
          created_at?: string
          custom_slug?: string | null
          description?: string | null
          event_date: string
          event_type: string
          expected_guests?: number | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          number_of_people?: number | null
          selected_theme?: Json | null
          theme?: string | null
          themes?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range?: string | null
          category_id?: string | null
          created_at?: string
          custom_slug?: string | null
          description?: string | null
          event_date?: string
          event_type?: string
          expected_guests?: number | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          number_of_people?: number | null
          selected_theme?: Json | null
          theme?: string | null
          themes?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          is_active: boolean | null
          question: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          question: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          question?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      guest_invites: {
        Row: {
          created_at: string
          guest_id: string
          id: string
          responded_at: string | null
          status: string
          sub_event_id: string
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          guest_id: string
          id?: string
          responded_at?: string | null
          status?: string
          sub_event_id: string
          token?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          guest_id?: string
          id?: string
          responded_at?: string | null
          status?: string
          sub_event_id?: string
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_invites_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "rsvp_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_invites_sub_event_id_fkey"
            columns: ["sub_event_id"]
            isOneToOne: false
            referencedRelation: "sub_events"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_lists: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          email: string
          event_id: string
          id: string
          invitation_sent_at: string | null
          linked_event_id: string | null
          linked_rsvp_event_id: string | null
          linked_sub_event_id: string | null
          name: string
          phone_number: string | null
          reminder_sent_at: string | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          email: string
          event_id: string
          id?: string
          invitation_sent_at?: string | null
          linked_event_id?: string | null
          linked_rsvp_event_id?: string | null
          linked_sub_event_id?: string | null
          name: string
          phone_number?: string | null
          reminder_sent_at?: string | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          email?: string
          event_id?: string
          id?: string
          invitation_sent_at?: string | null
          linked_event_id?: string | null
          linked_rsvp_event_id?: string | null
          linked_sub_event_id?: string | null
          name?: string
          phone_number?: string | null
          reminder_sent_at?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_lists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_lists_linked_event_id_fkey"
            columns: ["linked_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_lists_linked_rsvp_event_id_fkey"
            columns: ["linked_rsvp_event_id"]
            isOneToOne: false
            referencedRelation: "rsvp_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_lists_linked_sub_event_id_fkey"
            columns: ["linked_sub_event_id"]
            isOneToOne: false
            referencedRelation: "sub_events"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_tracking: {
        Row: {
          checked_in_at: string | null
          created_at: string | null
          event_id: string | null
          guest_email: string
          guest_list_id: string
          guest_message: string | null
          guest_name: string
          id: string
          invitation_sent_at: string | null
          opened_at: string | null
          response_received_at: string | null
          response_status: string
          rsvp_event_id: string | null
          status: string | null
          sub_event_id: string | null
          token: string | null
          updated_at: string | null
        }
        Insert: {
          checked_in_at?: string | null
          created_at?: string | null
          event_id?: string | null
          guest_email: string
          guest_list_id: string
          guest_message?: string | null
          guest_name: string
          id?: string
          invitation_sent_at?: string | null
          opened_at?: string | null
          response_received_at?: string | null
          response_status?: string
          rsvp_event_id?: string | null
          status?: string | null
          sub_event_id?: string | null
          token?: string | null
          updated_at?: string | null
        }
        Update: {
          checked_in_at?: string | null
          created_at?: string | null
          event_id?: string | null
          guest_email?: string
          guest_list_id?: string
          guest_message?: string | null
          guest_name?: string
          id?: string
          invitation_sent_at?: string | null
          opened_at?: string | null
          response_received_at?: string | null
          response_status?: string
          rsvp_event_id?: string | null
          status?: string | null
          sub_event_id?: string | null
          token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_tracking_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitation_tracking_guest_list_id_fkey"
            columns: ["guest_list_id"]
            isOneToOne: false
            referencedRelation: "guest_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitation_tracking_rsvp_event_id_fkey"
            columns: ["rsvp_event_id"]
            isOneToOne: false
            referencedRelation: "rsvp_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitation_tracking_sub_event_id_fkey"
            columns: ["sub_event_id"]
            isOneToOne: false
            referencedRelation: "sub_events"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_tiers: {
        Row: {
          created_at: string
          features: Json | null
          id: string
          max_events: number
          max_rsvps: number
          name: string
          price_monthly: number
        }
        Insert: {
          created_at?: string
          features?: Json | null
          id?: string
          max_events: number
          max_rsvps: number
          name: string
          price_monthly: number
        }
        Update: {
          created_at?: string
          features?: Json | null
          id?: string
          max_events?: number
          max_rsvps?: number
          name?: string
          price_monthly?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rsvp_events: {
        Row: {
          cover_image: string | null
          created_at: string
          custom_slug: string | null
          description: string | null
          id: string
          is_public: boolean
          main_date: string
          owner_id: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          custom_slug?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          main_date: string
          owner_id: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          custom_slug?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          main_date?: string
          owner_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rsvp_guests: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          rsvp_event_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          rsvp_event_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          rsvp_event_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_guests_rsvp_event_id_fkey"
            columns: ["rsvp_event_id"]
            isOneToOne: false
            referencedRelation: "rsvp_events"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvp_responses: {
        Row: {
          created_at: string
          guest_email: string
          guest_list_id: string
          guest_name: string
          id: string
          message: string | null
          responded_at: string
          response: string
          token_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          guest_email: string
          guest_list_id: string
          guest_name: string
          id?: string
          message?: string | null
          responded_at?: string
          response: string
          token_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          guest_email?: string
          guest_list_id?: string
          guest_name?: string
          id?: string
          message?: string | null
          responded_at?: string
          response?: string
          token_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_responses_guest_list_id_fkey"
            columns: ["guest_list_id"]
            isOneToOne: false
            referencedRelation: "guest_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvp_responses_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "rsvp_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvp_tokens: {
        Row: {
          created_at: string
          expires_at: string
          guest_id: string
          guest_list_id: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          guest_id: string
          guest_list_id: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          guest_id?: string
          guest_list_id?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_tokens_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guest_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvp_tokens_guest_list_id_fkey"
            columns: ["guest_list_id"]
            isOneToOne: false
            referencedRelation: "guest_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          abbreviation: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          abbreviation: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          abbreviation?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      sub_events: {
        Row: {
          created_at: string
          dress_code: string | null
          end_time: string | null
          event_date: string
          event_id: string | null
          event_time: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          rsvp_event_id: string | null
          start_time: string | null
          updated_at: string
          venue_map_link: string | null
        }
        Insert: {
          created_at?: string
          dress_code?: string | null
          end_time?: string | null
          event_date: string
          event_id?: string | null
          event_time?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          rsvp_event_id?: string | null
          start_time?: string | null
          updated_at?: string
          venue_map_link?: string | null
        }
        Update: {
          created_at?: string
          dress_code?: string | null
          end_time?: string | null
          event_date?: string
          event_id?: string | null
          event_time?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          rsvp_event_id?: string | null
          start_time?: string | null
          updated_at?: string
          venue_map_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sub_events_rsvp_event_id_fkey"
            columns: ["rsvp_event_id"]
            isOneToOne: false
            referencedRelation: "rsvp_events"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      vendor_search_cache: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          last_updated: string
          latitude: number | null
          location: string
          longitude: number | null
          next_refresh_date: string
          postal_code: string | null
          search_radius: number
          vendor_count: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          last_updated?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          next_refresh_date?: string
          postal_code?: string | null
          search_radius: number
          vendor_count?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          last_updated?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          next_refresh_date?: string
          postal_code?: string | null
          search_radius?: number
          vendor_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_search_cache_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_search_history: {
        Row: {
          cache_id: string
          id: string
          results_count: number
          search_date: string
          search_query: string
          user_id: string
        }
        Insert: {
          cache_id: string
          id?: string
          results_count: number
          search_date?: string
          search_query: string
          user_id: string
        }
        Update: {
          cache_id?: string
          id?: string
          results_count?: number
          search_date?: string
          search_query?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_search_history_cache_id_fkey"
            columns: ["cache_id"]
            isOneToOne: false
            referencedRelation: "vendor_search_cache"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_search_results: {
        Row: {
          address: string
          business_name: string
          business_type: string | null
          cache_id: string
          created_at: string
          description: string | null
          email: string | null
          google_data: Json | null
          google_place_id: string
          id: string
          images: Json | null
          is_premium: boolean | null
          last_google_update: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          rating: number | null
          review_count: number | null
          slug: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          business_name: string
          business_type?: string | null
          cache_id: string
          created_at?: string
          description?: string | null
          email?: string | null
          google_data?: Json | null
          google_place_id: string
          id?: string
          images?: Json | null
          is_premium?: boolean | null
          last_google_update?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          business_name?: string
          business_type?: string | null
          cache_id?: string
          created_at?: string
          description?: string | null
          email?: string | null
          google_data?: Json | null
          google_place_id?: string
          id?: string
          images?: Json | null
          is_premium?: boolean | null
          last_google_update?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_search_results_cache_id_fkey"
            columns: ["cache_id"]
            isOneToOne: false
            referencedRelation: "vendor_search_cache"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_searches: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          location: string
          search_query: string | null
          search_radius: number | null
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          location: string
          search_query?: string | null
          search_radius?: number | null
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          location?: string
          search_query?: string | null
          search_radius?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_searches_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          business_name: string
          business_type: string
          county_id: string | null
          created_at: string
          description: string | null
          email: string | null
          google_data: Json | null
          google_place_id: string | null
          id: string
          images: Json | null
          is_premium: boolean | null
          last_google_update: string | null
          last_updated: string | null
          phone: string | null
          rating: number | null
          review_count: number | null
          slug: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          business_type: string
          county_id?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          google_data?: Json | null
          google_place_id?: string | null
          id?: string
          images?: Json | null
          is_premium?: boolean | null
          last_google_update?: string | null
          last_updated?: string | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          business_type?: string
          county_id?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          google_data?: Json | null
          google_place_id?: string | null
          id?: string
          images?: Json | null
          is_premium?: boolean | null
          last_google_update?: string | null
          last_updated?: string | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          slug?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
        ]
      }
      website_templates: {
        Row: {
          category_id: string
          created_at: string
          css_content: string
          description: string | null
          html_content: string
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          js_content: string | null
          name: string
          preview_url: string | null
          sort_order: number | null
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          css_content: string
          description?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          js_content?: string | null
          name: string
          preview_url?: string | null
          sort_order?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          css_content?: string
          description?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          js_content?: string | null
          name?: string
          preview_url?: string | null
          sort_order?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_invitation_tracking_records: {
        Args: {
          p_event_id?: string
          p_guest_list_id: string
          p_rsvp_event_id?: string
          p_sub_event_id?: string
        }
        Returns: Json
      }
      extract_postal_code: {
        Args: { address_text: string }
        Returns: string
      }
      generate_rsvp_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_cached_vendor_results: {
        Args: {
          p_category_id: string
          p_location: string
          p_search_radius: number
        }
        Returns: {
          address: string
          business_name: string
          business_type: string
          description: string
          email: string
          google_place_id: string
          id: string
          images: Json
          is_premium: boolean
          latitude: number
          longitude: number
          phone: string
          rating: number
          review_count: number
          slug: string
          website: string
        }[]
      }
      get_rsvp_url: {
        Args: { guest_id_param: string }
        Returns: string
      }
      send_rsvp_event_invitations: {
        Args: { rsvp_event_id_param: string }
        Returns: Json
      }
      send_rsvp_invitations: {
        Args: { guest_list_id_param: string }
        Returns: Json
      }
      should_refresh_vendor_cache: {
        Args: {
          p_category_id: string
          p_location: string
          p_search_radius: number
        }
        Returns: boolean
      }
      update_cache_refresh_date: {
        Args: {
          p_category_id: string
          p_location: string
          p_search_radius: number
        }
        Returns: undefined
      }
      user_owns_event_for_invitation: {
        Args: { invitation_id: string }
        Returns: boolean
      }
      validate_rsvp_token: {
        Args: { p_token: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
