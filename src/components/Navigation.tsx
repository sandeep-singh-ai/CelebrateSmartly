
import React, { useState } from 'react';
import { NavigationLogo } from './NavigationLogo';
import { NavigationLinks } from './NavigationLinks';
import { NavigationAuthButtons } from './NavigationAuthButtons';
import { MobileNavigation } from './MobileNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Navigation = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Error signing out:', error);
        // You could add a toast notification here if you want to show the error to the user
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavigationLogo />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavigationLinks />
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-3 py-1 text-xs">
                BETA
              </Badge>
            </div>
            
            <div className="hidden md:flex">
              <NavigationAuthButtons 
                user={user}
                onAuthClick={handleAuthClick}
                onSignOut={handleSignOut}
                loading={loading}
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation
            isOpen={isMobileMenuOpen}
            user={user}
            onAuthClick={handleAuthClick}
            onSignOut={handleSignOut}
            onClose={() => setIsMobileMenuOpen(false)}
            loading={loading}
          />
        </div>
      </nav>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </>
  );
};
