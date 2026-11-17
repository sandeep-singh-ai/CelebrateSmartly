
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  event_type: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching events:', error);
        } else {
          setEvents(data || []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const removeEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => new Date(event.event_date) >= new Date()).length;
  const pastEvents = totalEvents - upcomingEvents;

  return {
    events,
    isLoading,
    totalEvents,
    upcomingEvents,
    pastEvents,
    removeEvent,
  };
};
