
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface GuestList {
  id: string;
  title: string;
  description: string;
  created_at: string;
  guest_count: number;
}

interface GuestListModalsProps {
  showAttachModal: boolean;
  setShowAttachModal: (show: boolean) => void;
  showInvitationModal: boolean;
  setShowInvitationModal: (show: boolean) => void;
  selectedGuestListId: string;
  setSelectedGuestListId: (id: string) => void;
  availableGuestLists: GuestList[] | undefined;
  attachedGuestLists: any[] | undefined;
  onAttachGuestList: (id: string) => void;
  onSendInvitations: (id: string) => void;
  isAttaching: boolean;
  isSending: boolean;
}

export const GuestListModals = ({
  showAttachModal,
  setShowAttachModal,
  showInvitationModal,
  setShowInvitationModal,
  selectedGuestListId,
  setSelectedGuestListId,
  availableGuestLists,
  attachedGuestLists,
  onAttachGuestList,
  onSendInvitations,
  isAttaching,
  isSending
}: GuestListModalsProps) => {
  return (
    <>
      {/* Attach Guest List Modal */}
      <Dialog open={showAttachModal} onOpenChange={setShowAttachModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach Guest List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedGuestListId} onValueChange={setSelectedGuestListId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a guest list to attach" />
              </SelectTrigger>
              <SelectContent>
                {availableGuestLists?.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.title} ({list.guest_count} guests)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAttachModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => onAttachGuestList(selectedGuestListId)}
                disabled={!selectedGuestListId || isAttaching}
              >
                Attach
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Invitations Modal */}
      <Dialog open={showInvitationModal} onOpenChange={setShowInvitationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invitations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select a guest list to send invitations to all guests in that list.
            </p>
            <Select value={selectedGuestListId} onValueChange={setSelectedGuestListId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a guest list" />
              </SelectTrigger>
              <SelectContent>
                {attachedGuestLists?.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInvitationModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => onSendInvitations(selectedGuestListId)}
                disabled={!selectedGuestListId || isSending}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Invitations
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
