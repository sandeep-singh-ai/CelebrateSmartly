
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { RSVPData } from './hooks/useRSVPData';

interface RSVPEventHeaderProps {
  rsvpData: RSVPData;
}

export const RSVPEventHeader = ({ rsvpData }: RSVPEventHeaderProps) => {
  const formatTime = (time: string | null | undefined) => {
    if (!time) return '';
    return format(new Date(`2000-01-01T${time}`), 'h:mm a');
  };

  const eventTitle = rsvpData.sub_event?.rsvp_event?.title || rsvpData.event?.title || 'Event Invitation';
  const eventDate = rsvpData.sub_event?.event_date || rsvpData.event?.event_date || new Date().toISOString();
  const eventLocation = rsvpData.sub_event?.location || rsvpData.event?.location;

  return (
    <Card className="mb-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{eventTitle}</CardTitle>
        {rsvpData.sub_event && (
          <h2 className="text-xl text-purple-600">{rsvpData.sub_event.name}</h2>
        )}
        <p className="text-gray-600">
          You're invited, {rsvpData.guest.name}!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            {format(new Date(eventDate), 'EEEE, MMMM dd, yyyy')}
          </div>
          {(rsvpData.sub_event?.start_time || rsvpData.sub_event?.end_time) && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              {rsvpData.sub_event.start_time && formatTime(rsvpData.sub_event.start_time)}
              {rsvpData.sub_event.start_time && rsvpData.sub_event.end_time && ' - '}
              {rsvpData.sub_event.end_time && formatTime(rsvpData.sub_event.end_time)}
            </div>
          )}
        </div>

        {eventLocation && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-purple-500" />
            {eventLocation}
          </div>
        )}

        {rsvpData.sub_event?.dress_code && (
          <div className="text-center">
            <Badge variant="outline" className="text-purple-600">
              Dress Code: {rsvpData.sub_event.dress_code}
            </Badge>
          </div>
        )}

        {rsvpData.sub_event?.notes && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">{rsvpData.sub_event.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
