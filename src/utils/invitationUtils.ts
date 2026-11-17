import { supabase } from '@/integrations/supabase/client';

export interface InvitationData {
  guestId: string;
  guestName: string;
  guestEmail: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  invitationToken: string;
  customMessage?: string;
}

/**
 * Generate a unique invitation token for a guest
 */
export function generateInvitationToken(guestId: string, eventId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `inv_${guestId}_${eventId}_${timestamp}_${random}`;
}

/**
 * Create or update invitation tracking record for a guest
 */
export async function createInvitationRecord(
  guestListId: string,
  guestName: string,
  guestEmail: string,
  eventId: string,
  invitationToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('invitation_tracking')
      .upsert({
        guest_list_id: guestListId,
        guest_name: guestName,
        guest_email: guestEmail,
        event_id: eventId,
        token: invitationToken,
        invitation_sent_at: new Date().toISOString(),
        response_status: 'no_response'
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error creating invitation record:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get invitation data for a specific guest from guest_lists table
 */
export async function getInvitationDataFromGuestList(
  guestListId: string,
  eventId: string
): Promise<InvitationData | null> {
  try {
    // Get guest information from guest_lists
    const { data: guest, error: guestError } = await supabase
      .from('guest_lists')
      .select('name, email')
      .eq('id', guestListId)
      .single();

    if (guestError) throw guestError;

    // Get event information
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('title, event_date, location')
      .eq('id', eventId)
      .single();

    if (eventError) throw eventError;

    // Generate or get existing invitation token
    const { data: existingInvitation } = await supabase
      .from('invitation_tracking')
      .select('token')
      .eq('guest_list_id', guestListId)
      .eq('event_id', eventId)
      .single();

    const invitationToken = existingInvitation?.token || generateInvitationToken(guestListId, eventId);

    // If no existing invitation, create one
    if (!existingInvitation) {
      await createInvitationRecord(guestListId, guest.name, guest.email, eventId, invitationToken);
    }

    return {
      guestId: guestListId,
      guestName: guest.name,
      guestEmail: guest.email,
      eventId,
      eventTitle: event.title,
      eventDate: event.event_date,
      eventLocation: event.location || '',
      invitationToken
    };
  } catch (error) {
    console.error('Error getting invitation data:', error);
    return null;
  }
}

/**
 * Get all invitation data for an event
 */
export async function getAllEventInvitations(eventId: string): Promise<InvitationData[]> {
  try {
    // Get all guests for the event from guest_lists
    const { data: guestLists, error: guestListError } = await supabase
      .from('guest_lists')
      .select('id, name, email')
      .eq('event_id', eventId);

    if (guestListError) throw guestListError;

    if (!guestLists || guestLists.length === 0) return [];

    // Get event information
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('title, event_date, location')
      .eq('id', eventId)
      .single();

    if (eventError) throw eventError;

    // Get or create invitation tokens for each guest
    const invitations: InvitationData[] = [];
    
    for (const guest of guestLists) {
      const invitationData = await getInvitationDataFromGuestList(guest.id, eventId);
      if (invitationData) {
        invitations.push(invitationData);
      }
    }

    return invitations;
  } catch (error) {
    console.error('Error getting all event invitations:', error);
    return [];
  }
}

/**
 * Mark invitation as opened/read
 */
export async function markInvitationOpened(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('invitation_tracking')
      .update({
        opened_at: new Date().toISOString(),
        response_status: 'opened'
      })
      .eq('token', token);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking invitation as opened:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Mark guest as checked in at event
 */
export async function markGuestCheckedIn(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('invitation_tracking')
      .update({
        checked_in_at: new Date().toISOString(),
        response_status: 'checked_in'
      })
      .eq('token', token);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking guest as checked in:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get invitation status for a token
 */
export async function getInvitationStatus(token: string): Promise<{
  success: boolean;
  data?: {
    guestName: string;
    eventTitle: string;
    status: string;
    checkedIn: boolean;
  };
  error?: string;
}> {
  try {
    const { data: invitation, error } = await supabase
      .from('invitation_tracking')
      .select(`
        token,
        response_status,
        checked_in_at,
        guest_name,
        events (title)
      `)
      .eq('token', token)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        guestName: invitation.guest_name || 'Unknown Guest',
        eventTitle: invitation.events?.title || 'Unknown Event',
        status: invitation.response_status,
        checkedIn: !!invitation.checked_in_at
      }
    };
  } catch (error) {
    console.error('Error getting invitation status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}