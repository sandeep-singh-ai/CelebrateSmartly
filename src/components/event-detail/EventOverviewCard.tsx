
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';

type EventFromDB = Tables<'events'>;

interface EventOverviewCardProps {
  event: EventFromDB;
}

export const EventOverviewCard: React.FC<EventOverviewCardProps> = ({ event }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{event.description || 'No description provided.'}</p>
      </CardContent>
    </Card>
  );
};
