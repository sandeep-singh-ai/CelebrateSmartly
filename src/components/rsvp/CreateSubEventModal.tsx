
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  event_date: z.string().min(1, "Event date is required"),
  event_time: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  venue_map_link: z.string().optional(),
  dress_code: z.string().optional(),
});

interface CreateSubEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventId: string;
  eventType?: 'event' | 'rsvp_event';
}

export const CreateSubEventModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  eventId, 
  eventType = 'event' 
}: CreateSubEventModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      event_date: '',
      event_time: '',
      start_time: '',
      end_time: '',
      location: '',
      notes: '',
      venue_map_link: '',
      dress_code: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const insertData: any = {
        name: values.name,
        event_date: values.event_date,
        event_time: values.event_time || null,
        start_time: values.start_time || null,
        end_time: values.end_time || null,
        location: values.location || null,
        notes: values.notes || null,
        venue_map_link: values.venue_map_link || null,
        dress_code: values.dress_code || null,
      };

      // Set the appropriate parent event ID based on event type
      if (eventType === 'rsvp_event') {
        insertData.rsvp_event_id = eventId;
      } else {
        insertData.event_id = eventId;
      }

      const { data, error } = await supabase
        .from('sub_events')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sub-event created successfully!",
      });

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating sub-event:', error);
      toast({
        title: "Error",
        description: "Failed to create sub-event.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Add Sub-Event
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ceremony, Reception, After Party..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time (Optional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time (Optional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Venue name and address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dress_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dress Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Formal, Cocktail, Casual..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue_map_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Map Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Google Maps or venue website link..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes for Guests</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Special instructions, parking info, etc..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Sub-Event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
