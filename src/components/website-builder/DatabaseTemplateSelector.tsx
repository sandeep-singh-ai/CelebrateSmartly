
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Cake, Baby, Sparkles } from "lucide-react";
import { useWebsiteTemplates, WebsiteTemplate } from "@/hooks/useWebsiteTemplates";
import { TemplateCategory } from "@/hooks/useTemplateCategories";

interface DatabaseTemplateSelectorProps {
  category: TemplateCategory;
  onSelectTemplate: (template: WebsiteTemplate) => void;
  onBack: () => void;
}

const categoryIcons = {
  'Heart': Heart,
  'Cake': Cake,
  'Baby': Baby,
  'Sparkles': Sparkles,
};

export const DatabaseTemplateSelector = ({ category, onSelectTemplate, onBack }: DatabaseTemplateSelectorProps) => {
  const { templates, isLoading } = useWebsiteTemplates(category.id);
  const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || Sparkles;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {category.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Templates
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a beautiful template for your {category.name.replace('-', ' ')} event
          </p>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <IconComponent className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            No templates found for this category.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              onClick={() => onSelectTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="capitalize">
                    <IconComponent className="w-3 h-3 mr-1" />
                    {category.name.replace('-', ' ')}
                  </Badge>
                  {template.is_premium && (
                    <Badge variant="default">Premium</Badge>
                  )}
                </div>
                
                {/* Template Preview */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {template.thumbnail_url ? (
                    <img 
                      src={template.thumbnail_url} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <IconComponent className="w-12 h-12 mx-auto mb-2 text-primary/60" />
                      <div className="text-xs text-muted-foreground">Template Preview</div>
                    </div>
                  )}
                  
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
                {template.description && (
                  <CardDescription className="text-sm mb-3">
                    {template.description}
                  </CardDescription>
                )}
                
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
