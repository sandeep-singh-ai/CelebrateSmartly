import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import QRCode from "https://esm.sh/qrcode@1.5.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BrevoEmailRequest {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface RegistrationEmailRequest {
  userEmail: string;
  userName: string;
}

interface InvitationEmailRequest {
  guestEmail: string;
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  rsvpUrl: string;
  customMessage?: string;
  invitationToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing email request...');
    
    const { type, ...emailData } = await req.json();
    
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    if (!brevoApiKey) {
      console.error('Brevo API key not found in environment');
      throw new Error('Brevo API key not configured');
    }

    console.log('Brevo API key found, proceeding with email generation for type:', type);

    let emailRequest: BrevoEmailRequest;

    if (type === 'registration') {
      const { userEmail, userName } = emailData as RegistrationEmailRequest;
      
      emailRequest = {
        to: [{ email: userEmail, name: userName }],
        subject: "Welcome to CelebrateSmartly!",
        htmlContent: generateRegistrationEmail(userName, userEmail),
        textContent: `Welcome ${userName}! Thank you for joining CelebrateSmartly. We're excited to help you create amazing events!`
      };
    } else if (type === 'invitation') {
      const { guestEmail, guestName, eventTitle, eventDate, eventLocation, rsvpUrl, customMessage, invitationToken } = emailData as InvitationEmailRequest;
      
      // Generate QR code for the invitation
      const qrCodeDataUrl = await QRCode.toDataURL(invitationToken, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      emailRequest = {
        to: [{ email: guestEmail, name: guestName }],
        subject: `You're Invited: ${eventTitle}`,
        htmlContent: generateInvitationEmail(guestName, eventTitle, eventDate, eventLocation, rsvpUrl, customMessage, qrCodeDataUrl),
        textContent: `Hi ${guestName}, you're invited to ${eventTitle} on ${eventDate} at ${eventLocation}. Please RSVP: ${rsvpUrl}`
      };
    } else {
      throw new Error('Invalid email type');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo API error:', response.status, errorText);
      throw new Error(`Brevo API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    return new Response(JSON.stringify({ success: true, messageId: result.messageId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in send-secure-email function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to send email',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

function generateRegistrationEmail(userName: string, userEmail: string): string {
  const baseUrl = Deno.env.get('SUPABASE_URL') || 'https://your-app.com';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to CelebrateSmartly</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; }
        </style>
    </head>
    <body style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 40px 20px; min-height: 100vh;">
        <!-- Main Container -->
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.15);">
            
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%); padding: 40px 30px; text-align: center; position: relative;">
                <div style="position: absolute; top: 20px; left: 30px; width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    🎉
                </div>
                <h1 style="color: white; margin: 20px 0 10px 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    Welcome to CelebrateSmartly!
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px; font-weight: 400;">
                    Your journey to amazing events starts here ✨
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #2d3748; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                        Hello ${userName}! 🌟
                    </h2>
                    <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6;">
                        We're absolutely thrilled to have you join our community of event creators and celebration enthusiasts!
                    </p>
                </div>
                
                <!-- Feature Cards -->
                <div style="margin: 30px 0;">
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between;">
                        
                        <div style="flex: 1; min-width: 250px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 20px; text-align: center; color: white;">
                            <div style="font-size: 32px; margin-bottom: 10px;">🎪</div>
                            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">AI-Powered Themes</h3>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Create stunning events with intelligent theme generation</p>
                        </div>
                        
                        <div style="flex: 1; min-width: 250px; background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); border-radius: 15px; padding: 20px; text-align: center; color: white;">
                            <div style="font-size: 32px; margin-bottom: 10px;">📋</div>
                            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Smart Guest Management</h3>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Effortless RSVPs and guest list management</p>
                        </div>
                        
                    </div>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; margin-top: 15px;">
                        
                        <div style="flex: 1; min-width: 250px; background: linear-gradient(135deg, #48dbfb 0%, #0abde3 100%); border-radius: 15px; padding: 20px; text-align: center; color: white;">
                            <div style="font-size: 32px; margin-bottom: 10px;">🌐</div>
                            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Beautiful Websites</h3>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Build gorgeous event pages in minutes</p>
                        </div>
                        
                        <div style="flex: 1; min-width: 250px; background: linear-gradient(135deg, #7bed9f 0%, #70a1ff 100%); border-radius: 15px; padding: 20px; text-align: center; color: white;">
                            <div style="font-size: 32px; margin-bottom: 10px;">🏪</div>
                            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Local Vendors</h3>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Discover amazing vendors in your area</p>
                        </div>
                        
                    </div>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 40px 0 30px 0;">
                    <a href="${baseUrl}/dashboard" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
                       🚀 Start Creating Magic
                    </a>
                </div>
                
                <!-- Tips Section -->
                <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f1f3ff 100%); border-radius: 15px; padding: 25px; margin: 30px 0; border-left: 5px solid #667eea;">
                    <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">💡 Pro Tips to Get Started:</h3>
                    <ul style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li>Start with our AI theme generator for instant inspiration</li>
                        <li>Upload your guest list in CSV format for quick setup</li>
                        <li>Customize your event website with our drag-and-drop builder</li>
                        <li>Explore local vendors to make your event unforgettable</li>
                    </ul>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Need Help? We're Here! 🤝</h4>
                    <p style="color: #718096; margin: 0; font-size: 14px;">
                        Contact us at <a href="mailto:support@celebratesmartly.com" style="color: #667eea; text-decoration: none; font-weight: 500;">support@celebratesmartly.com</a>
                    </p>
                </div>
                
                <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                        © 2025 CelebrateSmartly. Made with ❤️ for amazing celebrations.
                    </p>
                </div>
            </div>
            
        </div>
        
        <!-- Floating Elements for Visual Appeal -->
        <div style="position: absolute; top: 10%; left: 10%; width: 20px; height: 20px; background: #feca57; border-radius: 50%; opacity: 0.6;"></div>
        <div style="position: absolute; top: 20%; right: 15%; width: 15px; height: 15px; background: #ff6b6b; border-radius: 50%; opacity: 0.4;"></div>
        <div style="position: absolute; bottom: 15%; left: 20%; width: 25px; height: 25px; background: #48dbfb; border-radius: 50%; opacity: 0.5;"></div>
        
    </body>
    </html>
  `;
}

function generateInvitationEmail(
  guestName: string, 
  eventTitle: string, 
  eventDate: string, 
  eventLocation: string, 
  rsvpUrl: string,
  customMessage?: string,
  qrCodeDataUrl?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You're Invited: ${eventTitle}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 You're Invited! 🎉</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; margin: 20px 0; border-radius: 10px;">
            <h2 style="color: #ff6b6b; margin-top: 0;">Hello ${guestName}!</h2>
            
            ${customMessage ? `<p style="background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3;"><em>${customMessage}</em></p>` : ''}
            
            <h3 style="color: #333; margin-bottom: 20px;">${eventTitle}</h3>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p><strong>📅 Date:</strong> ${eventDate}</p>
                <p><strong>📍 Location:</strong> ${eventLocation}</p>
            </div>
            
            ${qrCodeDataUrl ? `
            <div style="text-align: center; margin: 30px 0; background: white; padding: 20px; border-radius: 10px; border: 2px dashed #e0e0e0;">
                <h4 style="color: #333; margin-bottom: 15px;">📱 Your Event QR Code</h4>
                <img src="${qrCodeDataUrl}" alt="Event QR Code" style="max-width: 200px; height: auto; border-radius: 8px;">
                <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">Show this QR code at the event for quick check-in</p>
            </div>` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${rsvpUrl}" 
                   style="background: #4caf50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 5px;">
                   ✅ Accept Invitation
                </a>
                <a href="${rsvpUrl}" 
                   style="background: #f44336; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 5px;">
                   ❌ Decline Invitation
                </a>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px;">
                Can't click the buttons? Copy and paste this link: <br>
                <a href="${rsvpUrl}">${rsvpUrl}</a>
            </p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px;">
            <p>This invitation was sent through CelebrateSmartly</p>
        </div>
    </body>
    </html>
  `;
}

serve(handler);