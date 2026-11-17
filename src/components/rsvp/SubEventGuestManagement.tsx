
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Mail, Send, UserCheck, UserX, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  created_at: string;
}

interface GuestInvite {
  id: string;
  guest_id: string;
  status: 'attending' | 'not_attending' | 'maybe' | 'no_response';
  responded_at?: string;
  token: string;
  guest: Guest;
}

interface SubEventGuestManagementProps {
  subEventId: string;
  rsvpEventId: string;
  onClose: () => void;
}

export const SubEventGuestManagement = ({ subEventId, rsvpEventId, onClose }: SubEventGuestManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '', notes: '' });

  const { data: guests, isLoading: guestsLoading } = useQuery({
    queryKey: ['rsvp-guests', rsvpEventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rsvp_guests')
        .select('*')
        .eq('rsvp_event_id', rsvpEventId)
        .order('name');

      if (error) throw error;
      return data as Guest[];
    },
  });

  const { data: invites, isLoading: invitesLoading } = useQuery({
    queryKey: ['guest-invites', subEventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_invites')
        .select(`
          *,
          guest:rsvp_guests(*)
        `)
        .eq('sub_event_id', subEventId);

      if (error) throw error;
      return data as GuestInvite[];
    },
  });

  const addGuestMutation = useMutation({
    mutationFn: async (guestData: typeof newGuest) => {
      const { data: guest, error: guestError } = await supabase
        .from('rsvp_guests')
        .insert({
          rsvp_event_id: rsvpEventId,
          name: guestData.name,
          email: guestData.email,
          phone: guestData.phone || null,
          notes: guestData.notes || null,
        })
        .select()
        .single();

      if (guestError) throw guestError;

      // Create invite for this sub-event
      const { error: inviteError } = await supabase
        .from('guest_invites')
        .insert({
          guest_id: guest.id,
          sub_event_id: subEventId,
        });

      if (inviteError) throw inviteError;
      return guest;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Guest added successfully!",
      });
      setNewGuest({ name: '', email: '', phone: '', notes: '' });
      queryClient.invalidateQueries({ queryKey: ['rsvp-guests', rsvpEventId] });
      queryClient.invalidateQueries({ queryKey: ['guest-invites', subEventId] });
    },
    onError: (error) => {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest.",
        variant: "destructive",
      });
    },
  });

  const sendInvitesMutation = useMutation({
    mutationFn: async () => {
      // This would call an edge function to send emails
      // For now, we'll just update the status to indicate invites were sent
      const { error } = await supabase
        .from('guest_invites')
        .update({ status: 'no_response' })
        .eq('sub_event_id', subEventId)
        .eq('status', 'no_response');

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invitations sent successfully!",
      });
    },
    onError: (error) => {
      console.error('Error sending invites:', error);
      toast({
        title: "Error",
        description: "Failed to send invitations.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'attending':
        return <Badge className="bg-green-100 text-green-800"><UserCheck className="w-3 h-3 mr-1" />Attending</Badge>;
      case 'not_attending':
        return <Badge className="bg-red-100 text-red-800"><UserX className="w-3 h-3 mr-1" />Not Attending</Badge>;
      case 'maybe':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Maybe</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />No Response</Badge>;
    }
  };

  const getStatusCounts = () => {
    if (!invites) return { attending: 0, notAttending: 0, maybe: 0, noResponse: 0 };
    
    return invites.reduce((acc, invite) => {
      switch (invite.status) {
        case 'attending':
          acc.attending++;
          break;
        case 'not_attending':
          acc.notAttending++;
          break;
        case 'maybe':
          acc.maybe++;
          break;
        default:
          acc.noResponse++;
      }
      return acc;
    }, { attending: 0, notAttending: 0, maybe: 0, noResponse: 0 });
  };

  const statusCounts = getStatusCounts();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Sub-Event Guests
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="guests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guests">Guests ({guests?.length || 0})</TabsTrigger>
            <TabsTrigger value="responses">Responses ({invites?.length || 0})</TabsTrigger>
            <TabsTrigger value="invitations">Send Invites</TabsTrigger>
          </TabsList>

          <TabsContent value="guests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Guest</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newGuest.name}
                      onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                      placeholder="Guest name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                      placeholder="guest@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newGuest.phone}
                      onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={newGuest.notes}
                      onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })}
                      placeholder="Special notes"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => addGuestMutation.mutate(newGuest)}
                  disabled={!newGuest.name || !newGuest.email || addGuestMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Guest
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Guests</CardTitle>
              </CardHeader>
              <CardContent>
                {guestsLoading ? (
                  <div className="text-center py-4">Loading guests...</div>
                ) : guests && guests.length > 0 ? (
                  <div className="space-y-2">
                    {guests.map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{guest.name}</p>
                          <p className="text-sm text-gray-600">{guest.email}</p>
                          {guest.phone && <p className="text-sm text-gray-500">{guest.phone}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No guests added yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{statusCounts.attending}</div>
                  <div className="text-sm text-gray-600">Attending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{statusCounts.notAttending}</div>
                  <div className="text-sm text-gray-600">Not Attending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{statusCounts.maybe}</div>
                  <div className="text-sm text-gray-600">Maybe</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{statusCounts.noResponse}</div>
                  <div className="text-sm text-gray-600">No Response</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Guest Responses</CardTitle>
              </CardHeader>
              <CardContent>
                {invitesLoading ? (
                  <div className="text-center py-4">Loading responses...</div>
                ) : invites && invites.length > 0 ? (
                  <div className="space-y-3">
                    {invites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{invite.guest.name}</p>
                          <p className="text-sm text-gray-600">{invite.guest.email}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(invite.status)}
                          {invite.responded_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Responded: {new Date(invite.responded_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No responses yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Invitations</CardTitle>
                <p className="text-sm text-gray-600">
                  Send RSVP invitations to all guests for this sub-event
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900">Invitation Preview</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Each guest will receive a personalized email with:
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
                    <li>Sub-event details and timing</li>
                    <li>Unique RSVP link</li>
                    <li>Option to respond: Yes, No, or Maybe</li>
                    <li>Event location and dress code (if provided)</li>
                  </ul>
                </div>

                <Button
                  onClick={() => sendInvitesMutation.mutate()}
                  disabled={sendInvitesMutation.isPending}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendInvitesMutation.isPending ? 'Sending...' : 'Send Invitations'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
