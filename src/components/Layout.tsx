
import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

export const Layout = ({ 
  children, 
  showNavigation = true, 
  showFooter = true 
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && <Navigation />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
