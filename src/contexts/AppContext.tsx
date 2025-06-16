
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Field {
  id: string;
  name: string;
  parcel_code?: string;
  size: number;
  crop?: string;
  status?: string;
  location?: string;
  coordinates?: any;
  planting_date?: string;
  harvest_date?: string;
  work_type?: string;
  costs?: number;
  inputs?: string;
  roi?: number;
  color?: string;
  soil_data?: any;
}

interface Task {
  id: string;
  title: string;
  field_name?: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  time?: string;
  due_date?: string;
  due_time?: string;
  status: 'pending' | 'completed' | 'in_progress';
  ai_suggested?: boolean;
  description?: string;
  estimated_duration?: string;
  duration?: number;
  category?: string;
  field_id?: string;
}

interface FieldPhoto {
  id: string;
  field_id: string;
  image_url: string;
  date: string;
  activity?: string;
  crop_stage?: string;
  weather_conditions?: string;
  notes?: string;
}

interface AppContextType {
  fields: Field[];
  tasks: Task[];
  fieldPhotos: FieldPhoto[];
  loading: boolean;
  addField: (field: Omit<Field, 'id'>) => Promise<void>;
  updateField: (id: string, updates: Partial<Field>) => Promise<void>;
  deleteField: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addFieldPhoto: (photo: Omit<FieldPhoto, 'id'>) => Promise<void>;
  refetchData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fieldPhotos, setFieldPhotos] = useState<FieldPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch fields
      const { data: fieldsData, error: fieldsError } = await supabase
        .from('fields')
        .select('*')
        .eq('user_id', user.id);

      if (fieldsError) throw fieldsError;

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (tasksError) throw tasksError;

      // Fetch field photos
      const { data: photosData, error: photosError } = await supabase
        .from('field_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (photosError) throw photosError;

      setFields(fieldsData || []);
      setTasks(tasksData || []);
      setFieldPhotos(photosData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setFields([]);
      setTasks([]);
      setFieldPhotos([]);
      setLoading(false);
    }
  }, [user]);

  const addField = async (fieldData: Omit<Field, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fields')
        .insert([{ ...fieldData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setFields(prev => [...prev, data]);
      toast({
        title: "Succes",
        description: "Terenul a fost adăugat cu succes."
      });
    } catch (error) {
      console.error('Error adding field:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga terenul.",
        variant: "destructive"
      });
    }
  };

  const updateField = async (id: string, updates: Partial<Field>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fields')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setFields(prev => prev.map(field => field.id === id ? data : field));
      toast({
        title: "Succes",
        description: "Terenul a fost actualizat cu succes."
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza terenul.",
        variant: "destructive"
      });
    }
  };

  const deleteField = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setFields(prev => prev.filter(field => field.id !== id));
      toast({
        title: "Succes",
        description: "Terenul a fost șters cu succes."
      });
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge terenul.",
        variant: "destructive"
      });
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [...prev, data]);
      toast({
        title: "Succes",
        description: "Sarcina a fost adăugată cu succes."
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga sarcina.",
        variant: "destructive"
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => task.id === id ? data : task));
      
      if (updates.status === 'completed') {
        toast({
          title: "Succes",
          description: "Sarcina a fost marcată ca finalizată."
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza sarcina.",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Succes",
        description: "Sarcina a fost ștearsă cu succes."
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge sarcina.",
        variant: "destructive"
      });
    }
  };

  const addFieldPhoto = async (photoData: Omit<FieldPhoto, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('field_photos')
        .insert([{ ...photoData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setFieldPhotos(prev => [data, ...prev]);
      toast({
        title: "Succes",
        description: "Fotografia a fost adăugată cu succes."
      });
    } catch (error) {
      console.error('Error adding field photo:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga fotografia.",
        variant: "destructive"
      });
    }
  };

  const refetchData = async () => {
    await fetchData();
  };

  return (
    <AppContext.Provider value={{
      fields,
      tasks,
      fieldPhotos,
      loading,
      addField,
      updateField,
      deleteField,
      addTask,
      updateTask,
      deleteTask,
      addFieldPhoto,
      refetchData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
