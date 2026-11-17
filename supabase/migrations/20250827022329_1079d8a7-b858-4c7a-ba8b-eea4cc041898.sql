-- Enable RLS on blog_posts_cache table
ALTER TABLE public.blog_posts_cache ENABLE ROW LEVEL SECURITY;

-- Create read-only policy for blog posts
CREATE POLICY "Anyone can view blog posts" ON public.blog_posts_cache FOR SELECT USING (true);