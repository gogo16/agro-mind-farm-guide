
-- Create enum types first
CREATE TYPE public.task_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE public.task_status AS ENUM ('pending', 'completed', 'in_progress');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE public.document_status AS ENUM ('verified', 'missing', 'expired', 'complete');
CREATE TYPE public.inventory_type AS ENUM ('equipment', 'chemical', 'seeds', 'fuel', 'other');
CREATE TYPE public.stock_level AS ENUM ('low', 'normal', 'high');
CREATE TYPE public.notification_type AS ENUM ('task', 'weather', 'inventory', 'ai', 'financial', 'system');
CREATE TYPE public.notification_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE public.sync_frequency AS ENUM ('daily', 'weekly', 'manual');

-- Create USER_PREFERENCES table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  weather_sync_frequency sync_frequency DEFAULT 'daily',
  notification_preferences JSONB DEFAULT '{}',
  dashboard_layout JSONB DEFAULT '{}',
  ai_suggestions_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create FIELDS table
CREATE TABLE public.fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  parcel_code TEXT,
  size NUMERIC NOT NULL, -- hectare
  crop TEXT,
  status TEXT DEFAULT 'active',
  location TEXT,
  coordinates JSONB, -- {lat, lng}
  planting_date DATE,
  harvest_date DATE,
  work_type TEXT,
  costs NUMERIC DEFAULT 0,
  inputs TEXT,
  roi NUMERIC DEFAULT 0,
  color TEXT DEFAULT '#22c55e',
  soil_data JSONB DEFAULT '{}', -- pH, humidity, nutrients
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create TASKS table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  field_name TEXT,
  priority task_priority DEFAULT 'medium',
  date DATE NOT NULL,
  time TIME,
  due_date DATE,
  due_time TIME,
  status task_status DEFAULT 'pending',
  ai_suggested BOOLEAN DEFAULT false,
  description TEXT,
  estimated_duration TEXT,
  duration INTEGER, -- minutes
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create WORK_HISTORY table
CREATE TABLE public.work_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE NOT NULL,
  work_type TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  worker TEXT,
  cost NUMERIC DEFAULT 0,
  duration INTEGER, -- minutes
  weather_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FIELD_PHOTOS table
CREATE TABLE public.field_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  date DATE NOT NULL,
  activity TEXT,
  crop_stage TEXT,
  weather_conditions TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FINANCIAL_TRANSACTIONS table
CREATE TABLE public.financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  date DATE NOT NULL,
  roi_impact NUMERIC DEFAULT 0,
  budget_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create INVENTORY table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type inventory_type NOT NULL,
  quantity TEXT NOT NULL,
  unit TEXT,
  condition TEXT,
  location TEXT,
  last_used DATE,
  next_maintenance DATE,
  expiration_date DATE,
  purpose TEXT,
  stock_level stock_level DEFAULT 'normal',
  purchase_cost NUMERIC DEFAULT 0,
  current_value NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PROPERTY_DOCUMENTS table
CREATE TABLE public.property_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL,
  name TEXT NOT NULL,
  file_name TEXT,
  file_url TEXT,
  upload_date DATE DEFAULT CURRENT_DATE,
  issue_date DATE,
  valid_until DATE,
  status document_status DEFAULT 'complete',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create APIA_DOCUMENTS table
CREATE TABLE public.apia_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  document_data JSONB NOT NULL DEFAULT '{}',
  file_url TEXT,
  status TEXT DEFAULT 'generated',
  submission_date DATE
);

-- Create SATELLITE_MONITORING table
CREATE TABLE public.satellite_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE NOT NULL,
  current_image_url TEXT,
  previous_image_url TEXT,
  comparison_image_url TEXT,
  change_detected BOOLEAN DEFAULT false,
  change_percentage NUMERIC DEFAULT 0,
  analysis_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_analysis_date TIMESTAMP WITH TIME ZONE,
  ai_insights JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create REPORTS_ANALYTICS table
CREATE TABLE public.reports_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  report_type TEXT NOT NULL,
  report_name TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  report_data JSONB NOT NULL DEFAULT '{}',
  file_url TEXT,
  parameters JSONB DEFAULT '{}', -- filters used to generate report
  status TEXT DEFAULT 'generated'
);

