
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  firstName: string;
  role: string;
  currentTierName: string;
  onSignOut: () => void;
}

export const DashboardHeader = ({ firstName, role, currentTierName, onSignOut }: DashboardHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 w-full">
      <div className="w-full px-4 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {firstName}!
            </h1>
            <p className="text-gray-600">
              {role === 'vendor' ? 'Manage your business' : 'Plan amazing events'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
              {currentTierName || 'Free'} Plan
            </Badge>
            <Button onClick={onSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
