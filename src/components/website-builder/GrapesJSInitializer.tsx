
import { useEffect, useRef } from 'react';

interface EventInfo {
  title: string;
  description: string;
  eventName: string;
  featuredImage: string;
}

interface GrapesJSInitializerProps {
  template: any;
  eventInfo: EventInfo;
  onReady: (editor: any) => void;
  onError: (error: Error) => void;
}

export const GrapesJSInitializer = ({ 
  template, 
  eventInfo, 
  onReady, 
  onError 
}: GrapesJSInitializerProps) => {
  console.log('GrapesJSInitializer component rendered with props:', { template, eventInfo });
  
  const editorRef = useRef<HTMLDivElement>(null);
  const initializeRef = useRef(false);

  useEffect(() => {
    console.log('GrapesJSInitializer useEffect triggered');
    
    if (initializeRef.current) return;
    initializeRef.current = true;

    const initGrapesJS = async () => {
      try {
        console.log('Initializing GrapesJS editor...');
        
        // Import GrapesJS core
        const grapesjs = await import('grapesjs').then(m => m.default);
        console.log('GrapesJS core imported successfully');
        
        if (!editorRef.current) {
          console.error('Editor container not found!');
          throw new Error('Editor container not found');
        }

        console.log('Creating GrapesJS instance...');
        
        const editor = grapesjs.init({
          container: editorRef.current,
          height: '500px',
          width: '100%',
          storageManager: false,
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
                id: 'heading',
                label: '<i class="fa fa-header"></i><div>Heading</div>',
                content: '<h1 data-gjs-type="text">Insert your heading</h1>',
              },
              {
                id: 'paragraph',
                label: '<i class="fa fa-paragraph"></i><div>Paragraph</div>',
                content: '<p data-gjs-type="text">Insert your paragraph</p>',
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
              {
                id: 'link',
                label: '<i class="fa fa-link"></i><div>Link</div>',
                content: '<a href="#" data-gjs-type="text">Insert your link</a>',
              },
              {
                id: 'divider',
                label: '<i class="fa fa-minus"></i><div>Divider</div>',
                content: '<hr style="border: 1px solid #ddd; margin: 20px 0;">',
              },
              {
                id: 'list',
                label: '<i class="fa fa-list"></i><div>List</div>',
                content: `<ul>
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </ul>`,
              },
              {
                id: 'form',
                label: '<i class="fa fa-wpforms"></i><div>Form</div>',
                content: `<form style="padding: 20px;">
                  <input type="text" placeholder="Enter your name" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
                  <button type="submit" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
                </form>`,
              },
              {
                id: 'hero',
                label: '<i class="fa fa-star"></i><div>Hero Section</div>',
                content: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center;">
                  <h1 style="font-size: 3rem; margin-bottom: 20px;">Hero Title</h1>
                  <p style="font-size: 1.2rem; margin-bottom: 30px;">Hero description goes here</p>
                  <button style="padding: 15px 30px; background: white; color: #667eea; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Call to Action</button>
                </div>`,
              },
              {
                id: 'card',
                label: '<i class="fa fa-credit-card"></i><div>Card</div>',
                content: `<div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h3 style="margin-top: 0;">Card Title</h3>
                  <p>Card content goes here. This is a sample card component.</p>
                  <button style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Learn More</button>
                </div>`,
              }
            ]
          },
          canvas: {
            styles: [
              'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
              'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
            ]
          }
        });

        // Add custom CSS to fix editor interface sizing and organization
        const style = document.createElement('style');
        style.textContent = `
          /* Editor wrapper full height */
          .gjs-editor { height: 100% !important; }
          
          /* Panel buttons - compact and professional */
          .gjs-pn-btn, .gjs-pn-button { 
            font-size: 11px !important; 
            padding: 3px 6px !important; 
            height: 26px !important;
            line-height: 20px !important;
            border-radius: 3px !important;
            background: #f8f9fa !important;
            border: 1px solid #e0e0e0 !important;
            margin: 1px !important;
          }
          .gjs-pn-btn:hover, .gjs-pn-button:hover { 
            background: #e9ecef !important; 
            border-color: #007bff !important;
          }
          .gjs-pn-btn.gjs-pn-active, .gjs-pn-button.gjs-pn-active { 
            background: #007bff !important; 
            color: white !important;
          }
          .gjs-pn-btn i, .gjs-pn-button i { font-size: 11px !important; }
          
          /* Blocks panel - organized grid */
          .gjs-blocks-c { padding: 8px !important; }
          .gjs-block { 
            font-size: 10px !important; 
            margin: 3px !important;
            padding: 6px !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 4px !important;
            background: #ffffff !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            min-height: 50px !important;
            width: calc(50% - 6px) !important;
            display: inline-block !important;
            vertical-align: top !important;
            text-align: center !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          }
          .gjs-block:hover { 
            background: #f0f8ff !important;
            border-color: #007bff !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
          }
          .gjs-block-label { 
            font-size: 9px !important; 
            font-weight: 500 !important;
            color: #495057 !important;
            margin-top: 4px !important;
          }
          .gjs-block i { 
            font-size: 16px !important;
            color: #6c757d !important;
            margin-bottom: 4px !important;
          }
          .gjs-block-category { 
            font-size: 11px !important; 
            font-weight: 600 !important;
            margin: 12px 0 6px 0 !important;
            color: #343a40 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          
          /* Layers panel - clean hierarchy */
          .gjs-layer-item, .gjs-lm-layer { 
            font-size: 10px !important; 
            padding: 2px 4px !important;
            line-height: 16px !important;
            border-bottom: 1px solid #f0f0f0 !important;
            min-height: 20px !important;
          }
          .gjs-layer-item:hover, .gjs-lm-layer:hover { background: #f8f9fa !important; }
          .gjs-layer-title, .gjs-lm-layer-name { 
            font-size: 9px !important; 
            color: #495057 !important;
          }
          .gjs-layer-vis, .gjs-lm-layer .gjs-layer-vis { 
            font-size: 8px !important; 
            width: 12px !important;
            height: 12px !important;
            opacity: 0.7 !important;
            margin-right: 2px !important;
          }
          .gjs-layer-caret, .gjs-lm-caret { 
            font-size: 8px !important; 
            color: #6c757d !important;
            width: 10px !important;
            height: 10px !important;
            margin-right: 2px !important;
          }
          
          /* Style manager - organized sections */
          .gjs-sm-sectors { padding: 4px !important; }
          .gjs-sm-sector { 
            margin-bottom: 4px !important;
            border: 1px solid #e9ecef !important;
            border-radius: 3px !important;
            background: #ffffff !important;
          }
          .gjs-sm-sector-title, .gjs-sm-title { 
            font-size: 9px !important; 
            font-weight: 600 !important;
            padding: 4px 6px !important;
            background: #f8f9fa !important;
            border-bottom: 1px solid #e9ecef !important;
            color: #495057 !important;
            cursor: pointer !important;
            line-height: 14px !important;
          }
          .gjs-sm-sector-title:hover, .gjs-sm-title:hover { background: #e9ecef !important; }
          .gjs-sm-properties { padding: 4px 6px !important; }
          .gjs-sm-property { 
            margin-bottom: 4px !important;
            display: flex !important;
            align-items: center !important;
            min-height: 18px !important;
          }
          .gjs-sm-label { 
            font-size: 8px !important;
            color: #6c757d !important;
            min-width: 50px !important;
            margin-right: 4px !important;
            line-height: 12px !important;
          }
          .gjs-sm-field { flex: 1 !important; }
          .gjs-sm-input { 
            font-size: 8px !important; 
            height: 18px !important; 
            padding: 2px 4px !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 2px !important;
            width: 100% !important;
          }
          .gjs-sm-input:focus { 
            border-color: #007bff !important;
            outline: none !important;
            box-shadow: 0 0 0 1px rgba(0,123,255,0.1) !important;
          }
          
          /* Style manager buttons and icons */
          .gjs-sm-btn, .gjs-sm-icon {
            width: 14px !important;
            height: 14px !important;
            font-size: 7px !important;
            padding: 1px !important;
            margin: 1px !important;
          }
          
          /* Color picker and sliders */
          .gjs-field-color-picker {
            height: 16px !important;
            width: 30px !important;
          }
          
          .gjs-sm-slider {
            height: 16px !important;
          }
          
          /* Trait manager - clean settings */
          .gjs-trt-traits { padding: 8px !important; }
          .gjs-trt-item { 
            margin-bottom: 8px !important;
            display: flex !important;
            align-items: center !important;
          }
          .gjs-trt-label { 
            font-size: 10px !important;
            color: #6c757d !important;
            min-width: 60px !important;
            margin-right: 8px !important;
          }
          .gjs-trt-input { 
            font-size: 10px !important; 
            height: 24px !important; 
            padding: 4px 6px !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 3px !important;
            flex: 1 !important;
          }
          .gjs-trt-input:focus { 
            border-color: #007bff !important;
            outline: none !important;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.1) !important;
          }
          
          /* Canvas - maximize space */
          .gjs-cv-canvas { 
            width: 100% !important; 
            height: 100% !important; 
            min-height: 500px !important;
            background: #ffffff !important;
          }
          .gjs-frame { 
            width: 100% !important; 
            height: 100% !important; 
            min-height: 500px !important;
            border: none !important;
            box-shadow: 0 0 10px rgba(0,0,0,0.1) !important;
          }
          
          /* Editor container */
          .gjs-editor { 
            height: 100% !important; 
            min-height: 500px !important;
          }
          
          /* Editor wrapper */
          .gjs-editor-wrapper { 
            height: 100% !important; 
            min-height: 500px !important;
          }
          
          /* Element selection toolbar - compact and visible */
          .gjs-toolbar { 
            background: linear-gradient(135deg, #007bff, #0056b3) !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            padding: 2px !important;
          }
          .gjs-toolbar-item { 
            width: 24px !important;
            height: 24px !important;
            line-height: 24px !important;
            font-size: 11px !important;
            color: white !important;
            border-radius: 3px !important;
            margin: 1px !important;
          }
          .gjs-toolbar-item:hover {
            background: rgba(255, 255, 255, 0.2) !important;
          }
          .gjs-toolbar-item.gjs-toolbar-item-active {
            background: rgba(255, 255, 255, 0.3) !important;
          }
          
          /* Right panel containers */
          .layers-container, .styles-container, .traits-container {
            padding: 4px !important;
            background: #fafafa !important;
            height: 100% !important;
            overflow-y: auto !important;
          }
          
          /* Panel switcher buttons - right section */
          .gjs-pn-views {
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
          }
          
          .gjs-pn-views-container {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 4px !important;
          }
          
          /* Panel buttons in right section */
          .gjs-pn-views .gjs-pn-btn, 
          .gjs-pn-views .gjs-pn-button {
            font-size: 9px !important;
            padding: 2px 4px !important;
            height: 20px !important;
            line-height: 16px !important;
            margin: 1px 0 !important;
            border-radius: 2px !important;
            background: #ffffff !important;
            border: 1px solid #e0e0e0 !important;
            color: #495057 !important;
            text-align: center !important;
            width: 100% !important;
          }
          
          .gjs-pn-views .gjs-pn-btn:hover, 
          .gjs-pn-views .gjs-pn-button:hover {
            background: #e9ecef !important;
            border-color: #007bff !important;
          }
          
          .gjs-pn-views .gjs-pn-btn.gjs-pn-active, 
          .gjs-pn-views .gjs-pn-button.gjs-pn-active {
            background: #007bff !important;
            color: white !important;
            border-color: #007bff !important;
          }
          
          .gjs-pn-views .gjs-pn-btn i, 
          .gjs-pn-views .gjs-pn-button i {
            font-size: 9px !important;
            margin-right: 2px !important;
          }
          
          /* Layers panel - improved alignment */
          .gjs-layer-item, .gjs-lm-layer { 
            font-size: 9px !important; 
            padding: 3px 6px !important;
            line-height: 14px !important;
            border-bottom: 1px solid #f0f0f0 !important;
            min-height: 18px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          
          .gjs-layer-item:hover, .gjs-lm-layer:hover { 
            background: #f8f9fa !important; 
          }
          
          .gjs-layer-title, .gjs-lm-layer-name { 
            font-size: 8px !important; 
            color: #495057 !important;
            flex: 1 !important;
            margin-right: 4px !important;
          }
          
          .gjs-layer-vis, .gjs-lm-layer .gjs-layer-vis { 
            font-size: 7px !important; 
            width: 10px !important;
            height: 10px !important;
            opacity: 0.7 !important;
            margin-right: 2px !important;
          }
          
          .gjs-layer-caret, .gjs-lm-caret { 
            font-size: 7px !important; 
            color: #6c757d !important;
            width: 8px !important;
            height: 8px !important;
            margin-right: 2px !important;
          }
          
          /* Style manager - better alignment */
          .gjs-sm-sectors { 
            padding: 2px !important; 
            height: 100% !important;
            overflow-y: auto !important;
          }
          
          .gjs-sm-sector { 
            margin-bottom: 3px !important;
            border: 1px solid #e9ecef !important;
            border-radius: 2px !important;
            background: #ffffff !important;
          }
          
          .gjs-sm-sector-title, .gjs-sm-title { 
            font-size: 8px !important; 
            font-weight: 600 !important;
            padding: 3px 4px !important;
            background: #f8f9fa !important;
            border-bottom: 1px solid #e9ecef !important;
            color: #495057 !important;
            cursor: pointer !important;
            line-height: 12px !important;
          }
          
          .gjs-sm-sector-title:hover, .gjs-sm-title:hover { 
            background: #e9ecef !important; 
          }
          
          .gjs-sm-properties { 
            padding: 3px 4px !important; 
          }
          
          .gjs-sm-property { 
            margin-bottom: 3px !important;
            display: flex !important;
            align-items: center !important;
            min-height: 16px !important;
          }
          
          .gjs-sm-label { 
            font-size: 7px !important;
            color: #6c757d !important;
            min-width: 40px !important;
            margin-right: 3px !important;
            line-height: 10px !important;
          }
          
          .gjs-sm-field { 
            flex: 1 !important; 
          }
          
          .gjs-sm-input { 
            font-size: 7px !important; 
            height: 16px !important; 
            padding: 1px 3px !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 2px !important;
            width: 100% !important;
          }
          
          .gjs-sm-input:focus { 
            border-color: #007bff !important;
            outline: none !important;
            box-shadow: 0 0 0 1px rgba(0,123,255,0.1) !important;
          }
          
          /* Style manager buttons and icons - smaller */
          .gjs-sm-btn, .gjs-sm-icon {
            width: 12px !important;
            height: 12px !important;
            font-size: 6px !important;
            padding: 1px !important;
            margin: 1px !important;
          }
          
          /* Color picker and sliders - smaller */
          .gjs-field-color-picker {
            height: 14px !important;
            width: 25px !important;
          }
          
          .gjs-sm-slider {
            height: 14px !important;
          }
          
          /* Trait manager - better alignment */
          .gjs-trt-traits { 
            padding: 4px !important; 
            height: 100% !important;
            overflow-y: auto !important;
          }
          
          .gjs-trt-item { 
            margin-bottom: 6px !important;
            display: flex !important;
            align-items: center !important;
          }
          
          .gjs-trt-label { 
            font-size: 8px !important;
            color: #6c757d !important;
            min-width: 50px !important;
            margin-right: 6px !important;
            line-height: 12px !important;
          }
          
          .gjs-trt-input { 
            font-size: 8px !important; 
            height: 20px !important; 
            padding: 2px 4px !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 2px !important;
            flex: 1 !important;
          }
          
          .gjs-trt-input:focus { 
            border-color: #007bff !important;
            outline: none !important;
            box-shadow: 0 0 0 1px rgba(0,123,255,0.1) !important;
          }
          
          /* Scrollbars */
          .gjs-pn-views::-webkit-scrollbar,
          .layers-container::-webkit-scrollbar,
          .styles-container::-webkit-scrollbar,
          .traits-container::-webkit-scrollbar,
          .gjs-blocks-c::-webkit-scrollbar {
            width: 6px !important;
          }
          
          .gjs-pn-views::-webkit-scrollbar-thumb,
          .layers-container::-webkit-scrollbar-thumb,
          .styles-container::-webkit-scrollbar-thumb,
          .traits-container::-webkit-scrollbar-thumb,
          .gjs-blocks-c::-webkit-scrollbar-thumb {
            background: #ccc !important;
            border-radius: 3px !important;
          }
          
          .gjs-pn-views::-webkit-scrollbar-track,
          .layers-container::-webkit-scrollbar-track,
          .styles-container::-webkit-scrollbar-track,
          .traits-container::-webkit-scrollbar-track,
          .gjs-blocks-c::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
          }
        `;
        document.head.appendChild(style);

        console.log('GrapesJS instance created successfully');

        // Add custom commands
        editor.Commands.add('set-device-desktop', {
          run: (editor: any) => editor.setDevice('Desktop')
        });
        editor.Commands.add('set-device-tablet', {
          run: (editor: any) => editor.setDevice('Tablet')
        });
        editor.Commands.add('set-device-mobile', {
          run: (editor: any) => editor.setDevice('Mobile')
        });

        // Load template content if available
        if (template?.html_content) {
          console.log('Loading template HTML content...');
          // Replace placeholders with actual values
          let htmlContent = template.html_content;
          htmlContent = htmlContent.replace(/\{\{event_title\}\}/g, eventInfo.title);
          htmlContent = htmlContent.replace(/\{\{event_description\}\}/g, eventInfo.description);
          htmlContent = htmlContent.replace(/\{\{event_name\}\}/g, eventInfo.eventName);
          editor.setComponents(htmlContent);
        } else {
          console.log('Loading default template...');
          // Load default event template
          const defaultTemplate = `
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
          editor.setComponents(defaultTemplate);
        }

        if (template?.css_content) {
          console.log('Loading template CSS content...');
          editor.setStyle(template.css_content);
        }

        console.log('GrapesJS editor initialized successfully');
        console.log('Calling onReady with editor:', editor);
        onReady(editor);
      } catch (error) {
        console.error('Failed to initialize GrapesJS:', error);
        console.error('Error stack:', error.stack);
        onError(error as Error);
      }
    };

    const timer = setTimeout(initGrapesJS, 100);
    return () => clearTimeout(timer);
  }, [template, eventInfo.title, eventInfo.description, onReady, onError]);

  console.log('GrapesJSInitializer rendering DOM element, editorRef.current:', editorRef.current);
  return <div ref={editorRef} className="h-full w-full"></div>;
};
