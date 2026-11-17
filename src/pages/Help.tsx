import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  MapPin, 
  Palette, 
  Mail,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

export default function Help() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Help Center - CelebrateSmartly",
    "description": "Complete guide to using CelebrateSmartly's free event planning platform",
    "url": "https://celebratesmartly.com/help",
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is CelebrateSmartly?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CelebrateSmartly is a completely free event planning platform that helps you create memorable events with AI-powered tools, RSVP management, and local vendor discovery."
          }
        }
      ]
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Help Center - Complete Guide to Event Planning | CelebrateSmartly</title>
        <meta name="description" content="Learn how to use CelebrateSmartly's free event planning tools. Complete guides for creating events, managing RSVPs, finding vendors, and building event websites." />
        <meta name="keywords" content="help, guide, event planning, RSVP management, vendor discovery, website builder, tutorial, CelebrateSmartly" />
        <link rel="canonical" href="https://celebratesmartly.com/help" />
        <meta property="og:title" content="Help Center - Event Planning Made Easy | CelebrateSmartly" />
        <meta property="og:description" content="Complete step-by-step guides for planning perfect events with our free platform. Learn RSVP management, vendor discovery, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://celebratesmartly.com/help" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CelebrateSmartly Help Center" />
        <meta name="twitter:description" content="Step-by-step guides for creating amazing events with our free planning tools." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about using CelebrateSmartly's free event planning platform. 
              From creating your first event to managing RSVPs and finding perfect vendors.
            </p>
          </div>

          {/* What is CelebrateSmartly */}
          <section className="mb-16">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Star className="w-6 h-6 text-primary" />
                  What is CelebrateSmartly?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      CelebrateSmartly is a completely <strong>free event planning platform</strong> designed to make 
                      every celebration extraordinary. We combine AI-powered tools with local vendor discovery 
                      to help you create memorable events without the stress or high costs.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Completely free during our beta phase</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>AI-powered event themes and suggestions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Unlimited events and RSVPs</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Local vendor discovery and connection</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Why Choose CelebrateSmartly?</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Save time with AI-powered planning</li>
                      <li>• Connect with trusted local vendors</li>
                      <li>• Manage RSVPs effortlessly</li>
                      <li>• Create beautiful event websites</li>
                      <li>• Track everything in one dashboard</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Core Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Core Features & How to Use Them</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Event Creation */}
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Event Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create stunning events with AI-powered themes and suggestions tailored to your vision.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Click "Create Event" from dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Fill in basic event details</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Let AI generate theme suggestions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Customize and save your event</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* RSVP Management */}
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">RSVP Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Effortlessly manage guest lists and track responses with automated invitation sending.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Create and organize guest lists</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Send personalized invitations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Track responses in real-time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Send automated reminders</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Discovery */}
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Vendor Discovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Find and connect with trusted local vendors for catering, photography, venues, and more.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Search by location and category</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>View ratings and reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Contact vendors directly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Save favorites for later</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Website Builder */}
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Website Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create beautiful, personalized event websites that match your theme and style.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Choose from AI-generated themes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Customize colors and layouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Add your own content and images</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Share with guests instantly</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dashboard Analytics */}
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Dashboard & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Monitor all your events from one central dashboard with real-time insights.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>View all events at a glance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Track RSVP statistics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Monitor guest engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Access quick actions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Privacy */}
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Security & Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Your data is secure with enterprise-grade encryption and privacy protection.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>End-to-end data encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>GDPR compliant data handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>Secure guest information storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span>No data sharing with third parties</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Step-by-Step Guides */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Step-by-Step Guides</h2>
            <div className="max-w-4xl mx-auto space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-primary" />
                    Getting Started: Your First Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <h4 className="font-semibold">Create Your Account</h4>
                          <p className="text-sm text-muted-foreground">Sign up for free using your email or social login</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <h4 className="font-semibold">Start Creating</h4>
                          <p className="text-sm text-muted-foreground">Click "Create Event" and fill in basic details</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <h4 className="font-semibold">Choose AI Themes</h4>
                          <p className="text-sm text-muted-foreground">Let our AI suggest perfect themes for your event</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                        <div>
                          <h4 className="font-semibold">Add Guests</h4>
                          <p className="text-sm text-muted-foreground">Create guest lists and manage invitations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">5</div>
                        <div>
                          <h4 className="font-semibold">Find Vendors</h4>
                          <p className="text-sm text-muted-foreground">Discover local vendors for your event needs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">6</div>
                        <div>
                          <h4 className="font-semibold">Launch & Monitor</h4>
                          <p className="text-sm text-muted-foreground">Send invitations and track responses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tips & Best Practices */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Tips & Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Event Planning Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Start planning at least 4-6 weeks in advance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Use AI theme suggestions as starting points</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Create detailed guest categories for better organization</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Send save-the-dates 6-8 weeks before the event</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>RSVP Management Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Set clear RSVP deadlines (1-2 weeks before event)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Send gentle reminders to non-responders</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Include dietary restriction questions for food events</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Use the guest messaging feature for updates</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Need More Help */}
          <section className="text-center">
            <Card className="max-w-2xl mx-auto p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Our support team is here to help you create amazing events. 
                We're committed to making your experience as smooth as possible during our beta phase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/faq">Browse FAQ</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                <strong>Beta Note:</strong> We're actively improving the platform based on user feedback. 
                Your suggestions help us build a better experience for everyone!
              </p>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
}