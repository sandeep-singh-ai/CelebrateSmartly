
-- Structure only. No accounts, guest lists, RSVPs, vendor rows, or email addresses.
-- Safe to commit. Do not replace this file with a data dump.

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."create_guest_invites_for_sub_event"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Create invites for all guests of the rsvp_event when a new sub_event is created
  INSERT INTO public.guest_invites (guest_id, sub_event_id, token)
  SELECT 
    rg.id,
    NEW.id,
    encode(gen_random_bytes(32), 'base64url')
  FROM public.rsvp_guests rg
  WHERE rg.rsvp_event_id = NEW.rsvp_event_id;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_guest_invites_for_sub_event"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_invitation_tracking_records"("p_guest_list_id" "uuid", "p_event_id" "uuid" DEFAULT NULL::"uuid", "p_rsvp_event_id" "uuid" DEFAULT NULL::"uuid", "p_sub_event_id" "uuid" DEFAULT NULL::"uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  guest_record RECORD;
  invitation_count INTEGER := 0;
BEGIN
  -- Create tracking records for each guest in the guest list
  FOR guest_record IN 
    SELECT name, email FROM public.guest_lists 
    WHERE event_id IN (
      SELECT event_id FROM public.guest_lists WHERE id = p_guest_list_id
    )
    AND name IS NOT NULL 
    AND email IS NOT NULL
  LOOP
    INSERT INTO public.invitation_tracking (
      guest_list_id,
      guest_email,
      guest_name,
      event_id,
      rsvp_event_id,
      sub_event_id,
      invitation_sent_at
    ) VALUES (
      p_guest_list_id,
      guest_record.email,
      guest_record.name,
      p_event_id,
      p_rsvp_event_id,
      p_sub_event_id,
      NOW()
    )
    ON CONFLICT (token) DO NOTHING;
    
    invitation_count := invitation_count + 1;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'invitation_count', invitation_count,
    'message', 'Invitation tracking records created'
  );
END;
$$;


