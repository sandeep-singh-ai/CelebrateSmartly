import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronDown, ChevronUp, MessageCircle, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

const categoryLabels: Record<string, string> = {
  'general': 'General',
  'event-creation': 'Event Creation',
  'event-management': 'Event Management',
  'rsvp': 'RSVP Management',
  'vendors': 'Vendor Discovery',
  'website-builder': 'Website Builder',
  'guest-management': 'Guest Management',
  'pricing': 'Pricing & Plans',
  'privacy': 'Privacy & Security',
  'support': 'Support & Help'
};

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [faqs, searchTerm, selectedCategory]);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('sort_order');

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFaqs(filtered);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": filteredFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Layout>
      <Helmet>
        <title>FAQ - Frequently Asked Questions | CelebrateSmartly</title>
        <meta name="description" content="Find answers to frequently asked questions about CelebrateSmartly's free event planning platform, RSVP management, vendor discovery, and more." />
        <meta name="keywords" content="FAQ, help, questions, event planning, RSVP, vendors, support, CelebrateSmartly" />
        <link rel="canonical" href="https://celebratesmartly.com/faq" />
        <meta property="og:title" content="FAQ - Frequently Asked Questions | CelebrateSmartly" />
        <meta property="og:description" content="Get quick answers about our free event planning platform, RSVP features, and vendor discovery tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://celebratesmartly.com/faq" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FAQ - CelebrateSmartly Help Center" />
        <meta name="twitter:description" content="Find answers to common questions about event planning, RSVPs, and vendor discovery." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about CelebrateSmartly's free event planning platform
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryLabels[category] || category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading FAQs...</p>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filter.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <Card key={faq.id} className="overflow-hidden">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full text-left p-6 hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {categoryLabels[faq.category] || faq.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {faq.question}
                          </h3>
                        </div>
                        <div className="flex-shrink-0">
                          {expandedItems.has(faq.id) ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </button>
                    {expandedItems.has(faq.id) && (
                      <CardContent className="pt-0 pb-6">
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                          {faq.answer}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/help">Visit Help Center</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}