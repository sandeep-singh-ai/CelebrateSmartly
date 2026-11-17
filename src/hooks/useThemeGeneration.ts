
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Theme {
  theme_name: string;
  colors: string[];
  party_suppliers: string[];
  food_recommendations: string[];
  additional_recommendations: string[];
}

export const useThemeGeneration = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateThemes = async (
    eventName: string,
    location: string,
    numberOfPeople: number,
    selectedCategory: string
  ) => {
    if (!eventName || !location || !numberOfPeople || !selectedCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the event details.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Generating unique celebration themes...');

      const { data, error } = await supabase.functions.invoke('generate-themes', {
        body: {
          eventName,
          location,
          numberOfPeople,
          selectedCategory
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate themes');
      }

      if (data?.themes && Array.isArray(data.themes)) {
        console.log('Successfully generated unique themes:', data.themes.length);
        setThemes(data.themes);
        toast({
          title: "Unique Themes Generated!",
          description: "Extraordinary celebration themes created just for your event.",
        });
        return data.themes;
      } else {
        throw new Error('Invalid response format from theme generation');
      }
    } catch (error) {
      console.error('Error generating themes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to generate themes: ${errorMessage}`,
        variant: "destructive",
      });
      setThemes([]);
    } finally {
      setLoading(false);
    }
  };

  const resetThemes = () => {
    setThemes([]);
    setSelectedTheme(null);
  };

  return {
    themes,
    selectedTheme,
    setSelectedTheme,
    loading,
    needsApiKey: false,
    generateThemes,
    resetThemes
  };
};
