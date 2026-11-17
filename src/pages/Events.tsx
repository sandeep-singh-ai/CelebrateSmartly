
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const Events = () => {
  const events = [
    {
      id: 1,
      title: "Summer Music Festival",
      date: "August 15, 2024",
      time: "6:00 PM",
      location: "Central Park",
      attendees: 250,
      category: "Music",
      description: "Join us for an evening of live music featuring local bands and artists."
    },
    {
      id: 2,
      title: "Wedding Expo 2024",
      date: "September 22, 2024",
      time: "10:00 AM",
      location: "Convention Center",
      attendees: 500,
      category: "Wedding",
      description: "Discover the latest wedding trends and meet top vendors in the industry."
    },
    {
      id: 3,
      title: "Corporate Networking Night",
      date: "October 5, 2024",
      time: "7:00 PM",
      location: "Downtown Hotel",
      attendees: 100,
      category: "Corporate",
      description: "Connect with local business leaders and expand your professional network."
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Discover Local Events | Find Weddings, Parties & Celebrations | CelebrateSmartly</title>
        <meta 
          name="description" 
          content="Discover amazing local events, weddings, parties, and celebrations in your area. Browse upcoming events, RSVP online, and connect with event organizers." 
        />
        <meta name="keywords" content="local events, upcoming events, weddings, parties, celebrations, event discovery, RSVP events, community events, social gatherings" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Discover Local Events | Find Weddings, Parties & Celebrations" />
        <meta property="og:description" content="Browse amazing local events, weddings, and parties. RSVP online and connect with event organizers in your community." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/events`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Local Events Directory - CelebrateSmartly" />
        <meta name="twitter:description" content="Discover and RSVP to local events, weddings, and parties in your area" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Local Events Directory",
              "description": "Directory of local events, weddings, parties, and celebrations",
              "url": `${window.location.origin}/events`,
              "numberOfItems": 3,
              "itemListElement": [
                {
                  "@type": "Event",
                  "name": "Summer Music Festival",
                  "startDate": "2024-08-15T18:00",
                  "location": {
                    "@type": "Place",
                    "name": "Central Park"
                  }
                },
                {
                  "@type": "Event", 
                  "name": "Wedding Expo 2024",
                  "startDate": "2024-09-22T10:00",
                  "location": {
                    "@type": "Place",
                    "name": "Convention Center"
                  }
                }
              ]
            })
          }}
        />
        
        <link rel="canonical" href={`${window.location.origin}/events`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Discover Events
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find and attend amazing events in your area
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </CardDescription>
                      </div>
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
                        {event.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Learn More
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                        RSVP
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Events;
