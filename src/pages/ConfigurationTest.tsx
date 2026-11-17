import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Mail, Settings } from 'lucide-react';
import EmailService from '@/services/emailService';

const ConfigurationTest = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const emailService = new EmailService();
  const isConfigured = emailService.isConfigured();

  const testEmailService = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Test basic configuration
      if (!isConfigured) {
        setTestResult('❌ Email service not configured - missing VITE_BREVO_API_KEY');
        return;
      }

      // Test API key format
      const apiKey = import.meta.env.VITE_BREVO_API_KEY;
      if (!apiKey.startsWith('xkeysib-')) {
        setTestResult('❌ Invalid API key format - should start with "xkeysib-"');
        return;
      }

      // Test a simple email send (this will fail but show us the error)
      const result = await emailService.sendInvitationEmail({
        guestName: 'Test User',
        guestEmail: 'test@example.com',
        eventTitle: 'Test Event',
        eventDate: '2024-01-01',
        eventLocation: 'Test Location',
        invitationToken: 'test_token_123',
      });

      if (result.success) {
        setTestResult('✅ Email service is working correctly!');
      } else {
        setTestResult(`❌ Email service error: ${result.error}`);
      }

    } catch (error: any) {
      setTestResult(`❌ Test failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Configuration Test | CelebrateSmartly</title>
        <meta name="description" content="Test your email service configuration." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuration Test</h1>
            <p className="text-gray-600">Test and verify your email service configuration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Service Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Service (Brevo)
                </CardTitle>
                <CardDescription>
                  Required for sending invitation emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={isConfigured ? "default" : "destructive"}>
                    {isConfigured ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Configured
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Missing
                      </>
                    )}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Key:</span>
                    <span className="text-sm font-mono">
                      {isConfigured ? 'xkeysib-***' : 'Not set'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Key Length:</span>
                    <span className="text-sm">
                      {import.meta.env.VITE_BREVO_API_KEY?.length || 0} chars
                    </span>
                  </div>
                </div>

                <Button
                  onClick={testEmailService}
                  disabled={testing || !isConfigured}
                  className="w-full"
                >
                  {testing ? 'Testing...' : 'Test Email Service'}
                </Button>

                {testResult && (
                  <div className={`p-3 rounded-lg text-sm ${
                    testResult.startsWith('✅') 
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {testResult}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Environment Variables
                </CardTitle>
                <CardDescription>
                  Check your configuration variables
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">VITE_BREVO_API_KEY:</span>
                    <Badge variant={isConfigured ? "default" : "destructive"}>
                      {isConfigured ? "Set" : "Missing"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">VITE_SUPABASE_URL:</span>
                    <Badge variant={import.meta.env.VITE_SUPABASE_URL ? "default" : "destructive"}>
                      {import.meta.env.VITE_SUPABASE_URL ? "Set" : "Missing"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">VITE_SUPABASE_ANON_KEY:</span>
                    <Badge variant={import.meta.env.VITE_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                      {import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Missing"}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Debug Info:</h4>
                  <div className="text-xs space-y-1">
                    <div>Node Env: {import.meta.env.MODE}</div>
                    <div>Base URL: {import.meta.env.BASE_URL}</div>
                    <div>Dev: {import.meta.env.DEV ? 'Yes' : 'No'}</div>
                    <div>Prod: {import.meta.env.PROD ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Setup Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">To fix the email sending issue:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Get your Brevo API key from <a href="https://app.brevo.com/settings/keys/api" target="_blank" rel="noopener noreferrer" className="underline">Brevo Dashboard</a></li>
                  <li>Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file in your project root</li>
                  <li>Add: <code className="bg-blue-100 px-1 rounded">VITE_BREVO_API_KEY=xkeysib-your_key_here</code></li>
                  <li>Restart your development server</li>
                  <li>Test again using the button above</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Brevo API keys start with <code className="bg-yellow-100 px-1 rounded">xkeysib-</code></li>
                  <li>Keys are typically 64+ characters long</li>
                  <li>Make sure to restart the dev server after adding the environment file</li>
                  <li>The <code className="bg-yellow-100 px-1 rounded">.env.local</code> file should not be committed to git</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ConfigurationTest;
