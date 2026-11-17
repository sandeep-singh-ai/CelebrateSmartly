
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Clock, Mail, Settings, Trash2 } from 'lucide-react';
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

interface RSVPEvent {
  id: string;
  title: string;
  main_date: string;
  description?: string;
  cover_image?: string;
  is_public: boolean;
  created_at: string;
  sub_events_count?: number;
  guests_count?: number;
  responses_count?: number;
}

interface RSVPEventCardProps {
  event: RSVPEvent;
  onManage: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
  onDelete?: () => void;
}

export const RSVPEventCard = ({ event, onManage, onViewDetails, onDelete }: RSVPEventCardProps) => {
  const { currentTier } = useSubscription();
  const { toast } = useToast();

  const isGoldTier = currentTier?.name === 'Gold';

  const handleDeleteEvent = async () => {
    try {
      const { error } = await supabase
        .from('rsvp_events')
        .delete()
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "RSVP event deleted successfully!",
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting RSVP event:', error);
      toast({
        title: "Error",
        description: "Failed to delete RSVP event.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {event.cover_image && (
        <div className="h-48 overflow-hidden rounded-t-lg">
          <img 
            src={event.cover_image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <Badge variant={event.is_public ? "default" : "secondary"}>
            {event.is_public ? "Public" : "Private"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {format(new Date(event.main_date), 'MMM dd, yyyy')}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {event.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>{event.sub_events_count || 0} Events</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-green-500" />
            <span>{event.guests_count || 0} Guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4 text-purple-500" />
            <span>{event.responses_count || 0} RSVPs</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onManage(event.id)}
            className="flex-1"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
          <Button 
            onClick={() => onViewDetails(event.id)}
            variant="outline"
            size="sm"
          >
            View Details
          </Button>
          {isGoldTier && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete RSVP Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{event.title}"? This action cannot be undone and will also delete all associated sub-events, guests, and RSVPs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteEvent}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Event
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
