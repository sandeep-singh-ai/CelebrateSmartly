
import React from 'react';
import { EventsHeader } from './events/EventsHeader';
import { EventsStats } from './events/EventsStats';
import { EventsTable } from './events/EventsTable';
import { useEvents } from '@/hooks/useEvents';

const DashboardEvents = () => {
  const { events, isLoading, totalEvents, upcomingEvents, pastEvents, removeEvent } = useEvents();

  return (
    <div className="space-y-6">
      <EventsHeader />
      <EventsStats 
        totalEvents={totalEvents}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
      />
      <EventsTable 
        events={events}
        isLoading={isLoading}
        onEventDeleted={removeEvent}
      />
    </div>
  );
};

export default DashboardEvents;
