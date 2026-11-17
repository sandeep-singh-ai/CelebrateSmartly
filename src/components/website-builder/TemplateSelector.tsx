import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { eventTemplates } from "@/data/event-templates";
import { EventTemplate } from "@/types/website-builder";
import { Heart, Cake, Baby, Sparkles } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: EventTemplate) => void;
}

const categoryIcons = {
  wedding: Heart,
  birthday: Cake,
  'baby-shower': Baby,
  general: Sparkles
};

export const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? eventTemplates 
    : eventTemplates.filter(template => template.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'birthday', name: 'Birthday' },
    { id: 'baby-shower', name: 'Baby Shower' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Choose Your Event Template
        </h1>
        <p className="text-muted-foreground text-lg">
          Select a beautiful template to start building your event website
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="px-6 py-2"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = categoryIcons[template.category];
          
          return (
            <Card 
              key={template.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              onClick={() => onSelectTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="capitalize">
                    <IconComponent className="w-3 h-3 mr-1" />
                    {template.category.replace('-', ' ')}
                  </Badge>
                </div>
                
                {/* Template Preview */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center p-4">
                    <IconComponent className="w-12 h-12 mx-auto mb-2 text-primary/60" />
                    <div className="text-xs text-muted-foreground">Template Preview</div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="sm" className="animate-fade-in">
                      Select Template
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
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            No templates found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
};