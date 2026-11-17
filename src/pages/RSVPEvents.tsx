
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CreateRSVPEventModal } from '@/components/rsvp/CreateRSVPEventModal';
import { RSVPEventCard } from '@/components/rsvp/RSVPEventCard';

interface RSVPEvent {
  id: string;
  title: string;
  main_date: string;
  description: string | null;
  cover_image: string | null;
  is_public: boolean;
  created_at: string;
  sub_events_count?: number;
  guests_count?: number;
  responses_count?: number;
}

const RSVPEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState<RSVPEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      const { data: eventsData, error } = await supabase
        .from('rsvp_events')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get counts for each event
      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
          // Count sub-events
          const { count: subEventsCount } = await supabase
            .from('sub_events')
            .select('*', { count: 'exact', head: true })
            .eq('rsvp_event_id', event.id);

          // Count guests
          const { count: guestsCount } = await supabase
            .from('rsvp_guests')
            .select('*', { count: 'exact', head: true })
            .eq('rsvp_event_id', event.id);

          // Count responses - simplified approach
          let responsesCount = 0;
          const { data: guestData } = await supabase
            .from('rsvp_guests')
            .select('id')
            .eq('rsvp_event_id', event.id);

          if (guestData && guestData.length > 0) {
            const guestIds = guestData.map(g => g.id);
            const { count: responseCount } = await supabase
              .from('guest_invites')
              .select('*', { count: 'exact', head: true })
              .in('guest_id', guestIds)
              .neq('status', 'no_response');
            
            responsesCount = responseCount || 0;
          }

          return {
            ...event,
            sub_events_count: subEventsCount || 0,
            guests_count: guestsCount || 0,
            responses_count: responsesCount,
          };
        })
      );

      setEvents(eventsWithCounts);
    } catch (error) {
      console.error('Error fetching RSVP events:', error);
      toast({
        title: "Error",
        description: "Failed to load RSVP events.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    fetchEvents();
    setShowCreateModal(false);
  };

  const handleManageEvent = (eventId: string) => {
    navigate(`/rsvp-events/${eventId}/manage`);
  };

  const handleViewDetails = (eventId: string) => {
    navigate(`/rsvp-events/${eventId}`);
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to manage your RSVP events.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Back to Dashboard Link */}
            <div className="mb-6">
              <Link to="/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">RSVP Events</h1>
                <p className="text-gray-600">Create and manage multi-event RSVPs like weddings, parties, and celebrations</p>
              </div>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create RSVP Event
              </Button>
            </div>

            {/* Events Grid */}
            {events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <RSVPEventCard 
                    key={event.id} 
                    event={event}
                    onManage={handleManageEvent}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No RSVP Events Yet</h3>
                  <p className="text-gray-600 mb-6">Create your first multi-event RSVP to get started with wedding planning, parties, and more.</p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First RSVP Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CreateRSVPEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateEvent}
      />
    </Layout>
  );
};

export default RSVPEvents;
