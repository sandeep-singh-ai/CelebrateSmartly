import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Mail, Clock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreateGuestListModal } from '@/components/guest-lists/CreateGuestListModal';
import { GuestListCard } from '@/components/guest-lists/GuestListCard';

interface GuestList {
  id: string;
  title: string;
  description: string;
  event_id: string;
  created_at: string;
  invitation_sent_at: string | null;
  reminder_sent_at: string | null;
  event?: {
    title: string;
  };
  guest_count?: number;
  response_count?: number;
}

const GuestLists = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [guestLists, setGuestLists] = useState<GuestList[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGuestLists();
    }
  }, [user]);

  const fetchGuestLists = async () => {
    if (!user) return;

    try {
      console.log('Fetching guest lists for user:', user.id);
      
      // First, get all events for the current user
      const { data: userEvents, error: eventsError } = await supabase
        .from('events')
        .select('id, title')
        .eq('user_id', user.id);

      if (eventsError) {
        console.error('Error fetching user events:', eventsError);
        throw eventsError;
      }

      console.log('User events:', userEvents);

      if (!userEvents || userEvents.length === 0) {
        console.log('No events found for user');
        setGuestLists([]);
        setLoading(false);
        return;
      }

      // Get event IDs
      const eventIds = userEvents.map(event => event.id);

      // Now get guest lists for these events, but only get unique guest lists (by title/description)
      const { data: guestListsData, error: guestListsError } = await supabase
        .from('guest_lists')
        .select('*')
        .in('event_id', eventIds)
        .not('title', 'is', null) // Only get guest lists that have a title (actual guest lists, not individual guests)
        .order('created_at', { ascending: false });

      if (guestListsError) {
        console.error('Error fetching guest lists:', guestListsError);
        throw guestListsError;
      }

      console.log('Raw guest lists data:', guestListsData);

      // Process the data and add event information
      const processedGuestLists = await Promise.all(
        (guestListsData || []).map(async (guestList) => {
          // Find the corresponding event
          const event = userEvents.find(e => e.id === guestList.event_id);
          
          // Count guests for this event (all rows in guest_lists for this event_id)
          const { count: guestCount } = await supabase
            .from('guest_lists')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', guestList.event_id);

          // Count RSVP responses for this guest list
          const { count: responseCount } = await supabase
            .from('rsvp_responses')
            .select('*', { count: 'exact', head: true })
            .eq('guest_list_id', guestList.id);

          return {
            ...guestList,
            event: event ? { title: event.title } : undefined,
            guest_count: guestCount || 0,
            response_count: responseCount || 0,
          };
        })
      );

      console.log('Processed guest lists:', processedGuestLists);
      setGuestLists(processedGuestLists);
    } catch (error) {
      console.error('Error fetching guest lists:', error);
      toast({
        title: "Error",
        description: "Failed to load guest lists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuestList = () => {
    fetchGuestLists();
    setShowCreateModal(false);
    toast({
      title: "Success",
      description: "Guest list created successfully!",
    });
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to manage your guest lists.</CardDescription>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Lists</h1>
                <p className="text-gray-600">Manage your event guest lists and track RSVPs</p>
              </div>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Guest List
              </Button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Total Lists</p>
                      <p className="text-2xl font-bold">{guestLists.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Mail className="w-8 h-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Invites Sent</p>
                      <p className="text-2xl font-bold">
                        {guestLists.filter(list => list.invitation_sent_at).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Responses</p>
                      <p className="text-2xl font-bold">
                        {guestLists.reduce((sum, list) => sum + (list.response_count || 0), 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Total Guests</p>
                      <p className="text-2xl font-bold">
                        {guestLists.reduce((sum, list) => sum + (list.guest_count || 0), 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Guest Lists */}
            {guestLists.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guestLists.map((guestList) => (
                  <GuestListCard 
                    key={guestList.id} 
                    guestList={guestList}
                    onUpdate={fetchGuestLists}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Guest Lists Yet</h3>
                  <p className="text-gray-600 mb-6">Create your first guest list to start managing RSVPs for your events.</p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Guest List
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CreateGuestListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateGuestList}
      />
    </Layout>
  );
};

export default GuestLists;
