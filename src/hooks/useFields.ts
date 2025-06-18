import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

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
  coordonate_gps?: { lat: number; lng: number } | { lat: number; lng: number }[] | null;
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
  coordonate_gps?: { lat: number; lng: number } | { lat: number; lng: number }[];
}

interface UpdateFieldData extends Partial<CreateFieldData> {}

// Enhanced helper function to transform GPS coordinates
const transformCoordinates = (coords: Json | null): { lat: number; lng: number } | { lat: number; lng: number }[] | null => {
  if (!coords) {
    console.log('No coordinates provided');
    return null;
  }
  
  try {
    let parsedCoords;
    
    // If coords is a string, parse it as JSON
    if (typeof coords === 'string') {
      console.log('Parsing coordinates from string:', coords);
      parsedCoords = JSON.parse(coords);
    } else {
      parsedCoords = coords;
    }
    
    console.log('Parsed coordinates:', parsedCoords);
    
    // Handle single coordinate object
    if (parsedCoords && typeof parsedCoords === 'object' && 'lat' in parsedCoords && 'lng' in parsedCoords) {
      const result = {
        lat: Number(parsedCoords.lat),
        lng: Number(parsedCoords.lng)
      };
      console.log('Single coordinate transformed:', result);
      return result;
    }
    
    // Handle array of coordinates
    if (Array.isArray(parsedCoords)) {
      const result = parsedCoords.map(coord => ({
        lat: Number(coord.lat),
        lng: Number(coord.lng)
      }));
      console.log('Array coordinates transformed:', result);
      return result;
    }
    
    console.log('Invalid coordinate format:', parsedCoords);
    return null;
  } catch (error) {
    console.error('Error parsing coordinates:', error, 'Input:', coords);
    return null;
  }
};

// Helper function to transform field data from database
const transformFieldFromDB = (dbField: any): Field => {
  const transformed = {
    ...dbField,
    coordonate_gps: transformCoordinates(dbField.coordonate_gps),
    suprafata: Number(dbField.suprafata)
  };
  
  console.log('Transformed field from DB:', {
    name: dbField.nume_teren,
    originalCoords: dbField.coordonate_gps,
    transformedCoords: transformed.coordonate_gps
  });
  
  return transformed;
};

export const useFields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching fields from database...');
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .is('data_stergerii', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Raw fields data from DB:', data);
      const transformedFields = (data || []).map(transformFieldFromDB);
      console.log('Transformed fields:', transformedFields);
      setFields(transformedFields);
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      const dataToInsert = {
        ...fieldData,
        user_id: user.id,
        coordonate_gps: fieldData.coordonate_gps ? JSON.stringify(fieldData.coordonate_gps) : null
      };

      console.log('Inserting field data:', dataToInsert);

      const { data, error } = await supabase
        .from('fields')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;

      const transformedField = transformFieldFromDB(data);
      setFields(prev => [transformedField, ...prev]);
      
      toast({
        title: "Succes",
        description: "Terenul a fost adăugat cu succes"
      });

      return transformedField;
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
      const dataToUpdate = {
        ...updates,
        coordonate_gps: updates.coordonate_gps ? JSON.stringify(updates.coordonate_gps) : undefined
      };

      const { data, error } = await supabase
        .from('fields')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const transformedField = transformFieldFromDB(data);
      setFields(prev => prev.map(field => 
        field.id === id ? transformedField : field
      ));

      toast({
        title: "Succes",
        description: "Terenul a fost actualizat cu succes"
      });

      return transformedField;
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
