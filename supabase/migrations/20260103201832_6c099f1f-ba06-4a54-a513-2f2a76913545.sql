-- Create collections table
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create generated_images table for library
CREATE TABLE public.generated_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth required for now)
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Anyone can create collections" ON public.collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update collections" ON public.collections FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete collections" ON public.collections FOR DELETE USING (true);

CREATE POLICY "Anyone can view images" ON public.generated_images FOR SELECT USING (true);
CREATE POLICY "Anyone can create images" ON public.generated_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update images" ON public.generated_images FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete images" ON public.generated_images FOR DELETE USING (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();