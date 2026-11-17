import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PAGE_SIZE = 30;

const VendorRecentSearches: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searches, setSearches] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const page = useMemo(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return Number.isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, count: total, error } = await supabase
        .from("vendor_searches")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);
      if (!error) {
        setSearches(data || []);
        setCount(total || 0);
      }
      setLoading(false);
    };
    load();
  }, [user, page]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const setPage = (p: number) => {
    setSearchParams({ page: String(p) });
  };

  return (
    <Layout>
      <Helmet>
        <title>Recent Vendor Searches | Celebrate Smartly</title>
        <meta name="description" content="Browse your recent vendor searches with SEO-friendly links." />
        <link rel="canonical" href={`/vendors/recent-searches?page=${page}`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <header className="mb-6">
              <h1 className="text-3xl font-bold">Recent vendor searches</h1>
            </header>
            <Card>
              <CardHeader>
                <CardTitle>All recent searches</CardTitle>
                <CardDescription>Your full search history</CardDescription>
              </CardHeader>
              <CardContent>
                {!user && (
                  <p>You need to sign in to view your recent searches.</p>
                )}
                {user && (
                  <>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <ul className="space-y-3">
                        {searches.map((s) => {
                          const href = `/vendors?location=${encodeURIComponent(s.location)}${s.category_id ? `&category_id=${s.category_id}` : ''}${s.search_radius ? `&radius=${s.search_radius}` : ''}`;
                          return (
                            <li key={s.id}>
                              <a href={href} className="underline" aria-label={`Search vendors in ${s.location}`}>
                                {s.search_query || s.location}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {totalPages > 1 && (
                      <Pagination className="mt-8">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href={page > 1 ? `/vendors/recent-searches?page=${page - 1}` : undefined} onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }} />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <PaginationItem key={p}>
                              <PaginationLink href={`/vendors/recent-searches?page=${p}`} isActive={p === page} onClick={(e) => { e.preventDefault(); setPage(p); }}>
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext href={page < totalPages ? `/vendors/recent-searches?page=${page + 1}` : undefined} onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }} />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VendorRecentSearches;
