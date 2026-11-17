
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeCard } from './ThemeCard';

interface Theme {
  theme_name: string;
  colors: string[];
  party_suppliers: string[];
  food_recommendations: string[];
  additional_recommendations: string[];
}

interface ThemeSelectionProps {
  themes: Theme[];
  selectedTheme: Theme | null;
  onThemeSelect: (theme: Theme) => void;
  onBack: () => void;
  onCreateEvent: () => void;
  loading: boolean;
}

export const ThemeSelection: React.FC<ThemeSelectionProps> = ({
  themes,
  selectedTheme,
  onThemeSelect,
  onBack,
  onCreateEvent,
  loading
}) => {
  return (
    <>
      <CardHeader className="space-y-2">
        <CardTitle>Select a Theme</CardTitle>
        <p className="text-sm text-muted-foreground">Choose the perfect theme for your event</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        {themes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme, index) => (
              <ThemeCard
                key={index}
                theme={theme}
                isSelected={selectedTheme?.theme_name === theme.theme_name}
                onSelect={onThemeSelect}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No themes generated. Please go back to step 1 and generate themes.</p>
        )}
        
        {selectedTheme && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✓ Selected Theme: {selectedTheme.theme_name}
            </p>
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back to Step 1
          </Button>
          <Button 
            onClick={onCreateEvent} 
            disabled={loading || !selectedTheme} 
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </Button>
        </div>
      </CardContent>
    </>
  );
};
