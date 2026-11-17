import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import EmailService from '@/services/emailService';
import { supabase } from '@/integrations/supabase/client';

export const useBrevoService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailService] = useState(() => new EmailService());
  const { toast } = useToast();

  // Check if Brevo is configured on mount
  const isConfigured = emailService.isConfigured();
  
  if (!isConfigured) {
    console.warn('Brevo API key not configured. Available env vars:', {
      brevoKey: !!import.meta.env.VITE_BREVO_API_KEY,
      keyLength: import.meta.env.VITE_BREVO_API_KEY?.length,
      keyStart: import.meta.env.VITE_BREVO_API_KEY?.substring(0, 20),
      allEnvVars: Object.keys(import.meta.env).filter(key => key.includes('BREVO'))
    });
  }

  const sendRegistrationEmail = async (userName: string, userEmail: string) => {
    if (!emailService.isConfigured()) {
      const error = 'Brevo API key not configured. Please contact support.';
      setError(error);
      toast({
        title: "Configuration Error",
        description: error,
        variant: "destructive",
      });
      return { error };
    }

    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll use a simple registration email
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to CelebrateSmartly</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #667eea;">Welcome to CelebrateSmartly! 🎉</h1>
                <p>Hello ${userName},</p>
                <p>Thank you for joining CelebrateSmartly! We're excited to help you create amazing events.</p>
                <p>Get started by creating your first event and sending beautiful invitations to your guests.</p>
                <p>Best regards,<br>The CelebrateSmartly Team</p>
            </div>
        </body>
        </html>
      `;
      
      const emailData = {
        to: userEmail,
        subject: "Welcome to CelebrateSmartly!",
        htmlContent,
      };

      console.log('Sending registration email via Brevo API...');
      const result = await emailService.sendInvitationEmail({
        guestName: userName,
        guestEmail: userEmail,
        eventTitle: 'Welcome to CelebrateSmartly',
        eventDate: new Date().toLocaleDateString(),
        eventLocation: 'Your Dashboard',
        invitationToken: `welcome_${Date.now()}`,
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error sending registration email:', error);
      const errorMessage = error.message || 'Failed to send registration email';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to send registration email to ${userEmail}: ${errorMessage}`,
        variant: "destructive",
      });
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendInvitationEmail = useCallback(async (
    guestName: string,
    guestEmail: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    rsvpToken: string
  ) => {
    if (!emailService.isConfigured()) {
      const error = 'Brevo API key not configured. Please contact support.';
      setError(error);
      toast({
        title: "Configuration Error",
        description: error,
        variant: "destructive",
      });
      return { error };
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await emailService.sendInvitationEmail({
        guestName,
        guestEmail,
        eventTitle,
        eventDate,
        eventLocation,
        invitationToken: rsvpToken,
      });
      
      return result;
    } catch (error: any) {
      console.error('Error sending invitation email:', error);
      const errorMessage = error.message || 'Failed to send invitation email';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to send invitation to ${guestEmail}: ${errorMessage}`,
        variant: "destructive",
      });
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [emailService, toast]);

  const sendBulkInvitations = useCallback(async (
    guestListId: string,
    eventType: 'event' | 'rsvp_event' | 'sub_event',
    eventId: string,
    rsvpEventId?: string,
    subEventId?: string,
    customMessage?: string
  ) => {
    if (!emailService.isConfigured()) {
      const error = 'Brevo API key not configured. Please contact support.';
      setError(error);
      toast({
        title: "Configuration Error",
        description: error,
        variant: "destructive",
      });
      return { success: false, error };
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Sending bulk invitations for event:', eventId);
      
      const result = await emailService.sendBulkInvitations(
        guestListId,
        eventType,
        eventId,
        customMessage
      );

      return result;

    } catch (error: any) {
      console.error('Error sending bulk invitations:', error);
      const errorMessage = error.message || 'Failed to send bulk invitations';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to send bulk invitations: ${errorMessage}`,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [emailService, toast]);

  return {
    sendRegistrationEmail,
    sendInvitationEmail,
    sendBulkInvitations,
    loading,
    error,
    isConfigured: emailService.isConfigured(),
  };
};