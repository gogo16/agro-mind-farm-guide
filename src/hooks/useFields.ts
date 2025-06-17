
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Field {
  id: string;
  user_id: string;
  nume_teren: string;
  cod_parcela: string;
  suprafata: number;
  cultura?: string;
  varietate?: string;
  data_insamantare?: string;
  data_recoltare?: string;
  culoare?: string;
  ingrasaminte_folosite?: string;
  coordonate_gps?: { lat: number; lng: number };
  created_at: string;
  updated_at: string;
  data_stergerii?: string;
  istoric_activitati?: any[];
}

interface CreateFieldData {
  nume_teren: string;
  cod_parcela: string;
  suprafata: number;
  cultura?: string;
  varietate?: string;
  data_insamantare?: string;
  data_recoltare?: string;
  culoare?: string;
  ingrasaminte_folosite?: string;
  coordonate_gps?: { lat: number; lng: number };
}

interface UpdateFieldData extends Partial<CreateFieldData> {}

export const useFields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .is('data_stergerii', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFields(data || []);
    } catch (err: any) {
      console.error('Error fetching fields:', err);
      setError(err.message);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca terenurile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addField = async (fieldData: CreateFieldData) => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .insert([fieldData])
        .select()
        .single();

      if (error) throw error;

      setFields(prev => [data, ...prev]);
      toast({
        title: "Succes",
        description: "Terenul a fost adăugat cu succes"
      });

      return data;
    } catch (err: any) {
      console.error('Error adding field:', err);
      toast({
        title: "Eroare",
        description: err.message || "Nu s-a putut adăuga terenul",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateField = async (id: string, updates: UpdateFieldData) => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFields(prev => prev.map(field => 
        field.id === id ? { ...field, ...data } : field
      ));

      toast({
        title: "Succes",
        description: "Terenul a fost actualizat cu succes"
      });

      return data;
    } catch (err: any) {
      console.error('Error updating field:', err);
      toast({
        title: "Eroare",
        description: err.message || "Nu s-a putut actualiza terenul",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fields')
        .update({ data_stergerii: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setFields(prev => prev.filter(field => field.id !== id));
      toast({
        title: "Succes",
        description: "Terenul a fost șters cu succes"
      });
    } catch (err: any) {
      console.error('Error deleting field:', err);
      toast({
        title: "Eroare",
        description: err.message || "Nu s-a putut șterge terenul",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  return {
    fields,
    loading,
    error,
    addField,
    updateField,
    deleteField,
    refetch: fetchFields
  };
};