ALTER FUNCTION "public"."create_invitation_tracking_records"("p_guest_list_id" "uuid", "p_event_id" "uuid", "p_rsvp_event_id" "uuid", "p_sub_event_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."extract_postal_code"("address_text" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
BEGIN
  -- Extract US postal code pattern (5 digits or 5+4 format)
  RETURN regexp_replace(address_text, '.*(\d{5}(?:-\d{4})?).*', '\1');
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."extract_postal_code"("address_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_rsvp_token"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$;


ALTER FUNCTION "public"."generate_rsvp_token"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_cached_vendor_results"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) RETURNS TABLE("id" "uuid", "business_name" "text", "business_type" "text", "description" "text", "address" "text", "phone" "text", "email" "text", "website" "text", "rating" numeric, "review_count" integer, "latitude" numeric, "longitude" numeric, "images" "jsonb", "is_premium" boolean, "slug" "text", "google_place_id" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vsr.id,
    vsr.business_name,
    vsr.business_type,
    vsr.description,
    vsr.address,
    vsr.phone,
    vsr.email,
    vsr.website,
    vsr.rating,
    vsr.review_count,
    vsr.latitude,
    vsr.longitude,
    vsr.images,
    vsr.is_premium,
    vsr.slug,
    vsr.google_place_id
  FROM public.vendor_search_results vsr
  JOIN public.vendor_search_cache vsc ON vsr.cache_id = vsc.id
  WHERE vsc.location = p_location
    AND vsc.category_id = p_category_id
    AND vsc.search_radius = p_search_radius
  ORDER BY vsr.rating DESC NULLS LAST, vsr.review_count DESC NULLS LAST;
END;
$$;


ALTER FUNCTION "public"."get_cached_vendor_results"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_rsvp_url"("guest_id_param" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  guest_token TEXT;
BEGIN
  SELECT token INTO guest_token 
  FROM public.guest_invites 
  WHERE guest_id = guest_id_param 
  LIMIT 1;
  
  IF guest_token IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN '/rsvp/' || guest_token;
END;
$$;


ALTER FUNCTION "public"."get_rsvp_url"("guest_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  
  -- Insert subscriber record with Free tier
  INSERT INTO public.subscribers (user_id, email, subscription_tier)
  VALUES (NEW.id, NEW.email, 'Free');
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_rsvp_event_invitations"("rsvp_event_id_param" "uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  result JSON;
  invitation_count INTEGER;
BEGIN
  -- Count invitations to be sent
  SELECT COUNT(DISTINCT gi.guest_id) INTO invitation_count
  FROM public.guest_invites gi
  JOIN public.rsvp_guests rg ON gi.guest_id = rg.id
  WHERE rg.rsvp_event_id = rsvp_event_id_param;
  
  -- This will be handled by an edge function
  result := json_build_object(
    'success', true, 
    'message', 'RSVP invitations queued for sending',
    'invitation_count', invitation_count
  );
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."send_rsvp_event_invitations"("rsvp_event_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_rsvp_invitations"("guest_list_id_param" "uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  result JSON;
BEGIN
  -- This will be handled by an edge function
  -- For now, just return success
  result := '{"success": true, "message": "Invitations queued for sending"}'::JSON;
  
  -- Update invitation sent timestamp
  UPDATE public.guest_lists 
  SET invitation_sent_at = NOW()
  WHERE id = guest_list_id_param;
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."send_rsvp_invitations"("guest_list_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."should_refresh_vendor_cache"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  cache_record RECORD;
BEGIN
  SELECT * INTO cache_record
  FROM public.vendor_search_cache
  WHERE location = p_location 
    AND category_id = p_category_id 
    AND search_radius = p_search_radius;
  
  -- Return true if no cache exists or if it's time to refresh
  RETURN cache_record IS NULL OR cache_record.next_refresh_date <= NOW();
END;
$$;


ALTER FUNCTION "public"."should_refresh_vendor_cache"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_cache_refresh_date"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.vendor_search_cache
  SET next_refresh_date = NOW() + INTERVAL '30 days',
      last_updated = NOW()
  WHERE location = p_location 
    AND category_id = p_category_id 
    AND search_radius = p_search_radius;
END;
$$;


ALTER FUNCTION "public"."update_cache_refresh_date"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_event_pages_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_event_pages_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_faqs_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_faqs_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_template_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_template_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_owns_event_for_invitation"("invitation_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    owns_event boolean := false;
BEGIN
    -- Check if user owns the event through event_id
    SELECT EXISTS(
        SELECT 1 FROM public.events e 
        INNER JOIN public.invitation_tracking it ON e.id = it.event_id
        WHERE it.id = invitation_id AND e.user_id = auth.uid()
    ) INTO owns_event;
    
    IF owns_event THEN
        RETURN true;
    END IF;
    
    -- Check if user owns the event through rsvp_event_id
    SELECT EXISTS(
        SELECT 1 FROM public.rsvp_events re 
        INNER JOIN public.invitation_tracking it ON re.id = it.rsvp_event_id
        WHERE it.id = invitation_id AND re.owner_id = auth.uid()
    ) INTO owns_event;
    
    IF owns_event THEN
        RETURN true;
    END IF;
    
    -- Check if user owns the event through sub_event_id
    SELECT EXISTS(
        SELECT 1 FROM public.sub_events se
        INNER JOIN public.events e ON se.event_id = e.id
        INNER JOIN public.invitation_tracking it ON se.id = it.sub_event_id
        WHERE it.id = invitation_id AND e.user_id = auth.uid()
    ) INTO owns_event;
    
    IF owns_event THEN
        RETURN true;
    END IF;
    
    -- Check if user owns the rsvp event through sub_event_id
    SELECT EXISTS(
        SELECT 1 FROM public.sub_events se
        INNER JOIN public.rsvp_events re ON se.rsvp_event_id = re.id
        INNER JOIN public.invitation_tracking it ON se.id = it.sub_event_id
        WHERE it.id = invitation_id AND re.owner_id = auth.uid()
    ) INTO owns_event;
    
    RETURN owns_event;
END;
$$;


ALTER FUNCTION "public"."user_owns_event_for_invitation"("invitation_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_rsvp_token"("p_token" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.invitation_tracking 
    WHERE token = p_token 
    AND response_status = 'no_response'
  );
END;
$$;


ALTER FUNCTION "public"."validate_rsvp_token"("p_token" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."blog_posts_cache" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wordpress_id" integer NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "excerpt" "text",
    "slug" "text" NOT NULL,
    "featured_image_url" "text",
    "author_name" "text",
    "published_date" timestamp with time zone NOT NULL,
    "categories" "jsonb" DEFAULT '[]'::"jsonb",
    "tags" "jsonb" DEFAULT '[]'::"jsonb",
    "seo_title" "text",
    "seo_description" "text",
    "last_updated" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."blog_posts_cache" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."counties" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "state_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."counties" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."event_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_pages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "event_name" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "template_id" "text" NOT NULL,
    "html_content" "text" NOT NULL,
    "css_content" "text" NOT NULL,
    "featured_image_url" "text",
    "meta_tags" "jsonb" DEFAULT '{}'::"jsonb",
    "is_published" boolean DEFAULT false,
    "custom_domain" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."event_pages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_rsvps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "guest_name" "text" NOT NULL,
    "guest_email" "text" NOT NULL,
    "response" "text" NOT NULL,
    "guest_message" "text",
    "dietary_restrictions" "text",
    "plus_one" boolean DEFAULT false,
    "qr_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "event_rsvps_response_check" CHECK (("response" = ANY (ARRAY['attending'::"text", 'not_attending'::"text", 'maybe'::"text"])))
);


ALTER TABLE "public"."event_rsvps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_themes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid",
    "theme_name" "text" NOT NULL,
    "colors" "jsonb" NOT NULL,
    "party_suppliers" "jsonb" NOT NULL,
    "food_recommendations" "jsonb" NOT NULL,
    "additional_recommendations" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."event_themes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "event_type" "text" NOT NULL,
    "event_date" timestamp with time zone NOT NULL,
    "location" "text",
    "budget_range" "text",
    "expected_guests" integer,
    "is_public" boolean DEFAULT false,
    "custom_slug" "text",
    "theme" "text" DEFAULT 'default'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "category_id" "uuid",
    "number_of_people" integer,
    "themes" "jsonb" DEFAULT '[]'::"jsonb",
    "selected_theme" "jsonb"
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."faqs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question" "text" NOT NULL,
    "answer" "text" NOT NULL,
    "category" "text" DEFAULT 'general'::"text" NOT NULL,
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."faqs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guest_invites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_id" "uuid" NOT NULL,
    "sub_event_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'no_response'::"text" NOT NULL,
    "responded_at" timestamp with time zone,
    "token" "text" DEFAULT "encode"("extensions"."gen_random_bytes"(32), 'base64url'::"text") NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "guest_invites_status_check" CHECK (("status" = ANY (ARRAY['attending'::"text", 'not_attending'::"text", 'maybe'::"text", 'no_response'::"text"])))
);


ALTER TABLE "public"."guest_invites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guest_lists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone_number" "text",
    "category" "text" DEFAULT 'general'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "description" "text",
    "invitation_sent_at" timestamp with time zone,
    "reminder_sent_at" timestamp with time zone,
    "linked_event_id" "uuid",
    "linked_rsvp_event_id" "uuid",
    "linked_sub_event_id" "uuid"
);


ALTER TABLE "public"."guest_lists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invitation_tracking" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_list_id" "uuid" NOT NULL,
    "guest_email" "text" NOT NULL,
    "guest_name" "text" NOT NULL,
    "event_id" "uuid",
    "rsvp_event_id" "uuid",
    "sub_event_id" "uuid",
    "invitation_sent_at" timestamp with time zone,
    "response_status" "text" DEFAULT 'no_response'::"text" NOT NULL,
    "response_received_at" timestamp with time zone,
    "guest_message" "text",
    "token" "text" DEFAULT "encode"("extensions"."gen_random_bytes"(32), 'base64url'::"text"),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "status" "text" DEFAULT 'no_response'::"text",
    "checked_in_at" timestamp with time zone,
    "opened_at" timestamp with time zone
);

ALTER TABLE ONLY "public"."invitation_tracking" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."invitation_tracking" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."membership_tiers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "price_monthly" numeric(10,2) NOT NULL,
    "max_events" integer NOT NULL,
    "max_rsvps" integer NOT NULL,
    "features" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."membership_tiers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "phone_number" "text",
    "country" "text",
    "role" "text" DEFAULT 'customer'::"text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['customer'::"text", 'vendor'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rsvp_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "cover_image" "text",
    "main_date" "date" NOT NULL,
    "description" "text",
    "is_public" boolean DEFAULT false NOT NULL,
    "custom_slug" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."rsvp_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rsvp_guests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rsvp_event_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."rsvp_guests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rsvp_responses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_list_id" "uuid" NOT NULL,
    "guest_email" "text" NOT NULL,
    "guest_name" "text" NOT NULL,
    "response" "text" NOT NULL,
    "message" "text",
    "responded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "rsvp_responses_response_check" CHECK (("response" = ANY (ARRAY['attending'::"text", 'not_attending'::"text", 'maybe'::"text"])))
);


ALTER TABLE "public"."rsvp_responses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rsvp_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_list_id" "uuid" NOT NULL,
    "guest_id" "uuid" NOT NULL,
    "token" "text" NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '30 days'::interval) NOT NULL,
    "used_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."rsvp_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."states" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "abbreviation" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."states" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sub_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rsvp_event_id" "uuid",
    "name" "text" NOT NULL,
    "event_date" "date" NOT NULL,
    "start_time" time without time zone,
    "end_time" time without time zone,
    "location" "text",
    "notes" "text",
    "venue_map_link" "text",
    "dress_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "event_time" time without time zone,
    "event_id" "uuid",
    CONSTRAINT "sub_events_parent_check" CHECK (((("rsvp_event_id" IS NOT NULL) AND ("event_id" IS NULL)) OR (("rsvp_event_id" IS NULL) AND ("event_id" IS NOT NULL))))
);


ALTER TABLE "public"."sub_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscribers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "stripe_customer_id" "text",
    "subscribed" boolean DEFAULT false NOT NULL,
    "subscription_tier" "text" DEFAULT 'Free'::"text",
    "subscription_end" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."subscribers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."template_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "icon" "text",
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."template_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vendor_search_cache" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "location" "text" NOT NULL,
    "category_id" "uuid",
    "search_radius" integer NOT NULL,
    "postal_code" "text",
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "vendor_count" integer DEFAULT 0,
    "last_updated" timestamp with time zone DEFAULT "now"() NOT NULL,
    "next_refresh_date" timestamp with time zone DEFAULT ("now"() + '30 days'::interval) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."vendor_search_cache" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vendor_search_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "cache_id" "uuid" NOT NULL,
    "search_query" "text" NOT NULL,
    "results_count" integer NOT NULL,
    "search_date" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."vendor_search_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vendor_search_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cache_id" "uuid" NOT NULL,
    "google_place_id" "text" NOT NULL,
    "business_name" "text" NOT NULL,
    "business_type" "text",
    "description" "text",
    "address" "text" NOT NULL,
    "phone" "text",
    "email" "text",
    "website" "text",
    "rating" numeric(3,2),
    "review_count" integer,
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "google_data" "jsonb",
    "images" "jsonb" DEFAULT '[]'::"jsonb",
    "is_premium" boolean DEFAULT false,
    "slug" "text",
    "last_google_update" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."vendor_search_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vendor_searches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "location" "text" NOT NULL,
    "category_id" "uuid",
    "search_radius" integer DEFAULT 25,
    "search_query" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."vendor_searches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vendors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "business_name" "text" NOT NULL,
    "business_type" "text" NOT NULL,
    "description" "text",
    "address" "text",
    "phone" "text",
    "email" "text",
    "website" "text",
    "county_id" "uuid",
    "rating" numeric(3,2) DEFAULT 0,
    "review_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "google_place_id" "text",
    "google_data" "jsonb",
    "images" "jsonb" DEFAULT '[]'::"jsonb",
    "last_google_update" timestamp with time zone,
    "is_premium" boolean DEFAULT false,
    "slug" "text",
    "last_updated" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."vendors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."website_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "category_id" "uuid" NOT NULL,
    "thumbnail_url" "text",
    "preview_url" "text",
    "html_content" "text" NOT NULL,
    "css_content" "text" NOT NULL,
    "js_content" "text" DEFAULT ''::"text",
    "is_premium" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "sort_order" integer DEFAULT 0,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."website_templates" OWNER TO "postgres";


ALTER TABLE ONLY "public"."blog_posts_cache"
    ADD CONSTRAINT "blog_posts_cache_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts_cache"
    ADD CONSTRAINT "blog_posts_cache_wordpress_id_key" UNIQUE ("wordpress_id");



ALTER TABLE ONLY "public"."counties"
    ADD CONSTRAINT "counties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_categories"
    ADD CONSTRAINT "event_categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."event_categories"
    ADD CONSTRAINT "event_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_pages"
    ADD CONSTRAINT "event_pages_event_name_key" UNIQUE ("event_name");



ALTER TABLE ONLY "public"."event_pages"
    ADD CONSTRAINT "event_pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_rsvps"
    ADD CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_rsvps"
    ADD CONSTRAINT "event_rsvps_qr_code_key" UNIQUE ("qr_code");



ALTER TABLE ONLY "public"."event_themes"
    ADD CONSTRAINT "event_themes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_custom_slug_key" UNIQUE ("custom_slug");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faqs"
    ADD CONSTRAINT "faqs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guest_invites"
    ADD CONSTRAINT "guest_invites_guest_id_sub_event_id_key" UNIQUE ("guest_id", "sub_event_id");



ALTER TABLE ONLY "public"."guest_invites"
    ADD CONSTRAINT "guest_invites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guest_invites"
    ADD CONSTRAINT "guest_invites_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."guest_lists"
    ADD CONSTRAINT "guest_lists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invitation_tracking"
    ADD CONSTRAINT "invitation_tracking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invitation_tracking"
    ADD CONSTRAINT "invitation_tracking_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."membership_tiers"
    ADD CONSTRAINT "membership_tiers_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."membership_tiers"
    ADD CONSTRAINT "membership_tiers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsvp_events"
    ADD CONSTRAINT "rsvp_events_custom_slug_key" UNIQUE ("custom_slug");



ALTER TABLE ONLY "public"."rsvp_events"
    ADD CONSTRAINT "rsvp_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsvp_guests"
    ADD CONSTRAINT "rsvp_guests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsvp_guests"
    ADD CONSTRAINT "rsvp_guests_rsvp_event_id_email_key" UNIQUE ("rsvp_event_id", "email");



ALTER TABLE ONLY "public"."rsvp_responses"
    ADD CONSTRAINT "rsvp_responses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsvp_tokens"
    ADD CONSTRAINT "rsvp_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rsvp_tokens"
    ADD CONSTRAINT "rsvp_tokens_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_abbreviation_key" UNIQUE ("abbreviation");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sub_events"
    ADD CONSTRAINT "sub_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."template_categories"
    ADD CONSTRAINT "template_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vendor_search_cache"
    ADD CONSTRAINT "vendor_search_cache_location_category_id_search_radius_key" UNIQUE ("location", "category_id", "search_radius");



ALTER TABLE ONLY "public"."vendor_search_cache"
    ADD CONSTRAINT "vendor_search_cache_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vendor_search_history"
    ADD CONSTRAINT "vendor_search_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vendor_search_results"
    ADD CONSTRAINT "vendor_search_results_google_place_id_key" UNIQUE ("google_place_id");



ALTER TABLE ONLY "public"."vendor_search_results"
    ADD CONSTRAINT "vendor_search_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vendor_searches"
    ADD CONSTRAINT "vendor_searches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_google_place_id_key" UNIQUE ("google_place_id");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."website_templates"
    ADD CONSTRAINT "website_templates_pkey" PRIMARY KEY ("id");



CREATE INDEX "blog_posts_published_date_idx" ON "public"."blog_posts_cache" USING "btree" ("published_date" DESC);



CREATE INDEX "blog_posts_slug_idx" ON "public"."blog_posts_cache" USING "btree" ("slug");



CREATE INDEX "idx_guest_invites_status" ON "public"."guest_invites" USING "btree" ("status");



CREATE INDEX "idx_guest_invites_sub_event_id" ON "public"."guest_invites" USING "btree" ("sub_event_id");



CREATE INDEX "idx_rsvp_guests_rsvp_event_id" ON "public"."rsvp_guests" USING "btree" ("rsvp_event_id");



CREATE INDEX "idx_sub_events_rsvp_event_id" ON "public"."sub_events" USING "btree" ("rsvp_event_id");



CREATE INDEX "vendor_search_cache_category_idx" ON "public"."vendor_search_cache" USING "btree" ("category_id");



CREATE INDEX "vendor_search_cache_location_category_idx" ON "public"."vendor_search_cache" USING "btree" ("location", "category_id");



CREATE INDEX "vendor_search_cache_location_idx" ON "public"."vendor_search_cache" USING "btree" ("location");



CREATE INDEX "vendor_search_cache_next_refresh_idx" ON "public"."vendor_search_cache" USING "btree" ("next_refresh_date");



CREATE INDEX "vendor_search_cache_postal_code_idx" ON "public"."vendor_search_cache" USING "btree" ("postal_code");



CREATE INDEX "vendor_search_history_cache_id_idx" ON "public"."vendor_search_history" USING "btree" ("cache_id");



CREATE INDEX "vendor_search_history_search_date_idx" ON "public"."vendor_search_history" USING "btree" ("search_date");



CREATE INDEX "vendor_search_history_user_id_idx" ON "public"."vendor_search_history" USING "btree" ("user_id");



CREATE INDEX "vendor_search_results_business_type_idx" ON "public"."vendor_search_results" USING "btree" ("business_type");



CREATE INDEX "vendor_search_results_cache_id_idx" ON "public"."vendor_search_results" USING "btree" ("cache_id");



CREATE INDEX "vendor_search_results_google_place_id_idx" ON "public"."vendor_search_results" USING "btree" ("google_place_id");



CREATE INDEX "vendor_search_results_location_idx" ON "public"."vendor_search_results" USING "btree" ("latitude", "longitude");



CREATE INDEX "vendors_business_type_idx" ON "public"."vendors" USING "btree" ("business_type");



CREATE INDEX "vendors_google_place_id_idx" ON "public"."vendors" USING "btree" ("google_place_id") WHERE ("google_place_id" IS NOT NULL);



CREATE INDEX "vendors_last_updated_idx" ON "public"."vendors" USING "btree" ("last_updated");



CREATE INDEX "vendors_location_idx" ON "public"."vendors" USING "btree" ("address");



CREATE INDEX "vendors_premium_idx" ON "public"."vendors" USING "btree" ("is_premium");



CREATE OR REPLACE TRIGGER "trigger_create_guest_invites" AFTER INSERT ON "public"."sub_events" FOR EACH ROW EXECUTE FUNCTION "public"."create_guest_invites_for_sub_event"();



CREATE OR REPLACE TRIGGER "update_event_pages_updated_at" BEFORE UPDATE ON "public"."event_pages" FOR EACH ROW EXECUTE FUNCTION "public"."update_event_pages_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_faqs_updated_at" BEFORE UPDATE ON "public"."faqs" FOR EACH ROW EXECUTE FUNCTION "public"."update_faqs_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_template_categories_updated_at" BEFORE UPDATE ON "public"."template_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_template_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_website_templates_updated_at" BEFORE UPDATE ON "public"."website_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_template_updated_at_column"();



ALTER TABLE ONLY "public"."counties"
    ADD CONSTRAINT "counties_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_rsvps"
    ADD CONSTRAINT "event_rsvps_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_themes"
    ADD CONSTRAINT "event_themes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."event_categories"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_invites"
    ADD CONSTRAINT "guest_invites_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."rsvp_guests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_invites"
    ADD CONSTRAINT "guest_invites_sub_event_id_fkey" FOREIGN KEY ("sub_event_id") REFERENCES "public"."sub_events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_lists"
    ADD CONSTRAINT "guest_lists_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_lists"
    ADD CONSTRAINT "guest_lists_linked_event_id_fkey" FOREIGN KEY ("linked_event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_lists"
    ADD CONSTRAINT "guest_lists_linked_rsvp_event_id_fkey" FOREIGN KEY ("linked_rsvp_event_id") REFERENCES "public"."rsvp_events"("id");



ALTER TABLE ONLY "public"."guest_lists"
    ADD CONSTRAINT "guest_lists_linked_sub_event_id_fkey" FOREIGN KEY ("linked_sub_event_id") REFERENCES "public"."sub_events"("id");



ALTER TABLE ONLY "public"."invitation_tracking"
    ADD CONSTRAINT "invitation_tracking_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invitation_tracking"
    ADD CONSTRAINT "invitation_tracking_guest_list_id_fkey" FOREIGN KEY ("guest_list_id") REFERENCES "public"."guest_lists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invitation_tracking"
    ADD CONSTRAINT "invitation_tracking_rsvp_event_id_fkey" FOREIGN KEY ("rsvp_event_id") REFERENCES "public"."rsvp_events"("id");



ALTER TABLE ONLY "public"."invitation_tracking"
    ADD CONSTRAINT "invitation_tracking_sub_event_id_fkey" FOREIGN KEY ("sub_event_id") REFERENCES "public"."sub_events"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsvp_events"
    ADD CONSTRAINT "rsvp_events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsvp_guests"
    ADD CONSTRAINT "rsvp_guests_rsvp_event_id_fkey" FOREIGN KEY ("rsvp_event_id") REFERENCES "public"."rsvp_events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsvp_responses"
    ADD CONSTRAINT "rsvp_responses_guest_list_id_fkey" FOREIGN KEY ("guest_list_id") REFERENCES "public"."guest_lists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsvp_responses"
    ADD CONSTRAINT "rsvp_responses_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "public"."rsvp_tokens"("id");



ALTER TABLE ONLY "public"."rsvp_tokens"
    ADD CONSTRAINT "rsvp_tokens_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."guest_lists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rsvp_tokens"
    ADD CONSTRAINT "rsvp_tokens_guest_list_id_fkey" FOREIGN KEY ("guest_list_id") REFERENCES "public"."guest_lists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sub_events"
    ADD CONSTRAINT "sub_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sub_events"
    ADD CONSTRAINT "sub_events_rsvp_event_id_fkey" FOREIGN KEY ("rsvp_event_id") REFERENCES "public"."rsvp_events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendor_search_cache"
    ADD CONSTRAINT "vendor_search_cache_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."event_categories"("id");



ALTER TABLE ONLY "public"."vendor_search_history"
    ADD CONSTRAINT "vendor_search_history_cache_id_fkey" FOREIGN KEY ("cache_id") REFERENCES "public"."vendor_search_cache"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendor_search_history"
    ADD CONSTRAINT "vendor_search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendor_search_results"
    ADD CONSTRAINT "vendor_search_results_cache_id_fkey" FOREIGN KEY ("cache_id") REFERENCES "public"."vendor_search_cache"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendor_searches"
    ADD CONSTRAINT "vendor_searches_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."event_categories"("id");



ALTER TABLE ONLY "public"."vendor_searches"
    ADD CONSTRAINT "vendor_searches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "public"."counties"("id");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."website_templates"
    ADD CONSTRAINT "website_templates_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."template_categories"("id") ON DELETE CASCADE;



CREATE POLICY "Anyone can create RSVP" ON "public"."event_rsvps" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can view active templates" ON "public"."website_templates" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view blog posts" ON "public"."blog_posts_cache" FOR SELECT USING (true);



CREATE POLICY "Anyone can view counties" ON "public"."counties" FOR SELECT USING (true);



CREATE POLICY "Anyone can view event categories" ON "public"."event_categories" FOR SELECT USING (true);



CREATE POLICY "Anyone can view states" ON "public"."states" FOR SELECT USING (true);



CREATE POLICY "Anyone can view template categories" ON "public"."template_categories" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view vendor search cache" ON "public"."vendor_search_cache" FOR SELECT USING (true);



CREATE POLICY "Anyone can view vendor search results" ON "public"."vendor_search_results" FOR SELECT USING (true);



CREATE POLICY "Anyone can view vendors" ON "public"."vendors" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can create vendor search cache" ON "public"."vendor_search_cache" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "FAQs are publicly viewable" ON "public"."faqs" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public RSVP events are viewable by anyone" ON "public"."rsvp_events" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Public RSVP full access by token" ON "public"."invitation_tracking" USING (("token" IS NOT NULL));



CREATE POLICY "Public sub-events are viewable" ON "public"."sub_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "sub_events"."rsvp_event_id") AND ("rsvp_events"."is_public" = true)))));



CREATE POLICY "Published event pages are publicly viewable" ON "public"."event_pages" FOR SELECT USING (("is_published" = true));



CREATE POLICY "RSVP events accessible via invitation token" ON "public"."rsvp_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."invitation_tracking"
  WHERE (("invitation_tracking"."rsvp_event_id" = "rsvp_events"."id") AND ("invitation_tracking"."token" IS NOT NULL)))));



