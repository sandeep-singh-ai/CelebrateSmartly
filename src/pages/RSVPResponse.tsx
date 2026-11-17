import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { CheckCircle, XCircle, HelpCircle, MessageSquare, Calendar, MapPin, User, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InvitationData {
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  invitationToken: string;
  currentResponse?: string;
}

type RSVPResponse = 'attending' | 'not_attending' | 'maybe';

const RSVPResponse = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<RSVPResponse | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (token) {
      loadInvitation(token);
    }
  }, [token]);

  useEffect(() => {
    // Set initial response from URL parameter
    const responseParam = searchParams.get('response') as RSVPResponse;
    if (responseParam && ['attending', 'not_attending', 'maybe'].includes(responseParam)) {
      setSelectedResponse(responseParam);
    }
  }, [searchParams]);

  const loadInvitation = async (invitationToken: string) => {
    try {
      setLoading(true);
      
      // Get invitation data from the token
      const { data: invitation, error } = await supabase
        .from('invitation_tracking')
        .select(`
          token,
          guest_name,
          guest_email,
          event_id,
          response_status,
          guest_message,
          events (
            title,
            event_date,
            location
          )
        `)
        .eq('token', invitationToken)
        .single();

      if (error) throw error;

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      setInvitationData({
        guestName: invitation.guest_name,
        eventTitle: invitation.events?.title || 'Event',
        eventDate: invitation.events?.event_date || '',
        eventLocation: invitation.events?.location || '',
        invitationToken,
        currentResponse: invitation.response_status
      });

    } catch (error) {
      console.error('Error loading invitation:', error);
      toast({
        title: "Invalid Invitation",
        description: "This invitation link is not valid or has expired.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVPSubmit = async () => {
    if (!selectedResponse || !invitationData) return;

    try {
      setSubmitting(true);

      // Update the invitation tracking record
      const { error } = await supabase
        .from('invitation_tracking')
        .update({
          response_status: selectedResponse,
          guest_message: comment.trim() || null,
          response_received_at: new Date().toISOString()
        })
        .eq('token', invitationData.invitationToken);

      if (error) throw error;

      toast({
        title: "RSVP Submitted!",
        description: `Thank you for your response, ${invitationData.guestName}!`,
      });

      // Redirect to a thank you page or back to verification
      setTimeout(() => {
        navigate(`/verify/${invitationData.invitationToken}`);
      }, 2000);

    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "Error",
        description: "Failed to submit your RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getResponseIcon = (response: RSVPResponse) => {
    switch (response) {
      case 'attending':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'not_attending':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'maybe':
        return <HelpCircle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getResponseText = (response: RSVPResponse) => {
    switch (response) {
      case 'attending':
        return 'Yes, I\'ll be there!';
      case 'not_attending':
        return 'Sorry, I can\'t make it';
      case 'maybe':
        return 'Maybe, I\'ll let you know';
    }
  };

  const getResponseColor = (response: RSVPResponse) => {
    switch (response) {
      case 'attending':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'not_attending':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invitation...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!invitationData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h1>
            <p className="text-gray-600">This invitation link is not valid or has expired.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>RSVP Response | CelebrateSmartly</title>
        <meta 
          name="description" 
          content="Respond to your event invitation and let the organizer know if you can attend." 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              RSVP Response
            </h1>
            <p className="text-gray-600">
              Please let us know if you can attend this special event
            </p>
          </div>

          {/* Event Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Guest Name</label>
                  <p className="font-semibold">{invitationData.guestName}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Event</label>
                  <p className="font-semibold">{invitationData.eventTitle}</p>
                </div>
                
                {invitationData.eventDate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Event Date</label>
                    <p className="font-semibold">{invitationData.eventDate}</p>
                  </div>
                )}
                
                {invitationData.eventLocation && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="font-semibold">{invitationData.eventLocation}</p>
                  </div>
                )}
              </div>

              {invitationData.currentResponse && invitationData.currentResponse !== 'no_response' && (
                <div className="pt-2">
                  <span className="text-sm font-medium text-gray-600">Current Response:</span>
                  <Badge className={`ml-2 ${getResponseColor(invitationData.currentResponse as RSVPResponse)}`}>
                    {getResponseText(invitationData.currentResponse as RSVPResponse)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RSVP Options */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Will you attend?</CardTitle>
              <CardDescription>
                Select your response below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['attending', 'maybe', 'not_attending'] as RSVPResponse[]).map((response) => (
                  <Button
                    key={response}
                    variant={selectedResponse === response ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-center gap-2 ${
                      selectedResponse === response 
                        ? response === 'attending' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : response === 'maybe'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-red-600 hover:bg-red-700'
                        : ''
                    }`}
                    onClick={() => setSelectedResponse(response)}
                  >
                    {getResponseIcon(response)}
                    <span className="font-medium">{getResponseText(response)}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comment Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Add a Message (Optional)
              </CardTitle>
              <CardDescription>
                Share any additional comments or dietary restrictions with the organizer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="comment">Message to Organizer</Label>
                <Textarea
                  id="comment"
                  placeholder="Add any comments, dietary restrictions, or special requests..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500">
                  This message will be visible to the event organizer
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleRSVPSubmit}
              disabled={!selectedResponse || submitting}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit RSVP
                </>
              )}
            </Button>
            
            {!selectedResponse && (
              <p className="text-sm text-gray-500 mt-2">
                Please select your response above
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              This RSVP page is powered by <strong>CelebrateSmartly</strong>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RSVPResponse;
