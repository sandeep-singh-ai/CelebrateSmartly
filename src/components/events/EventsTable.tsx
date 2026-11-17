
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Plus, MapPin, Settings, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  event_type: string;
}

interface EventsTableProps {
  events: Event[];
  isLoading: boolean;
  onEventDeleted: (eventId: string) => void;
}

export const EventsTable = ({ events, isLoading, onEventDeleted }: EventsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentTier } = useSubscription();
  const [deletingEventId, setDeletingEventId] = React.useState<string | null>(null);

  const isGoldTier = currentTier?.name === 'Gold';

  const getEventStatus = (eventDate: string) => {
    const now = new Date();
    const date = new Date(eventDate);
    
    if (date > now) {
      return { label: 'Upcoming', variant: 'default' as const };
    } else {
      return { label: 'Past', variant: 'secondary' as const };
    }
  };

  const handleManageEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    setDeletingEventId(eventId);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      onEventDeleted(eventId);
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    } finally {
      setDeletingEventId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event: Event) => {
                const status = getEventStatus(event.event_date);
                return (
                  <TableRow key={event.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{event.title}</div>
                        {event.description && (
                          <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {format(new Date(event.event_date), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.location ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="truncate max-w-32">{event.location}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No location</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.event_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageEvent(event.id)}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/events/${event.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        {isGoldTier && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                disabled={deletingEventId === event.id}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                {deletingEventId === event.id ? 'Deleting...' : 'Delete'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{event.title}"? This action cannot be undone and will also delete all associated guest lists, sub-events, and RSVPs.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Event
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Events Yet</h3>
            <p className="text-gray-600 mb-4">Create your first event to get started</p>
            <Button asChild>
              <Link to="/events/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
