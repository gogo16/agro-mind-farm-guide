
-- Create fields table with all required columns
CREATE TABLE public.fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nume_teren TEXT NOT NULL,
  cod_parcela TEXT NOT NULL,
  suprafata NUMERIC NOT NULL CHECK (suprafata > 0),
  cultura TEXT,
  varietate TEXT,
  data_insamantare DATE,
  data_recoltare DATE,
  culoare TEXT DEFAULT '#22c55e', -- Default green color
  ingrasaminte_folosite TEXT,
  coordonate_gps JSONB, -- Store as {lat: number, lng: number}
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_stergerii TIMESTAMP WITH TIME ZONE NULL, -- For soft delete
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  istoric_activitati JSONB DEFAULT '[]'::jsonb -- Empty array for future activities
);

-- Enable Row Level Security
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for fields
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

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fields_updated_at
  BEFORE UPDATE ON public.fields
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_fields_user_id ON public.fields(user_id);
CREATE INDEX idx_fields_cod_parcela ON public.fields(cod_parcela);
CREATE INDEX idx_fields_data_stergerii ON public.fields(data_stergerii) WHERE data_stergerii IS NULL;
CREATE INDEX idx_fields_created_at ON public.fields(created_at DESC);

-- Add unique constraint for cod_parcela per user
ALTER TABLE public.fields ADD CONSTRAINT unique_cod_parcela_per_user UNIQUE(user_id, cod_parcela);
