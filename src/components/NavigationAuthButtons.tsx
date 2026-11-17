
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

interface NavigationAuthButtonsProps {
  user: User | null;
  onAuthClick: (mode: 'login' | 'signup') => void;
  onSignOut: () => void;
  isMobile?: boolean;
  onButtonClick?: () => void;
  loading?: boolean;
}

export const NavigationAuthButtons = ({ 
  user, 
  onAuthClick, 
  onSignOut, 
  isMobile = false,
  onButtonClick,
  loading = false
}: NavigationAuthButtonsProps) => {
  console.log('🔄 NavigationAuthButtons: Rendering with user:', user?.email || 'No user', 'loading:', loading);
  
  if (user) {
    return (
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-4'}`}>
        <Link to="/dashboard" onClick={onButtonClick}>
          <Button variant="outline" className={isMobile ? 'w-full' : ''}>
            Dashboard
          </Button>
        </Link>
        <Button 
          onClick={() => {
            console.log('🔄 NavigationAuthButtons: Sign out button clicked');
            onSignOut();
            onButtonClick?.();
          }} 
          variant="ghost" 
          className={`${isMobile ? 'w-full' : ''} hover:bg-red-50 hover:text-red-600`}
          title="Click to sign out"
          disabled={loading}
        >
          {loading ? 'Signing Out...' : 'Sign Out'}
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-2'}`}>
      <Button
        onClick={() => {
          onAuthClick('login');
          onButtonClick?.();
        }}
        variant="ghost"
        className={isMobile ? 'w-full' : ''}
      >
        Sign In
      </Button>
      <Button
        onClick={() => {
          onAuthClick('signup');
          onButtonClick?.();
        }}
        className={`${isMobile ? 'w-full' : ''} bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600`}
      >
        Get Started
      </Button>
    </div>
  );
};
