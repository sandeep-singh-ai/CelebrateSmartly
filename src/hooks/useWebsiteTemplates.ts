
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  html_content: string;
  css_content: string;
  js_content: string | null;
  is_premium: boolean | null;
  is_active: boolean | null;
  sort_order: number | null;
  tags: string[] | null;
}

export const useWebsiteTemplates = (categoryId?: string) => {
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        let query = supabase
          .from('website_templates')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setTemplates(data || []);
      } catch (error) {
        console.error('Error fetching website templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [categoryId]);

  return { templates, isLoading };
};
