import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface EventInfo {
  title: string;
  description: string;
  eventName: string;
  featuredImage: string;
}

interface SimpleGrapesJSEditorProps {
  template: any;
  eventInfo: EventInfo;
  onReady: (editor: any) => void;
  onError: (error: Error) => void;
}

export const SimpleGrapesJSEditor = ({ 
  template, 
  eventInfo, 
  onReady, 
  onError 
}: SimpleGrapesJSEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const initEditor = async () => {
      try {
        console.log('Initializing simple GrapesJS editor...', { hasTemplate: !!template, eventInfo });
        
        // Import GrapesJS core only
        const grapesjs = await import('grapesjs');
        
        if (!editorRef.current) {
          console.error('Editor container not found');
          throw new Error('Editor container not found');
        }

        console.log('Creating GrapesJS instance...');
        
        const editor = grapesjs.default.init({
          container: editorRef.current,
          height: '600px',
          width: '100%',
          storageManager: false,
          panels: { defaults: [] },
          blockManager: { blocks: [] },
          canvas: {
            styles: [
              'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
            ]
          }
        });

        // Wait for editor to be ready
        editor.on('load', () => {
          console.log('GrapesJS editor loaded, setting content...');
          
          // Load template content
          if (template?.html_content) {
            console.log('Loading template content...');
            editor.setComponents(template.html_content);
            editor.setStyle(template.css_content || '');
          } else {
            console.log('Loading default content...');
            // Default content
            const defaultHtml = `
              <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <h1 style="font-size: 2.5rem; margin-bottom: 20px;">${eventInfo.title}</h1>
                <p style="font-size: 1.2rem; margin-bottom: 30px;">${eventInfo.description}</p>
                <button style="padding: 15px 30px; background: white; color: #667eea; border: none; border-radius: 5px; font-weight: bold;">RSVP Now</button>
              </div>
              <div style="padding: 60px 20px; text-align: center;">
                <h2>Event Details</h2>
                <p>Add your event information here...</p>
              </div>
            `;
            editor.setComponents(defaultHtml);
          }

          console.log('GrapesJS editor initialized successfully');
          setIsInitialized(true);
          onReady(editor);
          toast.success('Editor loaded successfully!');
        });
        
      } catch (error) {
        console.error('Failed to initialize GrapesJS:', error);
        onError(error as Error);
        toast.error('Failed to load editor');
        setIsInitialized(true); // Set to true to prevent infinite retries
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initEditor, 100);
    return () => clearTimeout(timer);
  }, [isInitialized]); // Only depend on isInitialized to prevent infinite loops

  return (
    <div className="h-full w-full">
      <div ref={editorRef} className="h-full" />
    </div>
  );
};