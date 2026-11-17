import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RSVPData {
  id: string;
  status: 'attending' | 'not_attending' | 'maybe' | 'no_response';
  responded_at?: string;
  guest: {
    id: string;
    name: string;
    email: string;
  };
  sub_event?: {
    id: string;
    name: string;
    event_date: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    notes?: string;
    dress_code?: string;
    rsvp_event: {
      title: string;
      description?: string;
    };
  };
  event?: {
    id: string;
    title: string;
    event_date: string;
    location?: string;
    description?: string;
  };
}

export const useRSVPData = (token?: string) => {
  return useQuery({
    queryKey: ['rsvp-response', token],
    queryFn: async (): Promise<RSVPData> => {
      if (!token) throw new Error('No token provided');
      
      console.log('Fetching RSVP data for token:', token);
      
      // First try to get from guest_invites table (for sub-events)
      const { data: inviteData, error: inviteError } = await supabase
        .from('guest_invites')
        .select(`
          *,
          guest:rsvp_guests(*),
          sub_event:sub_events(
            *,
            rsvp_event:rsvp_events(title, description)
          )
        `)
        .eq('token', token)
        .maybeSingle();

      console.log('Guest invites query result:', { inviteData, inviteError });

      if (inviteData && !inviteError) {
        console.log('Found data in guest_invites table');
        return {
          id: inviteData.id,
          status: inviteData.status as 'attending' | 'not_attending' | 'maybe' | 'no_response',
          responded_at: inviteData.responded_at,
          guest: {
            id: inviteData.guest.id,
            name: inviteData.guest.name,
            email: inviteData.guest.email
          },
          sub_event: {
            id: inviteData.sub_event.id,
            name: inviteData.sub_event.name,
            event_date: inviteData.sub_event.event_date,
            start_time: inviteData.sub_event.start_time,
            end_time: inviteData.sub_event.end_time,
            location: inviteData.sub_event.location,
            notes: inviteData.sub_event.notes,
            dress_code: inviteData.sub_event.dress_code,
            rsvp_event: inviteData.sub_event.rsvp_event
          }
        };
      }

      console.log('No data found in guest_invites, trying invitation_tracking table');

      // If not found in guest_invites, try invitation_tracking (for regular events)
      const { data: trackingData, error: trackingError } = await supabase
        .from('invitation_tracking')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      console.log('Invitation tracking query result:', { trackingData, trackingError });

      if (trackingError) {
        console.error('Error querying invitation_tracking:', trackingError);
        throw new Error(`Database error: ${trackingError.message}`);
      }

      if (!trackingData) {
        console.error('Token not found in either table. Token:', token);
        
        // Let's also check what tokens exist in the database for debugging
        const { data: allTokens, error: allTokensError } = await supabase
          .from('invitation_tracking')
          .select('token, guest_email, created_at')
          .limit(10);
        
        console.log('Recent tokens in database:', allTokens);
        
        throw new Error('Invalid RSVP token - not found in database');
      }
      
      console.log('Found data in invitation_tracking table:', trackingData);
      
      // Fetch event details for regular events
      let eventDetails = null;
      if (trackingData.event_id) {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, title, event_date, location, description')
          .eq('id', trackingData.event_id)
          .maybeSingle();
        
        console.log('Event details query:', { eventData, eventError });
        
        if (!eventError && eventData) {
          eventDetails = eventData;
        }
      }

      // If no event details found, try to get RSVP event details
      if (!eventDetails && trackingData.rsvp_event_id) {
        const { data: rsvpEventData, error: rsvpEventError } = await supabase
          .from('rsvp_events')
          .select('id, title, main_date, description')
          .eq('id', trackingData.rsvp_event_id)
          .maybeSingle();
        
        console.log('RSVP event details query:', { rsvpEventData, rsvpEventError });
        
        if (!rsvpEventError && rsvpEventData) {
          eventDetails = {
            id: rsvpEventData.id,
            title: rsvpEventData.title,
            event_date: rsvpEventData.main_date,
            location: null,
            description: rsvpEventData.description
          };
        }
      }

      console.log('Final event details:', eventDetails);
      
      // Create a compatible structure for regular events
      return {
        id: trackingData.id,
        status: (trackingData.response_status || 'no_response') as 'attending' | 'not_attending' | 'maybe' | 'no_response',
        responded_at: trackingData.response_received_at,
        guest: {
          id: trackingData.id,
          name: trackingData.guest_name || 'Guest',
          email: trackingData.guest_email || ''
        },
        event: eventDetails || {
          id: trackingData.event_id || trackingData.rsvp_event_id || '',
          title: 'Event Invitation',
          event_date: new Date().toISOString(),
          location: null,
          description: null
        }
      };
    },
    enabled: !!token,
    retry: 1,
  });
};

export type { RSVPData };
