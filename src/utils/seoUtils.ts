/**
 * Utility functions for SEO optimization
 */

/**
 * Extract keywords from text content using natural language processing
 */
export const extractKeywordsFromContent = (content: string, maxKeywords: number = 10): string[] => {
  // Remove HTML tags
  const cleanText = content.replace(/<[^>]*>/g, ' ');
  
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 
    'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);
  
  // Extract words and count frequency
  const words = cleanText
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  // Count word frequency
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

/**
 * Generate meta description from content with optimal length for SEO
 */
export const generateMetaDescription = (title: string, content: string, maxLength: number = 160): string => {
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // If content is short enough, use it directly
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Try to break at sentence boundary
  const sentences = cleanContent.split(/[.!?]+/);
  let description = '';
  
  for (const sentence of sentences) {
    const newDescription = description + (description ? '. ' : '') + sentence.trim();
    if (newDescription.length <= maxLength - 3) {
      description = newDescription;
    } else {
      break;
    }
  }
  
  // If we have a good description, use it
  if (description.length > 50) {
    return description + '...';
  }
  
  // Otherwise, truncate at word boundary
  const words = cleanContent.split(' ');
  let truncated = '';
  
  for (const word of words) {
    const newTruncated = truncated + (truncated ? ' ' : '') + word;
    if (newTruncated.length <= maxLength - 3) {
      truncated = newTruncated;
    } else {
      break;
    }
  }
  
  return truncated + '...';
};

/**
 * Combine existing tags with auto-generated keywords
 */
export const enhanceKeywords = (existingTags: string[], content: string): string[] => {
  const autoKeywords = extractKeywordsFromContent(content, 5);
  const combined = [...existingTags, ...autoKeywords];
  
  // Remove duplicates and limit to 15 keywords
  return Array.from(new Set(combined.map(tag => tag.toLowerCase())))
    .slice(0, 15);
};

/**
 * Generate dynamic meta description for blog listing pages
 */
export const generateBlogListingMetaDescription = (posts: any[]): string => {
  if (posts.length === 0) {
    return "Discover expert event planning tips, celebration trends, and creative ideas for unforgettable parties.";
  }
  
  const recentTopics = posts.slice(0, 3).map(post => {
    const title = typeof post.title === 'object' ? post.title.rendered : post.title;
    return title.replace(/[^\w\s]/g, '').split(' ').slice(0, 3).join(' ');
  });
  
  return `Latest event planning insights: ${recentTopics.join(', ')} and more expert celebration tips.`;
};
