
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RSVPResponse {
  id: string;
  guest_name: string;
  guest_email: string;
  response_status: string;
  guest_message: string | null;
  response_received_at: string | null;
}

interface RSVPResponsesCardProps {
  eventId: string;
}

export const RSVPResponsesCard: React.FC<RSVPResponsesCardProps> = ({ eventId }) => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRSVPResponses();
  }, [eventId]);

  const fetchRSVPResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('invitation_tracking')
        .select('*')
        .eq('event_id', eventId)
        .not('response_status', 'eq', 'no_response')
        .order('response_received_at', { ascending: false });

      if (error) throw error;

      setResponses(data || []);
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
        return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'not_attending':
        return <UserX className="w-4 h-4 text-red-500" />;
      case 'maybe':
        return <Clock className="w-4 h-4 text-yellow-500" />;
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>RSVP Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-300 rounded"></div>
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
          <MessageSquare className="w-5 h-5" />
          RSVP Responses ({responses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {responses.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {responses.map((response) => (
              <div key={response.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(response.response_status)}
                    <div>
                      <h4 className="font-medium">{response.guest_name}</h4>
                      <p className="text-sm text-gray-600">{response.guest_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(response.response_status)}
                    {response.response_received_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(response.response_received_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {response.guest_message && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700 italic">"{response.guest_message}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-600">RSVP responses will appear here once guests start responding</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
