
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Clock, Check, X, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InvitationData {
  id: string;
  guest_name: string;
  guest_email: string;
  response_status: string;
  event_title?: string;
  event_date?: string;
  event_location?: string;
  token: string;
}

export const RSVPResponsePage = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [guestMessage, setGuestMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInvitationData();
    }
    
    // Check if response is pre-selected from URL
    const preselectedResponse = searchParams.get('response');
    if (preselectedResponse && ['yes', 'no', 'maybe'].includes(preselectedResponse)) {
      setResponse(preselectedResponse === 'yes' ? 'accepted' : preselectedResponse === 'no' ? 'declined' : 'maybe');
    }
  }, [token, searchParams]);

  const fetchInvitationData = async () => {
    try {
      console.log('Fetching invitation data for token:', token);
      
      const { data, error } = await supabase
        .from('invitation_tracking')
        .select(`
          *,
          events:event_id(title, event_date, location),
          rsvp_events:rsvp_event_id(title, main_date),
          sub_events:sub_event_id(name, event_date, location)
        `)
        .eq('token', token)
        .single();

      if (error) {
        console.error('Error fetching invitation:', error);
        throw error;
      }

      console.log('Invitation data:', data);

      // Determine event details based on event type
      let eventTitle = 'Event';
      let eventDate = '';
      let eventLocation = '';

      if (data.events) {
        eventTitle = data.events.title;
        eventDate = data.events.event_date;
        eventLocation = data.events.location || '';
      } else if (data.rsvp_events) {
        eventTitle = data.rsvp_events.title;
        eventDate = data.rsvp_events.main_date;
        eventLocation = '';
      } else if (data.sub_events) {
        eventTitle = data.sub_events.name;
        eventDate = data.sub_events.event_date;
        eventLocation = data.sub_events.location || '';
      }

      const invitation: InvitationData = {
        id: data.id,
        guest_name: data.guest_name,
        guest_email: data.guest_email,
        response_status: data.response_status,
        event_title: eventTitle,
        event_date: eventDate,
        event_location: eventLocation,
        token: data.token
      };

      setInvitationData(invitation);
      setGuestName(data.guest_name || '');
      setGuestEmail(data.guest_email || '');
      
      // If already responded, show current status
      if (data.response_status && data.response_status !== 'no_response') {
        setResponse(data.response_status);
        setSubmitted(true);
      }

    } catch (error) {
      console.error('Error loading invitation:', error);
      toast({
        title: "Error",
        description: "Failed to load invitation details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!response) {
      toast({
        title: "Please select a response",
        description: "Choose whether you'll attend, decline, or maybe attend.",
        variant: "destructive",
      });
      return;
    }

    if (!guestName.trim() || !guestEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting RSVP response:', {
        token,
        response,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        message: guestMessage.trim()
      });

      const { data, error } = await supabase
        .from('invitation_tracking')
        .update({
          response_status: response,
          guest_message: guestMessage.trim() || null,
          response_received_at: new Date().toISOString(),
          guest_name: guestName.trim(),
          guest_email: guestEmail.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('token', token)
        .select();

      console.log('RSVP submission result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No rows were updated. Token may be invalid or expired.');
      }

      setSubmitted(true);
      toast({
        title: "Response Submitted",
        description: "Thank you for your response! The host has been notified.",
      });

    } catch (error: any) {
      console.error('Error submitting response:', error);
      
      let errorMessage = "Failed to submit your response. Please try again.";
      
      if (error?.message) {
        if (error.message.includes('No rows were updated')) {
          errorMessage = "Invalid or expired invitation link. Please contact the host for a new invitation.";
        } else if (error.message.includes('permission denied')) {
          errorMessage = "Permission denied. Please contact the host if you believe this is an error.";
        } else if (error.message.includes('token')) {
          errorMessage = "Invalid invitation token. Please check your invitation link.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getResponseIcon = (responseType: string) => {
    switch (responseType) {
      case 'accepted':
        return <Check className="w-6 h-6 text-green-500" />;
      case 'declined':
        return <X className="w-6 h-6 text-red-500" />;
      case 'maybe':
        return <HelpCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getResponseText = (responseType: string) => {
    switch (responseType) {
      case 'accepted':
        return 'Great! We look forward to seeing you there!';
      case 'declined':
        return 'Thank you for letting us know. You will be missed!';
      case 'maybe':
        return 'Thanks for your response. We hope you can make it!';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invitation...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!invitationData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Invalid Invitation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                This invitation link is invalid or has expired.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              // Thank you message
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {getResponseIcon(response)}
                  </div>
                  <CardTitle className="text-2xl">Response Submitted!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">{getResponseText(response)}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Your Response:</h4>
                    <p className="capitalize font-medium text-lg">
                      {response === 'accepted' ? 'Yes, I will attend' : 
                       response === 'declined' ? 'No, I cannot attend' : 
                       'Maybe, I might attend'}
                    </p>
                    {guestMessage && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">Your message:</p>
                        <p className="text-gray-600 italic">"{guestMessage}"</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              // RSVP Form
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">You're Invited!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">{invitationData.event_title}</h2>
                      </div>
                      
                      {invitationData.event_date && (
                        <div className="flex items-center gap-3 justify-center">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <span className="text-lg">
                            {new Date(invitationData.event_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                      
                      {invitationData.event_location && (
                        <div className="flex items-center gap-3 justify-center">
                          <MapPin className="w-5 h-5 text-purple-600" />
                          <span className="text-lg">{invitationData.event_location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Please Respond</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Guest Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guest-name">Your Name *</Label>
                        <Input
                          id="guest-name"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="guest-email">Your Email *</Label>
                        <Input
                          id="guest-email"
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    {/* Response Options */}
                    <div>
                      <Label className="text-base font-medium mb-4 block">Will you attend?</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Button
                          variant={response === 'accepted' ? 'default' : 'outline'}
                          className={`h-auto p-4 ${response === 'accepted' ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-50 hover:border-green-300'}`}
                          onClick={() => setResponse('accepted')}
                        >
                          <div className="text-center">
                            <Check className="w-6 h-6 mx-auto mb-2" />
                            <div className="font-medium">Yes, I'll attend</div>
                          </div>
                        </Button>
                        
                        <Button
                          variant={response === 'declined' ? 'default' : 'outline'}
                          className={`h-auto p-4 ${response === 'declined' ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-50 hover:border-red-300'}`}
                          onClick={() => setResponse('declined')}
                        >
                          <div className="text-center">
                            <X className="w-6 h-6 mx-auto mb-2" />
                            <div className="font-medium">Can't attend</div>
                          </div>
                        </Button>
                        
                        <Button
                          variant={response === 'maybe' ? 'default' : 'outline'}
                          className={`h-auto p-4 ${response === 'maybe' ? 'bg-yellow-500 hover:bg-yellow-600' : 'hover:bg-yellow-50 hover:border-yellow-300'}`}
                          onClick={() => setResponse('maybe')}
                        >
                          <div className="text-center">
                            <HelpCircle className="w-6 h-6 mx-auto mb-2" />
                            <div className="font-medium">Maybe</div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Optional Message */}
                    <div>
                      <Label htmlFor="guest-message">Message (Optional)</Label>
                      <Textarea
                        id="guest-message"
                        value={guestMessage}
                        onChange={(e) => setGuestMessage(e.target.value)}
                        placeholder="Any dietary requirements, special requests, or message for the host..."
                        rows={3}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleSubmitResponse}
                      disabled={submitting || !response}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      size="lg"
                    >
                      {submitting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Response'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
