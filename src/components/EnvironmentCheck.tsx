import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const EnvironmentCheck = () => {
  const [showSecrets, setShowSecrets] = useState(false);

  const envVars = {
    'Brevo API Key': {
      key: 'VITE_BREVO_API_KEY',
      value: import.meta.env.VITE_BREVO_API_KEY,
      required: true,
      description: 'Required for sending invitation emails'
    },
    'Supabase URL': {
      key: 'VITE_SUPABASE_URL',
      value: import.meta.env.VITE_SUPABASE_URL,
      required: true,
      description: 'Required for database operations'
    },
    'Supabase Anon Key': {
      key: 'VITE_SUPABASE_ANON_KEY',
      value: import.meta.env.VITE_SUPABASE_ANON_KEY,
      required: true,
      description: 'Required for database operations'
    },
    'Google Places API Key': {
      key: 'VITE_GOOGLE_PLACES_API_KEY',
      value: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
      required: false,
      description: 'Optional for vendor search'
    },
    'AWS Access Key': {
      key: 'VITE_AWS_ACCESS_KEY_ID',
      value: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      required: false,
      description: 'Optional for image uploads'
    }
  };

  const getStatusIcon = (envVar: any) => {
    if (!envVar.value) {
      return envVar.required ? <XCircle className="h-4 w-4 text-red-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusBadge = (envVar: any) => {
    if (!envVar.value) {
      return envVar.required ? 
        <Badge variant="destructive">Missing</Badge> : 
        <Badge variant="secondary">Optional</Badge>;
    }
    return <Badge variant="default">Configured</Badge>;
  };

  const getDisplayValue = (envVar: any) => {
    if (!envVar.value) return 'Not set';
    if (showSecrets) return envVar.value;
    return `${envVar.value.substring(0, 8)}...${envVar.value.substring(envVar.value.length - 4)}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Environment Configuration Check
        </CardTitle>
        <CardDescription>
          Check the status of your environment variables and API keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            This helps debug configuration issues with the invitation system
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSecrets(!showSecrets)}
          >
            {showSecrets ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showSecrets ? 'Hide' : 'Show'} Values
          </Button>
        </div>

        <div className="space-y-3">
          {Object.entries(envVars).map(([name, envVar]) => (
            <div key={envVar.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(envVar)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{name}</span>
                    {getStatusBadge(envVar)}
                  </div>
                  <p className="text-sm text-gray-600">{envVar.description}</p>
                  <p className="text-xs text-gray-500 font-mono">{envVar.key}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-gray-700">
                  {getDisplayValue(envVar)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Troubleshooting Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file in your project root</li>
            <li>• Add your API keys: <code className="bg-blue-100 px-1 rounded">VITE_BREVO_API_KEY=your_key_here</code></li>
            <li>• Restart your development server after adding environment variables</li>
            <li>• Check the browser console for detailed error messages</li>
          </ul>
        </div>

        {!envVars['Brevo API Key'].value && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">⚠️ Critical Issue</h4>
            <p className="text-sm text-red-800">
              The Brevo API key is missing, which means invitation emails cannot be sent. 
              This is why you're getting the "Failed to send invitations" error.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
