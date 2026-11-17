
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRSVPSubmission = (token?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ response, message }: { 
      response: 'attending' | 'not_attending' | 'maybe';
      message?: string;
    }) => {
      if (!token) throw new Error('No token provided');

      console.log('Submitting response:', response, 'with message:', message);

      // Try to update guest_invites first (for RSVP events)
      const { data: inviteUpdate, error: inviteError } = await supabase
        .from('guest_invites')
        .update({
          status: response,
          responded_at: new Date().toISOString(),
        })
        .eq('token', token)
        .select();

      console.log('Guest invite update result:', { inviteUpdate, inviteError });

      // If guest_invites update didn't affect any rows, try invitation_tracking (for regular events)
      if (!inviteUpdate || inviteUpdate.length === 0) {
        console.log('No guest invite found, trying invitation tracking');
        const { data: trackingUpdate, error: trackingError } = await supabase
          .from('invitation_tracking')
          .update({
            response_status: response,
            response_received_at: new Date().toISOString(),
            guest_message: message || null,
            updated_at: new Date().toISOString(),
          })
          .eq('token', token)
          .select();

        console.log('Invitation tracking update result:', { trackingUpdate, trackingError });

        if (trackingError || !trackingUpdate || trackingUpdate.length === 0) {
          console.error('Failed to update either table:', { inviteError, trackingError });
          throw new Error('Failed to update RSVP response');
        }
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the RSVP data to show updated status
      queryClient.invalidateQueries({ queryKey: ['rsvp-response', token] });
      
      toast({
        title: "Success",
        description: "Your RSVP response has been updated!",
      });
    },
    onError: (error) => {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "Error",
        description: "Failed to submit your response. Please try again.",
        variant: "destructive",
      });
    },
  });
};
