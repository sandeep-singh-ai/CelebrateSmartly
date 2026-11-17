
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GuestList {
  id: string;
  title: string;
  description: string;
  guest_count: number;
  linked_event_id?: string | null;
  linked_rsvp_event_id?: string | null;
  linked_sub_event_id?: string | null;
}

interface GuestListAttachmentProps {
  eventId: string;
  eventType: 'event' | 'rsvp_event' | 'sub_event';
  availableGuestLists: GuestList[];
  onAttached: () => void;
}

export const GuestListAttachment = ({ 
  eventId, 
  eventType, 
  availableGuestLists, 
  onAttached 
}: GuestListAttachmentProps) => {
  const [selectedGuestListId, setSelectedGuestListId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAttachGuestList = async () => {
    if (!selectedGuestListId) {
      toast({
        title: "Error",
        description: "Please select a guest list to attach.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if event already has a guest list attached - use separate queries for each type
      let existingAttachment = null;
      
      if (eventType === 'event') {
        const { data } = await supabase
          .from('guest_lists')
          .select('id')
          .eq('linked_event_id', eventId)
          .limit(1);
        existingAttachment = data;
      } else if (eventType === 'rsvp_event') {
        const { data } = await supabase
          .from('guest_lists')
          .select('id')
          .eq('linked_rsvp_event_id', eventId)
          .limit(1);
        existingAttachment = data;
      } else if (eventType === 'sub_event') {
        const { data } = await supabase
          .from('guest_lists')
          .select('id')
          .eq('linked_sub_event_id', eventId)
          .limit(1);
        existingAttachment = data;
      }

      if (existingAttachment && existingAttachment.length > 0) {
        toast({
          title: "Error",
          description: "This event already has a guest list attached. Each event can only have one guest list.",
          variant: "destructive",
        });
        return;
      }

      // Update the guest list with the appropriate linked field
      let updateData: any = {};
      if (eventType === 'event') {
        updateData.linked_event_id = eventId;
      } else if (eventType === 'rsvp_event') {
        updateData.linked_rsvp_event_id = eventId;
      } else if (eventType === 'sub_event') {
        updateData.linked_sub_event_id = eventId;
      }

      const { error } = await supabase
        .from('guest_lists')
        .update(updateData)
        .eq('id', selectedGuestListId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest list attached successfully!",
      });

      setIsOpen(false);
      setSelectedGuestListId('');
      onAttached();
    } catch (error) {
      console.error('Error attaching guest list:', error);
      toast({
        title: "Error",
        description: "Failed to attach guest list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter out guest lists that are already attached to other events
  const unattachedGuestLists = availableGuestLists.filter(list => 
    !list.linked_event_id && !list.linked_rsvp_event_id && !list.linked_sub_event_id
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link className="w-4 h-4 mr-2" />
          Attach Guest List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach Guest List</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select a guest list to attach to this event. Each event can only have one guest list attached.
          </p>
          <Select value={selectedGuestListId} onValueChange={setSelectedGuestListId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a guest list to attach" />
            </SelectTrigger>
            <SelectContent>
              {unattachedGuestLists.map((list) => (
                <SelectItem key={list.id} value={list.id}>
                  {list.title} ({list.guest_count} guests)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {unattachedGuestLists.length === 0 && (
            <p className="text-sm text-gray-500">
              No unattached guest lists available. All your guest lists are already attached to other events.
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAttachGuestList}
              disabled={!selectedGuestListId || loading || unattachedGuestLists.length === 0}
            >
              {loading ? 'Attaching...' : 'Attach'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
