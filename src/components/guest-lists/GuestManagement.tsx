
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { GuestForm } from './GuestForm';
import { GuestList } from './GuestList';
import { LoadingSkeleton } from './LoadingSkeleton';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  category?: string;
  created_at: string;
}

interface GuestManagementProps {
  guestListId: string;
}

export const GuestManagement = ({ guestListId }: GuestManagementProps) => {
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [eventId, setEventId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    category: 'general'
  });

  useEffect(() => {
    fetchGuests();
  }, [guestListId]);

  const fetchGuests = async () => {
    try {
      // First get the guest list to find the event_id
      const { data: guestListData, error: guestListError } = await supabase
        .from('guest_lists')
        .select('event_id')
        .eq('id', guestListId)
        .maybeSingle();

      if (guestListError) throw guestListError;

      if (!guestListData) {
        console.error('Guest list not found');
        toast({
          title: "Error",
          description: "Guest list not found.",
          variant: "destructive",
        });
        return;
      }

      setEventId(guestListData.event_id);

      // Now fetch all guests for this event, filtering out placeholder entries
      const { data, error } = await supabase
        .from('guest_lists')
        .select('*')
        .eq('event_id', guestListData.event_id)
        .not('name', 'is', null)
        .not('email', 'is', null)
        .neq('email', 'placeholder@example.com') // Filter out placeholder entries
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Error",
        description: "Failed to load guests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    if (!eventId) {
      toast({
        title: "Error",
        description: "Event ID not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('guest_lists')
        .insert({
          event_id: eventId,
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone_number || null,
          category: formData.category,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest added successfully!",
      });

      setFormData({ name: '', email: '', phone_number: '', category: 'general' });
      setShowAddDialog(false);
      fetchGuests();
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      const { error } = await supabase
        .from('guest_lists')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest removed successfully!",
      });

      fetchGuests();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: "Failed to remove guest.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Guest Management
            </CardTitle>
            <CardDescription>
              Add, edit, and manage guests for this event
            </CardDescription>
          </div>
          <GuestForm
            showAddDialog={showAddDialog}
            setShowAddDialog={setShowAddDialog}
            formData={formData}
            setFormData={setFormData}
            onAddGuest={handleAddGuest}
          />
        </div>
      </CardHeader>
      <CardContent>
        <GuestList guests={guests} onDeleteGuest={handleDeleteGuest} />
      </CardContent>
    </Card>
  );
};
