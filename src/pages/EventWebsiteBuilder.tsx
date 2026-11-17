
import { WebsiteBuilder } from "@/components/website-builder/WebsiteBuilder";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";

export default function EventWebsiteBuilder() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  
  const eventId = searchParams.get('eventId');
  const eventTitle = searchParams.get('eventTitle');
  const pageId = searchParams.get('pageId');
  const isPreview = searchParams.get('preview') === 'true';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <WebsiteBuilder 
        eventId={eventId || undefined}
        eventTitle={eventTitle || undefined}
        pageId={pageId || undefined}
        isPreview={isPreview}
      />
    </Layout>
  );
}
