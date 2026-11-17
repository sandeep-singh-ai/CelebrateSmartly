
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface EventsStatsProps {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
}

export const EventsStats = ({ totalEvents, upcomingEvents, pastEvents }: EventsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-blue-500 mr-4" />
            <div>
              <CardTitle className="text-2xl font-semibold">{totalEvents}</CardTitle>
              <p className="text-sm text-gray-500">Total Events</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-green-500 mr-4" />
            <div>
              <CardTitle className="text-2xl font-semibold">{upcomingEvents}</CardTitle>
              <p className="text-sm text-gray-500">Upcoming Events</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-orange-500 mr-4" />
            <div>
              <CardTitle className="text-2xl font-semibold">{pastEvents}</CardTitle>
              <p className="text-sm text-gray-500">Past Events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
