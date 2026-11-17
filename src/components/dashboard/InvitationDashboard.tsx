
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, Users, Mail, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InvitationData {
  id: string;
  guest_name: string;
  guest_email: string;
  event_name: string;
  sub_event_name?: string;
  response_status: string;
  invitation_sent_at: string | null;
  response_received_at: string | null;
  guest_message: string | null;
  event_date: string;
  event_type: 'event' | 'rsvp_event' | 'sub_event';
}

export const InvitationDashboard = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    eventName: '',
    subEventName: '',
    status: 'all',
    guestName: '',
  });

  const { data: invitationData, isLoading } = useQuery({
    queryKey: ['invitation-dashboard', filters],
    queryFn: async () => {
      // Get invitation tracking with event details
      const { data: trackingData, error } = await supabase
        .from('invitation_tracking')
        .select(`
          *,
          events:event_id (
            id,
            title,
            event_date
          ),
          rsvp_events:rsvp_event_id (
            id,
            title,
            main_date
          ),
          sub_events:sub_event_id (
            id,
            name,
            event_date,
            events (
              id,
              title,
              event_date
            ),
            rsvp_events (
              id,
              title,
              main_date
            )
          )
        `);

      if (error) throw error;

      const allInvitations: InvitationData[] = [];

      trackingData?.forEach((tracking: any) => {
        let eventName = 'Unknown Event';
        let eventDate = '';
        let eventType: 'event' | 'rsvp_event' | 'sub_event' = 'event';
        let subEventName: string | undefined;

        if (tracking.events) {
          eventName = tracking.events.title;
          eventDate = tracking.events.event_date;
          eventType = 'event';
        } else if (tracking.rsvp_events) {
          eventName = tracking.rsvp_events.title;
          eventDate = tracking.rsvp_events.main_date;
          eventType = 'rsvp_event';
        } else if (tracking.sub_events) {
          subEventName = tracking.sub_events.name;
          eventType = 'sub_event';
          
          if (tracking.sub_events.events) {
            eventName = tracking.sub_events.events.title;
            eventDate = tracking.sub_events.events.event_date || tracking.sub_events.event_date;
          } else if (tracking.sub_events.rsvp_events) {
            eventName = tracking.sub_events.rsvp_events.title;
            eventDate = tracking.sub_events.rsvp_events.main_date || tracking.sub_events.event_date;
          }
        }

        allInvitations.push({
          id: tracking.id,
          guest_name: tracking.guest_name,
          guest_email: tracking.guest_email,
          event_name: eventName,
          sub_event_name: subEventName,
          response_status: tracking.response_status,
          invitation_sent_at: tracking.invitation_sent_at,
          response_received_at: tracking.response_received_at,
          guest_message: tracking.guest_message,
          event_date: eventDate,
          event_type: eventType,
        });
      });

      // Apply filters
      return allInvitations.filter((invitation) => {
        return (
          (!filters.eventName || invitation.event_name.toLowerCase().includes(filters.eventName.toLowerCase())) &&
          (!filters.subEventName || (invitation.sub_event_name && invitation.sub_event_name.toLowerCase().includes(filters.subEventName.toLowerCase()))) &&
          (filters.status === 'all' || invitation.response_status === filters.status) &&
          (!filters.guestName || invitation.guest_name.toLowerCase().includes(filters.guestName.toLowerCase()))
        );
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'accepted': { label: 'Accepted', className: 'bg-green-100 text-green-800' },
      'declined': { label: 'Declined', className: 'bg-red-100 text-red-800' },
      'maybe': { label: 'Maybe', className: 'bg-yellow-100 text-yellow-800' },
      'no_response': { label: 'No Response', className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.no_response;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusCounts = () => {
    if (!invitationData) return { accepted: 0, declined: 0, maybe: 0, noResponse: 0, total: 0 };
    
    return invitationData.reduce((acc, invitation) => {
      acc.total++;
      switch (invitation.response_status) {
        case 'accepted':
          acc.accepted++;
          break;
        case 'declined':
          acc.declined++;
          break;
        case 'maybe':
          acc.maybe++;
          break;
        default:
          acc.noResponse++;
      }
      return acc;
    }, { accepted: 0, declined: 0, maybe: 0, noResponse: 0, total: 0 });
  };

  const exportToCSV = () => {
    if (!invitationData || invitationData.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no invitation records to export.",
        variant: "destructive",
      });
      return;
    }

    const csvHeaders = "Guest Name,Guest Email,Event Name,Sub Event Name,Status,Invitation Sent,Response Received,Message,Event Date\n";
    const csvData = invitationData.map(invitation => 
      `"${invitation.guest_name}","${invitation.guest_email}","${invitation.event_name}","${invitation.sub_event_name || ''}","${invitation.response_status}","${invitation.invitation_sent_at || ''}","${invitation.response_received_at || ''}","${invitation.guest_message || ''}","${invitation.event_date}"`
    ).join('\n');

    const blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invitation-tracking-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Invitation data has been exported to CSV.",
    });
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Invitation Dashboard
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Track all invitation sends and responses across events
              </p>
            </div>
            <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.total}</div>
            <div className="text-sm text-gray-600">Total Invitations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.declined}</div>
            <div className="text-sm text-gray-600">Declined</div>
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Filter by guest name..."
              value={filters.guestName}
              onChange={(e) => setFilters(prev => ({ ...prev, guestName: e.target.value }))}
            />
            <Input
              placeholder="Filter by event name..."
              value={filters.eventName}
              onChange={(e) => setFilters(prev => ({ ...prev, eventName: e.target.value }))}
            />
            <Input
              placeholder="Filter by sub-event name..."
              value={filters.subEventName}
              onChange={(e) => setFilters(prev => ({ ...prev, subEventName: e.target.value }))}
            />
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="no_response">No Response</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invitation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invitation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Sub Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Response Date</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitationData && invitationData.length > 0 ? (
                  invitationData.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{invitation.guest_name}</div>
                          <div className="text-sm text-gray-500">{invitation.guest_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{invitation.event_name}</TableCell>
                      <TableCell>{invitation.sub_event_name || '-'}</TableCell>
                      <TableCell>{getStatusBadge(invitation.response_status)}</TableCell>
                      <TableCell>
                        {invitation.invitation_sent_at ? 
                          new Date(invitation.invitation_sent_at).toLocaleDateString() : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>
                        {invitation.response_received_at ? 
                          new Date(invitation.response_received_at).toLocaleDateString() : 
                          '-'
                        }
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={invitation.guest_message || ''}>
                        {invitation.guest_message || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Mail className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500">No invitation data found</p>
                        <p className="text-sm text-gray-400">Invitations will appear here once you start sending them</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {invitationData && invitationData.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {invitationData.length} invitation{invitationData.length !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
