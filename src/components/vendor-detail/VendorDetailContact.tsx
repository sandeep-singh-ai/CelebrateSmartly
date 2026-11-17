
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Globe } from 'lucide-react';

interface VendorDetailContactProps {
  phone?: string;
  email?: string;
  website?: string;
}

export const VendorDetailContact = ({ phone, email, website }: VendorDetailContactProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm sticky top-4">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {phone && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-pink-500" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-gray-600">{phone}</p>
            </div>
          </div>
        )}
        
        {email && (
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-pink-500" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>
        )}
        
        {website && (
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-pink-500" />
            <div>
              <p className="font-medium">Website</p>
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                Visit Website
              </a>
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
            Contact Vendor
          </Button>
          <Button variant="outline" className="w-full mt-2">
            Request Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
