
-- Create table for storing EU cereal market data
CREATE TABLE public.eu_market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_state_code TEXT NOT NULL,
  member_state_name TEXT NOT NULL,
  begin_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reference_period DATE NOT NULL,
  week_number INTEGER,
  product_name TEXT NOT NULL,
  product_code TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  stage_code TEXT NOT NULL,
  market_name TEXT NOT NULL,
  market_code TEXT NOT NULL,
  unit TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for product mapping between EU and Romanian products
CREATE TABLE public.product_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  romanian_name TEXT NOT NULL,
  romanian_symbol TEXT NOT NULL,
  eu_product_code TEXT NOT NULL,
  eu_product_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for price history (for AI trend analysis)
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_code TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  date DATE NOT NULL,
  change_amount DECIMAL(10,2),
  change_percent DECIMAL(5,2),
  volume INTEGER,
  data_source TEXT DEFAULT 'eu_api',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_eu_market_prices_product_date ON public.eu_market_prices(product_code, reference_period);
CREATE INDEX idx_price_history_product_date ON public.price_history(product_code, date);
CREATE INDEX idx_product_mapping_romanian ON public.product_mapping(romanian_symbol);

-- Insert initial product mappings
INSERT INTO public.product_mapping (romanian_name, romanian_symbol, eu_product_code, eu_product_name) VALUES
('Grâu', 'WHEAT', 'BLT', 'Common wheat'),
('Porumb', 'CORN', 'MAI', 'Maize'),
('Orz', 'BARLEY', 'ORG', 'Feed barley'),
('Rapiță', 'RAPE', 'COL', 'Rapeseed'),
('Ovăz', 'OATS', 'AVE', 'Oats'),
('Grâu dur', 'DUR_WHEAT', 'DUR', 'Durum wheat');

-- Enable Row Level Security (RLS) - these tables can be public read
ALTER TABLE public.eu_market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to eu_market_prices" 
  ON public.eu_market_prices 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to product_mapping" 
  ON public.product_mapping 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to price_history" 
  ON public.price_history 
  FOR SELECT 
  USING (true);

-- Create policies for insert/update (for the API to populate data)
CREATE POLICY "Allow service role to modify eu_market_prices" 
  ON public.eu_market_prices 
  FOR ALL 
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role to modify price_history" 
  ON public.price_history 
  FOR ALL 
  USING (auth.role() = 'service_role');
