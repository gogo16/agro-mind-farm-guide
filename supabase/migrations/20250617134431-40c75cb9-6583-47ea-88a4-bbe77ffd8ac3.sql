
-- Crearea tabelului inventory
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nume_element TEXT NOT NULL,
  categorie_element TEXT NOT NULL CHECK (categorie_element IN ('equipment', 'chemical', 'crop', 'material', 'fuel')),
  cantitate_status TEXT,
  locatia TEXT,
  pret NUMERIC,
  tip_tranzactie TEXT CHECK (tip_tranzactie IN ('income', 'expense')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_stergerii TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activarea Row Level Security
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Politici RLS pentru ca utilizatorii să vadă doar propriile înregistrări
CREATE POLICY "Users can view their own inventory items" 
  ON public.inventory 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory items" 
  ON public.inventory 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory items" 
  ON public.inventory 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory items" 
  ON public.inventory 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger pentru actualizarea automată a updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.inventory 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Index pentru performanță
CREATE INDEX idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX idx_inventory_data_stergerii ON public.inventory(data_stergerii);