-- Create NOTIFICATIONS table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority notification_priority DEFAULT 'medium',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apia_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satellite_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for USER_PREFERENCES
CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own preferences" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for FIELDS
CREATE POLICY "Users can view their own fields" ON public.fields FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own fields" ON public.fields FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own fields" ON public.fields FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own fields" ON public.fields FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for TASKS
CREATE POLICY "Users can view their own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for WORK_HISTORY
CREATE POLICY "Users can view their own work history" ON public.work_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own work history" ON public.work_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own work history" ON public.work_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own work history" ON public.work_history FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for FIELD_PHOTOS
CREATE POLICY "Users can view their own field photos" ON public.field_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own field photos" ON public.field_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own field photos" ON public.field_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own field photos" ON public.field_photos FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for FINANCIAL_TRANSACTIONS
CREATE POLICY "Users can view their own transactions" ON public.financial_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.financial_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON public.financial_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON public.financial_transactions FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for INVENTORY
CREATE POLICY "Users can view their own inventory" ON public.inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own inventory" ON public.inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory" ON public.inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inventory" ON public.inventory FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for PROPERTY_DOCUMENTS
CREATE POLICY "Users can view their own documents" ON public.property_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own documents" ON public.property_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON public.property_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.property_documents FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for APIA_DOCUMENTS
CREATE POLICY "Users can view their own APIA documents" ON public.apia_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own APIA documents" ON public.apia_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own APIA documents" ON public.apia_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own APIA documents" ON public.apia_documents FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for SATELLITE_MONITORING
CREATE POLICY "Users can view their own satellite data" ON public.satellite_monitoring FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own satellite data" ON public.satellite_monitoring FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own satellite data" ON public.satellite_monitoring FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own satellite data" ON public.satellite_monitoring FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for REPORTS_ANALYTICS
CREATE POLICY "Users can view their own reports" ON public.reports_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reports" ON public.reports_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reports" ON public.reports_analytics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reports" ON public.reports_analytics FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for NOTIFICATIONS
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_fields_updated_at
  BEFORE UPDATE ON public.fields
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_fields_user_id ON public.fields(user_id);
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_field_id ON public.tasks(field_id);
CREATE INDEX idx_tasks_date ON public.tasks(date);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_work_history_user_id ON public.work_history(user_id);
CREATE INDEX idx_work_history_field_id ON public.work_history(field_id);
CREATE INDEX idx_field_photos_user_id ON public.field_photos(user_id);
CREATE INDEX idx_field_photos_field_id ON public.field_photos(field_id);
CREATE INDEX idx_financial_transactions_user_id ON public.financial_transactions(user_id);
CREATE INDEX idx_financial_transactions_field_id ON public.financial_transactions(field_id);
CREATE INDEX idx_financial_transactions_date ON public.financial_transactions(date);
CREATE INDEX idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX idx_property_documents_user_id ON public.property_documents(user_id);
CREATE INDEX idx_property_documents_field_id ON public.property_documents(field_id);
CREATE INDEX idx_apia_documents_user_id ON public.apia_documents(user_id);
CREATE INDEX idx_satellite_monitoring_user_id ON public.satellite_monitoring(user_id);
CREATE INDEX idx_satellite_monitoring_field_id ON public.satellite_monitoring(field_id);
CREATE INDEX idx_reports_analytics_user_id ON public.reports_analytics(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('field-photos', 'field-photos', true),
  ('documents', 'documents', true),
  ('satellite-images', 'satellite-images', true),
  ('reports', 'reports', true);

-- Create storage policies
CREATE POLICY "Users can upload their own field photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'field-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own field photos" ON storage.objects FOR SELECT USING (bucket_id = 'field-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own field photos" ON storage.objects FOR DELETE USING (bucket_id = 'field-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own satellite images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'satellite-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own satellite images" ON storage.objects FOR SELECT USING (bucket_id = 'satellite-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own satellite images" ON storage.objects FOR DELETE USING (bucket_id = 'satellite-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own reports" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own reports" ON storage.objects FOR SELECT USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own reports" ON storage.objects FOR DELETE USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);
