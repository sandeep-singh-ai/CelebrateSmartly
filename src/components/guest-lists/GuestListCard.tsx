
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Clock, Calendar, ArrowRight } from 'lucide-react';

interface GuestList {
  id: string;
  title: string;
  description: string;
  event_id: string;
  created_at: string;
  invitation_sent_at: string | null;
  reminder_sent_at: string | null;
  event?: {
    title: string;
  };
  guest_count?: number;
  response_count?: number;
}

interface GuestListCardProps {
  guestList: GuestList;
  onUpdate: () => void;
}

export const GuestListCard = ({ guestList, onUpdate }: GuestListCardProps) => {
  const navigate = useNavigate();

  const handleManage = () => {
    navigate(`/guest-lists/${guestList.id}`);
  };

  const getStatusBadge = () => {
    if (guestList.invitation_sent_at) {
      return <Badge className="bg-green-100 text-green-800">Invites Sent</Badge>;
    }
    return <Badge variant="secondary">Draft</Badge>;
  };

  const responseRate = guestList.guest_count ? 
    Math.round(((guestList.response_count || 0) / guestList.guest_count) * 100) : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{guestList.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className="w-4 h-4" />
              {guestList.event?.title}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
        {guestList.description && (
          <p className="text-sm text-gray-600 mt-2">{guestList.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Guests</p>
              <p className="font-semibold">{guestList.guest_count || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Responses</p>
              <p className="font-semibold">{guestList.response_count || 0}</p>
            </div>
          </div>
        </div>

        {/* Response Rate */}
        {guestList.guest_count && guestList.guest_count > 0 && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Response Rate</span>
              <span>{responseRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${responseRate}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Created {new Date(guestList.created_at).toLocaleDateString()}
          </div>
          {guestList.invitation_sent_at && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              Invites sent {new Date(guestList.invitation_sent_at).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <Button 
          onClick={handleManage}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          Manage Guest List
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
