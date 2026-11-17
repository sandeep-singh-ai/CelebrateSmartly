
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { GuestListManager } from '@/components/events/GuestListManager';
import { CreateSubEventModal } from './CreateSubEventModal';
import { SubEventList } from './SubEventList';
import { useSubEvents } from './hooks/useSubEvents';

interface SubEventManagementProps {
  eventId: string;
  eventType?: 'event' | 'rsvp_event';
}

export const SubEventManagement = ({ eventId, eventType = 'event' }: SubEventManagementProps) => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingSubEventId, setDeletingSubEventId] = useState<string | null>(null);

  const { subEvents, isLoading, deleteSubEvent, isDeletingSubEvent } = useSubEvents(eventId, eventType);

  const handleDeleteSubEvent = async (subEventId: string) => {
    setDeletingSubEventId(subEventId);
    try {
      await deleteSubEvent(subEventId);
    } finally {
      setDeletingSubEventId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubEventList
        subEvents={subEvents}
        onCreateClick={() => setShowCreateModal(true)}
        onDeleteSubEvent={handleDeleteSubEvent}
        deletingSubEventId={deletingSubEventId}
      />

      {/* Guest List Manager for the main event */}
      <GuestListManager 
        eventId={eventId}
        eventType={eventType}
        eventTitle="Main Event"
      />

      {/* Create Sub-Event Modal */}
      <CreateSubEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['sub-events', eventId, eventType] });
        }}
        eventId={eventId}
        eventType={eventType}
      />
    </div>
  );
};
