
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

// Folosim tipul din Supabase pentru consistență
type InventoryItem = Tables<'inventory'>;

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Încarcă inventarul utilizatorului
  const fetchInventory = async () => {
    if (!user) {
      setInventory([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .is('data_stergerii', null) // Nu includem elementele șterse
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut încărca inventarul.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adaugă element în inventar
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) {
      toast({
        title: "Eroare",
        description: "Trebuie să fii autentificat pentru a adăuga elemente.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          ...item,
          user_id: user.id
        }])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setInventory(prev => [data[0], ...prev]);
        return true;
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga elementul în inventar.",
        variant: "destructive"
      });
    }
    return false;
  };

  // Actualizează element din inventar
  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setInventory(prev => prev.map(item => 
          item.id === id ? { ...item, ...data[0] } : item
        ));
        return true;
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza elementul.",
        variant: "destructive"
      });
    }
    return false;
  };

  // Șterge element din inventar (soft delete)
  const deleteInventoryItem = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('inventory')
        .update({ data_stergerii: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setInventory(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge elementul.",
        variant: "destructive"
      });
    }
    return false;
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  return {
    inventory,
    loading,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    refreshInventory: fetchInventory
  };
};
