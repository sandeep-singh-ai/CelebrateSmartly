import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';
import { GuestListManager } from '@/components/events/GuestListManager';
import { EventOverviewCard } from '@/components/event-detail/EventOverviewCard';
import { SelectedThemeCard } from '@/components/event-detail/SelectedThemeCard';
import { LocalVendorsCard } from '@/components/event-detail/LocalVendorsCard';
import { RSVPResponsesCard } from '@/components/event-detail/RSVPResponsesCard';
import { EventWebsiteCard } from '@/components/event-detail/EventWebsiteCard';

type EventFromDB = Tables<'events'>;

interface Vendor {
  id: string;
  business_name: string;
  business_type: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  images: string[];
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventFromDB | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [vendorStartIndex, setVendorStartIndex] = useState([0]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
  };

  useEffect(() => {
    if (id && user) {
      fetchEventDetails();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      const { data: eventData, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      setEvent(eventData);
      
      // Fetch vendors for this event
      await fetchVendors(eventData.location || '', eventData.event_type);
      
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Error",
        description: "Failed to load event details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async (location: string, eventType: string) => {
    setVendorsLoading(true);
    try {
      console.log('Fetching vendors for location:', location, 'and event type:', eventType);
      
      // First, check if we have vendors in DB for this location and event type
      const { data: existingVendors } = await supabase
        .from('vendors')
        .select('*')
        .ilike('address', `%${location}%`)
        .limit(20);

      if (existingVendors && existingVendors.length > 0) {
        console.log('Using vendors from database:', existingVendors.length, 'vendors found');
        
        // Transform the database vendors to match our interface with proper data validation
        const transformedVendors: Vendor[] = existingVendors
          .filter(vendor => vendor.business_name && vendor.business_name.trim() !== '')
          .map(vendor => ({
            id: vendor.id,
            business_name: vendor.business_name || 'Unknown Business',
            business_type: vendor.business_type || 'Event Services',
            description: vendor.description || null,
            address: vendor.address || null,
            phone: vendor.phone || null,
            email: vendor.email || null,
            website: vendor.website || null,
            rating: vendor.rating ? Number(vendor.rating) : null,
            review_count: vendor.review_count || null,
            images: Array.isArray(vendor.images) ? vendor.images as string[] : []
          }));
        
        console.log('Transformed vendors:', transformedVendors);
        setVendors(transformedVendors);
        
        toast({
          title: "Vendors Loaded",
          description: `Found ${transformedVendors.length} vendors near your event location.`,
        });
      } else {
        console.log('No vendors found in database, fetching from Google Places API');
        // Fetch from Google Places API and store in DB
        const { data, error } = await supabase.functions.invoke('search-vendors', {
          body: {
            location,
            category: eventType,
            radius: 25
          }
        });

        if (error) {
          console.error('Error calling search-vendors function:', error);
          throw error;
        }

        console.log('Google Places API response:', data);

        // Transform the API response to match our interface
        const apiVendors = data.vendors || [];
        const transformedVendors: Vendor[] = apiVendors
          .filter((vendor: any) => vendor.business_name && vendor.business_name.trim() !== '')
          .map((vendor: any) => ({
            id: vendor.id || Math.random().toString(36).substr(2, 9),
            business_name: vendor.business_name || vendor.name || 'Unknown Business',
            business_type: vendor.business_type || eventType,
            description: vendor.description || null,
            address: vendor.address || null,
            phone: vendor.phone || null,
            email: vendor.email || null,
            website: vendor.website || null,
            rating: vendor.rating || 0,
            review_count: vendor.review_count || 0,
            images: Array.isArray(vendor.images) ? vendor.images : []
          }));

        console.log('Transformed API vendors:', transformedVendors);
        setVendors(transformedVendors);
        
        toast({
          title: "Vendors Loaded",
          description: `Found ${transformedVendors.length} vendors near your event location.`,
        });
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load nearby vendors.",
        variant: "destructive",
      });
      setVendors([]);
    } finally {
      setVendorsLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-64 bg-gray-300 rounded mb-6"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
              <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.expected_guests} guests</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{event.event_type}</Badge>
              </div>

              {/* Navigation Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="guest-lists">Guest Lists</TabsTrigger>
                  <TabsTrigger value="website">Website</TabsTrigger>
                </TabsList>

                {/* Overview Tab - Combined Event Details, Vendors, and RSVP Responses */}
                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Event Details */}
                    <div className="space-y-6">
                      <EventOverviewCard event={event} />
                      <SelectedThemeCard event={event} />
                      <RSVPResponsesCard eventId={event.id} />
                    </div>

                    {/* Right Side - Local Vendors */}
                    <div>
                      <LocalVendorsCard
                        vendors={vendors}
                        vendorsLoading={vendorsLoading}
                        vendorStartIndex={vendorStartIndex}
                        setVendorStartIndex={setVendorStartIndex}
                        onSearchVendors={() => fetchVendors(event.location || '', event.event_type)}
                        eventLocation={event.location || ''}
                        eventType={event.event_type}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Guest Lists Tab */}
                <TabsContent value="guest-lists" className="mt-6">
                  <GuestListManager 
                    eventId={event.id}
                    eventType="event"
                    eventTitle={event.title}
                  />
                </TabsContent>

                {/* Website Tab */}
                <TabsContent value="website" className="mt-6">
                  <EventWebsiteCard 
                    eventId={event.id}
                    eventTitle={event.title}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
