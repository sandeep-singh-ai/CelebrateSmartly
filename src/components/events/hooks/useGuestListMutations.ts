
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBrevoService } from '@/hooks/useBrevoService';

export const useAttachGuestList = (eventId: string, eventType: 'event' | 'rsvp_event' | 'sub_event') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guestListId: string) => {
      let column = '';
      switch (eventType) {
        case 'event':
          column = 'linked_event_id';
          break;
        case 'rsvp_event':
          column = 'linked_rsvp_event_id';
          break;
        case 'sub_event':
          column = 'linked_sub_event_id';
          break;
      }

      const { error } = await supabase
        .from('guest_lists')
        .update({ [column]: eventId })
        .eq('id', guestListId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Guest list attached successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['attached-guest-lists', eventId, eventType] });
    },
    onError: (error) => {
      console.error('Error attaching guest list:', error);
      toast({
        title: "Error",
        description: "Failed to attach guest list.",
        variant: "destructive",
      });
    },
  });
};

export const useSendInvitations = (eventId: string, eventType: 'event' | 'rsvp_event' | 'sub_event') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendBulkInvitations } = useBrevoService();

  return useMutation({
    mutationFn: async (guestListId: string) => {
      console.log('Sending invitations for:', { guestListId, eventId, eventType });
      
      // Use the Brevo service to send bulk invitations
      const result = await sendBulkInvitations(
        guestListId,
        eventType,
        eventId,
        eventType === 'rsvp_event' ? eventId : undefined,
        eventType === 'sub_event' ? eventId : undefined
      );

      if (!result.success) {
        const error_message = 'errors' in result ? result.errors?.join(', ') : 
                             ('error' in result ? result.error : 'Unknown error');
        throw new Error(error_message || 'Failed to send invitations');
      }

      return result;
    },
    onSuccess: (data: any) => {
      const invitationCount = data?.invitation_count || 0;
      const errors = data?.errors || [];
      
      if (errors.length > 0) {
        toast({
          title: "Partial Success",
          description: `Invitations sent to ${invitationCount} guests, but ${errors.length} failed.`,
          variant: "destructive",
        });
        console.warn('Invitation errors:', errors);
      } else {
        toast({
          title: "Success",
          description: `Invitations sent to ${invitationCount} guests!`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['invitation-status', eventId, eventType] });
      queryClient.invalidateQueries({ queryKey: ['attached-guest-lists', eventId, eventType] });
    },
    onError: (error) => {
      console.error('Error sending invitations:', error);
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    },
  });
};
