
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Filter, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RSVPData {
  id: string;
  guest_name: string;
  guest_email: string;
  event_name: string;
  sub_event_name?: string;
  status: string;
  comment?: string;
  event_date: string;
  sub_event_date?: string;
  event_type: 'event' | 'rsvp_event';
}

export const RSVPManagement = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    eventName: '',
    subEventName: '',
    status: 'all',
    guestName: '',
  });

  const { data: rsvpData, isLoading } = useQuery({
    queryKey: ['rsvp-management', filters],
    queryFn: async () => {
      // Get RSVPs from regular events
      const { data: eventRSVPs, error: eventError } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          guest_name,
          guest_email,
          response,
          guest_message,
          events (
            id,
            title,
            event_date
          )
        `);

      if (eventError) throw eventError;

      // Get guest invites for sub-events
      const { data: subEventInvites, error: subEventError } = await supabase
        .from('guest_invites')
        .select(`
          id,
          status,
          sub_events (
            id,
            name,
            event_date,
            rsvp_event_id,
            event_id,
            rsvp_events (
              id,
              title
            ),
            events (
              id,
              title
            )
          ),
          rsvp_guests (
            id,
            name,
            email
          )
        `);

      if (subEventError) throw subEventError;

      const allRSVPs: RSVPData[] = [];

      // Process regular event RSVPs
      eventRSVPs?.forEach((rsvp: any) => {
        allRSVPs.push({
          id: rsvp.id,
          guest_name: rsvp.guest_name,
          guest_email: rsvp.guest_email,
          event_name: rsvp.events?.title || 'Unknown Event',
          status: rsvp.response,
          comment: rsvp.guest_message,
          event_date: rsvp.events?.event_date,
          event_type: 'event'
        });
      });

      // Process sub-event invites
      subEventInvites?.forEach((invite: any) => {
        const parentEvent = invite.sub_events?.rsvp_events || invite.sub_events?.events;
        allRSVPs.push({
          id: invite.id,
          guest_name: invite.rsvp_guests?.name || 'Unknown Guest',
          guest_email: invite.rsvp_guests?.email || '',
          event_name: parentEvent?.title || 'Unknown Event',
          sub_event_name: invite.sub_events?.name,
          status: invite.status,
          event_date: parentEvent?.event_date || invite.sub_events?.event_date,
          sub_event_date: invite.sub_events?.event_date,
          event_type: invite.sub_events?.rsvp_event_id ? 'rsvp_event' : 'event'
        });
      });

      // Apply filters
      return allRSVPs.filter((rsvp) => {
        return (
          (!filters.eventName || rsvp.event_name.toLowerCase().includes(filters.eventName.toLowerCase())) &&
          (!filters.subEventName || (rsvp.sub_event_name && rsvp.sub_event_name.toLowerCase().includes(filters.subEventName.toLowerCase()))) &&
          (filters.status === 'all' || rsvp.status === filters.status) &&
          (!filters.guestName || rsvp.guest_name.toLowerCase().includes(filters.guestName.toLowerCase()))
        );
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'yes': { label: 'Accepted', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'no': { label: 'Not Coming', variant: 'secondary' as const, className: 'bg-red-100 text-red-800' },
      'maybe': { label: 'Maybe', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' },
      'accepted': { label: 'Accepted', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'declined': { label: 'Not Coming', variant: 'secondary' as const, className: 'bg-red-100 text-red-800' },
      'no_response': { label: 'No Response', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.no_response;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const exportToCSV = () => {
    if (!rsvpData || rsvpData.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no RSVP records to export.",
        variant: "destructive",
      });
      return;
    }

    const csvHeaders = "Guest Name,Guest Email,Event Name,Sub Event Name,Status,Comment,Event Date\n";
    const csvData = rsvpData.map(rsvp => 
      `"${rsvp.guest_name}","${rsvp.guest_email}","${rsvp.event_name}","${rsvp.sub_event_name || ''}","${rsvp.status}","${rsvp.comment || ''}","${rsvp.event_date}"`
    ).join('\n');

    const blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "RSVP data has been exported to CSV.",
    });
  };

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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              RSVP Management
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track all guest RSVPs across events and sub-events
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Input
              placeholder="Filter by guest name..."
              value={filters.guestName}
              onChange={(e) => setFilters(prev => ({ ...prev, guestName: e.target.value }))}
            />
          </div>
          <div>
            <Input
              placeholder="Filter by event name..."
              value={filters.eventName}
              onChange={(e) => setFilters(prev => ({ ...prev, eventName: e.target.value }))}
            />
          </div>
          <div>
            <Input
              placeholder="Filter by sub-event name..."
              value={filters.subEventName}
              onChange={(e) => setFilters(prev => ({ ...prev, subEventName: e.target.value }))}
            />
          </div>
          <div>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="yes">Accepted</SelectItem>
                <SelectItem value="no">Not Coming</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="no_response">No Response</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* RSVP Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Sub Event Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvpData && rsvpData.length > 0 ? (
                rsvpData.map((rsvp) => (
                  <TableRow key={rsvp.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{rsvp.guest_name}</div>
                        <div className="text-sm text-gray-500">{rsvp.guest_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{rsvp.event_name}</TableCell>
                    <TableCell>{rsvp.sub_event_name || '-'}</TableCell>
                    <TableCell>{getStatusBadge(rsvp.status)}</TableCell>
                    <TableCell className="max-w-xs truncate" title={rsvp.comment}>
                      {rsvp.comment || '-'}
                    </TableCell>
                    <TableCell>
                      {rsvp.sub_event_date || rsvp.event_date ? 
                        new Date(rsvp.sub_event_date || rsvp.event_date).toLocaleDateString() : 
                        '-'
                      }
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500">No RSVP data found</p>
                      <p className="text-sm text-gray-400">RSVPs will appear here once guests start responding</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {rsvpData && rsvpData.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {rsvpData.length} RSVP{rsvpData.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
