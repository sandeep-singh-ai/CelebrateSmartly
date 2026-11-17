
import React from 'react';
import { Users } from 'lucide-react';
import { GuestItem } from './GuestItem';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  category?: string;
  created_at: string;
}

interface GuestListProps {
  guests: Guest[];
  onDeleteGuest: (guestId: string) => void;
}

export const GuestList = ({ guests, onDeleteGuest }: GuestListProps) => {
  if (guests.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No guests yet</h3>
        <p className="text-gray-600 mb-4">Add your first guest to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {guests.map((guest) => (
        <GuestItem
          key={guest.id}
          guest={guest}
          onDeleteGuest={onDeleteGuest}
        />
      ))}
    </div>
  );
};
