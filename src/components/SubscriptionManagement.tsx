
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

const SubscriptionManagement = () => {
  const { subscription, currentTier, membershipTiers } = useSubscription();
  const { toast } = useToast();

  const handleSubscriptionChange = (tierName: string) => {
    // Placeholder for subscription change logic
    toast({
      title: "Subscription Change",
      description: `Subscription change to ${tierName} would be processed here.`,
    });
  };

  const getCurrentTierIndex = () => {
    if (!currentTier || !membershipTiers) return -1;
    return membershipTiers.findIndex(tier => tier.name === currentTier.name);
  };

  const getButtonText = (tier: any) => {
    if (!currentTier) return 'Subscribe';
    
    const currentIndex = getCurrentTierIndex();
    const tierIndex = membershipTiers?.findIndex(t => t.name === tier.name) ?? -1;
    
    if (currentIndex === tierIndex) return 'Current Plan';
    if (tierIndex > currentIndex) return 'Upgrade';
    return 'Downgrade';
  };

  const isCurrentPlan = (tier: any) => {
    return currentTier?.name === tier.name;
  };

  if (!membershipTiers) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Manage your subscription plan and billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentTier?.name || 'Free'} Plan</h3>
                <p className="text-gray-600">
                  ${currentTier?.price_monthly || 0}/month
                </p>
              </div>
              <Badge variant={currentTier?.name === 'Free' ? 'secondary' : 'default'}>
                Active
              </Badge>
            </div>
            
            {currentTier && (
              <div className="space-y-2">
                <h4 className="font-medium">Plan Features:</h4>
                <ul className="space-y-1">
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    Up to {currentTier.max_events} events
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    Up to {currentTier.max_rsvps} RSVPs per event
                  </li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membershipTiers.map((tier) => (
          <Card key={tier.id} className={`relative ${isCurrentPlan(tier) ? 'ring-2 ring-purple-500' : ''}`}>
            {isCurrentPlan(tier) && (
              <Badge className="absolute -top-2 left-4 bg-purple-500">
                Current Plan
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {tier.name}
                <span className="text-2xl font-bold">
                  ${tier.price_monthly}
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    Up to {tier.max_events} events
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    Up to {tier.max_rsvps} RSVPs per event
                  </li>
                  {tier.features && Array.isArray(tier.features) && tier.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={isCurrentPlan(tier) ? 'secondary' : 'default'}
                  disabled={isCurrentPlan(tier)}
                  onClick={() => handleSubscriptionChange(tier.name)}
                >
                  {getButtonText(tier)}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionManagement;
