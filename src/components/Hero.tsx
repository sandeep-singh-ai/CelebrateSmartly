
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin, Sparkles, ArrowRight } from "lucide-react";

interface HeroProps {
  onAuthClick: (mode: 'login' | 'signup') => void;
}

export const Hero = ({ onAuthClick }: HeroProps) => {
  return (
    <section className="py-20 px-4 lg:py-32">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-700">
                The Future of Event Planning
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Celebrate Smartly,
              </span>
              <br />
              <span className="text-gray-900">
                Support Local Business
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Connect with local vendors, manage RSVPs, and create unforgettable celebrations 
              with our all-in-one event planning platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => onAuthClick('signup')}
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-8 py-3"
              >
                Start Planning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={() => window.location.href = '/vendors'}
                variant="outline" 
                size="lg"
                className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 font-semibold px-8 py-3"
              >
                Find Your Local Vendor
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Local Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Happy Guests</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 h-96 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {/* Event Cards */}
                <div className="bg-white rounded-xl p-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-500 rounded-lg flex items-center justify-center mb-2">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">Sarah's Wedding</h3>
                  <p className="text-xs text-gray-600">June 15, 2024</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Users className="w-3 h-3 mr-1" />
                    <span>150 guests</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform mt-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mb-2">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">Baby Shower</h3>
                  <p className="text-xs text-gray-600">July 8, 2024</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>Garden Venue</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-lg transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mb-2">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">Birthday Party</h3>
                  <p className="text-xs text-gray-600">Aug 20, 2024</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Users className="w-3 h-3 mr-1" />
                    <span>25 guests</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform mt-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center mb-2">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">Corporate Event</h3>
                  <p className="text-xs text-gray-600">Sep 5, 2024</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>Downtown</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
