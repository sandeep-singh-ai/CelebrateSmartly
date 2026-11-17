export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  category: 'wedding' | 'birthday' | 'baby-shower' | 'general';
  thumbnail: string;
  html: string;
  css: string;
  components: any[];
}

export interface EventPage {
  id: string;
  user_id: string;
  event_name: string;
  title: string;
  description?: string;
  template_id: string;
  html_content: string;
  css_content: string;
  featured_image_url?: string;
  meta_tags: Record<string, string>;
  is_published: boolean;
  custom_domain?: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteBuilderProps {
  eventId?: string;
  onSave?: (data: any) => void;
  onPublish?: (data: any) => void;
}