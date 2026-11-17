
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VendorDetailAboutProps {
  description: string;
}

export const VendorDetailAbout = ({ description }: VendorDetailAboutProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm mb-6">
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">
          {description || 'No description available.'}
        </p>
      </CardContent>
    </Card>
  );
};
