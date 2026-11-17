import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Download, Copy, Check, Mail, Users } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { QRScanner } from '@/components/QRScanner';
import { EnvironmentCheck } from '@/components/EnvironmentCheck';
import { VerificationCodeInput } from '@/components/VerificationCodeInput';

const QRTest = () => {
  const [activeTab, setActiveTab] = useState('demo');
  const [demoQRCode, setDemoQRCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate a demo QR code
  const generateDemoQR = () => {
    const demoToken = `inv_demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`http://localhost:5173/verify/${demoToken}`)}&format=png&margin=2&color=1a365d&bgcolor=f7fafc`;
    setDemoQRCode(qrCodeUrl);
  };

  // Copy QR code URL
  const handleCopyQR = async () => {
    if (!demoQRCode) return;
    
    try {
      await navigator.clipboard.writeText(demoQRCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy QR code:', error);
    }
  };

  // Download QR code
  const handleDownloadQR = () => {
    if (!demoQRCode) return;
    
    const link = document.createElement('a');
    link.href = demoQRCode;
    link.download = `demo-qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <Helmet>
        <title>QR Code System Test | CelebrateSmartly</title>
        <meta 
          name="description" 
          content="Test the QR code generation and scanning system for event invitations." 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            QR Code System Test
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test the complete QR code system for event invitations. Generate demo QR codes, 
            test the scanner, and see how guests can be checked in at events.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="demo">Demo QR Codes</TabsTrigger>
            <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="info">System Info</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Generate Demo QR Code
                </CardTitle>
                <CardDescription>
                  Create a sample QR code to test the invitation system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Button onClick={generateDemoQR} size="lg" className="mb-6">
                    <QrCode className="h-5 w-5 mr-2" />
                    Generate Demo QR Code
                  </Button>
                </div>

                {demoQRCode && (
                  <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
                    <h4 className="font-medium text-blue-900 mb-4">Generated Demo QR Code</h4>
                    <img 
                      src={demoQRCode} 
                      alt="Demo QR Code" 
                      className="mx-auto w-64 h-64 rounded-lg shadow-lg mb-4"
                    />
                    
                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={handleDownloadQR}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      
                      <Button
                        onClick={handleCopyQR}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy URL'}
                      </Button>
                    </div>
                    
                    <p className="text-sm text-blue-700 mt-4">
                      This QR code contains a demo invitation token that can be used to test the scanner
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <QrCode className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">1. Generate QR Code</h4>
                    <p className="text-sm text-gray-600">
                      Each guest receives a unique QR code in their invitation email
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">2. Guest Arrives</h4>
                    <p className="text-sm text-gray-600">
                      Guest shows their QR code to event staff for check-in
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">3. Check-in</h4>
                    <p className="text-sm text-gray-600">
                      Staff scans QR code to instantly verify and check in the guest
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Scanner
                </CardTitle>
                <CardDescription>
                  Test the QR code scanner with the demo QR code you generated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRScanner eventTitle="Demo Event" eventId="demo-event-123" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Verification Code Input
                </CardTitle>
                <CardDescription>
                  Test the verification code input system for organizers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VerificationCodeInput />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <EnvironmentCheck />
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">QR Code Generation</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Unique token for each guest</li>
                      <li>• Encrypted with timestamp and random data</li>
                      <li>• Automatically included in invitation emails</li>
                      <li>• High-quality PNG format with custom colors</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Guest Check-in</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Real-time QR code scanning</li>
                      <li>• Instant guest verification</li>
                      <li>• Check-in status tracking</li>
                      <li>• Scan history and analytics</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Security Features</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• One-time use tokens</li>
                      <li>• Encrypted guest information</li>
                      <li>• Audit trail for all scans</li>
                      <li>• Role-based access control</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Integration</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Works with existing invitation system</li>
                      <li>• Automatic email integration</li>
                      <li>• Database tracking and reporting</li>
                      <li>• Mobile-friendly design</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• React with TypeScript</li>
                      <li>• Camera API integration</li>
                      <li>• Real-time status updates</li>
                      <li>• Responsive UI components</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Supabase database</li>
                      <li>• Row Level Security (RLS)</li>
                      <li>• Real-time subscriptions</li>
                      <li>• Edge Functions for email</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">QR Code Service</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• External QR code generation</li>
                      <li>• Custom styling and colors</li>
                      <li>• High-resolution output</li>
                      <li>• Fallback to local generation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Database Schema</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• invitation_tracking table</li>
                      <li>• Guest and event relationships</li>
                      <li>• Status tracking and timestamps</li>
                      <li>• Audit logging</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default QRTest;
