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
  Zap,
  GraduationCap,
  Baby,
  Cake,
  Briefcase,
  Home,
  Car
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrowseEvents() {
  const eventTypes = [
    {
      id: 'wedding',
      title: 'Wedding Planning',
      description: 'Create your perfect wedding with AI-powered planning tools, vendor recommendations, and personalized timelines.',
      icon: <Heart className="h-8 w-8" />,
      gradient: 'from-rose-500 to-pink-600',
      hoverGradient: 'from-rose-600 to-pink-700',
      features: [
        'AI Wedding Speech Generator',
        'Wedding Vows Creator',
        'Theme & Color Palette Designer',
        'Gift Finder & Registry',
        'Hashtag Generator',
        'Invitation Card Designer',
        'Dress Design Ideas',
        'Cake Design Generator',
        'Bridesmaid Dress Ideas',
        'Thank You Card Designer',
        'Caption Generator',
        'Wedding Monogram Creator'
      ],
      stats: { events: '10,000+', satisfaction: '98%' },
      isFeatured: true
    },
    {
      id: 'corporate',
      title: 'Corporate Events',
      description: 'Professional event planning for conferences, meetings, team building, and corporate celebrations.',
      icon: <Briefcase className="h-8 w-8" />,
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'from-blue-600 to-indigo-700',
      features: [
        'Conference Planning',
        'Team Building Activities',
        'Product Launch Events',
        'Award Ceremonies',
        'Networking Events',
        'Corporate Retreats'
      ],
      stats: { events: '5,000+', satisfaction: '95%' }
    },
    {
      id: 'birthday',
      title: 'Birthday Parties',
      description: 'Celebrate special moments with personalized birthday party planning for all ages.',
      icon: <Cake className="h-8 w-8" />,
      gradient: 'from-yellow-500 to-orange-600',
      hoverGradient: 'from-yellow-600 to-orange-700',
      features: [
        'Kids Birthday Parties',
        'Adult Birthday Celebrations',
        'Milestone Birthdays',
        'Surprise Party Planning',
        'Theme Party Ideas',
        'Entertainment Booking'
      ],
      stats: { events: '15,000+', satisfaction: '97%' }
    },
    {
      id: 'graduation',
      title: 'Graduation Celebrations',
      description: 'Honor academic achievements with memorable graduation parties and ceremonies.',
      icon: <GraduationCap className="h-8 w-8" />,
      gradient: 'from-purple-500 to-violet-600',
      hoverGradient: 'from-purple-600 to-violet-700',
      features: [
        'High School Graduation',
        'College Graduation',
        'Graduate School Celebrations',
        'Achievement Ceremonies',
        'Academic Milestones',
        'Honor Society Events'
      ],
      stats: { events: '8,000+', satisfaction: '96%' }
    },
    {
      id: 'baby-shower',
      title: 'Baby Showers',
      description: 'Welcome new arrivals with beautiful baby shower celebrations and gender reveal parties.',
      icon: <Baby className="h-8 w-8" />,
      gradient: 'from-pink-500 to-rose-600',
      hoverGradient: 'from-pink-600 to-rose-700',
      features: [
        'Baby Shower Planning',
        'Gender Reveal Parties',
        'Nursery Theme Ideas',
        'Gift Registry Management',
        'Decorations & Setup',
        'Games & Activities'
      ],
      stats: { events: '6,000+', satisfaction: '98%' }
    },
    {
      id: 'anniversary',
      title: 'Anniversaries',
      description: 'Celebrate love and milestones with romantic anniversary celebrations.',
      icon: <Heart className="h-8 w-8" />,
      gradient: 'from-red-500 to-pink-600',
      hoverGradient: 'from-red-600 to-pink-700',
      features: [
        'Wedding Anniversaries',
        'Dating Anniversaries',
        'Milestone Celebrations',
        'Romantic Dinners',
        'Gift Ideas',
        'Memory Lane Planning'
      ],
      stats: { events: '4,000+', satisfaction: '99%' }
    },
    {
      id: 'holiday',
      title: 'Holiday Parties',
      description: 'Make every holiday special with festive party planning and seasonal celebrations.',
      icon: <Zap className="h-8 w-8" />,
      gradient: 'from-green-500 to-emerald-600',
      hoverGradient: 'from-green-600 to-emerald-700',
      features: [
        'Christmas Parties',
        'New Year Celebrations',
        'Halloween Parties',
        'Easter Gatherings',
        'Thanksgiving Dinners',
        'Valentine\'s Day Events'
      ],
      stats: { events: '12,000+', satisfaction: '94%' }
    },
    {
      id: 'home',
      title: 'House Parties',
      description: 'Host memorable gatherings at home with personalized party planning and entertainment.',
      icon: <Home className="h-8 w-8" />,
      gradient: 'from-amber-500 to-yellow-600',
      hoverGradient: 'from-amber-600 to-yellow-700',
      features: [
        'Housewarming Parties',
        'Dinner Parties',
        'Cocktail Parties',
        'Game Nights',
        'Pool Parties',
        'Backyard BBQs'
      ],
      stats: { events: '7,000+', satisfaction: '96%' }
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Browse Events - AI Event Planning Tools for Every Celebration | Wise Event Sphere</title>
        <meta name="description" content="Explore comprehensive AI-powered event planning tools for weddings, corporate events, birthdays, anniversaries, and more. Free tools with personalized recommendations, timelines, and vendor suggestions." />
        <meta name="keywords" content="event planning tools, AI event planner, wedding planning software, corporate event management, birthday party planner, anniversary celebration, holiday party planning, baby shower planner, graduation party, house party planning, event management software, free event planning tools, personalized event recommendations, event timeline generator, vendor finder, event budget planner" />
        <meta property="og:title" content="Browse Events - AI Event Planning Tools for Every Celebration" />
        <meta property="og:description" content="Explore comprehensive AI-powered event planning tools for weddings, corporate events, birthdays, anniversaries, and more. Free tools with personalized recommendations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wiseeventsphere.com/browse-events" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Browse Events - AI Event Planning Tools for Every Celebration" />
        <meta name="twitter:description" content="Explore comprehensive AI-powered event planning tools for weddings, corporate events, birthdays, anniversaries, and more." />
        <link rel="canonical" href="https://wiseeventsphere.com/browse-events" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Browse Events - AI Event Planning Tools for Every Celebration",
            "description": "Explore comprehensive AI-powered event planning tools for weddings, corporate events, birthdays, anniversaries, and more. Free tools with personalized recommendations, timelines, and vendor suggestions.",
            "url": "https://wiseeventsphere.com/browse-events",
            "keywords": "event planning tools, AI event planner, wedding planning software, corporate event management, birthday party planner, anniversary celebration, holiday party planning, baby shower planner, graduation party, house party planning",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Event Planning Tools",
              "description": "Comprehensive collection of AI-powered event planning tools for all types of celebrations",
              "itemListElement": eventTypes.map((event, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": event.title,
                "description": event.description,
                "url": event.id === 'wedding' ? "https://wiseeventsphere.com/wedding" : `https://wiseeventsphere.com/browse-events#${event.id}`
              }))
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
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Event Planning
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Browse Events
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                Discover all types of events you can plan with our comprehensive AI-powered tools. 
                From intimate celebrations to grand occasions, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Calendar className="mr-2 h-5 w-5" />
                  Start Planning Now
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                  <Users className="mr-2 h-5 w-5" />
                  View Success Stories
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Event - Wedding Planning */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-rose-100 text-rose-700 px-4 py-2 text-sm font-medium mb-4">
                Most Popular
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Event Type</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our most comprehensive event planning solution with the most tools and features
              </p>
            </div>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-2 border-rose-200">
              <CardHeader className="text-center pb-6">
                <div className={`p-6 rounded-3xl bg-gradient-to-r ${eventTypes[0].gradient} text-white mx-auto w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {eventTypes[0].icon}
                </div>
                <CardTitle className="text-3xl mb-4 group-hover:text-rose-600 transition-colors">
                  {eventTypes[0].title}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {eventTypes[0].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {eventTypes[0].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">{eventTypes[0].stats.events}</div>
                    <div className="text-sm text-gray-600">Events Planned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">{eventTypes[0].stats.satisfaction}</div>
                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>
                <div className="text-center">
                  <Link to="/wedding">
                    <Button size="lg" className={`bg-gradient-to-r ${eventTypes[0].gradient} hover:${eventTypes[0].hoverGradient} text-white px-8 py-4 text-lg font-semibold`}>
                      <Heart className="mr-2 h-5 w-5" />
                      Start Wedding Planning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Event Types */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">All Event Types</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from our comprehensive collection of event planning solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eventTypes.slice(1).map((eventType) => (
                <Card key={eventType.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${eventType.gradient} text-white mx-auto w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {eventType.icon}
                    </div>
                    <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
                      {eventType.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                      {eventType.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1 text-xs text-gray-600 mb-4">
                      {eventType.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {eventType.features.length > 3 && (
                        <li className="text-gray-500 text-xs">
                          +{eventType.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span>{eventType.stats.events} events</span>
                      <span>{eventType.stats.satisfaction} satisfaction</span>
                    </div>
                    <Button className={`w-full bg-gradient-to-r ${eventType.gradient} hover:${eventType.hoverGradient} text-white font-medium text-sm py-2`}>
                      Explore {eventType.title}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Plan Your Perfect Event?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have created unforgettable celebrations with our AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                <Users className="mr-2 h-5 w-5" />
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
