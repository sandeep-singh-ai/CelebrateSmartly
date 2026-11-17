
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, Share2, ArrowLeft, Type, Image as ImageIcon, Square, MousePointer } from "lucide-react";
import { toast } from "sonner";

interface SimpleEditorProps {
  template: any;
  onSave: (data: any) => void;
  onPublish: (data: any) => void;
  onBack: () => void;
  eventData?: any;
}

interface Element {
  id: string;
  type: 'text' | 'image' | 'button' | 'section';
  content: string;
  styles: {
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: string;
  };
  position: { x: number; y: number };
}

export const SimpleEditor = ({ 
  template, 
  onSave, 
  onPublish, 
  onBack,
  eventData 
}: SimpleEditorProps) => {
  const [eventInfo, setEventInfo] = useState({
    title: eventData?.title || 'My Event',
    description: eventData?.description || 'Join us for a wonderful celebration',
    eventName: eventData?.event_name || '',
    featuredImage: eventData?.featured_image_url || ''
  });

  const [elements, setElements] = useState<Element[]>([
    {
      id: '1',
      type: 'text',
      content: eventInfo.title,
      styles: { fontSize: '2rem', textAlign: 'center', padding: '20px' },
      position: { x: 50, y: 100 }
    },
    {
      id: '2',
      type: 'text',
      content: eventInfo.description,
      styles: { fontSize: '1rem', textAlign: 'center', padding: '10px' },
      position: { x: 50, y: 200 }
    }
  ]);

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addElement = (type: Element['type']) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'New Text' : type === 'button' ? 'Click Me' : type === 'image' ? 'https://via.placeholder.com/300x200' : 'New Section',
      styles: {
        padding: '10px',
        fontSize: type === 'text' ? '1rem' : undefined,
        backgroundColor: type === 'button' ? '#007bff' : type === 'section' ? '#f8f9fa' : undefined,
        color: type === 'button' ? 'white' : '#333'
      },
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 }
    };

    setElements([...elements, newElement]);
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setDraggedElement(elementId);
    setSelectedElement(elementId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateElement(draggedElement, {
      position: { x: Math.max(0, x), y: Math.max(0, y) }
    });
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const generateHTML = () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${eventInfo.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; position: relative; min-height: 100vh; }
            .element { position: absolute; cursor: move; }
          </style>
        </head>
        <body>
          ${elements.map(el => `
            <div class="element" style="
              left: ${el.position.x}px; 
              top: ${el.position.y}px;
              font-size: ${el.styles.fontSize || '1rem'};
              color: ${el.styles.color || 'inherit'};
              background-color: ${el.styles.backgroundColor || 'transparent'};
              padding: ${el.styles.padding || '0'};
              margin: ${el.styles.margin || '0'};
              text-align: ${el.styles.textAlign || 'left'};
            ">
              ${el.type === 'image' ? 
                `<img src="${el.content}" alt="Event Image" style="max-width: 100%; height: auto;" />` :
                el.type === 'button' ? 
                `<button style="padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; background-color: ${el.styles.backgroundColor}; color: ${el.styles.color};">${el.content}</button>` :
                el.content
              }
            </div>
          `).join('')}
        </body>
      </html>
    `;
    return html;
  };

  const handleSave = () => {
    const html = generateHTML();
    const data = {
      html_content: html,
      css_content: '', // CSS is inline for simplicity
      title: eventInfo.title,
      description: eventInfo.description,
      event_name: eventInfo.eventName,
      featured_image_url: eventInfo.featuredImage,
      template_id: template.id,
      is_published: false
    };

    onSave(data);
    toast.success('Draft saved successfully!');
  };

  const handlePublish = () => {
    if (!eventInfo.eventName.trim()) {
      toast.error('Please enter an event name for the URL');
      return;
    }

    const html = generateHTML();
    const data = {
      html_content: html,
      css_content: '',
      title: eventInfo.title,
      description: eventInfo.description,
      event_name: eventInfo.eventName,
      featured_image_url: eventInfo.featuredImage,
      template_id: template.id,
      is_published: true
    };

    onPublish(data);
  };

  const handlePreview = () => {
    const html = generateHTML();
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(html);
      previewWindow.document.close();
    }
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

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
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="elements" className="p-4 space-y-2">
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addElement('text')}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addElement('image')}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addElement('button')}
                >
                  <MousePointer className="w-4 h-4 mr-2" />
                  Add Button
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addElement('section')}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="properties" className="p-4 space-y-4">
              {selectedEl ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Element Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Content</Label>
                      <Input
                        value={selectedEl.content}
                        onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label>Font Size</Label>
                      <Input
                        value={selectedEl.styles.fontSize || '1rem'}
                        onChange={(e) => updateElement(selectedEl.id, { 
                          styles: { ...selectedEl.styles, fontSize: e.target.value }
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={selectedEl.styles.color || '#333333'}
                        onChange={(e) => updateElement(selectedEl.id, { 
                          styles: { ...selectedEl.styles, color: e.target.value }
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={selectedEl.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateElement(selectedEl.id, { 
                          styles: { ...selectedEl.styles, backgroundColor: e.target.value }
                        })}
                      />
                    </div>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteElement(selectedEl.id)}
                    >
                      Delete Element
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-sm text-muted-foreground">Select an element to edit its properties</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          <div 
            ref={canvasRef}
            className="relative min-h-full w-full bg-white mx-auto shadow-lg"
            style={{ minHeight: '800px', maxWidth: '1200px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move border-2 ${
                  selectedElement === element.id ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  fontSize: element.styles.fontSize,
                  color: element.styles.color,
                  backgroundColor: element.styles.backgroundColor,
                  padding: element.styles.padding,
                  margin: element.styles.margin,
                  textAlign: element.styles.textAlign as any,
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onClick={() => setSelectedElement(element.id)}
              >
                {element.type === 'image' ? (
                  <img 
                    src={element.content} 
                    alt="Event Image" 
                    style={{ maxWidth: '300px', height: 'auto' }}
                    draggable={false}
                  />
                ) : element.type === 'button' ? (
                  <button 
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: element.styles.backgroundColor,
                      color: element.styles.color,
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    {element.content}
                  </button>
                ) : (
                  <div>{element.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
