
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

export const EventsHeader = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Your Events
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage your events and track their performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/events/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Link>
            </Button>
            <Button asChild>
              <Link to="/rsvp-events">
                <Calendar className="w-4 h-4 mr-2" />
                RSVP Events
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
