
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubEvent {
  id: string;
  name: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  notes?: string;
  venue_map_link?: string;
  dress_code?: string;
  created_at: string;
}

export const useSubEvents = (eventId: string, eventType: 'event' | 'rsvp_event' = 'event') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subEvents, isLoading } = useQuery({
    queryKey: ['sub-events', eventId, eventType],
    queryFn: async () => {
      let query = supabase.from('sub_events').select('*');
      
      if (eventType === 'rsvp_event') {
        query = query.eq('rsvp_event_id', eventId);
      } else {
        query = query.eq('event_id', eventId);
      }
      
      const { data, error } = await query.order('event_date', { ascending: true });

      if (error) throw error;
      return data as SubEvent[];
    },
  });

  const deleteSubEventMutation = useMutation({
    mutationFn: async (subEventId: string) => {
      const { error } = await supabase
        .from('sub_events')
        .delete()
        .eq('id', subEventId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Sub-event deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['sub-events', eventId, eventType] });
    },
    onError: (error) => {
      console.error('Error deleting sub-event:', error);
      toast({
        title: "Error",
        description: "Failed to delete sub-event.",
        variant: "destructive",
      });
    },
  });

  return {
    subEvents,
    isLoading,
    deleteSubEvent: deleteSubEventMutation.mutate,
    isDeletingSubEvent: deleteSubEventMutation.isPending,
  };
};
