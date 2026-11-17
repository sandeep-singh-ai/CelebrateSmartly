
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MapPin, Smartphone, Heart, Zap, Shield, Star } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Event Planning",
      description: "Create beautiful events with our intuitive wizard and customizable themes",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: Users,
      title: "RSVP Management",
      description: "Track responses, manage guest lists, and send automated reminders",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: MapPin,
      title: "Local Vendor Discovery",
      description: "Find and connect with trusted local businesses for your events",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Smartphone,
      title: "QR Code Invitations",
      description: "Modern RSVP system with QR codes and mobile-friendly pages",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Heart,
      title: "Personalized Experience",
      description: "Custom themes, branded pages, and personalized guest experiences",
      gradient: "from-rose-500 to-rose-600"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live updates for RSVPs, guest lists, and vendor communications",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Star,
      title: "Premium Support",
      description: "Dedicated support team to help you create perfect events",
      gradient: "from-pink-500 to-purple-500"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-gray-900">
              to Plan Perfect Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From initial planning to the big day, CelebrateWise provides all the tools 
            you need to create memorable celebrations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group">
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Feature Highlight */}
        <div className="mt-20">
          <Card className="border-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-2xl">
            <CardContent className="p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                All-in-One Event Management
              </h3>
              <p className="text-pink-100 text-lg mb-8 max-w-3xl mx-auto">
                Stop juggling multiple apps and spreadsheets. CelebrateWise combines 
                event planning, guest management, vendor discovery, and more in one 
                beautiful, easy-to-use platform.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-pink-200">Event Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-pink-200">Verified Vendors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-pink-200">Uptime Guarantee</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
