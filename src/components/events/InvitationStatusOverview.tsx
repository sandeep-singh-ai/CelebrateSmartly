
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface InvitationStatus {
  id: string;
  guest_name: string;
  guest_email: string;
  response_status: string;
  invitation_sent_at: string | null;
  response_received_at: string | null;
  guest_message: string | null;
}

interface InvitationStatusOverviewProps {
  invitationStatus: InvitationStatus[] | undefined;
}

export const InvitationStatusOverview = ({ invitationStatus }: InvitationStatusOverviewProps) => {
  const getStatusCounts = () => {
    if (!invitationStatus) return { accepted: 0, declined: 0, maybe: 0, noResponse: 0, total: 0 };
    
    return invitationStatus.reduce((acc, invite) => {
      acc.total++;
      switch (invite.response_status) {
        case 'accepted':
          acc.accepted++;
          break;
        case 'declined':
          acc.declined++;
          break;
        case 'maybe':
          acc.maybe++;
          break;
        default:
          acc.noResponse++;
      }
      return acc;
    }, { accepted: 0, declined: 0, maybe: 0, noResponse: 0, total: 0 });
  };

  const statusCounts = getStatusCounts();

  if (!invitationStatus || invitationStatus.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.total}</div>
          <div className="text-sm text-gray-600">Total Invites</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
          <div className="text-sm text-gray-600">Accepted</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statusCounts.declined}</div>
          <div className="text-sm text-gray-600">Declined</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.maybe}</div>
          <div className="text-sm text-gray-600">Maybe</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{statusCounts.noResponse}</div>
          <div className="text-sm text-gray-600">No Response</div>
        </CardContent>
      </Card>
    </div>
  );
};
