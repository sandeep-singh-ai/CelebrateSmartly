
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";

interface PricingSectionProps {
  onAuthClick: (mode: 'login' | 'signup') => void;
}

export const PricingSection = ({ onAuthClick }: PricingSectionProps) => {
  const plans = [
    {
      name: "Free ( Limited Time )",
      price: "0",
      description: "Everything you need, completely free",
      icon: Crown,
      features: [
        "Unlimited Events*",
        "Unlimited RSVPs*",
        "Premium event themes*",
        "Advanced QR features",
        "Priority vendor matching",
        "Advanced guest management",
        "Detailed analytics",
        "White-label options",
        "Priority support",
        "Custom event pages",
        "Email invitations*"
      ],
      buttonText: "Get Started Free",
      popular: true,
      gradient: "from-pink-500 to-purple-500"
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your event planning needs. 
            Start free and upgrade as you grow.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="max-w-md w-full">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
              plan.popular 
                ? 'border-purple-200 shadow-lg scale-105' 
                : 'border-gray-200 hover:border-purple-200'
            }`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${plan.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price !== "0" && (
                    <span className="text-gray-600">/month</span>
                  )}
                </div>
                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  onClick={() => onAuthClick('signup')}
                  className={`w-full mb-6 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.buttonText}
                </Button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            All plans include SSL security, 99.9% uptime, and basic customer support.
          </p>
          <p className="text-sm text-gray-500">
            Need a custom plan for your organization? 
            <Button variant="link" className="text-purple-600 hover:text-purple-700 p-0 ml-1">
              Contact our sales team
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
};
