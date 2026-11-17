import { useEffect, useCallback } from 'react';
import { sitemapService } from '@/services/sitemapService';

interface UseSitemapOptions {
  autoUpdate?: boolean;
  updateInterval?: number; // in milliseconds
}

export const useSitemap = (options: UseSitemapOptions = {}) => {
  const { autoUpdate = false, updateInterval = 24 * 60 * 60 * 1000 } = options; // Default 24 hours

  const updateSitemap = useCallback(async () => {
    await sitemapService.updateSitemap();
  }, []);

  const shouldUpdate = useCallback(() => {
    const lastUpdate = sitemapService.getLastUpdateTime();
    if (!lastUpdate) return true;
    
    const lastUpdateTime = new Date(lastUpdate).getTime();
    const now = new Date().getTime();
    
    return (now - lastUpdateTime) > updateInterval;
  }, [updateInterval]);

  // Auto-update sitemap on mount if needed
  useEffect(() => {
    if (autoUpdate && shouldUpdate()) {
      updateSitemap();
    }
  }, [autoUpdate, shouldUpdate, updateSitemap]);

  // Set up periodic updates if auto-update is enabled
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      if (shouldUpdate()) {
        updateSitemap();
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [autoUpdate, updateInterval, shouldUpdate, updateSitemap]);

  return {
    updateSitemap,
    getLastUpdateTime: () => sitemapService.getLastUpdateTime(),
    getCachedSitemap: () => sitemapService.getCachedSitemap(),
  };
};