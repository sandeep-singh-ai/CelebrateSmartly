import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEventPages } from "@/hooks/useEventPages";
import { EventPage } from "@/types/website-builder";
import { Helmet } from "react-helmet-async";
import DOMPurify from 'dompurify';

export default function PublicEventPage() {
  const { eventName } = useParams<{ eventName: string }>();
  const { getEventPageByName } = useEventPages();
  const [eventPage, setEventPage] = useState<EventPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadEventPage = async () => {
      if (!eventName) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const page = await getEventPageByName(eventName);
        if (page) {
          setEventPage(page);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error loading event page:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadEventPage();
  }, [eventName, getEventPageByName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound || !eventPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground">The event page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{eventPage.meta_tags['og:title'] || eventPage.title}</title>
        <meta name="description" content={eventPage.meta_tags['og:description'] || eventPage.description} />
        <meta property="og:title" content={eventPage.meta_tags['og:title']} />
        <meta property="og:description" content={eventPage.meta_tags['og:description']} />
        <meta property="og:image" content={eventPage.meta_tags['og:image']} />
        <meta property="og:url" content={eventPage.meta_tags['og:url']} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={eventPage.meta_tags['twitter:title']} />
        <meta name="twitter:description" content={eventPage.meta_tags['twitter:description']} />
        <meta name="twitter:image" content={eventPage.meta_tags['twitter:image']} />
      </Helmet>
      
      <div dangerouslySetInnerHTML={{ 
        __html: DOMPurify.sanitize(`
          <style>${eventPage.css_content || ''}</style>
          ${eventPage.html_content || ''}
        `, { ADD_TAGS: ['style'], ADD_ATTR: ['style'] })
      }} />
    </>
  );
}