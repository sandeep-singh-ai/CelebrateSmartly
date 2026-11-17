
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Save, Share2 } from "lucide-react";

interface EditorHeaderProps {
  eventName: string;
  onBack: () => void;
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
}

export const EditorHeader = ({ 
  eventName, 
  onBack, 
  onPreview, 
  onSave, 
  onPublish 
}: EditorHeaderProps) => {
  return (
    <div className="border-b bg-card shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Professional Website Builder</h1>
            <p className="text-sm text-muted-foreground">{eventName || 'Untitled Event'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button size="sm" onClick={onPublish}>
            <Share2 className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};
