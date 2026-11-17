
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EventCategory {
  id: string;
  name: string;
  description: string;
}

let categoriesCache: EventCategory[] | null = null;
let loadingPromise: Promise<EventCategory[]> | null = null;

export const useEventCategories = () => {
  const [categories, setCategories] = useState<EventCategory[]>(categoriesCache || []);
  const [categoriesLoading, setCategoriesLoading] = useState(!categoriesCache);
  const { toast } = useToast();

  useEffect(() => {
    if (categoriesCache) {
      setCategories(categoriesCache);
      setCategoriesLoading(false);
      return;
    }

    if (loadingPromise) {
      loadingPromise.then((cachedCategories) => {
        setCategories(cachedCategories);
        setCategoriesLoading(false);
      });
      return;
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    if (loadingPromise) return loadingPromise;

    setCategoriesLoading(true);
    
    loadingPromise = new Promise(async (resolve, reject) => {
      try {
        const { data, error } = await supabase
          .from('event_categories')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching categories:', error);
          toast({
            title: "Error",
            description: "Failed to load event categories.",
            variant: "destructive",
          });
          reject(error);
        } else {
          categoriesCache = data || [];
          setCategories(categoriesCache);
          console.log('Loaded categories:', data);
          resolve(categoriesCache);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load event categories.",
          variant: "destructive",
        });
        reject(error);
      } finally {
        setCategoriesLoading(false);
        loadingPromise = null;
      }
    });

    return loadingPromise;
  };

  return {
    categories,
    categoriesLoading,
    fetchCategories
  };
};
