
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Cake, Baby, Sparkles } from "lucide-react";
import { useTemplateCategories, TemplateCategory } from "@/hooks/useTemplateCategories";

interface CategorySelectorProps {
  onSelectCategory: (category: TemplateCategory) => void;
  onBack?: () => void;
}

const categoryIcons = {
  'Heart': Heart,
  'Cake': Cake,
  'Baby': Baby,
  'Sparkles': Sparkles,
};

export const CategorySelector = ({ onSelectCategory, onBack }: CategorySelectorProps) => {
  const { categories, isLoading } = useTemplateCategories();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
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
        {onBack && (
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Event Category
          </h1>
          <p className="text-muted-foreground text-lg">
            Select the type of event you're creating a website for
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || Sparkles;
          
          return (
            <Card 
              key={category.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              onClick={() => onSelectCategory(category)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl capitalize group-hover:text-primary transition-colors">
                  {category.name.replace('-', ' ')}
                </CardTitle>
                {category.description && (
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="text-center">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Templates
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
