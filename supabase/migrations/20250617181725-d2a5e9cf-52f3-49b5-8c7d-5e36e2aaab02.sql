
-- First, let's drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can create their own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can update their own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can delete their own fields" ON public.fields;

-- Enable Row Level Security (this might already be enabled, but it's safe to run)
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;

-- Create the RLS policies
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
