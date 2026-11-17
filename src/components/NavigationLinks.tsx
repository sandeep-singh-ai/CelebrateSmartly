import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationLinksProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export const NavigationLinks: React.FC<NavigationLinksProps> = ({ 
  isMobile = false, 
  onLinkClick 
}) => {
  const location = useLocation();
  
  const links = [
    { to: '/vendors', label: 'Find Vendors' },
    { to: '/browse-events', label: 'Browse Events' },
    { to: '/blog', label: 'Blog' },
    // { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  const linkClasses = isMobile 
    ? "block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
    : "text-gray-700 hover:text-purple-600 transition-colors font-medium";

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`${linkClasses} ${
            location.pathname === link.to ? 'text-purple-600' : ''
          }`}
          onClick={onLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};
