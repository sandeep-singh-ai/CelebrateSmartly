-- Fix remaining functions to have SET search_path = public
CREATE OR REPLACE FUNCTION public.send_rsvp_invitations(guest_list_id_param uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_event_pages_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_template_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_rsvp_event_invitations(rsvp_event_id_param uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.create_guest_invites_for_sub_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.create_invitation_tracking_records(p_guest_list_id uuid, p_event_id uuid DEFAULT NULL::uuid, p_rsvp_event_id uuid DEFAULT NULL::uuid, p_sub_event_id uuid DEFAULT NULL::uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_faqs_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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