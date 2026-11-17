
import { useState, useEffect } from "react";
import { RobustGrapesJSEditor } from "./RobustGrapesJSEditor";
import { CategorySelector } from "./CategorySelector";
import { DatabaseTemplateSelector } from "./DatabaseTemplateSelector";
import { useEventPages } from "@/hooks/useEventPages";
import { TemplateCategory } from "@/hooks/useTemplateCategories";
import { WebsiteTemplate } from "@/hooks/useWebsiteTemplates";
import { sampleTemplates } from "@/data/sample-templates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Edit, Trash2, ExternalLink, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface WebsiteBuilderProps {
  eventId?: string;
  eventTitle?: string;
  pageId?: string;
  isPreview?: boolean;
}

export const WebsiteBuilder = ({ eventId, eventTitle, pageId, isPreview }: WebsiteBuilderProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'list' | 'categories' | 'templates' | 'editor' | 'sample-templates'>('list');
  
  const { 
    eventPages, 
    isLoading, 
    saveEventPage, 
    deleteEventPage 
  } = useEventPages();

  // Handle event-specific initialization
  useEffect(() => {
    if (pageId && eventPages) {
      // Editing existing page
      const existingPage = eventPages.find(page => page.id === pageId);
      if (existingPage) {
        setEditingEvent(existingPage);
        // Create a template object from the saved event page
        const template: WebsiteTemplate = {
          id: existingPage.template_id,
          name: existingPage.title,
          description: existingPage.description,
          category_id: '',
          thumbnail_url: existingPage.featured_image_url,
          preview_url: null,
          html_content: existingPage.html_content,
          css_content: existingPage.css_content,
          js_content: null,
          is_premium: false,
          is_active: true,
          sort_order: 0,
          tags: null
        };
        setSelectedTemplate(template);
        setCurrentStep('editor');
      }
    } else if (eventId && !pageId) {
      // Creating new page for event - start with template selection
      setCurrentStep('sample-templates');
    }
  }, [pageId, eventPages, eventId]);

  console.log('WebsiteBuilder state:', { currentStep, selectedTemplate, editingEvent, eventId, pageId });

  const handleSelectCategory = (category: TemplateCategory) => {
    console.log('Selected category:', category);
    setSelectedCategory(category);
    setCurrentStep('templates');
  };

  const handleSelectTemplate = (template: WebsiteTemplate | any) => {
    console.log('Selected template:', template);
    setSelectedTemplate(template);
    setCurrentStep('editor');
  };

  const handleSelectSampleTemplate = (template: any) => {
    console.log('Selected sample template:', template);
    // Convert sample template to WebsiteTemplate format
    const websiteTemplate = {
      id: template.id,
      name: template.name,
      description: template.description,
      category_id: '',
      thumbnail_url: template.thumbnail,
      preview_url: null,
      html_content: template.html_content,
      css_content: template.css_content,
      js_content: null,
      is_premium: false,
      is_active: true,
      sort_order: 0,
      tags: null
    };
    setSelectedTemplate(websiteTemplate);
    setCurrentStep('editor');
  };

  const handleSave = (data: any) => {
    console.log('Saving event page:', data);
    const saveData = {
      ...data,
      id: editingEvent?.id,
      event_name: eventId || data.event_name, // Use eventId if provided
    };
    
    saveEventPage(saveData);
    
    // If this was created from an event, redirect back to event detail
    if (eventId && !editingEvent?.id) {
      setTimeout(() => {
        navigate(`/events/${eventId}?tab=website`);
      }, 1000);
    }
  };

  const handlePublish = (data: any) => {
    console.log('Publishing event page:', data);
    const publishData = {
      ...data,
      is_published: true,
      id: editingEvent?.id,
      event_name: eventId || data.event_name, // Use eventId if provided
    };
    
    saveEventPage(publishData);
    
    // If this was created from an event, redirect back to event detail
    if (eventId && !editingEvent?.id) {
      setTimeout(() => {
        navigate(`/events/${eventId}?tab=website`);
      }, 1000);
    }
  };

  const handleEdit = (eventPage: any) => {
    console.log('Editing event page:', eventPage);
    setEditingEvent(eventPage);
    // Create a template object from the saved event page
    const template: WebsiteTemplate = {
      id: eventPage.template_id,
      name: eventPage.title,
      description: eventPage.description,
      category_id: '',
      thumbnail_url: eventPage.featured_image_url,
      preview_url: null,
      html_content: eventPage.html_content,
      css_content: eventPage.css_content,
      js_content: null,
      is_premium: false,
      is_active: true,
      sort_order: 0,
      tags: null
    };
    setSelectedTemplate(template);
    setCurrentStep('editor');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event page?')) {
      deleteEventPage(id);
    }
  };

  const handleNewEvent = () => {
    console.log('Creating new event');
    setEditingEvent(null);
    setSelectedTemplate(null);
    setSelectedCategory(null);
    setCurrentStep('sample-templates');
  };

  const handleBack = () => {
    console.log('Going back from step:', currentStep);
    if (currentStep === 'editor') {
      if (eventId) {
        // If editing from event detail, go back to event
        navigate(`/events/${eventId}?tab=website`);
      } else {
        setCurrentStep(editingEvent ? 'list' : 'sample-templates');
        setSelectedTemplate(null);
        if (editingEvent) {
          setEditingEvent(null);
          setCurrentStep('list');
          setSelectedCategory(null);
        }
      }
    } else if (currentStep === 'templates') {
      setCurrentStep('categories');
      setSelectedCategory(null);
    } else if (currentStep === 'categories') {
      setCurrentStep('sample-templates');
    } else if (currentStep === 'sample-templates') {
      if (eventId) {
        navigate(`/events/${eventId}?tab=website`);
      } else {
        setCurrentStep('list');
      }
    }
  };

  const handleBackToCategories = () => {
    console.log('Going back to categories');
    setCurrentStep('categories');
    setSelectedCategory(null);
  };

  const handleBackToEvent = () => {
    if (eventId) {
      navigate(`/events/${eventId}?tab=website`);
    } else {
      setCurrentStep('list');
    }
  };

  // Show sample templates first
  if (currentStep === 'sample-templates') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={eventId ? handleBackToEvent : () => setCurrentStep('list')} className="flex items-center gap-2">
            Back to {eventId ? 'Event' : 'Dashboard'}
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {eventId && eventTitle ? `Create Website for ${eventTitle}` : 'Choose Your Template'}
            </h1>
            <p className="text-muted-foreground text-lg">
              Start with our professionally designed templates
            </p>
          </div>
          <Button variant="outline" onClick={() => setCurrentStep('categories')} className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Browse More Templates
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              onClick={() => handleSelectSampleTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {template.category.replace('-', ' ')}
                  </Badge>
                  <Badge variant="default">Popular</Badge>
                </div>
                
                {/* Template Preview */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="sm" className="animate-fade-in">
                      Use This Template
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                  {template.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show category selection
  if (currentStep === 'categories') {
    return (
      <CategorySelector 
        onSelectCategory={handleSelectCategory}
        onBack={() => setCurrentStep('sample-templates')}
      />
    );
  }

  // Show template selection for selected category
  if (currentStep === 'templates' && selectedCategory) {
    return (
      <DatabaseTemplateSelector
        category={selectedCategory}
        onSelectTemplate={handleSelectTemplate}
        onBack={handleBackToCategories}
      />
    );
  }

  // Show editor with selected template
  if (currentStep === 'editor' && selectedTemplate) {
    return (
      <RobustGrapesJSEditor
        template={selectedTemplate}
        onSave={handleSave}
        onPublish={handlePublish}
        onBack={handleBack}
        eventData={editingEvent}
      />
    );
  }

  // Main dashboard view
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Event Websites</h1>
          <p className="text-muted-foreground mt-2">
            Create beautiful, professional event pages with our drag-and-drop builder
          </p>
        </div>
        
        <Button onClick={handleNewEvent} size="lg" className="bg-gradient-to-r from-primary to-primary/80">
          <Sparkles className="w-4 h-4 mr-2" />
          Create New Website
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : eventPages && eventPages.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventPages.map((eventPage) => (
            <Card key={eventPage.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg truncate">{eventPage.title}</CardTitle>
                  <Badge variant={eventPage.is_published ? "default" : "secondary"}>
                    {eventPage.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(eventPage.updated_at), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Preview thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  {eventPage.html_content ? (
                    <iframe
                      srcDoc={`<style>${eventPage.css_content || ''}</style>${eventPage.html_content || ''}`}
                      title={eventPage.title}
                      className="w-full h-full rounded-lg border"
                      style={{ minHeight: 180, background: 'white' }}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : eventPage.featured_image_url ? (
                    <img 
                      src={eventPage.featured_image_url} 
                      alt={eventPage.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Eye className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">No preview available</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {eventPage.description || 'No description provided'}
                  </p>
                  
                  {eventPage.is_published && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">
                        celebratesmartly.com/celebration/{eventPage.event_name}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(eventPage)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    
                    {eventPage.is_published && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/celebration/${eventPage.event_name}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(eventPage.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Event Websites Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first professional event website with our drag-and-drop builder
            </p>
            <Button onClick={handleNewEvent} className="bg-gradient-to-r from-primary to-primary/80">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Your First Website
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
