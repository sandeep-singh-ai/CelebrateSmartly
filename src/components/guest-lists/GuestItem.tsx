
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  category?: string;
  created_at: string;
}

interface GuestItemProps {
  guest: Guest;
  onDeleteGuest: (guestId: string) => void;
}

export const GuestItem = ({ guest, onDeleteGuest }: GuestItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium">{guest.name}</h4>
        <p className="text-sm text-gray-600">{guest.email}</p>
        {guest.phone_number && (
          <p className="text-sm text-gray-500">{guest.phone_number}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDeleteGuest(guest.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
