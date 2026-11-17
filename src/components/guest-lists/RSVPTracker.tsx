import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, HelpCircle, Mail } from 'lucide-react';

interface RSVPResponse {
  id: string;
  guest_name: string;
  guest_email: string;
  response: 'attending' | 'not_attending' | 'maybe';
  message?: string;
  responded_at: string;
}

interface RSVPTrackerProps {
  guestListId: string;
}

export const RSVPTracker = ({ guestListId }: RSVPTrackerProps) => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    attending: 0,
    not_attending: 0,
    maybe: 0,
    no_response: 0
  });

  useEffect(() => {
    fetchRSVPResponses();
  }, [guestListId]);

  const fetchRSVPResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('guest_list_id', guestListId)
        .order('responded_at', { ascending: false });

      if (error) throw error;

      // Type assertion to ensure the response field matches our expected union type
      const typedResponses = (data || []).map(item => ({
        ...item,
        response: item.response as 'attending' | 'not_attending' | 'maybe'
      }));

      setResponses(typedResponses);
      
      // Calculate stats
      const attending = typedResponses.filter(r => r.response === 'attending').length;
      const not_attending = typedResponses.filter(r => r.response === 'not_attending').length;
      const maybe = typedResponses.filter(r => r.response === 'maybe').length;
      const total = typedResponses.length;

      setStats({
        total,
        attending,
        not_attending,
        maybe,
        no_response: 0 // This would need to be calculated based on total guests vs responses
      });
    } catch (error) {
      console.error('Error fetching RSVP responses:', error);
      toast({
        title: "Error",
        description: "Failed to load RSVP responses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'attending':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'not_attending':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'maybe':
        return <HelpCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'attending':
        return <Badge className="bg-green-100 text-green-800">Attending</Badge>;
      case 'not_attending':
        return <Badge className="bg-red-100 text-red-800">Not Attending</Badge>;
      case 'maybe':
        return <Badge className="bg-yellow-100 text-yellow-800">Maybe</Badge>;
      default:
        return <Badge variant="secondary">No Response</Badge>;
    }
  };

  const filterResponsesByStatus = (status: string) => {
    return responses.filter(r => r.response === status);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          RSVP Tracker
        </CardTitle>
        <CardDescription>
          Track guest responses and see who's attending your event
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-600">Total Responses</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.attending}</div>
            <div className="text-sm text-green-600">Attending</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.not_attending}</div>
            <div className="text-sm text-red-600">Not Attending</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.maybe}</div>
            <div className="text-sm text-yellow-600">Maybe</div>
          </div>
        </div>

        {/* Response List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="attending">Attending ({stats.attending})</TabsTrigger>
            <TabsTrigger value="not_attending">Not Attending ({stats.not_attending})</TabsTrigger>
            <TabsTrigger value="maybe">Maybe ({stats.maybe})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {responses.length > 0 ? (
              responses.map((response) => (
                <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(response.response)}
                    <div>
                      <h4 className="font-medium">{response.guest_name}</h4>
                      <p className="text-sm text-gray-600">{response.guest_email}</p>
                      {response.message && (
                        <p className="text-sm text-gray-500 italic mt-1">"{response.message}"</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(response.response)}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(response.responded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
                <p className="text-gray-600">Responses will appear here once guests start RSVPing</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="attending" className="space-y-4">
            {filterResponsesByStatus('attending').map((response) => (
              <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <h4 className="font-medium">{response.guest_name}</h4>
                    <p className="text-sm text-gray-600">{response.guest_email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(response.responded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="not_attending" className="space-y-4">
            {filterResponsesByStatus('not_attending').map((response) => (
              <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                <div className="flex items-center gap-3">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <div>
                    <h4 className="font-medium">{response.guest_name}</h4>
                    <p className="text-sm text-gray-600">{response.guest_email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(response.responded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="maybe" className="space-y-4">
            {filterResponsesByStatus('maybe').map((response) => (
              <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-yellow-500" />
                  <div>
                    <h4 className="font-medium">{response.guest_name}</h4>
                    <p className="text-sm text-gray-600">{response.guest_email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(response.responded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
