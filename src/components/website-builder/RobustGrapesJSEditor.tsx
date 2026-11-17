
import { useState } from "react";
import { toast } from "sonner";
import { EditorHeader } from "./EditorHeader";
import { EditorSidebar } from "./EditorSidebar";
import { EditorRightPanel } from "./EditorRightPanel";
import { SimpleGrapesJSEditor } from "./SimpleGrapesJSEditor";
import { GrapesJSInitializer } from "./GrapesJSInitializer";
import { Button } from "@/components/ui/button";
import { Settings, Layers, Palette, Sliders } from "lucide-react";

// Right Panel Component
const RightPanel = () => {
  const [activeTab, setActiveTab] = useState('layers');

  const tabs = [
    { id: 'layers', label: 'Layers', icon: Layers, container: 'layers-container' },
    { id: 'styles', label: 'Styles', icon: Palette, container: 'styles-container' },
    { id: 'traits', label: 'Settings', icon: Sliders, container: 'traits-container' }
  ];

  const handleTabChange = (tabId: string, container: string) => {
    setActiveTab(tabId);
    
    // Hide all containers
    tabs.forEach(tab => {
      const element = document.querySelector(`.${tab.container}`) as HTMLElement;
      if (element) {
        element.style.display = 'none';
      }
    });
    
    // Show selected container
    const activeElement = document.querySelector(`.${container}`) as HTMLElement;
    if (activeElement) {
      activeElement.style.display = 'block';
    }
  };

  return (
    <div className="w-72 bg-white border-l flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b bg-gray-50">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id, tab.container)}
                className={`flex-1 flex items-center justify-center px-2 py-2 text-xs font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Panel Content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="layers-container h-full overflow-y-auto"></div>
        <div className="styles-container h-full overflow-y-auto" style={{ display: 'none' }}></div>
        <div className="traits-container h-full overflow-y-auto" style={{ display: 'none' }}></div>
      </div>
    </div>
  );
};

interface RobustGrapesJSEditorProps {
  template: any;
  onSave: (data: any) => void;
  onPublish: (data: any) => void;
  onBack: () => void;
  eventData?: any;
}

export const RobustGrapesJSEditor = ({ 
  template, 
  onSave, 
  onPublish, 
  onBack,
  eventData 
}: RobustGrapesJSEditorProps) => {
  console.log('RobustGrapesJSEditor props:', { template, eventData });
  const [isLoading, setIsLoading] = useState(false); // Set to false initially
  const [grapesEditor, setGrapesEditor] = useState<any>(null);
  const [eventInfo, setEventInfo] = useState({
    title: eventData?.title || 'My Event',
    description: eventData?.description || 'Join us for a wonderful celebration',
    eventName: eventData?.event_name || '',
    featuredImage: eventData?.featured_image_url || '',
    eventSlug: eventData?.event_slug || '' // Add eventSlug to state
  });

  // Remove the test loading code
  console.log('Current isLoading state:', isLoading);

  const handleEditorReady = (editor: any) => {
    console.log('handleEditorReady called with editor:', editor);
    setGrapesEditor(editor);
    setIsLoading(false);
    console.log('Loading state set to false');
  };

  const handleEditorError = (error: Error) => {
    console.error('handleEditorError called with error:', error);
    console.error('Editor initialization error:', error);
    toast.error('Failed to load editor. Please try again.');
    setIsLoading(false);
    console.log('Loading state set to false due to error');
  };

  const handleSave = () => {
    if (!grapesEditor) return;

    try {
      const html = grapesEditor.getHtml();
      const css = grapesEditor.getCss();
      
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
    if (!grapesEditor) return;
    if (!eventInfo.eventName.trim()) {
      toast.error('Please enter an event name for the URL');
      return;
    }

    try {
      const html = grapesEditor.getHtml();
      const css = grapesEditor.getCss();
      
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
    if (!grapesEditor) return;
    
    try {
      const html = grapesEditor.getHtml();
      const css = grapesEditor.getCss();
      
      // Try to open in fullscreen or very large window
      const previewWindow = window.open('', '_blank', 'width=1920,height=1080,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no');
      if (previewWindow) {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${eventInfo.title} - Preview</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" rel="stylesheet">
              <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
              <style>
                html, body { 
                  margin: 0; 
                  padding: 0; 
                  width: 100%; 
                  height: 100vh; 
                  overflow-x: hidden;
                }
                * { box-sizing: border-box; }
                .container-fluid { width: 100%; max-width: none; }
                .container { width: 100%; max-width: none; }
                #preview-content { 
                  width: 100%; 
                  min-height: 100vh; 
                  height: 100vh;
                  display: flex; 
                  flex-direction: column;
                }
                /* Force all sections to take full height */
                section, div, main, article {
                  min-height: 100vh !important;
                }
                /* Ensure the first element takes full height if content is short */
                #preview-content > *:first-child {
                  min-height: 100vh !important;
                  flex: 1;
                }
                ${css}
              </style>
            </head>
            <body>
              <div id="preview-content">
                ${html}
              </div>
              <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
              <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
              <script>
                // Force window to be large
                window.resizeTo(1920, 1080);
                // Ensure content takes full height
                document.body.style.height = '100vh';
                document.getElementById('preview-content').style.height = '100vh';
              </script>
            </body>
          </html>
        `);
        previewWindow.document.close();
        previewWindow.focus();
      }
    } catch (error) {
      console.error('Error creating preview:', error);
      toast.error('Failed to create preview. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <EditorHeader
        eventName={eventInfo.eventName}
        onBack={onBack}
        onPreview={handlePreview}
        onSave={handleSave}
        onPublish={handlePublish}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Blocks */}
        <div className="w-64 bg-white border-r flex flex-col">
          <div className="p-3 border-b">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Event Details</h3>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1" htmlFor="eventName">Webpage Name</label>
              <input
                id="eventName"
                type="text"
                className="w-full border rounded px-2 py-1 text-xs"
                value={eventInfo.eventName}
                onChange={e => {
                  const name = e.target.value;
                  // Generate slug: remove special chars, replace spaces with dash, lowercase
                  const slug = name
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
                  setEventInfo(info => ({ ...info, eventName: name, eventSlug: slug }));
                }}
                placeholder="Enter webpage name"
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1" htmlFor="eventUrl">Webpage URL</label>
              <textarea
                id="eventUrl"
                className="w-full border rounded px-2 py-1 text-xs bg-gray-100 resize-none"
                value={`celebratesmartly.com/celebration/${eventInfo.eventSlug || ''}`}
                readOnly
                rows={2}
              />
            </div>
          </div>
          <div className="p-3 border-b">
            <h3 className="text-sm font-semibold text-gray-700">Blocks</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="blocks-container p-3"></div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          <div className="border-b bg-card p-2">
            <div className="flex items-center justify-between">
              <div className="panel__basic-actions flex gap-1"></div>
              <div className="flex items-center gap-2">
                <div className="panel__devices flex gap-1"></div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Event settings coming soon!')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Event Settings
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 relative bg-gray-100">
            <GrapesJSInitializer
              template={template}
              eventInfo={eventInfo}
              onReady={handleEditorReady}
              onError={handleEditorError}
            />
          </div>
        </div>
      </div>
      
      {/* Hidden containers for other panels */}
      <div className="styles-container" style={{ display: 'none' }}></div>
      <div className="traits-container" style={{ display: 'none' }}></div>
    </div>
  );
};
