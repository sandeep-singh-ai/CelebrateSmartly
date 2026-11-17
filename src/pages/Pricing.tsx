import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap, Calendar, Users, Mail, Palette, BarChart3, Shield, Zap as ZapIcon, Heart, MapPin, Gift, Camera, MessageSquare, Settings } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with event planning",
      maxEvents: 1,
      maxRSVPs: 10,
      features: [
        "Create 1 event",
        "Up to 10 RSVPs per event",
        "Basic AI theme generation",
        "Email invitations",
        "Basic RSVP tracking",
        "Guest list management",
        "Event details & date management",
        "Community support"
      ],
      icon: <Star className="w-6 h-6" />,
      buttonText: "Get Started Free",
      popular: false,
      color: "from-gray-400 to-gray-600"
    },
    {
      name: "Silver",
      price: "$4.99",
      period: "per month",
      description: "Great for regular event planners",
      maxEvents: 5,
      maxRSVPs: 50,
      features: [
        "Create up to 5 events",
        "Up to 50 RSVPs per event",
        "Enhanced AI theme customization",
        "Priority email support",
        "Advanced RSVP analytics",
        "Custom event branding",
        "Vendor recommendations",
        "Event templates",
        "Guest categorization",
        "Reminder notifications"
      ],
      icon: <Crown className="w-6 h-6" />,
      buttonText: "Start Silver Plan",
      popular: true,
      color: "from-pink-500 to-purple-500"
    },
    {
      name: "Gold",
      price: "$15.99",
      period: "per month",
      description: "For professional event planners and businesses",
      maxEvents: 500,
      maxRSVPs: "Unlimited",
      features: [
        "Unlimited events",
        "Unlimited RSVPs per event",
        "Premium AI themes & customization",
        "Advanced analytics & reporting",
        "White-label branding",
        "Priority support",
        "Custom integrations",
        "Team collaboration",
        "API access",
        "Advanced security features",
        "Custom workflows",
        "Dedicated account manager"
      ],
      icon: <Zap className="w-6 h-6" />,
      buttonText: "Start Gold Plan",
      popular: false,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const websiteFeatures = [
    {
      category: "Event Planning",
      features: [
        { name: "AI-Powered Theme Generation", description: "Get unique, personalized event themes based on your preferences", icon: <Palette className="w-5 h-5" /> },
        { name: "Event Creation & Management", description: "Create detailed events with dates, locations, and descriptions", icon: <Calendar className="w-5 h-5" /> },
        { name: "Guest List Management", description: "Organize and manage your guest lists efficiently", icon: <Users className="w-5 h-5" /> },
        { name: "RSVP System", description: "Track responses with automated email invitations", icon: <Mail className="w-5 h-5" /> }
      ]
    },
    {
      category: "Vendor Discovery",
      features: [
        { name: "Local Vendor Search", description: "Find vendors in your area for any event type", icon: <MapPin className="w-5 h-5" /> },
        { name: "Premium Vendor Listings", description: "Access to verified, high-quality vendors", icon: <Crown className="w-5 h-5" /> },
        { name: "Vendor Reviews & Ratings", description: "Make informed decisions with community reviews", icon: <Star className="w-5 h-5" /> },
        { name: "Vendor Categories", description: "Browse vendors by category (catering, photography, etc.)", icon: <Gift className="w-5 h-5" /> }
      ]
    },
    {
      category: "Communication & Analytics",
      features: [
        { name: "Email Invitations", description: "Send beautiful, branded invitations to your guests", icon: <Mail className="w-5 h-5" /> },
        { name: "RSVP Tracking", description: "Monitor responses and manage guest lists in real-time", icon: <BarChart3 className="w-5 h-5" /> },
        { name: "Guest Messages", description: "Allow guests to leave messages with their RSVPs", icon: <MessageSquare className="w-5 h-5" /> },
        { name: "Analytics Dashboard", description: "Track event performance and guest engagement", icon: <BarChart3 className="w-5 h-5" /> }
      ]
    },
    {
      category: "Security & Support",
      features: [
        { name: "SSL Security", description: "Your data is protected with enterprise-grade security", icon: <Shield className="w-5 h-5" /> },
        { name: "24/7 Support", description: "Get help whenever you need it", icon: <MessageSquare className="w-5 h-5" /> },
        { name: "Mobile Responsive", description: "Access your events from any device", icon: <ZapIcon className="w-5 h-5" /> },
        { name: "Data Backup", description: "Your event data is automatically backed up", icon: <Shield className="w-5 h-5" /> }
      ]
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Pricing Plans | CelebrateSmartly Event Planning Platform</title>
        <meta 
          name="description" 
          content="Choose the perfect plan for your event planning needs. Free forever plan available with unlimited features. Premium plans for professional event organizers." 
        />
        <meta name="keywords" content="event planning pricing, free event planner, premium event plans, celebration platform costs, RSVP management pricing" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Pricing Plans | CelebrateSmartly Event Planning Platform" />
        <meta property="og:description" content="Free forever plan available with unlimited features for event planning and vendor connections" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/pricing`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="CelebrateSmartly Pricing" />
        <meta name="twitter:description" content="Free forever plan with unlimited event planning features" />
        
        <link rel="canonical" href={`${window.location.origin}/pricing`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're planning your first event or managing hundreds, we have the perfect plan for you. 
              Discover all the features that make CelebrateSmartly the ultimate event planning platform.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-purple-500 shadow-2xl scale-105' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`mx-auto p-4 rounded-full bg-gradient-to-r ${plan.color} w-16 h-16 flex items-center justify-center mb-4`}>
                    <div className="text-white">
                      {plan.icon}
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Events:</span>
                      <span className="font-semibold">{plan.maxEvents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">RSVPs per event:</span>
                      <span className="font-semibold">{plan.maxRSVPs}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Website Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Complete Event Planning Platform</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                CelebrateSmartly provides everything you need to plan, organize, and execute perfect events. 
                Here's what you get with every plan:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {websiteFeatures.map((category, index) => (
                <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                            <div className="text-pink-600">
                              {feature.icon}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">{feature.name}</h4>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose CelebrateSmartly?</h2>
              <p className="text-lg text-gray-600">
                Join thousands of event planners who trust us to make their celebrations extraordinary
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Planning</h3>
                <p className="text-gray-600">Get personalized event themes and recommendations powered by advanced AI</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Vendor Network</h3>
                <p className="text-gray-600">Connect with verified local vendors to bring your vision to life</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Seamless Experience</h3>
                <p className="text-gray-600">From planning to execution, everything you need in one platform</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h4>
                  <p className="text-gray-600 text-sm">Yes! You can change your plan at any time. Changes take effect immediately.</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">What happens to my data if I cancel?</h4>
                  <p className="text-gray-600 text-sm">Your data is safe! You can access it for 30 days after cancellation.</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
                  <p className="text-gray-600 text-sm">We offer a 30-day money-back guarantee for all paid plans.</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Is my payment information secure?</h4>
                  <p className="text-gray-600 text-sm">Absolutely! We use industry-standard encryption and secure payment processing.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <Card className="border-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white max-w-2xl mx-auto">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Planning?</h3>
                <p className="text-pink-100 mb-6">
                  Join thousands of event planners who trust CelebrateSmartly to create unforgettable celebrations.
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
