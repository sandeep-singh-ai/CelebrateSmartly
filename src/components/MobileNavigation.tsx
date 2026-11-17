
import React from 'react';
import { NavigationLinks } from './NavigationLinks';
import { NavigationAuthButtons } from './NavigationAuthButtons';
import { User } from '@supabase/supabase-js';

interface MobileNavigationProps {
  isOpen: boolean;
  user: any;
  onAuthClick: (mode: 'login' | 'signup') => void;
  onSignOut: () => void;
  onClose: () => void;
  loading?: boolean;
}

export const MobileNavigation = ({ 
  isOpen, 
  user, 
  onAuthClick, 
  onSignOut, 
  onClose,
  loading = false
}: MobileNavigationProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 border-t border-pink-100">
      <div className="flex flex-col space-y-4">
        <NavigationLinks />
        
        <div className="pt-4 border-t border-pink-100">
          <NavigationAuthButtons 
            user={user}
            onAuthClick={onAuthClick}
            onSignOut={onSignOut}
            isMobile
            onButtonClick={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
