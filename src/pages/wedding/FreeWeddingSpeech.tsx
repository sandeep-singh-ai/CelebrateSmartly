import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, ArrowLeft, Copy, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FreeWeddingSpeech() {
  const [formData, setFormData] = useState({
    speechFor: '',
    name: '',
    role: '',
    tone: '',
    groomName: '',
    brideName: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSpeech, setGeneratedSpeech] = useState('');
  const [error, setError] = useState('');

  const roles = [
    'Best Man',
    'Maid of Honor', 
    'Groomsmen',
    'Bridesmaid',
    'Father of the bride',
    'Father of the groom',
    'Mother of the bride',
    'Mother of the groom'
  ];

  const tones = [
    'Heartfelt',
    'Funny',
    'Cute',
    'Witty',
    'Traditional',
    'Poem'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const generateSpeech = async () => {
    if (!formData.speechFor || !formData.name || !formData.role || !formData.tone || !formData.groomName || !formData.brideName) {
      setError('Please fill in all fields');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Mock API call - replace with actual OpenAI integration
      const prompt = `Write a ${formData.tone.toLowerCase()} wedding speech for ${formData.speechFor}. 
      
      Details:
      - Speaker: ${formData.name}
      - Role: ${formData.role}
      - Tone: ${formData.tone}
      - Groom: ${formData.groomName}
      - Bride: ${formData.brideName}
      
      Make the speech personal, heartfelt, and unique. It should sound handwritten and authentic. Include personal touches and make it memorable for the wedding guests.`;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - replace with actual OpenAI API call
      const mockSpeech = `Dear family and friends,

I stand here today as ${formData.role.toLowerCase()} to celebrate the beautiful union of ${formData.groomName} and ${formData.brideName}. 

${formData.tone === 'Heartfelt' ? 
`When I think about ${formData.groomName}, I'm reminded of his incredible kindness and the way he lights up every room he enters. And ${formData.brideName} - she's not just beautiful, she's the kind of person who makes everyone around her better.

Their love story is one for the ages. I've watched them grow together, support each other through life's challenges, and celebrate each other's victories. Today, as they promise to love, honor, and cherish each other, I know they're making the best decision of their lives.

${formData.groomName}, you've found your perfect match in ${formData.brideName}. She brings out the best in you, and I know you'll do the same for her. ${formData.brideName}, you've chosen a man who will love you unconditionally, support your dreams, and be your partner in all of life's adventures.

May your love continue to grow stronger with each passing year. Here's to a lifetime of happiness, laughter, and endless love.

Cheers to the happy couple!` :

formData.tone === 'Funny' ?
`Well, well, well... look who decided to get married! ${formData.groomName} and ${formData.brideName}, you two have finally made it official.

I have to say, ${formData.groomName}, I never thought I'd see the day when you'd willingly give up your bachelor pad and your collection of... let's call them "interesting" life choices. But then ${formData.brideName} came along and somehow managed to domesticate you. It's like watching a wild animal become a house pet - but in the best possible way!

${formData.brideName}, you're a brave soul for taking on this project. I mean, who else would put up with his terrible jokes, his questionable cooking skills, and his obsession with [insert hobby here]? But somehow, you make it work, and you make him better.

The secret to a successful marriage, I've learned, is simple: never go to bed angry, always say "I love you," and most importantly, always remember that you're both on the same team - even when you're arguing about whose turn it is to take out the trash.

Here's to ${formData.groomName} and ${formData.brideName} - may your love be as strong as your WiFi signal and as reliable as your favorite pizza place!` :

formData.tone === 'Poem' ?
`In the garden of love, two hearts entwined,
${formData.groomName} and ${formData.brideName}, forever combined.

Like stars that dance in the midnight sky,
Their love will never fade or die.

Through laughter and tears, through joy and pain,
Together they'll weather life's gentle rain.

${formData.groomName}, your love is pure and true,
${formData.brideName}, your heart he'll always pursue.

Today they promise, hand in hand,
To walk together across life's shifting sand.

May their love bloom like roses in spring,
And may their hearts forever sing.

Here's to the couple, so perfectly matched,
May their love be eternal, never to be detached.` :

`Today we celebrate the beautiful union of ${formData.groomName} and ${formData.brideName}. 

As ${formData.role.toLowerCase()}, I've had the privilege of watching their love story unfold. ${formData.groomName} and ${formData.brideName} complement each other in ways that are truly remarkable.

Their journey together has been filled with love, laughter, and countless precious moments. Today marks the beginning of a new chapter in their lives, and I couldn't be happier for them.

May their marriage be blessed with endless joy, unwavering love, and countless adventures together. Here's to a lifetime of happiness!`}

With love and best wishes,
${formData.name}`;

      setGeneratedSpeech(mockSpeech);
    } catch (err) {
      setError('Failed to generate speech. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSpeech);
  };

  const downloadSpeech = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedSpeech], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `wedding-speech-${formData.name}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <Helmet>
        <title>Free Wedding Speech Generator - Create Personalized Wedding Speeches | celebrate Smartly</title>
        <meta name="description" content="Create heartfelt, personalized wedding speeches instantly with our free AI wedding speech generator. Perfect for Best Man, Maid of Honor, parents, and wedding party members. Multiple tones, personalized content, and professional quality speeches." />
        <meta name="keywords" content="wedding speech generator, AI wedding speech, best man speech generator, maid of honor speech, father of bride speech, mother of groom speech, wedding toast generator, free wedding speech, personalized wedding speech, wedding speech templates, heartfelt wedding speech, funny wedding speech, traditional wedding speech, wedding speech writer, wedding speech ideas, wedding party speech, wedding ceremony speech, wedding reception speech, wedding speech help, wedding speech examples" />
        <meta property="og:title" content="Free AI Wedding Speech Generator - Create Personalized Wedding Speeches" />
        <meta property="og:description" content="Create heartfelt, personalized wedding speeches instantly with our free AI wedding speech generator. Perfect for Best Man, Maid of Honor, parents, and wedding party members." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.celebratesmartly.com/wedding/free-wedding-speech" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Wedding Speech Generator - Create Personalized Wedding Speeches" />
        <meta name="twitter:description" content="Create heartfelt, personalized wedding speeches instantly with our free AI wedding speech generator. Perfect for any wedding role." />
        <link rel="canonical" href="https://www.celebratesmartly.com/wedding/free-wedding-speech" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free AI Wedding Speech Generator - Create Personalized Wedding Speeches",
            "description": "Create heartfelt, personalized wedding speeches instantly with our free AI wedding speech generator. Perfect for Best Man, Maid of Honor, parents, and wedding party members. Multiple tones, personalized content, and professional quality speeches.",
            "url": "https://www.celebratesmartly.com/wedding/free-wedding-speech",
            "applicationCategory": "Wedding Planning Tool",
            "operatingSystem": "Web Browser",
            "keywords": "wedding speech generator, AI wedding speech, best man speech generator, maid of honor speech, father of bride speech, mother of groom speech, wedding toast generator, free wedding speech, personalized wedding speech, wedding speech templates, heartfelt wedding speech, funny wedding speech, traditional wedding speech, wedding speech writer, wedding speech ideas, wedding party speech, wedding ceremony speech, wedding reception speech, wedding speech help, wedding speech examples",
            "featureList": [
              "Personalized Content for Different Speakers",
              "Multiple Speech Tones (Heartfelt, Funny, Cute, Witty, Traditional, Poem)",
              "Role-Specific Speech Generation",
              "Copy and Download Functionality",
              "Professional Quality Output",
              "Free to Use"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free AI-powered wedding speech generator"
            },
            "creator": {
              "@type": "Organization",
              "name": "celebrate Smartly"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.celebratesmartly.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Browse Events",
                  "item": "https://www.celebratesmartly.com/browse-events"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Wedding Planning",
                  "item": "https://www.celebratesmartly.com/wedding"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Wedding Speech Generator",
                  "item": "https://www.celebratesmartly.com/wedding/free-wedding-speech"
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link to="/wedding">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Wedding Planning
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                <h1 className="text-xl font-semibold text-gray-900">Free Wedding Speech Generator</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Free AI-Powered Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Write a Heartfelt Wedding Speech Effortlessly
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create personalized, memorable wedding speeches with our AI-powered generator. 
              Perfect for Best Man, Maid of Honor, parents, and wedding party members.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Speech Details
                </CardTitle>
                <CardDescription>
                  Tell us about the speech you want to create
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="speechFor">Who are you crafting the wedding speech for?</Label>
                  <Input
                    id="speechFor"
                    placeholder="e.g., My best friend's wedding"
                    value={formData.speechFor}
                    onChange={(e) => handleInputChange('speechFor', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="name">What is your name?</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="role">What is your role in the wedding?</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tone">What is your desired tone for the speech?</Label>
                  <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groomName">Groom's name</Label>
                    <Input
                      id="groomName"
                      placeholder="Groom's name"
                      value={formData.groomName}
                      onChange={(e) => handleInputChange('groomName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brideName">Bride's name</Label>
                    <Input
                      id="brideName"
                      placeholder="Bride's name"
                      value={formData.brideName}
                      onChange={(e) => handleInputChange('brideName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  onClick={generateSpeech} 
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Speech...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate My Speech
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Speech */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Your Generated Speech
                </CardTitle>
                <CardDescription>
                  Your personalized wedding speech will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedSpeech ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-serif leading-relaxed">
                        {generatedSpeech}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button onClick={downloadSpeech} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Fill out the form and click "Generate My Speech" to create your personalized wedding speech</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Why Choose Our Wedding Speech Generator?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Content</h3>
                <p className="text-gray-600 text-sm">Every speech is tailored to your specific role, relationship, and the couple's names</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multiple Tones</h3>
                <p className="text-gray-600 text-sm">Choose from heartfelt, funny, cute, witty, traditional, or poetic styles</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Copy className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
                <p className="text-gray-600 text-sm">Copy, download, or print your speech instantly. No registration required</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
