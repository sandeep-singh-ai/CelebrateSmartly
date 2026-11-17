
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GuestList {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface AttachedGuestListsCardProps {
  attachedGuestLists: GuestList[] | undefined;
}

export const AttachedGuestListsCard = ({ attachedGuestLists }: AttachedGuestListsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attached Guest Lists</CardTitle>
      </CardHeader>
      <CardContent>
        {attachedGuestLists && attachedGuestLists.length > 0 ? (
          <div className="space-y-3">
            {attachedGuestLists.map((list) => (
              <div key={list.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{list.title}</p>
                  {list.description && <p className="text-sm text-gray-600">{list.description}</p>}
                </div>
                <Badge variant="outline">Attached</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No guest lists attached yet</p>
        )}
      </CardContent>
    </Card>
  );
};
