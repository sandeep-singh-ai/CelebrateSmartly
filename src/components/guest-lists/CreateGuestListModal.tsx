
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
}

interface CreateGuestListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGuestListModal = ({ isOpen, onClose, onSuccess }: CreateGuestListModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [createWithoutEvent, setCreateWithoutEvent] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchEvents();
    }
  }, [isOpen, user]);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the guest list.",
        variant: "destructive",
      });
      return;
    }

    if (!createWithoutEvent && !selectedEventId) {
      toast({
        title: "Error",
        description: "Please select an event or choose to create without an event.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create a placeholder event if creating without event
      let eventId = selectedEventId;
      
      if (createWithoutEvent) {
        const { data: placeholderEvent, error: eventError } = await supabase
          .from('events')
          .insert({
            title: `Guest List: ${title}`,
            user_id: user.id,
            event_type: 'guest_list_only',
            event_date: new Date().toISOString(),
            location: 'Not specified'
          })
          .select()
          .single();

        if (eventError) throw eventError;
        eventId = placeholderEvent.id;
      }

      // Create the guest list entry with title and description
      const { error } = await supabase
        .from('guest_lists')
        .insert({
          event_id: eventId,
          title: title.trim(),
          description: description.trim() || null,
          name: 'Guest List Entry',
          email: 'placeholder@example.com'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest list created successfully!",
      });

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating guest list:', error);
      toast({
        title: "Error",
        description: "Failed to create guest list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedEventId('');
    setCreateWithoutEvent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Guest List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter guest list title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for this guest list"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="createWithoutEvent"
                checked={createWithoutEvent}
                onChange={(e) => setCreateWithoutEvent(e.target.checked)}
              />
              <Label htmlFor="createWithoutEvent">Create guest list without linking to an event</Label>
            </div>

            {!createWithoutEvent && (
              <div>
                <Label htmlFor="event">Select Event *</Label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {events.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    No events found. You can create a guest list without an event by checking the option above.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Guest List'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
