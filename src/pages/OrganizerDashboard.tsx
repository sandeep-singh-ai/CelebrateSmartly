import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  MapPin, 
  QrCode, 
  CheckCircle, 
  Clock, 
  Search,
  Copy,
  Check,
  Eye,
  MessageSquare,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  event_date: string;
  location: string;
  description: string;
}

interface Invitation {
  id: string;
  guest_name: string;
  guest_email: string;
  token: string;
  invitation_sent_at: string;
  opened_at: string | null;
  checked_in_at: string | null;
  response_status: string;
  guest_message: string | null;
  response_received_at: string | null;
}

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    if (selectedEvent) {
      fetchInvitations(selectedEvent.id);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, location, description')
        .eq('user_id', user.id)
        .order('event_date', { ascending: false });

      if (error) throw error;

      setEvents(data || []);
      if (data && data.length > 0) {
        setSelectedEvent(data[0]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('invitation_tracking')
        .select(`
          id,
          guest_name,
          guest_email,
          token,
          invitation_sent_at,
          opened_at,
          checked_in_at,
          response_status,
          guest_message,
          response_received_at
        `)
        .eq('event_id', eventId)
        .order('guest_name');

      if (error) throw error;

      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load invitations.",
        variant: "destructive",
      });
    }
  };

  const generateVerificationCode = (token: string): string => {
    const hash = token.split('').reduce((a, b) => {
      a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
      return a;
    }, 0);
    return Math.abs(hash % 100000).toString().padStart(5, '0');
  };

  const copyVerificationCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: "Copied!",
        description: "Verification code copied to clipboard",
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const checkInGuest = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitation_tracking')
        .update({
          checked_in_at: new Date().toISOString(),
          response_status: 'checked_in'
        })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest checked in successfully!",
      });

      // Refresh invitations
      if (selectedEvent) {
        fetchInvitations(selectedEvent.id);
      }
    } catch (error) {
      console.error('Error checking in guest:', error);
      toast({
        title: "Error",
        description: "Failed to check in guest.",
        variant: "destructive",
      });
    }
  };

  const getResponseIcon = (status: string) => {
    switch (status) {
      case 'attending':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'not_attending':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'maybe':
        return <HelpCircle className="w-4 h-4 text-yellow-600" />;
      case 'checked_in':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getResponseColor = (status: string) => {
    switch (status) {
      case 'attending':
        return 'bg-green-100 text-green-800';
      case 'not_attending':
        return 'bg-red-100 text-red-800';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResponseText = (status: string) => {
    switch (status) {
      case 'attending':
        return 'Attending';
      case 'not_attending':
        return 'Not Attending';
      case 'maybe':
        return 'Maybe';
      case 'checked_in':
        return 'Checked In';
      case 'no_response':
        return 'No Response';
      default:
        return status;
    }
  };

  const filteredInvitations = invitations.filter(invitation =>
    invitation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invitation.guest_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = invitations.filter(inv => inv.checked_in_at).length;
  const totalInvitations = invitations.length;
  const attendingCount = invitations.filter(inv => inv.response_status === 'attending').length;
  const notAttendingCount = invitations.filter(inv => inv.response_status === 'not_attending').length;
  const maybeCount = invitations.filter(inv => inv.response_status === 'maybe').length;
  const noResponseCount = invitations.filter(inv => inv.response_status === 'no_response').length;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading organizer dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Organizer Dashboard | CelebrateSmartly</title>
        <meta name="description" content="Manage your events and track guest check-ins with verification codes." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organizer Dashboard</h1>
          <p className="text-gray-600">Manage your events and track guest responses & check-ins</p>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
              <Button asChild>
                <a href="/create-event">Create Your First Event</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Event Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Event</CardTitle>
                <CardDescription>Choose an event to manage invitations and responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <Card
                      key={event.id}
                      className={`cursor-pointer transition-all ${
                        selectedEvent?.id === event.id
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.event_date).toLocaleDateString()}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedEvent && (
              <>
                {/* Event Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {selectedEvent.title} - Guest Management
                    </CardTitle>
                    <CardDescription>
                      {new Date(selectedEvent.event_date).toLocaleDateString()} • {selectedEvent.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{totalInvitations}</div>
                        <div className="text-sm text-gray-600">Total Invitations</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{attendingCount}</div>
                        <div className="text-sm text-gray-600">Attending</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{maybeCount}</div>
                        <div className="text-sm text-gray-600">Maybe</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{notAttendingCount}</div>
                        <div className="text-sm text-gray-600">Not Attending</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{checkedInCount}</div>
                        <div className="text-sm text-gray-600">Checked In</div>
                      </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="rsvp">RSVP Responses</TabsTrigger>
                        <TabsTrigger value="checkin">Check-in</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search guests by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        {/* Guest List */}
                        <div className="space-y-2">
                          {filteredInvitations.map((invitation) => {
                            const verificationCode = generateVerificationCode(invitation.token);
                            const isCheckedIn = !!invitation.checked_in_at;
                            
                            return (
                              <Card key={invitation.id} className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="font-semibold text-gray-900">{invitation.guest_name}</h4>
                                      <Badge className={getResponseColor(invitation.response_status)}>
                                        {getResponseIcon(invitation.response_status)}
                                        <span className="ml-1">{getResponseText(invitation.response_status)}</span>
                                      </Badge>
                                      {isCheckedIn && (
                                        <Badge className="bg-purple-100 text-purple-800">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Checked In
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{invitation.guest_email}</p>
                                    
                                    {invitation.guest_message && (
                                      <div className="bg-gray-50 p-3 rounded-lg mb-2">
                                        <div className="flex items-center gap-2 mb-1">
                                          <MessageSquare className="w-4 h-4 text-gray-500" />
                                          <span className="text-sm font-medium text-gray-700">Guest Message:</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"{invitation.guest_message}"</p>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2">
                                        <QrCode className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                          {verificationCode}
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => copyVerificationCode(verificationCode)}
                                        >
                                          {copiedCode === verificationCode ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                          ) : (
                                            <Copy className="w-4 h-4" />
                                          )}
                                        </Button>
                                      </div>
                                      {!isCheckedIn && (
                                        <Button
                                          size="sm"
                                          onClick={() => checkInGuest(invitation.id)}
                                        >
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          Check In
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>

                        {filteredInvitations.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            {searchTerm ? 'No guests found matching your search.' : 'No invitations found for this event.'}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="rsvp" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Attending */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="w-5 h-5" />
                                Attending ({attendingCount})
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {invitations.filter(inv => inv.response_status === 'attending').map(invitation => (
                                <div key={invitation.id} className="border-b border-gray-100 py-2 last:border-b-0">
                                  <p className="font-medium">{invitation.guest_name}</p>
                                  <p className="text-sm text-gray-600">{invitation.guest_email}</p>
                                  {invitation.guest_message && (
                                    <p className="text-sm text-gray-500 italic mt-1">"{invitation.guest_message}"</p>
                                  )}
                                </div>
                              ))}
                            </CardContent>
                          </Card>

                          {/* Maybe */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-yellow-600">
                                <HelpCircle className="w-5 h-5" />
                                Maybe ({maybeCount})
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {invitations.filter(inv => inv.response_status === 'maybe').map(invitation => (
                                <div key={invitation.id} className="border-b border-gray-100 py-2 last:border-b-0">
                                  <p className="font-medium">{invitation.guest_name}</p>
                                  <p className="text-sm text-gray-600">{invitation.guest_email}</p>
                                  {invitation.guest_message && (
                                    <p className="text-sm text-gray-500 italic mt-1">"{invitation.guest_message}"</p>
                                  )}
                                </div>
                              ))}
                            </CardContent>
                          </Card>

                          {/* Not Attending */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-red-600">
                                <XCircle className="w-5 h-5" />
                                Not Attending ({notAttendingCount})
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {invitations.filter(inv => inv.response_status === 'not_attending').map(invitation => (
                                <div key={invitation.id} className="border-b border-gray-100 py-2 last:border-b-0">
                                  <p className="font-medium">{invitation.guest_name}</p>
                                  <p className="text-sm text-gray-600">{invitation.guest_email}</p>
                                  {invitation.guest_message && (
                                    <p className="text-sm text-gray-500 italic mt-1">"{invitation.guest_message}"</p>
                                  )}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="checkin" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Checked In */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-purple-600">
                                <CheckCircle className="w-5 h-5" />
                                Checked In ({checkedInCount})
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {invitations.filter(inv => inv.checked_in_at).map(invitation => (
                                <div key={invitation.id} className="border-b border-gray-100 py-2 last:border-b-0">
                                  <p className="font-medium">{invitation.guest_name}</p>
                                  <p className="text-sm text-gray-600">
                                    Checked in at {new Date(invitation.checked_in_at!).toLocaleTimeString()}
                                  </p>
                                </div>
                              ))}
                            </CardContent>
                          </Card>

                          {/* Not Checked In */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-5 h-5" />
                                Not Checked In ({totalInvitations - checkedInCount})
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {invitations.filter(inv => !inv.checked_in_at).map(invitation => (
                                <div key={invitation.id} className="border-b border-gray-100 py-2 last:border-b-0">
                                  <p className="font-medium">{invitation.guest_name}</p>
                                  <p className="text-sm text-gray-600">{invitation.guest_email}</p>
                                  <Button
                                    size="sm"
                                    onClick={() => checkInGuest(invitation.id)}
                                    className="mt-1"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Check In
                                  </Button>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrganizerDashboard;
