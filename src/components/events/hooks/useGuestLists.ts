
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GuestList {
  id: string;
  title: string;
  description: string;
  created_at: string;
  event_id: string;
  guest_count: number;
}

interface AttachedGuestList {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface InvitationStatus {
  id: string;
  guest_name: string;
  guest_email: string;
  response_status: string;
  invitation_sent_at: string | null;
  response_received_at: string | null;
  guest_message: string | null;
}

const fetchAvailableGuestLists = async () => {
  const { data, error } = await supabase
    .from('guest_lists')
    .select('id, title, description, created_at, event_id')
    .not('title', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Get guest counts for each list
  const listsWithCounts = await Promise.all(
    (data || []).map(async (list) => {
      const { count } = await supabase
        .from('guest_lists')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', list.event_id || '')
        .not('name', 'is', null);

      return {
        ...list,
        guest_count: count || 0
      };
    })
  );

  return listsWithCounts;
};

const fetchAttachedGuestLists = async (eventId: string, eventType: 'event' | 'rsvp_event' | 'sub_event') => {
  let query = supabase
    .from('guest_lists')
    .select('id, title, description, created_at')
    .not('title', 'is', null);

  if (eventType === 'event') {
    query = query.eq('linked_event_id', eventId);
  } else if (eventType === 'rsvp_event') {
    query = query.eq('linked_rsvp_event_id', eventId);
  } else if (eventType === 'sub_event') {
    query = query.eq('linked_sub_event_id', eventId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

const fetchInvitationStatus = async (eventId: string, eventType: 'event' | 'rsvp_event' | 'sub_event') => {
  let query = supabase
    .from('invitation_tracking')
    .select('*')
    .order('created_at', { ascending: false });

  if (eventType === 'event') {
    query = query.eq('event_id', eventId);
  } else if (eventType === 'rsvp_event') {
    query = query.eq('rsvp_event_id', eventId);
  } else if (eventType === 'sub_event') {
    query = query.eq('sub_event_id', eventId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const useAvailableGuestLists = () => {
  return useQuery({
    queryKey: ['available-guest-lists'],
    queryFn: fetchAvailableGuestLists,
  });
};

export const useAttachedGuestLists = (eventId: string, eventType: 'event' | 'rsvp_event' | 'sub_event') => {
  return useQuery({
    queryKey: ['attached-guest-lists', eventId, eventType],
    queryFn: async () => fetchAttachedGuestLists(eventId, eventType),
  });
};

export const useInvitationStatus = (eventId: string, eventType: 'event' | 'rsvp_event' | 'sub_event') => {
  return useQuery({
    queryKey: ['invitation-status', eventId, eventType],
    queryFn: async () => fetchInvitationStatus(eventId, eventType),
  });
};