CREATE POLICY "RSVP guests accessible via invitation token" ON "public"."rsvp_guests" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."guest_invites"
  WHERE (("guest_invites"."guest_id" = "rsvp_guests"."id") AND ("guest_invites"."token" IS NOT NULL)))));



CREATE POLICY "Sub-events accessible via invitation token" ON "public"."sub_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."invitation_tracking"
  WHERE (("invitation_tracking"."sub_event_id" = "sub_events"."id") AND ("invitation_tracking"."token" IS NOT NULL)))));



CREATE POLICY "System can manage vendor search results" ON "public"."vendor_search_results" USING (true);



CREATE POLICY "System can update vendor search cache" ON "public"."vendor_search_cache" FOR UPDATE USING (true);



CREATE POLICY "Token-based RSVP access" ON "public"."invitation_tracking" FOR SELECT USING ((("token" IS NOT NULL) AND ("length"("token") > 10)));



CREATE POLICY "Token-based RSVP update" ON "public"."invitation_tracking" FOR UPDATE USING ((("token" IS NOT NULL) AND ("length"("token") > 10) AND ("response_received_at" IS NULL)));



CREATE POLICY "Token-based guest invite access" ON "public"."guest_invites" FOR SELECT USING ((("token" IS NOT NULL) AND ("length"("token") > 10)));



