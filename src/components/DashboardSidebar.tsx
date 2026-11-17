
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  Star, 
  CreditCard, 
  Bell, 
  Calendar, 
  Heart,
  Settings,
  Clock,
  Plus,
  QrCode,
} from 'lucide-react';

export const DashboardSidebar = () => {
  return (
    <div className="w-80 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Get started with common tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link to="/events/create" className="w-full">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Button>
          </Link>
          
          <Link to="/website-builder" className="w-full">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Build Event Website
            </Button>
          </Link>
          
          <Link to="/guest-lists" className="w-full">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Guest Lists
            </Button>
          </Link>
          
          <Link to="/vendor-search" className="w-full">
            <Button variant="outline" className="w-full justify-start">
              <Search className="h-4 w-4 mr-2" />
              Find Local Vendors
            </Button>
          </Link>
          
          <Link to="/pricing" className="w-full">
            <Button className="w-full justify-start bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" disabled>
            <Clock className="h-4 w-4 mr-2" />
            Recent Searches
          </Button>
          
          <Button variant="outline" className="w-full justify-start" disabled>
            <Bell className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>
          
          <Link to="/events" className="w-full">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Browse Events
            </Button>
          </Link>

          <Link to="/qr-scanner" className="w-full">
            <Button variant="outline" className="w-full justify-start">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code Scanner
            </Button>
          </Link>
          
          <Link to="/saved-vendors" className="w-full">
            <Button variant="outline" className="w-full justify-start">
              <Heart className="h-4 w-4 mr-2" />
              Saved Vendors
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
