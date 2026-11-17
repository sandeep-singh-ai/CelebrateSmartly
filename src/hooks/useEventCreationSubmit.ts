
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Theme {
  theme_name: string;
  colors: string[];
  party_suppliers: string[];
  food_recommendations: string[];
  additional_recommendations: string[];
}

export const useEventCreationSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const createEvent = async (
    eventName: string,
    location: string,
    numberOfPeople: number,
    selectedCategory: string,
    eventDate: string,
    description: string,
    themes: Theme[],
    selectedTheme: Theme | null
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create an event.",
        variant: "destructive",
      });
      return false;
    }

    if (!eventName || !location || !selectedCategory || !eventDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      // Convert datetime-local string to ISO string for PostgreSQL
      const formattedDate = eventDate ? new Date(eventDate).toISOString() : new Date().toISOString();
      
      const eventData = {
        title: eventName,
        location,
        expected_guests: numberOfPeople,
        event_type: 'custom',
        category_id: selectedCategory,
        user_id: user.id,
        event_date: formattedDate,
        description: description || null,
        themes: themes as any,
        selected_theme: selectedTheme as any,
      };

      console.log('Creating event with data:', eventData);

      const { data: event, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to create event: ${error.message}`);
      }

      console.log('Event created successfully:', event);

      toast({
        title: "Success!",
        description: "Your event has been created successfully.",
      });

      // Redirect to the created event page
      navigate(`/events/${event.id}`);
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to create event: ${errorMessage}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    loading
  };
};
