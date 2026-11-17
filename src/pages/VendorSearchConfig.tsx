import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import VendorSearchService from '@/services/vendorSearchService';

interface TestResult {
  success: boolean;
  message: string;
  rawResponse?: any;
}

const VendorSearchConfig: React.FC = () => {
  const [testLocation, setTestLocation] = useState('10001');
  const [testCategory, setTestCategory] = useState('catering');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testing, setTesting] = useState(false);

  const vendorSearchService = new VendorSearchService();
  const isConfigured = vendorSearchService['isGoogleConfigured']();

  const handleTestAPI = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const result = await vendorSearchService.searchVendors({
        location: testLocation,
        categoryId: testCategory,
        categoryName: testCategory,
        searchRadius: 25,
        userId: 'test-user'
      });

      setTestResult({
        success: true,
        message: `✅ API test successful! Found ${result.totalCount} vendors for ${testCategory} in zipcode ${testLocation}`,
        rawResponse: result
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `❌ API test failed: ${error.message}`,
        rawResponse: error
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vendor Search Configuration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Configure and test your Google Places API integration for the vendor search system.
            This system now uses zipcode-based searches for more accurate and reliable results.
          </p>
        </div>

        {/* Configuration Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              {isConfigured ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Not Configured
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>Environment Variable:</strong> VITE_GOOGLE_PLACES_API_KEY</p>
              <p><strong>Status:</strong> {isConfigured ? '✅ Set' : '❌ Not set'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">1. Get Google Places API Key</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                <li>Create a new project or select existing one</li>
                <li>Enable these APIs:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li><strong>Places API</strong> - Required for vendor searches</li>
                    <li><strong>Geocoding API</strong> - Required for location conversion</li>
                    <li><strong>Maps JavaScript API</strong> - Optional, for enhanced features</li>
                  </ul>
                </li>
                <li>Go to "Credentials" and create an API key</li>
                <li>Set API restrictions to only the enabled APIs</li>
                <li>Enable billing for your project</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">2. Configure Environment</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root</li>
                <li>Add: <code className="bg-gray-100 px-1 rounded">VITE_GOOGLE_PLACES_API_KEY=your_api_key_here</code></li>
                <li>Restart your development server</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">3. Test the Integration</h3>
              <p className="text-sm text-gray-600">
                Use the test section below to verify your API key works correctly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Testing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test API Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="testLocation">Test Zipcode</Label>
                <Input
                  id="testLocation"
                  value={testLocation}
                  onChange={(e) => setTestLocation(e.target.value)}
                  placeholder="e.g., 10001"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid US zipcode (5 digits or 5+4 format)
                </p>
              </div>
              
              <div>
                <Label htmlFor="testCategory">Test Category</Label>
                <Select value={testCategory} onValueChange={setTestCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="music">Music & Entertainment</SelectItem>
                    <SelectItem value="decorations">Decorations & Flowers</SelectItem>
                    <SelectItem value="venues">Venues & Locations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleTestAPI} 
                  disabled={!isConfigured || testing}
                  className="w-full"
                >
                  {testing ? 'Testing...' : 'Test API'}
                </Button>
              </div>
            </div>

            {testResult && (
              <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}

            {testResult?.rawResponse && (
              <div className="mt-4">
                <details className="bg-gray-50 p-4 rounded">
                  <summary className="cursor-pointer font-medium text-gray-700">
                    Raw API Response
                  </summary>
                  <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(testResult.rawResponse, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vendor Search Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">🔍 Zipcode-Based Search</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Enter any US zipcode (e.g., 10001, 10001-1234)</li>
                  <li>• Automatic coordinate conversion</li>
                  <li>• Fallback coordinates for major cities</li>
                  <li>• More accurate and reliable results</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">📱 User Experience</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time zipcode validation</li>
                  <li>• Category selection dropdown</li>
                  <li>• Configurable search radius</li>
                  <li>• Rich vendor information display</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">🔧 Technical Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Google Places API integration</li>
                  <li>• Automatic fallback coordinates</li>
                  <li>• Enhanced error handling</li>
                  <li>• TypeScript support</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">📊 Data Sources</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Google Places business data</li>
                  <li>• Ratings and reviews</li>
                  <li>• Business photos</li>
                  <li>• Contact information</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle>Help & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Common Issues</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>API not authorized:</strong> Enable required APIs in Google Cloud Console</li>
                  <li>• <strong>Quota exceeded:</strong> Check your billing and usage limits</li>
                  <li>• <strong>Invalid location:</strong> Use valid US zipcodes</li>
                </ul>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <a href="https://developers.google.com/maps/documentation/places/web-service" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Places API Docs
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Google Cloud Console
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorSearchConfig;
