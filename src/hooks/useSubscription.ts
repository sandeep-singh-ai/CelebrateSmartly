
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Subscription {
  id: string;
  user_id: string;
  email: string;
  stripe_customer_id: string | null;
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  updated_at: string;
  created_at: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  price_monthly: number;
  max_events: number;
  max_rsvps: number;
  features: any;
  created_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as Subscription;
    },
    enabled: !!user?.id,
  });

  const { data: membershipTiers } = useQuery({
    queryKey: ['membership-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membership_tiers')
        .select('*')
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      return data as MembershipTier[];
    },
  });

  const currentTier = membershipTiers?.find(
    tier => tier.name === subscription?.subscription_tier
  );

  return {
    subscription,
    membershipTiers,
    currentTier,
    isLoading,
  };
};
