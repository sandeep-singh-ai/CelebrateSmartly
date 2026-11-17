
interface BrevoEmailRequest {
  to: Array<{ email: string; name: string }>;
  subject: string;
  htmlContent: string;
  sender?: { email: string; name: string };
}

interface BrevoApiResponse {
  messageId: string;
}

// Utility function to get the correct base URL
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // For server-side rendering or edge functions, use environment variable or default
  return import.meta.env.VITE_APP_URL || 'https://celebratesmartly.com';
};

class BrevoService {
  private apiKey: string;
  private baseUrl = 'https://api.brevo.com/v3';

  constructor(apiKey?: string) {
    // Use provided API key or read from environment variable
    this.apiKey = apiKey || import.meta.env.VITE_BREVO_API_KEY || '';
    console.log('BrevoService constructor:', {
      configured: this.isConfigured(),
      keyLength: this.apiKey?.length,
      keyProvided: !!apiKey,
      keyFromEnv: !!import.meta.env.VITE_BREVO_API_KEY,
      keyStart: this.apiKey?.substring(0, 20)
    });
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async sendEmail(emailData: BrevoEmailRequest): Promise<BrevoApiResponse> {
    if (!this.isConfigured()) {
      throw new Error('Brevo API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/smtp/email`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey,
      },
      body: JSON.stringify({
        sender: emailData.sender || {
          name: 'Celebrate Smartly',
          email: 'noreply@celebratesmartly.com'
        },
        to: emailData.to,
        subject: emailData.subject,
        htmlContent: emailData.htmlContent
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Brevo API error: ${response.status} - ${errorData}`);
    }

    return await response.json();
  }

  generateRegistrationEmail(userName: string, userEmail: string): string {
    const baseUrl = getBaseUrl();
    
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
              @media only screen and (max-width: 600px) {
                  .container { width: 100% !important; }
                  .content { padding: 20px !important; }
                  .feature-card { min-width: 100% !important; margin-bottom: 15px !important; }
              }
          </style>
      </head>
      <body style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 40px 20px; min-height: 100vh;">
          <!-- Main Container -->
          <div class="container" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.15);">
              
              <!-- Header with Gradient -->
              <div style="background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%); padding: 40px 30px; text-align: center; position: relative;">
                  <div style="position: absolute; top: 20px; left: 30px; width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
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
              <div class="content" style="padding: 40px 30px;">
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
                          
                          <div class="feature-card" style="flex: 1; min-width: 250px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 20px; text-align: center; color: white;">
                              <div style="font-size: 32px; margin-bottom: 10px;">🎪</div>
                              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">AI-Powered Themes</h3>
                              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Create stunning events with intelligent theme generation</p>
                          </div>
                          
                          <div class="feature-card" style="flex: 1; min-width: 250px; background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); border-radius: 15px; padding: 20px; text-align: center; color: white;">
                              <div style="font-size: 32px; margin-bottom: 10px;">📋</div>
                              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Smart Guest Management</h3>
                              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Effortless RSVPs and guest list management</p>
                          </div>
                          
                      </div>
                      
                      <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; margin-top: 15px;">
                          
                          <div class="feature-card" style="flex: 1; min-width: 250px; background: linear-gradient(135deg, #48dbfb 0%, #0abde3 100%); border-radius: 15px; padding: 20px; text-align: center; color: white;">
                              <div style="font-size: 32px; margin-bottom: 10px;">🌐</div>
                              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Beautiful Websites</h3>
                              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Build gorgeous event pages in minutes</p>
                          </div>
                          
                          <div class="feature-card" style="flex: 1; min-width: 250px; background: linear-gradient(135deg, #7bed9f 0%, #70a1ff 100%); border-radius: 15px; padding: 20px; text-align: center; color: white;">
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
      </body>
      </html>
    `;
  }

  generateInvitationEmailWithRSVP(guestName: string, eventTitle: string, eventDate: string, eventLocation: string, rsvpToken: string): string {
    const baseUrl = getBaseUrl();
    // Use verification URL instead of RSVP URL
    const verificationUrl = `${baseUrl}/verify/${rsvpToken}`;
    
    // Generate QR code URL using external service for the verification URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}&format=png&margin=2&color=1a365d&bgcolor=f7fafc`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You're Invited: ${eventTitle}</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; }
              @media only screen and (max-width: 600px) {
                  .container { width: 100% !important; padding: 20px !important; }
                  .qr-code { max-width: 200px !important; }
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
                          Hello ${guestName}! 👋
                      </h2>
                      
                      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 15px; border: 2px solid #e2e8f0;">
                          <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 1.6em; font-weight: 600;">${eventTitle}</h3>
                          
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                              <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; border: 1px solid #e2e8f0;">
                                  <div style="font-size: 2em; margin-bottom: 10px;">📅</div>
                                  <p style="margin: 0; color: #4a5568; font-weight: 500;">${eventDate}</p>
                              </div>
                              
                              <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; border: 1px solid #e2e8f0;">
                                  <div style="font-size: 2em; margin-bottom: 10px;">📍</div>
                                  <p style="margin: 0; color: #4a5568; font-weight: 500;">${eventLocation}</p>
                              </div>
                          </div>
                      </div>
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
                  
                  <!-- Direct Link -->
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
}

export default BrevoService;
