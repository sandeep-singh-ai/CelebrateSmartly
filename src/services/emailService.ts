import { supabase } from '@/integrations/supabase/client';

interface EmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface InvitationData {
  guestName: string;
  guestEmail: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  invitationToken: string;
  customMessage?: string;
}

class EmailService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_BREVO_API_KEY || '';
    this.baseUrl = 'https://api.brevo.com/v3';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private async sendEmail(emailData: EmailRequest): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured()) {
      throw new Error('Brevo API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/smtp/email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Api-Key': this.apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: 'Celebrate Smartly',
            email: 'noreply@celebratesmartly.com'
          },
          to: [{ email: emailData.to, name: emailData.to.split('@')[0] }],
          subject: emailData.subject,
          htmlContent: emailData.htmlContent,
          textContent: emailData.textContent
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Brevo API error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      return { success: true, messageId: result.messageId };
    } catch (error: any) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  private generateInvitationToken(guestId: string, eventId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `inv_${guestId}_${eventId}_${timestamp}_${random}`;
  }

  private generateQRCodeUrl(token: string): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_APP_URL || 'https://celebratesmartly.com';
    const verificationUrl = `${baseUrl}/verify/${token}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}&format=png&margin=2&color=1a365d&bgcolor=f7fafc`;
  }

  private generateInvitationEmailHTML(data: InvitationData): string {
    const qrCodeUrl = this.generateQRCodeUrl(data.invitationToken);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_APP_URL || 'https://celebratesmartly.com';
    const verificationUrl = `${baseUrl}/verify/${data.invitationToken}`;
    const rsvpUrl = `${baseUrl}/rsvp/${data.invitationToken}`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You're Invited: ${data.eventTitle}</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; }
              @media only screen and (max-width: 600px) {
                  .container { width: 100% !important; padding: 20px !important; }
                  .qr-code { max-width: 200px !important; }
                  .rsvp-buttons { flex-direction: column !important; }
                  .rsvp-button { width: 100% !important; margin: 5px 0 !important; }
              }
          </style>
      </head>
      <body style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 40px 20px; min-height: 100vh;">
          <!-- Main Container -->
          <div class="container" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.15);">
              
              <!-- Header with Gradient -->
              <div style="background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); color: white; padding: 40px 30px; text-align: center; position: relative;">
                  <div style="position: absolute; top: 20px; left: 30px; width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                      🎉
                  </div>
                  
                  <h1 style="margin: 0; font-size: 2.5em; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      You're Invited!
                  </h1>
                  <p style="margin: 10px 0 0 0; font-size: 1.2em; opacity: 0.9; font-weight: 300;">
                      A special celebration awaits you
                  </p>
              </div>
              
              <!-- Main Content -->
              <div style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                      <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 1.8em; font-weight: 600;">
                          Hello ${data.guestName}! 👋
                      </h2>
                      
                      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 15px; border: 2px solid #e2e8f0;">
                          <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 1.6em; font-weight: 600;">${data.eventTitle}</h3>
                          
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                              <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; border: 1px solid #e2e8f0;">
                                  <div style="font-size: 2em; margin-bottom: 10px;">📅</div>
                                  <p style="margin: 0; color: #4a5568; font-weight: 500;">${data.eventDate}</p>
                              </div>
                              
                              <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; border: 1px solid #e2e8f0;">
                                  <div style="font-size: 2em; margin-bottom: 10px;">📍</div>
                                  <p style="margin: 0; color: #4a5568; font-weight: 500;">${data.eventLocation}</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <!-- Custom Message -->
                  ${data.customMessage ? `
                  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 15px; border: 2px solid #f59e0b; margin-bottom: 30px;">
                      <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 1.2em; font-weight: 600;">💌 Personal Message</h4>
                      <p style="color: #92400e; margin: 0; font-style: italic;">${data.customMessage}</p>
                  </div>
                  ` : ''}
                  
                  <!-- RSVP Section -->
                  <div style="text-align: center; margin: 40px 0; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 20px; border: 2px dashed #0ea5e9;">
                      <h4 style="color: #0c4a6e; margin: 0 0 20px 0; font-size: 1.4em; font-weight: 600;">📝 RSVP Response</h4>
                      <p style="color: #0c4a6e; font-size: 16px; margin: 0 0 25px 0; font-weight: 500;">
                          Please let us know if you can attend this special event
                      </p>
                      
                      <div class="rsvp-buttons" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                          <a href="${rsvpUrl}?response=attending" class="rsvp-button" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                              ✅ Yes, I'll be there!
                          </a>
                          <a href="${rsvpUrl}?response=maybe" class="rsvp-button" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
                              🤔 Maybe, I'll let you know
                          </a>
                          <a href="${rsvpUrl}?response=not_attending" class="rsvp-button" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); transition: all 0.3s ease;">
                              ❌ Sorry, I can't make it
                          </a>
                      </div>
                      
                      <p style="color: #0c4a6e; font-size: 14px; margin: 20px 0 0 0; opacity: 0.8;">
                          Click any button above to RSVP and add a personal message
                      </p>
                  </div>
                  
                  <!-- QR Code Section -->
                  <div style="text-align: center; margin: 40px 0; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 20px; border: 2px dashed #0ea5e9;">
                      <h4 style="color: #0c4a6e; margin: 0 0 20px 0; font-size: 1.4em; font-weight: 600;">📱 Your Event QR Code</h4>
                      <img src="${qrCodeUrl}" alt="Event QR Code" class="qr-code" style="max-width: 250px; height: auto; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                      <p style="color: #0c4a6e; font-size: 14px; margin: 15px 0 0 0; font-weight: 500;">
                          Scan this QR code at the event for quick check-in
                      </p>
                      <p style="color: #0c4a6e; font-size: 12px; margin: 5px 0 0 0; opacity: 0.8;">
                          This will show your verification code to the event organizer
                      </p>
                  </div>
                  
                  <!-- Verification Instructions -->
                  <div style="text-align: center; margin: 40px 0;">
                      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 25px; border-radius: 15px; border: 2px solid #f59e0b;">
                          <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 1.3em; font-weight: 600;">🔐 How to Check In</h4>
                          <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                              <div style="display: flex; align-items: center; gap: 3; margin-bottom: 10px;">
                                  <div style="width: 20px; height: 20px; background: #f59e0b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">1</div>
                                  <span style="color: #92400e; font-size: 14px;">Scan the QR code with your phone camera</span>
                              </div>
                              <div style="display: flex; align-items: center; gap: 3; margin-bottom: 10px;">
                                  <div style="width: 20px; height: 20px; background: #f59e0b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">2</div>
                                  <span style="color: #92400e; font-size: 14px;">You'll see a 5-digit verification code</span>
                              </div>
                              <div style="display: flex; align-items: center; gap: 3;">
                                  <div style="width: 20px; height: 20px; background: #f59e0b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">3</div>
                                  <span style="color: #92400e; font-size: 14px;">Share this code with the event organizer</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <!-- Direct Links -->
                  <div style="text-align: center; margin: 40px 0;">
                      <p style="color: #6b7280; font-size: 14px; margin: 0;">
                          Can't scan the QR code? Click this link: <br>
                          <a href="${verificationUrl}" style="color: #667eea; word-break: break-all; text-decoration: none;">${verificationUrl}</a>
                      </p>
                  </div>
                  
                  <!-- Footer -->
                  <div style="background: #f7fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="color: #6b7280; margin: 0; font-size: 14px;">
                          This invitation was sent through <strong>CelebrateSmartly</strong> 🎉
                      </p>
                      <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
                          If you received this email by mistake, please ignore it.
                      </p>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  async sendInvitationEmail(data: InvitationData): Promise<{ success: boolean; error?: string }> {
    try {
      const htmlContent = this.generateInvitationEmailHTML(data);
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_APP_URL || 'https://celebratesmartly.com';
      const rsvpUrl = `${baseUrl}/rsvp-response/${data.invitationToken}`;
      const textContent = `Hi ${data.guestName}, you're invited to ${data.eventTitle} on ${data.eventDate} at ${data.eventLocation}. Please RSVP by clicking the links in the email or scan the QR code for check-in. RSVP: ${rsvpUrl}`;

      const result = await this.sendEmail({
        to: data.guestEmail,
        subject: `🎉 You're Invited: ${data.eventTitle}`,
        htmlContent,
        textContent
      });

      return result;
    } catch (error: any) {
      console.error('Error sending invitation email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendBulkInvitations(
    guestListId: string,
    eventType: 'event' | 'rsvp_event' | 'sub_event',
    eventId: string,
    customMessage?: string
  ): Promise<{ success: boolean; invitation_count: number; errors?: string[] }> {
    try {
      console.log('Starting bulk invitation process for event:', eventId);

      // Get event details
      let eventDetails = null;
      if (eventType === 'event') {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('title, event_date, location')
          .eq('id', eventId)
          .single();

        if (eventError) throw eventError;
        eventDetails = eventData;
      }

      if (!eventDetails) {
        throw new Error('Event details not found');
      }

      // Get all individual guests for this event (not guest list headers)
      const { data: guests, error: guestsError } = await supabase
        .from('guest_lists')
        .select('id, name, email')
        .eq('event_id', eventId)
        .is('title', null) // Only get individual guests, not guest list headers
        .not('name', 'is', null)
        .not('email', 'is', null);

      if (guestsError) throw guestsError;

      if (!guests || guests.length === 0) {
        throw new Error('No guests found for this event');
      }

      console.log(`Found ${guests.length} guests to invite`);

      // Send invitations to each guest
      const results = await Promise.allSettled(
        guests.map(async (guest) => {
          // Generate unique token for this guest
          const invitationToken = this.generateInvitationToken(guest.id, eventId);
          
          // Create invitation tracking record
          const { error: trackingError } = await supabase
            .from('invitation_tracking')
            .upsert({
              guest_list_id: guestListId,
              guest_email: guest.email,
              guest_name: guest.name,
              event_id: eventId,
              token: invitationToken,
              invitation_sent_at: new Date().toISOString(),
              response_status: 'no_response'
            });

          if (trackingError) {
            console.error('Error creating tracking record:', trackingError);
          }

          // Send invitation email
          return this.sendInvitationEmail({
            guestName: guest.name,
            guestEmail: guest.email,
            eventTitle: eventDetails.title,
            eventDate: eventDetails.event_date,
            eventLocation: eventDetails.location || '',
            invitationToken,
            customMessage
          });
        })
      );

      // Process results
      const successful = results.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length;
      
      const failed = results.filter(result => 
        result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
      ).length;

      const errors = results
        .filter(result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success))
        .map((result, index) => {
          if (result.status === 'rejected') {
            return `Guest ${index + 1}: ${result.reason}`;
          }
          return `Guest ${index + 1}: ${result.value.error}`;
        });

      console.log(`Bulk invitation results: ${successful} successful, ${failed} failed`);

      // Update the guest list header with invitation sent timestamp
      await supabase
        .from('guest_lists')
        .update({ invitation_sent_at: new Date().toISOString() })
        .eq('id', guestListId);

      return {
        success: successful > 0,
        invitation_count: successful,
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error: any) {
      console.error('Error sending bulk invitations:', error);
      return { 
        success: false, 
        invitation_count: 0, 
        errors: [error.message] 
      };
    }
  }
}

export default EmailService;
