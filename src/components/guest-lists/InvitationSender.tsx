import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBrevoService } from '@/hooks/useBrevoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, Clock, AlertCircle } from 'lucide-react';

interface GuestListDetail {
  id: string;
  title: string;
  description: string;
  invitation_sent_at: string | null;
  reminder_sent_at: string | null;
  event: {
    title: string;
    event_date: string;
    description: string;
    location?: string;
  };
}

interface InvitationSenderProps {
  guestList: GuestListDetail;
  onInvitationsSent?: () => void;
}

export const InvitationSender = ({ guestList, onInvitationsSent }: InvitationSenderProps) => {
  const { toast } = useToast();
  const { sendBulkInvitations, loading: emailLoading, isConfigured } = useBrevoService();
  const [loading, setLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const handleSendInvitations = async () => {
    if (!isConfigured) {
      toast({
        title: "Configuration Error",
        description: "Email service not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get the linked event ID from the guest list
      const { data: guestListData, error: guestListError } = await supabase
        .from('guest_lists')
        .select('linked_event_id')
        .eq('id', guestList.id)
        .single();

      if (guestListError) throw guestListError;

      if (!guestListData.linked_event_id) {
        throw new Error('No event linked to this guest list');
      }

      console.log('Sending invitations with custom message:', customMessage);

      // Send bulk invitations using the new service
      const result = await sendBulkInvitations(
        guestList.id,
        'event', // Assuming this is for regular events
        guestListData.linked_event_id,
        undefined, // rsvpEventId
        undefined, // subEventId
        customMessage // Pass the custom message
      );

      if (result.success) {
        const invitation_count = 'invitation_count' in result ? result.invitation_count : 0;
        const errors = 'errors' in result ? result.errors : undefined;
        
        toast({
          title: "Invitations Sent",
          description: `Successfully sent invitations to ${invitation_count} guests!`,
        });

        if (errors && errors.length > 0) {
          console.warn('Some invitations failed:', errors);
          toast({
            title: "Partial Success",
            description: `Sent ${invitation_count} invitations, but ${errors.length} failed. Check console for details.`,
            variant: "default",
          });
        }

        if (onInvitationsSent) {
          onInvitationsSent();
        }
      } else {
        const error_message = 'errors' in result ? result.errors?.join(', ') : 
                            ('error' in result ? result.error : 'Unknown error');
        throw new Error(error_message || 'Failed to send invitations');
      }

    } catch (error) {
      console.error('Error sending invitations:', error);
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminders = async () => {
    // This would be similar to handleSendInvitations but for reminders
    toast({
      title: "Coming Soon",
      description: "Reminder functionality will be available soon.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Configuration Warning */}
      {!isConfigured && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Email Service Not Configured
            </CardTitle>
            <CardDescription className="text-yellow-700">
              The email service is not properly configured. Please contact support to set up Brevo integration.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Invitation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invitation Status
          </CardTitle>
          <CardDescription>
            Track when invitations were sent and manage follow-ups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Invitations Sent</Label>
              <div className="text-sm text-gray-600">
                {guestList.invitation_sent_at ? (
                  <span className="text-green-600">
                    ✓ Sent on {new Date(guestList.invitation_sent_at).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-gray-500">Not sent yet</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Reminders Sent</Label>
              <div className="text-sm text-gray-600">
                {guestList.reminder_sent_at ? (
                  <span className="text-blue-600">
                    ✓ Sent on {new Date(guestList.reminder_sent_at).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-gray-500">No reminders sent</span>
                )}
              </div>
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="custom-message" className="text-sm font-medium text-gray-700">
              Custom Message (Optional)
            </Label>
            <Textarea
              id="custom-message"
              placeholder="Add a personal message to include with your invitations..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              This message will be included in all invitations sent to guests.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSendInvitations}
              disabled={loading || emailLoading || !isConfigured}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {loading || emailLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {guestList.invitation_sent_at ? 'Resend Invitations' : 'Send Invitations'}
                </>
              )}
            </Button>

            {guestList.invitation_sent_at && (
              <Button
                variant="outline"
                onClick={handleSendReminders}
                disabled={loading || emailLoading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Reminders
              </Button>
            )}
          </div>

          {guestList.invitation_sent_at && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Note:</strong> Invitations were already sent on{' '}
              {new Date(guestList.invitation_sent_at).toLocaleDateString()}.{' '}
              Clicking "Resend Invitations" will send new invitations to all guests.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
