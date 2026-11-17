
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Star, Heart, Gift, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PricingSection } from "@/components/PricingSection";
import { AuthModal } from "@/components/AuthModal";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show landing page if user is not authenticated
  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Helmet>
        <title>CelebrateSmartly - AI-Powered Event Planning & Local Vendor Discovery (Beta)</title>
        <meta 
          name="description" 
          content="Plan perfect events with AI-powered themes and discover trusted local vendors. Free event planning platform with unlimited RSVPs, vendor connections, and celebration management." 
        />
        <meta name="keywords" content="free online rsvp sites , free online rsvp for wedding , free online rsvp tracker , rsvp locations , free online rsvp for birthday Party , Free Online rsvp platform , free online rsvp qr code , is there an rsvp app , free online rsvp tracking , free online rsvp for party , free online rsvp baby shower, event planning, AI event planner, local vendors, party planning, RSVP management, celebration organizer, wedding planner, birthday parties" />
        
        {/* Open Graph */}
        <meta property="og:title" content="CelebrateSmartly - AI-Powered Event Planning & Local Vendor Discovery, free online rsvp sites , free online rsvp for wedding" />
        <meta property="og:description" content="Plan perfect events with AI-powered themes and connect with trusted local vendors. Free forever." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CelebrateSmartly - AI Event Planning" />
        <meta name="twitter:description" content="Plan perfect events with AI-powered themes and local vendor connections" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CelebrateSmartly",
              "description": "AI-powered event planning platform connecting organizers with local vendors",
              "url": window.location.origin,
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        
        <link rel="canonical" href={window.location.origin} />
      </Helmet>
      
      <Navigation />
      
      <main>
        <Hero onAuthClick={handleAuthClick} />
        <Features />
        
        {/* Focus on Local Business Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Empowering Local Business Connections
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Connect your events with trusted local vendors and businesses in your community
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <MapPin className="w-8 h-8" />,
                  title: "Local Vendor Discovery",
                  description: "Find and connect with trusted caterers, photographers, florists, and venues in your area"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Community Network",
                  description: "Build relationships with local businesses and support your community's economy"
                },
                {
                  icon: <Star className="w-8 h-8" />,
                  title: "Verified Reviews",
                  description: "Access genuine reviews and ratings from real customers in your local area"
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "Direct Communication",
                  description: "Connect directly with local business owners for personalized service and quotes"
                },
                {
                  icon: <Gift className="w-8 h-8" />,
                  title: "Exclusive Local Deals",
                  description: "Access special offers and packages available only to local event organizers"
                },
                {
                  icon: <Sparkles className="w-8 h-8" />,
                  title: "Seamless Integration",
                  description: "Incorporate local vendor information directly into your event planning process"
                }
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-500 text-lg font-medium">Supporting local businesses, strengthening communities!</p>
              <Button 
                onClick={() => handleAuthClick('signup')}
                className="mt-6 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3"
              >
                Discover Local Vendors
              </Button>
            </div>
          </div>
        </section>
        
        <PricingSection onAuthClick={handleAuthClick} />
        
        {/* Local Vendors Preview Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Discover Local Vendors
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Connect with trusted local businesses to make your events unforgettable
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Elegant Catering Co.", category: "Catering", rating: 4.9, location: "Downtown" },
                { name: "Bloom & Petal", category: "Florist", rating: 4.8, location: "Midtown" },
                { name: "Capture Moments", category: "Photography", rating: 5.0, location: "Riverside" }
              ].map((vendor, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {vendor.location}
                        </CardDescription>
                      </div>
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
                        {vendor.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{vendor.rating}</span>
                      <span className="text-gray-600 text-sm ml-1">(127 reviews)</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Create Amazing Events?
              </h2>
              <p className="text-pink-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of event organizers who trust CelebrateSmartly to make their celebrations unforgettable
              </p>
              <Button 
                onClick={() => handleAuthClick('signup')}
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
              >
                Start Planning Your Event
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Index;
