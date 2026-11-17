import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Calendar, 
  Users, 
  Camera, 
  Music, 
  Utensils, 
  Gift, 
  MapPin, 
  Sparkles, 
  CheckCircle, 
  Star,
  ArrowRight,
  Clock,
  DollarSign,
  Palette,
  Flower2,
  Crown,
  Circle,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wedding() {
  const weddingFeatures = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "AI Wedding Timeline",
      description: "Get a personalized wedding timeline with detailed tasks and deadlines powered by ChatGPT",
      color: "bg-blue-500",
      features: ["6-12 month planning timeline", "Task prioritization", "Deadline reminders", "Vendor coordination"]
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Budget Planning",
      description: "Smart budget allocation and cost tracking for every aspect of your wedding",
      color: "bg-green-500",
      features: ["Budget breakdown by category", "Cost optimization tips", "Vendor price comparison", "Expense tracking"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Guest Management",
      description: "Effortlessly manage your guest list with RSVP tracking and seating arrangements",
      color: "bg-purple-500",
      features: ["Guest list organization", "RSVP management", "Seating arrangements", "Dietary preferences"]
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Invitation Design",
      description: "Create stunning, personalized wedding invitations with AI-generated content",
      color: "bg-pink-500",
      features: ["Custom invitation designs", "AI-generated content", "Multiple formats", "Print-ready files"]
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: "Music Curation",
      description: "Perfect playlist creation for ceremony, cocktail hour, and reception",
      color: "bg-orange-500",
      features: ["Ceremony music", "Cocktail hour playlist", "Reception dance music", "Special moments songs"]
    },
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Menu Planning",
      description: "Expert menu planning with dietary accommodations and seasonal recommendations",
      color: "bg-red-500",
      features: ["Wedding menu design", "Dietary accommodations", "Seasonal recommendations", "Catering coordination"]
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Photo Planning",
      description: "Plan your perfect wedding photos with shot lists and timeline coordination",
      color: "bg-indigo-500",
      features: ["Photo shot lists", "Timeline coordination", "Pose suggestions", "Location planning"]
    },
    {
      icon: <Flower2 className="h-8 w-8" />,
      title: "Theme & Decor",
      description: "Bring your wedding vision to life with AI-powered theme and decoration suggestions",
      color: "bg-rose-500",
      features: ["Theme development", "Color palette selection", "Decor ideas", "Vendor recommendations"]
    }
  ];

  const planningSteps = [
    {
      step: "1",
      title: "Tell Us About Your Vision",
      description: "Share your wedding details, preferences, and special requirements",
      icon: <Heart className="h-6 w-6" />
    },
    {
      step: "2", 
      title: "AI Creates Your Plan",
      description: "Our ChatGPT-powered system generates a comprehensive wedding plan",
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      step: "3",
      title: "Customize & Refine",
      description: "Review and customize your plan with our easy-to-use tools",
      icon: <Palette className="h-6 w-6" />
    },
    {
      step: "4",
      title: "Execute Your Perfect Day",
      description: "Follow your personalized timeline and enjoy your dream wedding",
      icon: <Zap className="h-6 w-6" />
    }
  ];

  const testimonials = [
    {
      name: "Sarah & Michael",
      location: "New York, NY",
      text: "The AI wedding planner saved us months of stress! It created the perfect timeline and helped us stay organized throughout our entire planning process.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Emily & David",
      location: "Los Angeles, CA", 
      text: "The budget planning feature was incredible. We stayed within our budget and still had everything we wanted for our special day.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Jessica & Ryan",
      location: "Chicago, IL",
      text: "The guest management system made RSVPs so easy, and the seating arrangement tool was a lifesaver for our 200-guest wedding.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const weddingStats = [
    { number: "10,000+", label: "Weddings Planned" },
    { number: "98%", label: "Couple Satisfaction" },
    { number: "6 Months", label: "Average Planning Time" },
    { number: "24/7", label: "AI Support Available" }
  ];

  return (
    <Layout>
      <Helmet>
        <title>AI Wedding Planner - Complete Wedding Planning Tools & Resources | Wise Event Sphere</title>
        <meta name="description" content="Plan your perfect wedding with our comprehensive AI-powered wedding planning suite. Get personalized timelines, budget breakdowns, guest management, vendor recommendations, speech generators, vow creators, and 12+ specialized wedding tools." />
        <meta name="keywords" content="wedding planner, AI wedding planning, wedding timeline generator, wedding budget planner, guest management system, wedding invitations, wedding speech generator, wedding vows creator, wedding theme designer, wedding gift finder, wedding hashtag generator, wedding dress design, wedding cake designer, bridesmaid dress ideas, thank you card designer, wedding caption generator, wedding monogram creator, wedding music curator, wedding menu planner, wedding vendor finder, free wedding planning tools, personalized wedding recommendations" />
        <meta property="og:title" content="AI Wedding Planner - Complete Wedding Planning Tools & Resources" />
        <meta property="og:description" content="Plan your perfect wedding with our comprehensive AI-powered wedding planning suite. Get personalized timelines, budget breakdowns, and 12+ specialized wedding tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wiseeventsphere.com/wedding" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Wedding Planner - Complete Wedding Planning Tools & Resources" />
        <meta name="twitter:description" content="Plan your perfect wedding with our comprehensive AI-powered wedding planning suite. Get personalized timelines, budget breakdowns, and 12+ specialized wedding tools." />
        <link rel="canonical" href="https://wiseeventsphere.com/wedding" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI Wedding Planner - Complete Wedding Planning Tools & Resources",
            "description": "Plan your perfect wedding with our comprehensive AI-powered wedding planning suite. Get personalized timelines, budget breakdowns, guest management, vendor recommendations, speech generators, vow creators, and 12+ specialized wedding tools.",
            "url": "https://wiseeventsphere.com/wedding",
            "applicationCategory": "Wedding Planning",
            "operatingSystem": "Web Browser",
            "keywords": "wedding planner, AI wedding planning, wedding timeline generator, wedding budget planner, guest management system, wedding invitations, wedding speech generator, wedding vows creator, wedding theme designer, wedding gift finder, wedding hashtag generator, wedding dress design, wedding cake designer, bridesmaid dress ideas, thank you card designer, wedding caption generator, wedding monogram creator, wedding music curator, wedding menu planner, wedding vendor finder, free wedding planning tools, personalized wedding recommendations",
            "featureList": [
              "Wedding Speech Generator",
              "Wedding Vows Creator", 
              "Wedding Theme Designer",
              "Wedding Gift Finder",
              "Wedding Hashtag Generator",
              "Wedding Invitation Designer",
              "Wedding Dress Design Ideas",
              "Wedding Cake Design Generator",
              "Bridesmaid Dress Ideas",
              "Thank You Card Designer",
              "Wedding Caption Generator",
              "Wedding Monogram Creator"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free AI-powered wedding planning tools"
            },
            "creator": {
              "@type": "Organization",
              "name": "Wise Event Sphere"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://wiseeventsphere.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Browse Events",
                  "item": "https://wiseeventsphere.com/browse-events"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Wedding Planning",
                  "item": "https://wiseeventsphere.com/wedding"
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100">
          <div className="absolute inset-0 bg-white/50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/80 rounded-full backdrop-blur-sm shadow-lg">
                  <Heart className="h-16 w-16 text-rose-500" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Plan Your Perfect
                <span className="block bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                  Wedding
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                Let our AI-powered wedding planner create the perfect plan for your special day. 
                From timeline to budget, guest management to vendor recommendations - we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/tools/event-planner">
                  <Button size="lg" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-8 py-4 text-lg">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Planning Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-rose-500 text-rose-600 hover:bg-rose-50 px-8 py-4 text-lg">
                  <Camera className="mr-2 h-5 w-5" />
                  View Gallery
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {weddingStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-rose-600 mb-2">{stat.number}</div>
                    <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our AI Wedding Planner Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Planning your wedding has never been easier. Our AI-powered system creates a comprehensive, 
                personalized plan tailored to your unique vision and budget.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {planningSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for Your Perfect Wedding</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive suite of AI-powered tools covers every aspect of wedding planning, 
                from the initial vision to the final celebration.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {weddingFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader className="text-center pb-4">
                    <div className={`p-4 rounded-2xl ${feature.color} text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-rose-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* AI Planning Tools for Wedding */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Planning Tools for Wedding</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our specialized AI-powered tools designed specifically for wedding planning. 
                From speeches to dress designs, we have everything you need to make your day perfect.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Wedding Speech */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Crown className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    Wedding Speech
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    AI-generated wedding speeches for bride, groom, and wedding party
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Personalized content
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Multiple speech types
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Tone customization
                    </li>
                  </ul>
                  <Link to="/wedding/free-wedding-speech">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-sm py-2">
                      Try for Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Wedding Vows */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
                    Wedding Vows
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Create heartfelt, personalized wedding vows with AI assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Personalized vows
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Multiple styles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Length options
                    </li>
                  </ul>
                  <Link to="/wedding/generate-free-personalized-vows">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium text-sm py-2">
                      Try for Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Wedding Themes */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Palette className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-rose-600 transition-colors">
                    Wedding Themes
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Explore and customize beautiful wedding themes and color palettes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Theme suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Color palettes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Decor ideas
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>

              {/* Wedding Gift Finder */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Gift className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-green-600 transition-colors">
                    Wedding Gift Finder
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Find the perfect wedding gifts for couples and wedding party
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Gift suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Price ranges
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Registry integration
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>

              {/* Wedding Hashtag Generator */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-orange-600 transition-colors">
                    Wedding Hashtag Generator
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Create unique and memorable wedding hashtags for social media
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Unique hashtags
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Social media ready
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Multiple options
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>

              {/* Wedding Invitation Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Gift className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-pink-600 transition-colors">
                    Wedding Invitation Card
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Design beautiful, personalized wedding invitation cards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Custom designs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Print ready
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Multiple formats
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>

              {/* Wedding Dress Design */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Crown className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                    Wedding Dress Design
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Get AI-powered wedding dress design ideas and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Style suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Body type matching
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Color options
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>

              {/* Wedding Cake Design Generator */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Utensils className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-yellow-600 transition-colors">
                    Wedding Cake Design Generator
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Create stunning wedding cake designs with AI assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Design ideas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Flavor combinations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Size recommendations
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>

              {/* Bridesmaid Dress Ideas */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-teal-600 transition-colors">
                    Bridesmaid Dress Ideas
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Find perfect bridesmaid dress ideas that complement your wedding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Coordinated looks
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Color matching
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Style variety
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>

              {/* Thank You Card Design */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Gift className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-red-600 transition-colors">
                    Thank You Card Design
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Design beautiful thank you cards for your wedding guests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Custom designs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Personal messages
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Print ready
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>

              {/* Wedding Caption Generator */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-violet-600 transition-colors">
                    Wedding Caption Generator
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Generate perfect captions for your wedding photos and posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Social media ready
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Multiple styles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Hashtag integration
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>

              {/* Wedding Monogram */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Circle className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-amber-600 transition-colors">
                    Wedding Monogram
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Create elegant wedding monograms and personalized designs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Custom monograms
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      Multiple styles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      High resolution
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-sm py-2">
                    Try for Free
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link to="/tools">
                <Button size="lg" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-8 py-4 text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore All Wedding Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Couples Are Saying</h2>
              <p className="text-xl text-gray-600">
                Real stories from couples who planned their perfect wedding with our AI planner
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="text-center">
                    <div className="flex justify-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-600 mb-4 italic">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-rose-500 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Plan Your Dream Wedding?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of couples who have created their perfect wedding with our AI-powered planner. 
              Start your journey today and make your special day truly unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tools/event-planner">
                <Button size="lg" variant="secondary" className="bg-white text-rose-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Planning Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about our AI wedding planning platform
              </p>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How does the AI wedding planner work?
                  </h3>
                  <p className="text-gray-600">
                    Our AI wedding planner uses advanced ChatGPT technology to analyze your preferences, 
                    budget, and requirements to create a personalized wedding plan. Simply input your details, 
                    and our AI will generate a comprehensive timeline, budget breakdown, and recommendations.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Is the wedding planner free to use?
                  </h3>
                  <p className="text-gray-600">
                    Yes! Our basic wedding planning tools are completely free. You can create timelines, 
                    manage your budget, organize your guest list, and get AI recommendations at no cost. 
                    Premium features are available for advanced customization and priority support.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I customize the AI-generated wedding plan?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely! Our AI creates a foundation plan that you can fully customize. 
                    You can modify timelines, adjust budgets, add or remove tasks, and personalize 
                    every aspect of your wedding plan to match your unique vision.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How accurate are the budget estimates?
                  </h3>
                  <p className="text-gray-600">
                    Our AI uses current market data and regional pricing to provide accurate budget estimates. 
                    However, prices can vary based on location, season, and specific vendor choices. 
                    We recommend getting quotes from local vendors for the most accurate pricing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
