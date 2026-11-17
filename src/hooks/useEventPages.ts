
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EventPage } from "@/types/website-builder";
import { toast } from "sonner";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const useEventPages = () => {
  const queryClient = useQueryClient();

  const { data: eventPages, isLoading } = useQuery({
    queryKey: ['event-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as EventPage[];
    },
  });

  const saveEventPage = useMutation({
    mutationFn: async (data: {
      html_content: string;
      css_content: string;
      title: string;
      description: string;
      event_name: string;
      featured_image_url: string;
      template_id: string;
      is_published: boolean;
      id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const pageData = {
        user_id: user.id,
        event_name: data.event_name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        title: data.title,
        description: data.description,
        template_id: data.template_id,
        html_content: data.html_content,
        css_content: data.css_content,
        featured_image_url: data.featured_image_url,
        is_published: data.is_published,
        meta_tags: {
          'og:title': data.title,
          'og:description': data.description,
          'og:image': data.featured_image_url,
          'og:url': `https://celebratesmartly.com/celebration/${data.event_name}`,
          'twitter:card': 'summary_large_image',
          'twitter:title': data.title,
          'twitter:description': data.description,
          'twitter:image': data.featured_image_url,
        }
      };

      if (data.id) {
        const { data: result, error } = await supabase
          .from('event_pages')
          .update(pageData)
          .eq('id', data.id)
          .select()
          .single();

        if (error) throw error;
        return result;
      } else {
        const { data: result, error } = await supabase
          .from('event_pages')
          .insert(pageData)
          .select()
          .single();

        if (error) throw error;
        return result;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-pages'] });
      if (variables.is_published) {
        toast.success(`Event page published! Visit: celebratesmartly.com/celebration/${data.event_name}`);
      } else {
        toast.success('Event page saved as draft');
      }
    },
    onError: (error: any) => {
      console.error('Failed to save event page:', error);
      toast.error(error.message || 'Failed to save event page');
    },
  });

  const deleteEventPage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('event_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-pages'] });
      toast.success('Event page deleted');
    },
    onError: (error: any) => {
      console.error('Failed to delete event page:', error);
      toast.error('Failed to delete event page');
    },
  });

  const getEventPageByName = async (eventName: string) => {
    const { data, error } = await supabase
      .from('event_pages')
      .select('*')
      .eq('event_name', eventName)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

    return data as EventPage;
  };

  const uploadEventImage = async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return {
    eventPages,
    isLoading,
    saveEventPage: saveEventPage.mutate,
    deleteEventPage: deleteEventPage.mutate,
    getEventPageByName,
    uploadEventImage,
    isSaving: saveEventPage.isPending,
    isDeleting: deleteEventPage.isPending,
  };
};
