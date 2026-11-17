import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Clock } from 'lucide-react';
import { useSitemap } from '@/hooks/useSitemap';
import { useToast } from '@/hooks/use-toast';

export const SitemapGenerator = () => {
  const { updateSitemap, getLastUpdateTime, getCachedSitemap } = useSitemap();
  const { toast } = useToast();

  const handleUpdateSitemap = async () => {
    try {
      await updateSitemap();
      toast({
        title: "Sitemap Updated",
        description: "The sitemap has been successfully updated with the latest content.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update the sitemap. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSitemap = () => {
    const sitemapXML = getCachedSitemap();
    if (!sitemapXML) {
      toast({
        title: "No Sitemap Available",
        description: "Please generate a sitemap first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([sitemapXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Sitemap Downloaded",
      description: "The sitemap.xml file has been downloaded to your device.",
    });
  };

  const lastUpdateTime = getLastUpdateTime();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Sitemap Management
          <Badge variant="secondary">SEO Tool</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            Last updated: {lastUpdateTime ? formatDate(lastUpdateTime) : 'Never'}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleUpdateSitemap} className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Sitemap
          </Button>
          <Button onClick={handleDownloadSitemap} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>The sitemap includes all static pages and dynamically fetched blog posts. It's automatically updated when blog content changes.</p>
        </div>
      </CardContent>
    </Card>
  );
};