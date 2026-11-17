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
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Sparkles, ArrowLeft, Copy, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GenerateFreePersonalizedVows() {
  const [formData, setFormData] = useState({
    name: '',
    partnerName: '',
    role: '',
    howWeMet: '',
    loveAppreciate: [] as string[],
    specialMoments: '',
    tone: '',
    additionalThoughts: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVows, setGeneratedVows] = useState('');
  const [error, setError] = useState('');

  const loveAppreciateOptions = [
    'Affection and Care',
    'Sense of Humor',
    'Handsomeness and Charm',
    'Dependability',
    'Patience',
    'Thoughtfulness',
    'Loyalty',
    'Kindness',
    'Chivalrous Nature'
  ];

  const tones = [
    'Heartfelt',
    'Traditional',
    'Cute',
    'Romantic',
    'Funny',
    'Poem'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleLoveAppreciateChange = (option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      loveAppreciate: checked 
        ? [...prev.loveAppreciate, option]
        : prev.loveAppreciate.filter(item => item !== option)
    }));
  };

  const generateVows = async () => {
    if (!formData.name || !formData.partnerName || !formData.role || !formData.tone || formData.loveAppreciate.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Mock API call - replace with actual OpenAI integration
      const prompt = `Write personalized wedding vows for ${formData.name} (${formData.role}) to ${formData.partnerName}. 
      
      Details:
      - Speaker: ${formData.name}
      - Partner: ${formData.partnerName}
      - Role: ${formData.role}
      - Tone: ${formData.tone}
      - What they love most: ${formData.loveAppreciate.join(', ')}
      ${formData.howWeMet ? `- How they met: ${formData.howWeMet}` : ''}
      ${formData.specialMoments ? `- Special moments: ${formData.specialMoments}` : ''}
      ${formData.additionalThoughts ? `- Additional thoughts: ${formData.additionalThoughts}` : ''}
      
      Make the vows personal, heartfelt, and unique. They should sound handwritten and authentic. Include specific details about their relationship and what makes their love special.`;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - replace with actual OpenAI API call
      const howWeMetText = formData.howWeMet ? `I will never forget ${formData.howWeMet}. That moment changed everything for me, and I knew I had found my person.` : 'Every day with you has been a gift, and I am grateful for the love we share.';
      const specialMomentsText = formData.specialMoments ? `One of my favorite memories is ${formData.specialMoments}. It's moments like these that remind me why I fell in love with you.` : 'The little moments we share - your laugh, your smile, the way you look at me - these are the things that make my heart full.';
      const howWeMetRomantic = formData.howWeMet ? `When ${formData.howWeMet}, I felt my world shift. I knew that my life would never be the same, and I was right - it became infinitely better.` : 'Every day with you feels like a dream come true.';
      const specialMomentsRomantic = formData.specialMoments ? `I will treasure ${formData.specialMoments} forever. It's these precious moments that remind me of the depth of our love.` : 'The way you look at me, the way you hold my hand, the way you make me laugh - these are the things that make my heart skip a beat.';
      const howWeMetFunny = formData.howWeMet ? `Remember when ${formData.howWeMet}? I knew then that you were either the best thing that ever happened to me or the worst mistake I'd ever make. Turns out, you're the best thing!` : 'I still can\'t believe you said yes when I asked you out. I mean, have you seen me?';
      const specialMomentsFunny = formData.specialMoments ? `One of my favorite memories is ${formData.specialMoments}. It's moments like these that remind me why I love you so much.` : 'The way you snore, the way you leave your clothes everywhere, the way you eat cereal at midnight - these are the things that make you uniquely you, and I love every single one of them.';
      const howWeMetPoem = formData.howWeMet ? `When ${formData.howWeMet}, my world was set free,\nI knew in that moment, you were meant for me.` : 'From the first moment I saw you, I knew,\nThat my heart had found its home in you.';
      const specialMomentsPoem = formData.specialMoments ? `${formData.specialMoments} - a memory so dear,\nA moment I'll treasure year after year.` : 'Every day with you is a gift so rare,\nFilled with love beyond compare.';
      const howWeMetDefault = formData.howWeMet ? `${formData.howWeMet} - that moment changed everything for me. I knew I had found my person.` : 'Every day with you is a blessing, and I am grateful for the love we share.';
      const specialMomentsDefault = formData.specialMoments ? `I will always treasure ${formData.specialMoments}. These are the moments that make our love story special.` : 'The little things you do, the way you make me feel, the love you show me every day - these are the things that make my heart full.';

      const mockVows = `My dearest ${formData.partnerName},

${formData.tone === 'Heartfelt' ? 
`From the moment I first saw you, I knew my life would never be the same. Today, as I stand here before our family and friends, I want to tell you what you mean to me.

I love you for your ${formData.loveAppreciate[0].toLowerCase()}, your ${formData.loveAppreciate[1]?.toLowerCase() || 'incredible spirit'}, and your ${formData.loveAppreciate[2]?.toLowerCase() || 'amazing heart'}. You have shown me what it means to love unconditionally and to be loved in return.

${howWeMetText}

${specialMomentsText}

I promise to love you through all of life's adventures, to support your dreams, to be your partner in everything, and to choose you every single day. I promise to be patient, kind, and understanding. I promise to grow with you, to learn with you, and to build a beautiful life together.

You are my best friend, my greatest love, and my forever. I can't wait to spend the rest of my life making you happy.

With all my love,
${formData.name}` :

formData.tone === 'Traditional' ?
`I, ${formData.name}, take you, ${formData.partnerName}, to be my lawfully wedded ${formData.role === 'Bride' ? 'husband' : 'wife'}, to have and to hold from this day forward, for better, for worse, for richer, for poorer, in sickness and in health, to love and to cherish, till death do us part.

I promise to honor and respect you, to support you in all your endeavors, and to be faithful to you in all things. I will love you with all my heart, and I will work every day to be the partner you deserve.

You are my ${formData.loveAppreciate[0].toLowerCase()}, my ${formData.loveAppreciate[1]?.toLowerCase() || 'strength'}, and my ${formData.loveAppreciate[2]?.toLowerCase() || 'joy'}. I am blessed to call you mine.

This is my solemn vow to you, today and always.

${formData.name}` :

formData.tone === 'Romantic' ?
`My beloved ${formData.partnerName},

You are the love of my life, my heart's desire, and my soul's perfect match. From the first moment I saw you, I knew that you were the one I had been waiting for all my life.

I love you for your ${formData.loveAppreciate[0].toLowerCase()}, your ${formData.loveAppreciate[1]?.toLowerCase() || 'beautiful soul'}, and your ${formData.loveAppreciate[2]?.toLowerCase() || 'incredible heart'}. You make me a better person just by being in my life.

${howWeMetRomantic}

${specialMomentsRomantic}

I promise to love you with every fiber of my being, to cherish you above all others, and to be your partner in all of life's beautiful moments. I promise to grow old with you, to create countless memories together, and to love you more each day than I did the day before.

You are my everything, my forever, and my always. I love you more than words can express.

Forever yours,
${formData.name}` :

formData.tone === 'Funny' ?
`Hey ${formData.partnerName},

So, here we are! I never thought I'd be standing here, in front of all these people, promising to put up with you for the rest of my life. But here I am, and honestly, I couldn't be happier about it.

I love you for your ${formData.loveAppreciate[0].toLowerCase()}, your ${formData.loveAppreciate[1]?.toLowerCase() || 'terrible jokes'}, and your ${formData.loveAppreciate[2]?.toLowerCase() || 'amazing ability to make me laugh'}. You're the only person who can make me smile even when I'm trying to be mad at you.

${howWeMetFunny}

${specialMomentsFunny}

I promise to love you even when you're being ridiculous, to laugh at your jokes even when they're not funny, and to be your partner in crime for all of life's adventures. I promise to grow old and grumpy with you, to create a lifetime of inside jokes, and to love you more each day.

You're my best friend, my favorite person, and the love of my life. Here's to forever, babe!

With all my love and a little bit of sarcasm,
${formData.name}` :

formData.tone === 'Poem' ?
`My dearest ${formData.partnerName}, my heart's true light,
You are my love, my joy, my everything bright.

I love your ${formData.loveAppreciate[0].toLowerCase()}, so pure and true,
Your ${formData.loveAppreciate[1]?.toLowerCase() || 'gentle spirit'} in everything you do.

${howWeMetPoem}

${specialMomentsPoem}

I promise to love you through all of life's seasons,
To be your partner for all the right reasons.
Through laughter and tears, through joy and through pain,
I'll love you forever, again and again.

You are my heart, my soul, my everything,
The love of my life, my eternal spring.
With this ring, I give you my heart,
And promise we'll never be apart.

Forever and always, my love,
${formData.name}` :

`My beloved ${formData.partnerName},

Today I stand before you, ready to make the most important promise of my life. I promise to love you, honor you, and cherish you for all the days of my life.

I love you for your ${formData.loveAppreciate[0].toLowerCase()}, your ${formData.loveAppreciate[1]?.toLowerCase() || 'beautiful heart'}, and your ${formData.loveAppreciate[2]?.toLowerCase() || 'amazing spirit'}. You are everything I never knew I needed and everything I always wanted.

${howWeMetDefault}

${specialMomentsDefault}

I promise to be your partner in all things, to support your dreams, to grow with you, and to love you more each day. I promise to be patient, kind, and understanding. I promise to build a beautiful life with you, filled with love, laughter, and countless memories.

You are my best friend, my greatest love, and my forever. I can't wait to spend the rest of my life with you.

With all my love,
${formData.name}`}

${formData.additionalThoughts ? `

P.S. ${formData.additionalThoughts}` : ''}`;

      setGeneratedVows(mockVows);
    } catch (err) {
      setError('Failed to generate vows. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedVows);
  };

  const downloadVows = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedVows], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `wedding-vows-${formData.name}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <Helmet>
        <title>Free Wedding Vows Generator - Create Personalized Wedding Vows | celebrate Smartly</title>
        <meta name="description" content="Create heartfelt, personalized wedding vows instantly with our free AI wedding vows generator. Perfect for brides and grooms. Multiple tones, personalized content, and professional quality vows." />
        <meta name="keywords" content="wedding vows generator, AI wedding vows, personalized wedding vows, free wedding vows, wedding vows writer, heartfelt wedding vows, traditional wedding vows, romantic wedding vows, funny wedding vows, wedding vows examples, wedding vows templates, custom wedding vows, wedding ceremony vows, wedding vows help" />
        <meta property="og:title" content="Free Wedding Vows Generator - Create Personalized Wedding Vows" />
        <meta property="og:description" content="Create heartfelt, personalized wedding vows instantly with our free AI wedding vows generator. Perfect for brides and grooms." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.celebratesmartly.com/wedding/generate-free-personalized-vows" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Wedding Vows Generator - Create Personalized Wedding Vows" />
        <meta name="twitter:description" content="Create heartfelt, personalized wedding vows instantly with our free AI wedding vows generator. Perfect for brides and grooms." />
        <link rel="canonical" href="https://www.celebratesmartly.com/wedding/generate-free-personalized-vows" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Wedding Vows Generator - Create Personalized Wedding Vows",
            "description": "Create heartfelt, personalized wedding vows instantly with our free AI wedding vows generator. Perfect for brides and grooms. Multiple tones, personalized content, and professional quality vows.",
            "url": "https://www.celebratesmartly.com/wedding/generate-free-personalized-vows",
            "applicationCategory": "Wedding Planning Tool",
            "operatingSystem": "Web Browser",
            "keywords": "wedding vows generator, AI wedding vows, personalized wedding vows, free wedding vows, wedding vows writer, heartfelt wedding vows, traditional wedding vows, romantic wedding vows, funny wedding vows, wedding vows examples, wedding vows templates, custom wedding vows, wedding ceremony vows, wedding vows help",
            "featureList": [
              "Personalized Content for Bride and Groom",
              "Multiple Vow Tones (Heartfelt, Traditional, Cute, Romantic, Funny, Poem)",
              "Customizable Love Appreciation Options",
              "Special Moments Integration",
              "Copy and Download Functionality",
              "Professional Quality Output",
              "Free to Use"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free AI-powered wedding vows generator"
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
                  "name": "Wedding Vows Generator",
                  "item": "https://www.celebratesmartly.com/wedding/generate-free-personalized-vows"
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
                <h1 className="text-xl font-semibold text-gray-900">Free Wedding Vows Generator</h1>
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
              Generate Free Personalized Vows
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create heartfelt, personalized wedding vows that capture your unique love story. 
              Perfect for brides and grooms who want to express their love in their own words.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Vow Details
                </CardTitle>
                <CardDescription>
                  Tell us about your love story and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">What is your name? *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerName">What is your partner's name? *</Label>
                    <Input
                      id="partnerName"
                      placeholder="Partner's name"
                      value={formData.partnerName}
                      onChange={(e) => handleInputChange('partnerName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Are you the bride or groom? *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bride">Bride</SelectItem>
                      <SelectItem value="Groom">Groom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="howWeMet">When, where, and how did you first meet your partner?</Label>
                  <Textarea
                    id="howWeMet"
                    placeholder="Tell us your love story..."
                    value={formData.howWeMet}
                    onChange={(e) => handleInputChange('howWeMet', e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>What do you love and appreciate most about your partner? * (Select up to 3)</Label>
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    {loveAppreciateOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={formData.loveAppreciate.includes(option)}
                          onCheckedChange={(checked) => handleLoveAppreciateChange(option, checked as boolean)}
                          disabled={!formData.loveAppreciate.includes(option) && formData.loveAppreciate.length >= 3}
                        />
                        <Label htmlFor={option} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.loveAppreciate.length}/3 selected
                  </p>
                </div>

                <div>
                  <Label htmlFor="specialMoments">Are there any special moments or times?</Label>
                  <Textarea
                    id="specialMoments"
                    placeholder="Share your special memories..."
                    value={formData.specialMoments}
                    onChange={(e) => handleInputChange('specialMoments', e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tone">What is the preferred tone for sharing your vows? *</Label>
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

                <div>
                  <Label htmlFor="additionalThoughts">Do you have any additional thoughts that you want to share?</Label>
                  <Textarea
                    id="additionalThoughts"
                    placeholder="Any other thoughts or feelings you'd like to include..."
                    value={formData.additionalThoughts}
                    onChange={(e) => handleInputChange('additionalThoughts', e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  onClick={generateVows} 
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Vows...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate My Vows
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Vows */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Your Generated Vows
                </CardTitle>
                <CardDescription>
                  Your personalized wedding vows will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedVows ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-serif leading-relaxed">
                        {generatedVows}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button onClick={downloadVows} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Fill out the form and click "Generate My Vows" to create your personalized wedding vows</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Why Choose Our Wedding Vows Generator?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Content</h3>
                <p className="text-gray-600 text-sm">Every vow is tailored to your specific relationship, love story, and preferences</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multiple Tones</h3>
                <p className="text-gray-600 text-sm">Choose from heartfelt, traditional, cute, romantic, funny, or poetic styles</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Copy className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
                <p className="text-gray-600 text-sm">Copy, download, or print your vows instantly. No registration required</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
