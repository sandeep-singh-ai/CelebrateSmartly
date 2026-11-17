
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";

interface EventInfo {
  title: string;
  description: string;
  eventName: string;
  featuredImage: string;
}

interface EditorSidebarProps {
  eventInfo: EventInfo;
  onEventInfoChange: (info: EventInfo) => void;
}

export const EditorSidebar = ({ eventInfo, onEventInfoChange }: EditorSidebarProps) => {
  const handleChange = (field: keyof EventInfo, value: string) => {
    onEventInfoChange({ ...eventInfo, [field]: value });
  };

  return (
    <div className="w-80 border-r bg-card overflow-auto">
      <Tabs defaultValue="settings" className="h-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
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
                  onChange={(e) => handleChange('eventName', e.target.value)}
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
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={eventInfo.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={eventInfo.featuredImage}
                  onChange={(e) => handleChange('featuredImage', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blocks" className="p-0 h-full">
          <div className="blocks-container h-full overflow-auto"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
