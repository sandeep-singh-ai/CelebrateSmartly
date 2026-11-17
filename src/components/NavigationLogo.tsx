
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export const NavigationLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
        <Calendar className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
        CelebrateSmartly
      </span>
    </Link>
  );
};
