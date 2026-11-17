
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { SubEventCard } from './SubEventCard';

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

interface SubEventListProps {
  subEvents: SubEvent[] | undefined;
  onCreateClick: () => void;
  onDeleteSubEvent: (subEventId: string) => void;
  deletingSubEventId: string | null;
}

export const SubEventList = ({ 
  subEvents, 
  onCreateClick, 
  onDeleteSubEvent, 
  deletingSubEventId 
}: SubEventListProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Sub-Events
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage individual events within your main event
            </p>
          </div>
          <Button 
            onClick={onCreateClick}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Sub-Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {subEvents && subEvents.length > 0 ? (
          <div className="space-y-4">
            {subEvents.map((subEvent) => (
              <SubEventCard
                key={subEvent.id}
                subEvent={subEvent}
                onDelete={onDeleteSubEvent}
                isDeleting={deletingSubEventId === subEvent.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sub-events yet</h3>
            <p className="text-gray-600 mb-4">Create your first sub-event to get started</p>
            <Button 
              onClick={onCreateClick}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sub-Event
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
