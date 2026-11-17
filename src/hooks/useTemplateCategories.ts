
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TemplateCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

export const useTemplateCategories = () => {
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('template_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          throw error;
        }

        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching template categories:', error);
        toast.error('Failed to load template categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading };
};
