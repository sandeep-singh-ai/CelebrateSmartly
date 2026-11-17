
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type EventFromDB = Tables<'events'>;

interface SelectedThemeCardProps {
  event: EventFromDB;
}

export const SelectedThemeCard: React.FC<SelectedThemeCardProps> = ({ event }) => {
  const selectedTheme = event.selected_theme && 
    typeof event.selected_theme === 'object' && 
    !Array.isArray(event.selected_theme) && 
    'theme_name' in event.selected_theme 
      ? event.selected_theme as { theme_name: string; colors: string[]; party_suppliers: string[]; food_recommendations: string[]; additional_recommendations: string[] }
      : null;

  if (!selectedTheme) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Theme Selected</h3>
          <p className="text-gray-600">This event doesn't have a selected theme yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Selected Theme: {selectedTheme.theme_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Colors */}
        <div>
          <h4 className="font-semibold mb-2">Color Palette</h4>
          <div className="flex gap-2">
            {selectedTheme.colors?.map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full shadow-md border border-gray-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Party Suppliers */}
        <div>
          <h4 className="font-semibold mb-2">Party Suppliers</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {selectedTheme.party_suppliers?.map((supplier, i) => (
              <li key={i}>{supplier}</li>
            ))}
          </ul>
        </div>

        {/* Food Recommendations */}
        <div>
          <h4 className="font-semibold mb-2">Food & Beverages</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {selectedTheme.food_recommendations?.map((food, i) => (
              <li key={i}>{food}</li>
            ))}
          </ul>
        </div>

        {/* Additional Recommendations */}
        <div>
          <h4 className="font-semibold mb-2">Additional Ideas</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {selectedTheme.additional_recommendations?.map((recommendation, i) => (
              <li key={i}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
