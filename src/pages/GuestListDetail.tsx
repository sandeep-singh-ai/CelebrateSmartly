
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Mail, Users, Download } from 'lucide-react';
import { GuestManagement } from '@/components/guest-lists/GuestManagement';
import { RSVPTracker } from '@/components/guest-lists/RSVPTracker';
import { InvitationSender } from '@/components/guest-lists/InvitationSender';

interface GuestListDetail {
  id: string;
  title: string;
  description: string;
  event_id: string;
  created_at: string;
  invitation_sent_at: string | null;
  reminder_sent_at: string | null;
  event: {
    title: string;
    event_date: string;
    description: string;
  };
}

const GuestListDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [guestList, setGuestList] = useState<GuestListDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchGuestListDetail();
    }
  }, [user, id]);

  const fetchGuestListDetail = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('guest_lists')
        .select(`
          *,
          events!guest_lists_event_id_fkey(title, event_date, description, user_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data.events && data.events.user_id === user.id) {
        setGuestList({
          ...data,
          event: {
            title: data.events.title,
            event_date: data.events.event_date,
            description: data.events.description,
          },
        });
      } else {
        throw new Error('Access denied');
      }
    } catch (error) {
      console.error('Error fetching guest list:', error);
      toast({
        title: "Error",
        description: "Failed to load guest list details.",
        variant: "destructive",
      });
      navigate('/guest-lists');
    } finally {
      setLoading(false);
    }
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
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!guestList) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Guest List Not Found</CardTitle>
              <CardDescription>The guest list you're looking for doesn't exist or you don't have access to it.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/guest-lists')}>
                Back to Guest Lists
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/guest-lists')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Guest Lists
              </Button>
            </div>

            {/* Guest List Info */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{guestList.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      Event: {guestList.event.title}
                    </CardDescription>
                    <p className="text-sm text-gray-600 mt-1">
                      Date: {new Date(guestList.event.event_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
                {guestList.description && (
                  <p className="text-gray-700 mt-4">{guestList.description}</p>
                )}
              </CardHeader>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="guests" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="guests" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Guests
                </TabsTrigger>
                <TabsTrigger value="rsvp" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  RSVP Tracking
                </TabsTrigger>
                <TabsTrigger value="invitations" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Invitations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="guests">
                <GuestManagement guestListId={guestList.id} />
              </TabsContent>

              <TabsContent value="rsvp">
                <RSVPTracker guestListId={guestList.id} />
              </TabsContent>

              <TabsContent value="invitations">
                <InvitationSender 
                  guestList={guestList} 
                  onInvitationsSent={fetchGuestListDetail}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GuestListDetail;
