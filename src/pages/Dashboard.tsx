
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { useEvents } from '@/hooks/useEvents';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, CreditCard, Settings, Users } from 'lucide-react';
import { ProfileSettings } from '@/components/ProfileSettings';
import SubscriptionManagement from '@/components/SubscriptionManagement';
import { Layout } from '@/components/Layout';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import DashboardOverview from '@/components/DashboardOverview';
import DashboardEvents from '@/components/DashboardEvents';
import { DashboardSettings } from '@/components/DashboardSettings';
import { RSVPManagement } from '@/components/dashboard/RSVPManagement';
import { InvitationDashboard } from '@/components/dashboard/InvitationDashboard';

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { subscription, currentTier } = useSubscription();
  const { events, totalEvents, upcomingEvents, pastEvents } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const handleSignOut = async () => {
    console.log('🔄 Dashboard sign out button clicked, starting sign out process...');
    try {
      const { error } = await signOut();
      if (error) {
        console.error('❌ Error signing out:', error);
        // You could add a toast notification here if you want to show the error to the user
      } else {
        console.log('✅ Dashboard sign out successful');
      }
    } catch (error) {
      console.error('💥 Unexpected error during dashboard sign out:', error);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Dashboard | CelebrateSmartly Event Management</title>
        <meta 
          name="description" 
          content="Manage your events, RSVPs, and invitations from your personal CelebrateSmartly dashboard. Track analytics and organize celebrations efficiently." 
        />
        <meta name="robots" content="noindex, nofollow" />
        
        <link rel="canonical" href={`${window.location.origin}/dashboard`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <DashboardHeader 
          firstName={profile.first_name}
          role={profile.role}
          currentTierName={currentTier?.name}
          onSignOut={handleSignOut}
        />

        <main className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="flex-1">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="events" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Events
                  </TabsTrigger>
                  <TabsTrigger value="rsvps" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    RSVPs
                  </TabsTrigger>
                  <TabsTrigger value="invitations" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Invitations
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Subscription
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <DashboardOverview 
                    recentEvents={events}
                    totalEvents={totalEvents}
                    upcomingEvents={upcomingEvents}
                    pastEvents={pastEvents}
                  />
                </TabsContent>

                <TabsContent value="events">
                  <DashboardEvents />
                </TabsContent>

                <TabsContent value="rsvps">
                  <RSVPManagement />
                </TabsContent>

                <TabsContent value="invitations">
                  <InvitationDashboard />
                </TabsContent>

                <TabsContent value="profile">
                  <ProfileSettings />
                </TabsContent>

                <TabsContent value="subscription">
                  <SubscriptionManagement />
                </TabsContent>

                <TabsContent value="settings">
                  <DashboardSettings />
                </TabsContent>
              </Tabs>
            </div>

            <DashboardSidebar />
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
