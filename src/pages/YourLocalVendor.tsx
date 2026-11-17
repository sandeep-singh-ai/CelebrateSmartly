
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Users, Star, Handshake, Award, Globe, TrendingUp } from 'lucide-react';

const YourLocalVendor = () => {
  const benefits = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Supporting Local Economy",
      description: "Every dollar spent with local vendors stays in your community, creating a multiplier effect that benefits everyone."
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      title: "Reduced Carbon Footprint",
      description: "Local vendors mean shorter distances, less transportation, and a smaller environmental impact for your events."
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Personal Relationships",
      description: "Build lasting relationships with vendors who understand your local market and can provide personalized service."
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Unique Local Flavor",
      description: "Local vendors bring authentic, regional specialties that make your events truly memorable and distinctive."
    }
  ];

  const howWeHelp = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Local Vendor Discovery",
      description: "Our platform connects you with verified local vendors in your area, making it easy to find the perfect partners for your events."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Quality Assurance",
      description: "We vet all vendors to ensure they meet our quality standards, giving you confidence in your local choices."
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Seamless Integration",
      description: "Our tools make it easy to communicate, coordinate, and work with local vendors throughout your event planning process."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Performance Tracking",
      description: "Track vendor performance and build a network of trusted local partners for all your future events."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Supporting Your Local Vendors
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Celebrate Smartly, we believe in the power of local businesses. Discover how partnering with local vendors 
              creates stronger communities, better events, and lasting relationships.
            </p>
          </div>

          {/* Why Choose Local Vendors */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose Local Vendors?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How We Help */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How We Support Local Vendors
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {howWeHelp.map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-lg text-white flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white mb-20">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">85%</div>
                  <p className="text-lg">of event planners prefer working with local vendors</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">$68</div>
                  <p className="text-lg">of every $100 spent locally stays in the community</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">2.5x</div>
                  <p className="text-lg">more jobs created by supporting local businesses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Discover Amazing Local Vendors?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of event planners who are already building stronger communities through local partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3"
              >
                Find Local Vendors
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-3"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default YourLocalVendor;
