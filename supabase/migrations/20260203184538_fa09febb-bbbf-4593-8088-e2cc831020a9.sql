-- Create a table to track site visits
CREATE TABLE public.site_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert visits (anonymous tracking)
CREATE POLICY "Anyone can record visits" 
ON public.site_visits 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read visit stats
CREATE POLICY "Anyone can read visits" 
ON public.site_visits 
FOR SELECT 
USING (true);

-- Enable realtime for presence tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;