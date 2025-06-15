
-- Create table for storing weather data
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  temperature_celsius DECIMAL(5, 2),
  precipitation_mm DECIMAL(8, 2),
  relative_humidity_percent INTEGER,
  wind_speed_kph DECIMAL(5, 2),
  weather_code INTEGER,
  data_type TEXT NOT NULL CHECK (data_type IN ('forecast', 'historical', 'current')),
  extraction_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for optimized queries
CREATE INDEX idx_weather_data_user_id ON public.weather_data(user_id);
CREATE INDEX idx_weather_data_timestamp ON public.weather_data(timestamp);
CREATE INDEX idx_weather_data_user_timestamp ON public.weather_data(user_id, timestamp);
CREATE INDEX idx_weather_data_type ON public.weather_data(data_type);
CREATE INDEX idx_weather_data_coordinates ON public.weather_data(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own weather data" 
  ON public.weather_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weather data" 
  ON public.weather_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weather data" 
  ON public.weather_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weather data" 
  ON public.weather_data 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to handle weather data cleanup (keep only last 365 days for historical data)
CREATE OR REPLACE FUNCTION public.cleanup_old_weather_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.weather_data 
  WHERE data_type = 'historical' 
    AND timestamp < NOW() - INTERVAL '365 days';
END;
$$;