CREATE POLICY "Token-based guest invite update" ON "public"."guest_invites" FOR UPDATE USING ((("token" IS NOT NULL) AND ("length"("token") > 10) AND ("status" = 'no_response'::"text")));



CREATE POLICY "Users can create guests for their rsvp events" ON "public"."rsvp_guests" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "rsvp_guests"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can create invitation tracking for own events" ON "public"."invitation_tracking" FOR INSERT WITH CHECK (((("event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "invitation_tracking"."event_id") AND ("e"."user_id" = "auth"."uid"()))))) OR (("rsvp_event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."rsvp_events" "re"
  WHERE (("re"."id" = "invitation_tracking"."rsvp_event_id") AND ("re"."owner_id" = "auth"."uid"()))))) OR (("sub_event_id" IS NOT NULL) AND ("event_id" IS NULL) AND ("rsvp_event_id" IS NULL) AND (EXISTS ( SELECT 1
   FROM ("public"."sub_events" "se"
     JOIN "public"."events" "e" ON (("se"."event_id" = "e"."id")))
  WHERE (("se"."id" = "invitation_tracking"."sub_event_id") AND ("e"."user_id" = "auth"."uid"()))))) OR (("sub_event_id" IS NOT NULL) AND ("rsvp_event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM ("public"."sub_events" "se"
     JOIN "public"."rsvp_events" "re" ON (("se"."rsvp_event_id" = "re"."id")))
  WHERE (("se"."id" = "invitation_tracking"."sub_event_id") AND ("re"."owner_id" = "auth"."uid"())))))));



