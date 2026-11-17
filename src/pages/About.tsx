
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, Award, Globe } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About CelebrateSmartly | Event Planning Made Simple</title>
        <meta 
          name="description" 
          content="Learn about CelebrateSmartly's mission to make event planning easier by connecting organizers with trusted local vendors. Discover our story and values." 
        />
        <meta name="keywords" content="about celebrate smartly, event planning company, local vendors, event organizers, celebration platform" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About CelebrateSmartly | Event Planning Made Simple" />
        <meta property="og:description" content="Making every celebration extraordinary by connecting event planners with trusted local vendors" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/about`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="About CelebrateSmartly" />
        <meta name="twitter:description" content="Making event planning easier by connecting organizers with trusted local vendors" />
        
        <link rel="canonical" href={`${window.location.origin}/about`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                About CelebrateSmartly
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Making every celebration extraordinary by connecting event planners with trusted local vendors
              </p>
            </div>

            {/* Mission Section */}
            <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="h-6 w-6 text-pink-500" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  We believe that every celebration deserves to be special. Our platform connects event organizers 
                  with local vendors, making it easier than ever to plan memorable events while supporting local businesses. 
                  From intimate gatherings to grand celebrations, we're here to make your vision come to life.
                </p>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">10,000+</h3>
                  <p className="text-gray-600">Happy Customers</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <Award className="h-12 w-12 mx-auto mb-4 text-pink-500" />
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">5,000+</h3>
                  <p className="text-gray-600">Trusted Vendors</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">50+</h3>
                  <p className="text-gray-600">Cities Served</p>
                </CardContent>
              </Card>
            </div>

            {/* Story Section */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Our Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Founded in 2020, CelebrateSmartly started with a simple idea: event planning shouldn't be stressful. 
                  Our founders experienced firsthand the challenges of finding reliable vendors and coordinating multiple 
                  services for their own celebrations.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  What began as a local directory of trusted vendors has grown into a comprehensive platform that 
                  streamlines the entire event planning process. We've helped thousands of customers create 
                  unforgettable moments while supporting local businesses in communities across the country.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Today, we continue to innovate and expand our services, always keeping our core mission in mind: 
                  making celebrations smarter, easier, and more meaningful for everyone involved.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
