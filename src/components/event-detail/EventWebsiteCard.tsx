import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Edit, Plus, Trash2, Eye, ExternalLink } from 'lucide-react';
import { useEventPages } from '@/hooks/useEventPages';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface EventWebsiteCardProps {
  eventId: string;
  eventTitle: string;
}

export const EventWebsiteCard: React.FC<EventWebsiteCardProps> = ({ eventId, eventTitle }) => {
  const { eventPages, isLoading, deleteEventPage } = useEventPages();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [attachedWebsite, setAttachedWebsite] = useState<any>(null);

  useEffect(() => {
    // Find website attached to this event - check by event_name which should match eventId
    const website = eventPages?.find(page => page.event_name === eventId);
    setAttachedWebsite(website);
  }, [eventPages, eventId]);

  const handleCreateWebsite = () => {
    navigate(`/event-website-builder?eventId=${eventId}&eventTitle=${encodeURIComponent(eventTitle)}`);
  };

  const handleEditWebsite = () => {
    navigate(`/event-website-builder?eventId=${eventId}&pageId=${attachedWebsite.id}`);
  };

  const handleRemoveWebsite = () => {
    deleteEventPage(attachedWebsite.id);
  };

  const handleViewWebsite = () => {
    if (attachedWebsite?.is_published) {
      // Open published website in new tab
      window.open(`/event/${attachedWebsite.event_name}`, '_blank');
    } else {
      // Show preview
      navigate(`/event-website-builder?eventId=${eventId}&pageId=${attachedWebsite.id}&preview=true`);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Event Website
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Event Website
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attachedWebsite ? (
          <div className="space-y-4">
            {/* Website Preview */}
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              {attachedWebsite.html_content ? (
                <iframe
                  srcDoc={`<style>${attachedWebsite.css_content || ''}</style>${attachedWebsite.html_content || ''}`}
                  title={attachedWebsite.title}
                  className="w-full h-full rounded-lg border"
                  style={{ minHeight: 180, background: 'white' }}
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : attachedWebsite.featured_image_url ? (
                <img 
                  src={attachedWebsite.featured_image_url} 
                  alt={attachedWebsite.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">No preview available</p>
                </div>
              )}
            </div>

            {/* Website Info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{attachedWebsite.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={attachedWebsite.is_published ? "default" : "secondary"}>
                    {attachedWebsite.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              {attachedWebsite.description && (
                <p className="text-sm text-muted-foreground mb-3">{attachedWebsite.description}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleViewWebsite} variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                {attachedWebsite.is_published ? "View Live" : "Preview"}
              </Button>
              <Button onClick={handleEditWebsite} size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {attachedWebsite.is_published && (
                <Button 
                  onClick={() => window.open(`/event/${attachedWebsite.event_name}`, '_blank')} 
                  variant="outline" 
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Live Site
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Website</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this website from the event? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemoveWebsite}>Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Website Attached</h3>
            <p className="text-muted-foreground mb-4">
              Create a beautiful website for your event to share with guests.
            </p>
            <Button onClick={handleCreateWebsite}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event Website
            </Button>
          </div>
        )}

        {attachedWebsite && (
          <Alert className="mt-4">
            <AlertDescription>
              Each event can have one website attached. You can edit, preview, or remove the current website and create a new one.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};