CREATE POLICY "Users can create invites for their events" ON "public"."guest_invites" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."rsvp_guests" "rg"
     JOIN "public"."rsvp_events" "re" ON (("re"."id" = "rg"."rsvp_event_id")))
  WHERE (("rg"."id" = "guest_invites"."guest_id") AND ("re"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can create search history" ON "public"."vendor_search_history" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create searches" ON "public"."vendor_searches" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create sub-events for their events" ON "public"."sub_events" FOR INSERT WITH CHECK (((("rsvp_event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "sub_events"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"()))))) OR (("event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "sub_events"."event_id") AND ("events"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can create themes for own events" ON "public"."event_themes" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_themes"."event_id") AND ("events"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete guests for their rsvp events" ON "public"."rsvp_guests" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "rsvp_guests"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete invitation tracking for own events" ON "public"."invitation_tracking" FOR DELETE USING ("public"."user_owns_event_for_invitation"("id"));



CREATE POLICY "Users can delete sub-events for their events" ON "public"."sub_events" FOR DELETE USING (((("rsvp_event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "sub_events"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"()))))) OR (("event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "sub_events"."event_id") AND ("events"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert subscription" ON "public"."subscribers" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can manage existing invitation tracking for own events" ON "public"."invitation_tracking" FOR SELECT USING ("public"."user_owns_event_for_invitation"("id"));



CREATE POLICY "Users can manage guest lists for own events" ON "public"."guest_lists" USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "guest_lists"."event_id") AND ("events"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can manage guests for their RSVP events" ON "public"."rsvp_guests" USING ((EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "rsvp_guests"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can manage invites for their events" ON "public"."guest_invites" USING ((EXISTS ( SELECT 1
   FROM ("public"."rsvp_guests" "rg"
     JOIN "public"."rsvp_events" "re" ON (("rg"."rsvp_event_id" = "re"."id")))
  WHERE (("rg"."id" = "guest_invites"."guest_id") AND ("re"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can manage own vendor profile" ON "public"."vendors" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage sub-events for their RSVP events" ON "public"."sub_events" USING ((EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "sub_events"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can manage their own RSVP events" ON "public"."rsvp_events" USING (("owner_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own event pages" ON "public"."event_pages" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage tokens for own guest lists" ON "public"."rsvp_tokens" USING ((EXISTS ( SELECT 1
   FROM ("public"."guest_lists" "gl"
     JOIN "public"."events" "e" ON (("gl"."event_id" = "e"."id")))
  WHERE (("gl"."id" = "rsvp_tokens"."guest_list_id") AND ("e"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update RSVPs for own events" ON "public"."event_rsvps" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_rsvps"."event_id") AND ("events"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update guests for their rsvp events" ON "public"."rsvp_guests" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "rsvp_guests"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can update invitation tracking for own events" ON "public"."invitation_tracking" FOR UPDATE USING ("public"."user_owns_event_for_invitation"("id"));



CREATE POLICY "Users can update invites for their events" ON "public"."guest_invites" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM ("public"."rsvp_guests" "rg"
     JOIN "public"."rsvp_events" "re" ON (("re"."id" = "rg"."rsvp_event_id")))
  WHERE (("rg"."id" = "guest_invites"."guest_id") AND ("re"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own subscription" ON "public"."subscribers" FOR UPDATE USING ((("user_id" = "auth"."uid"()) OR ("email" = "auth"."email"())));



CREATE POLICY "Users can update sub-events for their events" ON "public"."sub_events" FOR UPDATE USING (((("rsvp_event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "sub_events"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"()))))) OR (("event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "sub_events"."event_id") AND ("events"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can view RSVPs for own events" ON "public"."event_rsvps" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_rsvps"."event_id") AND ("events"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view guests for their rsvp events" ON "public"."rsvp_guests" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "rsvp_guests"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can view invites for their events" ON "public"."guest_invites" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."rsvp_guests" "rg"
     JOIN "public"."rsvp_events" "re" ON (("re"."id" = "rg"."rsvp_event_id")))
  WHERE (("rg"."id" = "guest_invites"."guest_id") AND ("re"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own search history" ON "public"."vendor_search_history" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own searches" ON "public"."vendor_searches" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own subscription" ON "public"."subscribers" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR ("email" = "auth"."email"())));



CREATE POLICY "Users can view responses for own guest lists" ON "public"."rsvp_responses" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."guest_lists" "gl"
     JOIN "public"."events" "e" ON (("gl"."event_id" = "e"."id")))
  WHERE (("gl"."id" = "rsvp_responses"."guest_list_id") AND ("e"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view sub-events for their events" ON "public"."sub_events" FOR SELECT USING (((("rsvp_event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."rsvp_events"
  WHERE (("rsvp_events"."id" = "sub_events"."rsvp_event_id") AND ("rsvp_events"."owner_id" = "auth"."uid"()))))) OR (("event_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "sub_events"."event_id") AND ("events"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can view themes for own events" ON "public"."event_themes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."events"
  WHERE (("events"."id" = "event_themes"."event_id") AND ("events"."user_id" = "auth"."uid"())))));



CREATE POLICY "Validated RSVP responses insert" ON "public"."rsvp_responses" FOR INSERT WITH CHECK ((("token_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."invitation_tracking" "it"
  WHERE (("it"."id" = "rsvp_responses"."token_id") AND ("it"."token" IS NOT NULL))))));



ALTER TABLE "public"."blog_posts_cache" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."counties" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_rsvps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_themes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "events_delete_own" ON "public"."events" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "events_insert_own" ON "public"."events" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "events_select_own" ON "public"."events" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "events_select_public" ON "public"."events" FOR SELECT USING (("is_public" = true));



CREATE POLICY "events_update_own" ON "public"."events" FOR UPDATE USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."faqs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_invites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_lists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invitation_tracking" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."membership_tiers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsvp_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsvp_guests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsvp_responses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rsvp_tokens" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_membership_tiers" ON "public"."membership_tiers" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."states" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sub_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscribers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."template_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vendor_search_cache" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vendor_search_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vendor_search_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vendor_searches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vendors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."website_templates" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."create_guest_invites_for_sub_event"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_guest_invites_for_sub_event"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_guest_invites_for_sub_event"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_invitation_tracking_records"("p_guest_list_id" "uuid", "p_event_id" "uuid", "p_rsvp_event_id" "uuid", "p_sub_event_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_invitation_tracking_records"("p_guest_list_id" "uuid", "p_event_id" "uuid", "p_rsvp_event_id" "uuid", "p_sub_event_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_invitation_tracking_records"("p_guest_list_id" "uuid", "p_event_id" "uuid", "p_rsvp_event_id" "uuid", "p_sub_event_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."extract_postal_code"("address_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."extract_postal_code"("address_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."extract_postal_code"("address_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_rsvp_token"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_rsvp_token"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_rsvp_token"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_cached_vendor_results"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_cached_vendor_results"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_cached_vendor_results"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_rsvp_url"("guest_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_rsvp_url"("guest_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_rsvp_url"("guest_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."send_rsvp_event_invitations"("rsvp_event_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."send_rsvp_event_invitations"("rsvp_event_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_rsvp_event_invitations"("rsvp_event_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."send_rsvp_invitations"("guest_list_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."send_rsvp_invitations"("guest_list_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_rsvp_invitations"("guest_list_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."should_refresh_vendor_cache"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."should_refresh_vendor_cache"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."should_refresh_vendor_cache"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_cache_refresh_date"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."update_cache_refresh_date"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_cache_refresh_date"("p_location" "text", "p_category_id" "uuid", "p_search_radius" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_event_pages_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_event_pages_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_event_pages_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_faqs_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_faqs_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_faqs_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_template_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_template_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_template_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."user_owns_event_for_invitation"("invitation_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_owns_event_for_invitation"("invitation_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_owns_event_for_invitation"("invitation_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_rsvp_token"("p_token" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_rsvp_token"("p_token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_rsvp_token"("p_token" "text") TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts_cache" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts_cache" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts_cache" TO "service_role";



GRANT ALL ON TABLE "public"."counties" TO "anon";
GRANT ALL ON TABLE "public"."counties" TO "authenticated";
GRANT ALL ON TABLE "public"."counties" TO "service_role";



GRANT ALL ON TABLE "public"."event_categories" TO "anon";
GRANT ALL ON TABLE "public"."event_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."event_categories" TO "service_role";



GRANT ALL ON TABLE "public"."event_pages" TO "anon";
GRANT ALL ON TABLE "public"."event_pages" TO "authenticated";
GRANT ALL ON TABLE "public"."event_pages" TO "service_role";



GRANT ALL ON TABLE "public"."event_rsvps" TO "anon";
GRANT ALL ON TABLE "public"."event_rsvps" TO "authenticated";
GRANT ALL ON TABLE "public"."event_rsvps" TO "service_role";



GRANT ALL ON TABLE "public"."event_themes" TO "anon";
GRANT ALL ON TABLE "public"."event_themes" TO "authenticated";
GRANT ALL ON TABLE "public"."event_themes" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."faqs" TO "anon";
GRANT ALL ON TABLE "public"."faqs" TO "authenticated";
GRANT ALL ON TABLE "public"."faqs" TO "service_role";



GRANT ALL ON TABLE "public"."guest_invites" TO "anon";
GRANT ALL ON TABLE "public"."guest_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_invites" TO "service_role";



GRANT ALL ON TABLE "public"."guest_lists" TO "anon";
GRANT ALL ON TABLE "public"."guest_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_lists" TO "service_role";



GRANT ALL ON TABLE "public"."invitation_tracking" TO "anon";
GRANT ALL ON TABLE "public"."invitation_tracking" TO "authenticated";
GRANT ALL ON TABLE "public"."invitation_tracking" TO "service_role";



GRANT ALL ON TABLE "public"."membership_tiers" TO "anon";
GRANT ALL ON TABLE "public"."membership_tiers" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_tiers" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."rsvp_events" TO "anon";
GRANT ALL ON TABLE "public"."rsvp_events" TO "authenticated";
GRANT ALL ON TABLE "public"."rsvp_events" TO "service_role";



GRANT ALL ON TABLE "public"."rsvp_guests" TO "anon";
GRANT ALL ON TABLE "public"."rsvp_guests" TO "authenticated";
GRANT ALL ON TABLE "public"."rsvp_guests" TO "service_role";



GRANT ALL ON TABLE "public"."rsvp_responses" TO "anon";
GRANT ALL ON TABLE "public"."rsvp_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."rsvp_responses" TO "service_role";



GRANT ALL ON TABLE "public"."rsvp_tokens" TO "anon";
GRANT ALL ON TABLE "public"."rsvp_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."rsvp_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."states" TO "anon";
GRANT ALL ON TABLE "public"."states" TO "authenticated";
GRANT ALL ON TABLE "public"."states" TO "service_role";



GRANT ALL ON TABLE "public"."sub_events" TO "anon";
GRANT ALL ON TABLE "public"."sub_events" TO "authenticated";
GRANT ALL ON TABLE "public"."sub_events" TO "service_role";



GRANT ALL ON TABLE "public"."subscribers" TO "anon";
GRANT ALL ON TABLE "public"."subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."subscribers" TO "service_role";



GRANT ALL ON TABLE "public"."template_categories" TO "anon";
GRANT ALL ON TABLE "public"."template_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."template_categories" TO "service_role";



GRANT ALL ON TABLE "public"."vendor_search_cache" TO "anon";
GRANT ALL ON TABLE "public"."vendor_search_cache" TO "authenticated";
GRANT ALL ON TABLE "public"."vendor_search_cache" TO "service_role";



GRANT ALL ON TABLE "public"."vendor_search_history" TO "anon";
GRANT ALL ON TABLE "public"."vendor_search_history" TO "authenticated";
GRANT ALL ON TABLE "public"."vendor_search_history" TO "service_role";



GRANT ALL ON TABLE "public"."vendor_search_results" TO "anon";
GRANT ALL ON TABLE "public"."vendor_search_results" TO "authenticated";
GRANT ALL ON TABLE "public"."vendor_search_results" TO "service_role";



GRANT ALL ON TABLE "public"."vendor_searches" TO "anon";
GRANT ALL ON TABLE "public"."vendor_searches" TO "authenticated";
GRANT ALL ON TABLE "public"."vendor_searches" TO "service_role";



GRANT ALL ON TABLE "public"."vendors" TO "anon";
GRANT ALL ON TABLE "public"."vendors" TO "authenticated";
GRANT ALL ON TABLE "public"."vendors" TO "service_role";



GRANT ALL ON TABLE "public"."website_templates" TO "anon";
GRANT ALL ON TABLE "public"."website_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."website_templates" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






