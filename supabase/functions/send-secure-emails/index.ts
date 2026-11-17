import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: 'registration' | 'invitation';
  to: string;
  userData?: {
    userName: string;
    userEmail: string;
  };
  eventData?: {
    guestName: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    rsvpToken: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Send secure emails function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY not found in environment');
      throw new Error('Email service not configured');
    }

    const { type, to, userData, eventData }: EmailRequest = await req.json();
    console.log(`Sending ${type} email to: ${to}`);

    let emailContent: { subject: string; html: string };

    if (type === 'registration' && userData) {
      emailContent = {
        subject: 'Welcome to CelebrateSmartly!',
        html: generateRegistrationEmail(userData.userName, userData.userEmail)
      };
    } else if (type === 'invitation' && eventData) {
      emailContent = {
        subject: `You're Invited: ${eventData.eventTitle}`,
        html: generateInvitationEmailWithRSVP(
          eventData.guestName,
          eventData.eventTitle,
          eventData.eventDate,
          eventData.eventLocation,
          eventData.rsvpToken
        )
      };
    } else {
      throw new Error('Invalid email request data');
    }

    const emailData = {
      sender: {
        name: "CelebrateSmartly",
        email: "noreply@celebratesmartly.com"
      },
      to: [{ email: to }],
      subject: emailContent.subject,
      htmlContent: emailContent.html
    };

    console.log('Sending email via Brevo API...');
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo API error:', response.status, errorText);
      throw new Error(`Failed to send email: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Email sent successfully via Brevo:', result);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.messageId 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    });

  } catch (error: any) {
    console.error('Error in send-secure-emails function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

function getBaseUrl(): string {
  const env = Deno.env.get('DENO_DEPLOYMENT_ID');
  if (env) {
    // Running on Supabase Edge Functions
    return 'https://kthnwmgkdkuleuysobru.supabase.co';
  }
  return 'http://localhost:8081';
}

function generateRegistrationEmail(userName: string, userEmail: string): string {
  const baseUrl = getBaseUrl();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to CelebrateSmartly!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to CelebrateSmartly! 🎉</h1>
      </div>
      <div class="content">
        <h2>Hello ${userName}!</h2>
        <p>Thank you for joining CelebrateSmartly! We're excited to have you as part of our community.</p>
        <p>With CelebrateSmartly, you can:</p>
        <ul>
          <li>Create stunning events with AI-powered theme suggestions</li>
          <li>Find and connect with local vendors</li>
          <li>Manage guest lists and RSVPs seamlessly</li>
          <li>Build beautiful event websites</li>
        </ul>
        <p>Ready to start planning your next celebration?</p>
        <a href="${baseUrl}/dashboard" class="button">Get Started</a>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy celebrating!</p>
        <p><strong>The CelebrateSmartly Team</strong></p>
      </div>
      <div class="footer">
        <p>This email was sent to ${userEmail}. If you didn't sign up for CelebrateSmartly, please ignore this email.</p>
        <p>&copy; 2024 CelebrateSmartly. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

function generateInvitationEmailWithRSVP(
  guestName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  rsvpToken: string
): string {
  const baseUrl = getBaseUrl();
  const rsvpUrl = `${baseUrl}/rsvp/${rsvpToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Invited: ${eventTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; font-size: 16px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 You're Invited! 🎉</h1>
      </div>
      <div class="content">
        <h2>Hello ${guestName}!</h2>
        <p>You've been invited to a special event!</p>
        
        <div class="event-details">
          <h3>${eventTitle}</h3>
          <p><strong>📅 Date:</strong> ${eventDate}</p>
          <p><strong>📍 Location:</strong> ${eventLocation}</p>
        </div>
        
        <p>We're excited to celebrate with you! Please let us know if you can make it.</p>
        
        <div style="text-align: center;">
          <a href="${rsvpUrl}" class="button">RSVP Now</a>
        </div>
        
        <p>Click the RSVP button above to confirm your attendance. If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${rsvpUrl}</p>
        
        <p>We can't wait to see you there!</p>
        <p><strong>Event Host</strong></p>
      </div>
      <div class="footer">
        <p>This invitation was sent via CelebrateSmartly</p>
        <p>&copy; 2024 CelebrateSmartly. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);