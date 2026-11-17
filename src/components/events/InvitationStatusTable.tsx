
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface InvitationStatus {
  id: string;
  guest_name: string;
  guest_email: string;
  response_status: string;
  invitation_sent_at: string | null;
  response_received_at: string | null;
  guest_message: string | null;
}

interface InvitationStatusTableProps {
  invitationStatus: InvitationStatus[] | undefined;
}

export const InvitationStatusTable = ({ invitationStatus }: InvitationStatusTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800">Declined</Badge>;
      case 'maybe':
        return <Badge className="bg-yellow-100 text-yellow-800">Maybe</Badge>;
      default:
        return <Badge variant="secondary">No Response</Badge>;
    }
  };

  if (!invitationStatus || invitationStatus.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead>Responded At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitationStatus.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell className="font-medium">{invite.guest_name}</TableCell>
                <TableCell>{invite.guest_email}</TableCell>
                <TableCell>{getStatusBadge(invite.response_status)}</TableCell>
                <TableCell>
                  {invite.invitation_sent_at ? 
                    new Date(invite.invitation_sent_at).toLocaleDateString() : 
                    '-'
                  }
                </TableCell>
                <TableCell>
                  {invite.response_received_at ? 
                    new Date(invite.response_received_at).toLocaleDateString() : 
                    '-'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
