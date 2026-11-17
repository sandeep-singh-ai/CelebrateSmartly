
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { GuestListManager } from '@/components/events/GuestListManager';
import { useSubscription } from '@/hooks/useSubscription';
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

interface SubEvent {
  id: string;
  name: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  notes?: string;
  venue_map_link?: string;
  dress_code?: string;
  created_at: string;
}

interface SubEventCardProps {
  subEvent: SubEvent;
  onDelete: (subEventId: string) => void;
  isDeleting: boolean;
}

export const SubEventCard = ({ subEvent, onDelete, isDeleting }: SubEventCardProps) => {
  const { currentTier } = useSubscription();
  const isGoldTier = currentTier?.name === 'Gold';

  const formatTime = (time: string | null | undefined) => {
    if (!time) return '';
    return format(new Date(`2000-01-01T${time}`), 'h:mm a');
  };

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{subEvent.name}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(subEvent.event_date), 'MMM dd, yyyy')}
              </div>
              {(subEvent.start_time || subEvent.end_time) && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {subEvent.start_time && formatTime(subEvent.start_time)}
                  {subEvent.start_time && subEvent.end_time && ' - '}
                  {subEvent.end_time && formatTime(subEvent.end_time)}
                </div>
              )}
            </div>
            {subEvent.location && (
              <p className="text-sm text-gray-600 mt-1">📍 {subEvent.location}</p>
            )}
            {subEvent.dress_code && (
              <Badge variant="outline" className="mt-2">
                {subEvent.dress_code}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {isGoldTier && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Sub-Event</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{subEvent.name}"? This action cannot be undone and will also delete all associated guest invites and RSVPs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(subEvent.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Sub-Event
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      {subEvent.notes && (
        <CardContent className="pt-0">
          <p className="text-sm text-gray-700">{subEvent.notes}</p>
        </CardContent>
      )}
      
      {/* Guest List Manager for each sub-event */}
      <CardContent className="pt-0">
        <GuestListManager 
          eventId={subEvent.id}
          eventType="sub_event"
          eventTitle={subEvent.name}
        />
      </CardContent>
    </Card>
  );
};
