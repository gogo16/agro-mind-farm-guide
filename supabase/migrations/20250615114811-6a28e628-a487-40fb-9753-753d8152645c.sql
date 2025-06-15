
-- Create fields table for storing user fields
CREATE TABLE public.fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  area NUMERIC NOT NULL,
  crop TEXT NOT NULL,
  coordinates_lat NUMERIC,
  coordinates_lng NUMERIC,
  soil_type TEXT,
  last_activity TEXT,
  notes TEXT,
  parcel_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'healthy',
  color TEXT NOT NULL DEFAULT '#22c55e',
  planting_date DATE,
  harvest_date DATE,
  work_type TEXT,
  inputs TEXT,
  variety TEXT,
  costs NUMERIC DEFAULT 0,
  roi NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create field_photos table for storing field photos
CREATE TABLE public.field_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  date_taken TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to fields table
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;

-- Create policies for fields table
CREATE POLICY "Users can view their own fields" 
  ON public.fields 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fields" 
  ON public.fields 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fields" 
  ON public.fields 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fields" 
  ON public.fields 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add Row Level Security (RLS) to field_photos table
ALTER TABLE public.field_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for field_photos table
CREATE POLICY "Users can view their own field photos" 
  ON public.field_photos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own field photos" 
  ON public.field_photos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own field photos" 
  ON public.field_photos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own field photos" 
  ON public.field_photos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp for fields
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.fields 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
