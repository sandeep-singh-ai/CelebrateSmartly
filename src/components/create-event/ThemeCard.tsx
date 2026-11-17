
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Theme {
  theme_name: string;
  colors: string[];
  party_suppliers: string[];
  food_recommendations: string[];
  additional_recommendations: string[];
}

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (theme: Theme) => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isSelected, onSelect }) => {
  const { toast } = useToast();

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(theme);
    toast({
      title: "Theme Selected!",
      description: `${theme.theme_name} has been selected for your event.`,
    });
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={() => onSelect(theme)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{theme.theme_name}</CardTitle>
        <div className="flex gap-2 flex-wrap">
          {theme.colors.map((color, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full shadow-md border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-700">Party Suppliers:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {theme.party_suppliers.slice(0, 3).map((supplier, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {supplier}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-700">Food & Beverages:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {theme.food_recommendations.slice(0, 3).map((food, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {food}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-700">Additional Ideas:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {theme.additional_recommendations.slice(0, 2).map((recommendation, i) => (
              <li key={i} className="flex items-start">
                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
        <Button 
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="w-full mt-3"
          onClick={handleSelect}
        >
          {isSelected ? "Selected" : "Select Theme"}
        </Button>
      </CardContent>
    </Card>
  );
};
