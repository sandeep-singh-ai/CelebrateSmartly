import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { QrCode, CheckCircle, Clock, User, Calendar, MapPin, Copy, Check, MessageSquare, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InvitationData {
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  verificationCode: string;
  status: string;
  checkedIn: boolean;
  responseStatus: string;
  guestMessage: string | null;
}

const InvitationVerification = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      verifyInvitation(token);
    }
  }, [token]);

  const verifyInvitation = async (invitationToken: string) => {
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
          status,
          checked_in_at,
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

      // Generate a 5-digit verification code
      const verificationCode = generateVerificationCode(invitationToken);
      
      // Update invitation with verification code and mark as opened
      await supabase
        .from('invitation_tracking')
        .update({
          opened_at: new Date().toISOString(),
          status: 'opened'
        })
        .eq('token', invitationToken);

      setInvitationData({
        guestName: invitation.guest_name,
        eventTitle: invitation.events?.title || 'Event',
        eventDate: invitation.events?.event_date || '',
        eventLocation: invitation.events?.location || '',
        verificationCode,
        status: invitation.status,
        checkedIn: !!invitation.checked_in_at,
        responseStatus: invitation.response_status,
        guestMessage: invitation.guest_message
      });

    } catch (error) {
      console.error('Error verifying invitation:', error);
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

  const generateVerificationCode = (token: string): string => {
    // Generate a consistent 5-digit code based on the token
    const hash = token.split('').reduce((a, b) => {
      a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
      return a;
    }, 0);
    return Math.abs(hash % 100000).toString().padStart(5, '0');
  };

  const copyVerificationCode = async () => {
    if (!invitationData) return;
    
    try {
      await navigator.clipboard.writeText(invitationData.verificationCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Verification code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'not_attending':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResponseText = (status: string) => {
    switch (status) {
      case 'attending':
        return 'Yes, I\'ll be there!';
      case 'not_attending':
        return 'Sorry, I can\'t make it';
      case 'maybe':
        return 'Maybe, I\'ll let you know';
      case 'checked_in':
        return 'Checked In';
      case 'no_response':
        return 'No Response Yet';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying invitation...</p>
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
        <title>Verify Invitation | CelebrateSmartly</title>
        <meta 
          name="description" 
          content="Verify your event invitation with the verification code." 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Invitation Verified! 🎉
            </h1>
            <p className="text-gray-600">
              Your invitation has been successfully verified. Please share the verification code below with the event organizer.
            </p>
          </div>

          {/* RSVP Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                RSVP Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getResponseColor(invitationData.responseStatus)}>
                    {getResponseIcon(invitationData.responseStatus)}
                    <span className="ml-1">{getResponseText(invitationData.responseStatus)}</span>
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/rsvp-response/${token}`)}
                >
                  Update RSVP
                </Button>
              </div>
              
              {invitationData.guestMessage && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Your Message:</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{invitationData.guestMessage}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Code Card */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600">
                Verification Code
              </CardTitle>
              <CardDescription>
                Share this code with the event organizer for check-in
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                <div className="text-6xl font-bold text-gray-900 font-mono tracking-wider">
                  {invitationData.verificationCode}
                </div>
              </div>
              
              <div className="flex justify-center gap-3">
                <Button
                  onClick={copyVerificationCode}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 mt-3">
                This code is unique to your invitation and cannot be shared
              </p>
            </CardContent>
          </Card>

          {/* Guest Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Guest Information
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

              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm font-medium text-gray-600">Check-in Status:</span>
                <Badge variant={invitationData.checkedIn ? "default" : "secondary"}>
                  {invitationData.checkedIn ? "Checked In" : "Not Checked In"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use This Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Share the Code</h4>
                    <p className="text-sm text-gray-600">
                      Show the 5-digit verification code to the event organizer or staff
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Organizer Verification</h4>
                    <p className="text-sm text-gray-600">
                      The organizer will enter this code in their check-in system
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Check-in Complete</h4>
                    <p className="text-sm text-gray-600">
                      Once verified, you'll be marked as checked in to the event
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              This verification page is powered by <strong>CelebrateSmartly</strong>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InvitationVerification;
