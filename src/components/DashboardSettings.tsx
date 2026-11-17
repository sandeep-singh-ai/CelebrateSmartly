
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const DashboardSettings = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [allowEventSharing, setAllowEventSharing] = useState(true);

  const handleEmailNotificationSave = () => {
    toast({
      title: "Settings Updated",
      description: "Email notification preferences have been saved.",
    });
    setShowEmailModal(false);
  };

  const handlePrivacySettingsSave = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy preferences have been saved.",
    });
    setShowPrivacyModal(false);
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would call an API to delete the account
      toast({
        title: "Account Deletion",
        description: "Account deletion would be processed here. This is a demo.",
        variant: "destructive",
      });
      setShowDeleteModal(false);
      // await signOut(); // Uncomment when implementing actual deletion
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates about your events and RSVPs</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowEmailModal(true)}>
                Configure
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Privacy Settings</h4>
                <p className="text-sm text-gray-500">Control who can see your events and information</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPrivacyModal(true)}>
                Manage
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
              <div>
                <h4 className="font-medium text-red-600">Delete Account</h4>
                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Notification Settings</DialogTitle>
            <DialogDescription>
              Choose which email notifications you'd like to receive.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="event-notifications">Event Updates</Label>
                <p className="text-sm text-gray-500">Get notified about event changes</p>
              </div>
              <Switch
                id="event-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rsvp-notifications">RSVP Updates</Label>
                <p className="text-sm text-gray-500">Get notified when guests RSVP</p>
              </div>
              <Switch id="rsvp-notifications" defaultChecked={true} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmailNotificationSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Settings Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Settings</DialogTitle>
            <DialogDescription>
              Control who can see your profile and events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="public-profile">Public Profile</Label>
                <p className="text-sm text-gray-500">Make your profile visible to everyone</p>
              </div>
              <Switch
                id="public-profile"
                checked={isPublicProfile}
                onCheckedChange={setIsPublicProfile}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="event-sharing">Allow Event Sharing</Label>
                <p className="text-sm text-gray-500">Let others share your events</p>
              </div>
              <Switch
                id="event-sharing"
                checked={allowEventSharing}
                onCheckedChange={setAllowEventSharing}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrivacyModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePrivacySettingsSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
              All your events, guest lists, and data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
