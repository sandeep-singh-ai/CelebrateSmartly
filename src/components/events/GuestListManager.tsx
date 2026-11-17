
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Link, Send } from 'lucide-react';
import { useAvailableGuestLists, useAttachedGuestLists, useInvitationStatus } from './hooks/useGuestLists';
import { useAttachGuestList, useSendInvitations } from './hooks/useGuestListMutations';
import { InvitationStatusOverview } from './InvitationStatusOverview';
import { InvitationStatusTable } from './InvitationStatusTable';
import { AttachedGuestListsCard } from './AttachedGuestListsCard';
import { GuestListModals } from './GuestListModals';

interface GuestListManagerProps {
  eventId: string;
  eventType: 'event' | 'rsvp_event' | 'sub_event';
  eventTitle: string;
}

export const GuestListManager = ({ eventId, eventType, eventTitle }: GuestListManagerProps) => {
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [selectedGuestListId, setSelectedGuestListId] = useState<string>('');

  // Fetch data using custom hooks
  const { data: availableGuestLists } = useAvailableGuestLists();
  const { data: attachedGuestLists } = useAttachedGuestLists(eventId, eventType);
  const { data: invitationStatus } = useInvitationStatus(eventId, eventType);

  // Mutations
  const attachGuestListMutation = useAttachGuestList(eventId, eventType);
  const sendInvitationsMutation = useSendInvitations(eventId, eventType);

  const handleAttachGuestList = (guestListId: string) => {
    attachGuestListMutation.mutate(guestListId, {
      onSuccess: () => {
        setShowAttachModal(false);
        setSelectedGuestListId('');
      }
    });
  };

  const handleSendInvitations = (guestListId: string) => {
    sendInvitationsMutation.mutate(guestListId, {
      onSuccess: () => {
        setShowInvitationModal(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Guest Lists for {eventTitle}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage guest lists and track invitation responses
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAttachModal(true)}
                variant="outline"
              >
                <Link className="w-4 h-4 mr-2" />
                Attach Guest List
              </Button>
              <Button 
                onClick={() => setShowInvitationModal(true)}
                disabled={!attachedGuestLists || attachedGuestLists.length === 0}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Invitations
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status Overview */}
      <InvitationStatusOverview invitationStatus={invitationStatus} />

      {/* Attached Guest Lists */}
      <AttachedGuestListsCard attachedGuestLists={attachedGuestLists} />

      {/* Invitation Status Table */}
      <InvitationStatusTable invitationStatus={invitationStatus} />

      {/* Modals */}
      <GuestListModals
        showAttachModal={showAttachModal}
        setShowAttachModal={setShowAttachModal}
        showInvitationModal={showInvitationModal}
        setShowInvitationModal={setShowInvitationModal}
        selectedGuestListId={selectedGuestListId}
        setSelectedGuestListId={setSelectedGuestListId}
        availableGuestLists={availableGuestLists}
        attachedGuestLists={attachedGuestLists}
        onAttachGuestList={handleAttachGuestList}
        onSendInvitations={handleSendInvitations}
        isAttaching={attachGuestListMutation.isPending}
        isSending={sendInvitationsMutation.isPending}
      />
    </div>
  );
};
