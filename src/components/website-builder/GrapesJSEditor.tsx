
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventTemplate } from "@/types/website-builder";
import { Save, Eye, Share2, Settings, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface GrapesJSEditorProps {
  template: EventTemplate;
  onSave: (data: any) => void;
  onPublish: (data: any) => void;
  onBack: () => void;
  eventData?: any;
}

export const GrapesJSEditor = ({ 
  template, 
  onSave, 
  onPublish, 
  onBack,
  eventData 
}: GrapesJSEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const grapesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState({
    title: eventData?.title || 'My Event',
    description: eventData?.description || 'Join us for a wonderful celebration',
    eventName: eventData?.event_name || '',
    featuredImage: eventData?.featured_image_url || ''
  });

  useEffect(() => {
    let mounted = true;
    
    const initGrapesJS = async () => {
      try {
        console.log('Initializing GrapesJS editor...');
        
        // Dynamic import for GrapesJS
        const grapesjs = (await import('grapesjs')).default;
        
        if (!mounted || !editorRef.current || grapesRef.current) {
          return;
        }

        console.log('Creating GrapesJS instance...');
        
        grapesRef.current = grapesjs.init({
          container: editorRef.current,
          width: '100%',
          height: '70vh',
          storageManager: false,
          fromElement: false,
          panels: {
            defaults: [
              {
                id: 'basic-actions',
                el: '.panel__basic-actions',
                buttons: [
                  {
                    id: 'visibility',
                    active: true,
                    className: 'btn-toggle-borders',
                    label: '<i class="fa fa-clone"></i>',
                    command: 'sw-visibility',
                  },
                  {
                    id: 'export',
                    className: 'btn-open-export',
                    label: '<i class="fa fa-code"></i>',
                    command: 'export-template',
                    context: 'export-template',
                  },
                ],
              },
              {
                id: 'panel-devices',
                el: '.panel__devices',
                buttons: [
                  {
                    id: 'device-desktop',
                    label: '<i class="fa fa-desktop"></i>',
                    command: 'set-device-desktop',
                    active: true,
                    togglable: false,
                  },
                  {
                    id: 'device-tablet',
                    label: '<i class="fa fa-tablet"></i>',
                    command: 'set-device-tablet',
                    togglable: false,
                  },
                  {
                    id: 'device-mobile',
                    label: '<i class="fa fa-mobile"></i>',
                    command: 'set-device-mobile',
                    togglable: false,
                  }
                ],
              }
            ]
          },
          deviceManager: {
            devices: [
              {
                name: 'Desktop',
                width: '',
              },
              {
                name: 'Tablet',
                width: '768px',
                widthMedia: '992px',
              },
              {
                name: 'Mobile',
                width: '320px',
                widthMedia: '768px',
              }
            ]
          },
          layerManager: {
            appendTo: '.layers-container'
          },
          traitManager: {
            appendTo: '.traits-container',
          },
          selectorManager: {
            appendTo: '.styles-container'
          },
          styleManager: {
            appendTo: '.styles-container',
            sectors: [
              {
                name: 'Dimension',
                open: false,
                buildProps: ['width', 'min-height', 'padding'],
                properties: [
                  {
                    type: 'integer',
                    name: 'The width',
                    property: 'width',
                    units: ['px', '%'],
                    defaults: 'auto',
                    min: 0,
                  }
                ]
              },
              {
                name: 'Typography',
                open: false,
                buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height'],
              },
              {
                name: 'Decorations',
                open: false,
                buildProps: ['opacity', 'border-radius', 'border', 'box-shadow', 'background-bg'],
              },
              {
                name: 'Extra',
                open: false,
                buildProps: ['transition', 'perspective', 'transform'],
              }
            ]
          },
          blockManager: {
            appendTo: '.blocks-container',
            blocks: [
              {
                id: 'section',
                label: '<i class="fa fa-square-o"></i><div>Section</div>',
                attributes: { class: 'gjs-block-section' },
                content: `<section style="padding: 40px 20px; text-align: center;">
                  <h2>New Section</h2>
                  <p>Add your content here</p>
                </section>`,
              },
              {
                id: 'text',
                label: '<i class="fa fa-text-width"></i><div>Text</div>',
                content: '<div data-gjs-type="text">Insert your text here</div>',
              },
              {
                id: 'image',
                label: '<i class="fa fa-picture-o"></i><div>Image</div>',
                content: { type: 'image' },
                activate: true,
              },
              {
                id: 'button',
                label: '<i class="fa fa-hand-pointer-o"></i><div>Button</div>',
                content: '<button class="btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Click me</button>',
              },
            ]
          },
          canvas: {
            styles: [
              'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
            ]
          }
        });

        console.log('GrapesJS instance created, loading template content...');

        // Load the template content
        if (template.html) {
          grapesRef.current.setComponents(template.html);
        }
        if (template.css) {
          grapesRef.current.setStyle(template.css);
        }

        // Add custom commands
        grapesRef.current.Commands.add('set-device-desktop', {
          run: (editor: any) => editor.setDevice('Desktop')
        });
        grapesRef.current.Commands.add('set-device-tablet', {
          run: (editor: any) => editor.setDevice('Tablet')
        });
        grapesRef.current.Commands.add('set-device-mobile', {
          run: (editor: any) => editor.setDevice('Mobile')
        });

        console.log('GrapesJS editor initialized successfully');
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize GrapesJS:', error);
        toast.error('Failed to load editor. Please try again.');
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(initGrapesJS, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (grapesRef.current) {
        try {
          grapesRef.current.destroy();
        } catch (error) {
          console.error('Error destroying GrapesJS:', error);
        }
        grapesRef.current = null;
      }
    };
  }, [template]);

  const handleSave = () => {
    if (!grapesRef.current) return;

    try {
      const html = grapesRef.current.getHtml();
      const css = grapesRef.current.getCss();
      
      const data = {
        html_content: html,
        css_content: css,
        title: eventInfo.title,
        description: eventInfo.description,
        event_name: eventInfo.eventName,
        featured_image_url: eventInfo.featuredImage,
        template_id: template.id,
        is_published: false
      };

      onSave(data);
      toast.success('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save. Please try again.');
    }
  };

  const handlePublish = () => {
    if (!grapesRef.current) return;
    if (!eventInfo.eventName.trim()) {
      toast.error('Please enter an event name for the URL');
      return;
    }

    try {
      const html = grapesRef.current.getHtml();
      const css = grapesRef.current.getCss();
      
      const data = {
        html_content: html,
        css_content: css,
        title: eventInfo.title,
        description: eventInfo.description,
        event_name: eventInfo.eventName,
        featured_image_url: eventInfo.featuredImage,
        template_id: template.id,
        is_published: true
      };

      onPublish(data);
    } catch (error) {
      console.error('Error publishing:', error);
      toast.error('Failed to publish. Please try again.');
    }
  };

  const handlePreview = () => {
    if (!grapesRef.current) return;
    
    try {
      const html = grapesRef.current.getHtml();
      const css = grapesRef.current.getCss();
      
      // Create preview window
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${eventInfo.title}</title>
              <style>${css}</style>
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
              ${html}
            </body>
          </html>
        `);
        previewWindow.document.close();
      }
    } catch (error) {
      console.error('Error creating preview:', error);
      toast.error('Failed to create preview. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading editor...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{template.name} Editor</h1>
              <p className="text-sm text-muted-foreground">{eventInfo.eventName || 'Untitled Event'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm" onClick={handlePublish}>
              <Share2 className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card overflow-auto">
          <Tabs defaultValue="settings" className="h-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="eventName">Event URL Name *</Label>
                    <Input
                      id="eventName"
                      value={eventInfo.eventName}
                      onChange={(e) => setEventInfo(prev => ({ ...prev, eventName: e.target.value }))}
                      placeholder="my-awesome-event"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      celebratesmartly.com/celebration/{eventInfo.eventName}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={eventInfo.title}
                      onChange={(e) => setEventInfo(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={eventInfo.description}
                      onChange={(e) => setEventInfo(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="featuredImage">Featured Image URL</Label>
                    <Input
                      id="featuredImage"
                      value={eventInfo.featuredImage}
                      onChange={(e) => setEventInfo(prev => ({ ...prev, featuredImage: e.target.value }))}
                      placeholder="https://..."
                    />
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="blocks" className="p-0">
              <div className="blocks-container h-full"></div>
            </TabsContent>
            
            <TabsContent value="styles" className="p-0">
              <div className="styles-container h-full"></div>
              <div className="traits-container"></div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="border-b bg-card p-2">
            <div className="flex items-center justify-between">
              <div className="panel__basic-actions flex gap-1"></div>
              <div className="panel__devices flex gap-1"></div>
            </div>
          </div>
          
          {/* Editor Canvas */}
          <div className="flex-1 relative">
            <div ref={editorRef} className="h-full w-full"></div>
          </div>
        </div>

        {/* Right Sidebar - Layers */}
        <div className="w-60 border-l bg-card overflow-auto">
          <div className="p-4">
            <h3 className="font-medium mb-2">Layers</h3>
            <div className="layers-container h-64 border rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
