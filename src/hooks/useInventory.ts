
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Local inventory type (no database dependency)
type InventoryItem = {
  id: string;
  nume_element: string;
  categorie_element: 'equipment' | 'chemical' | 'crop' | 'material' | 'fuel';
  cantitate_status?: string | null;
  locatia?: string | null;
  pret?: number | null;
  tip_tranzactie?: 'income' | 'expense' | null;
  created_at: string;
  updated_at: string;
};

// Tip pentru adăugarea de elemente noi - doar câmpurile esențiale
type NewInventoryItem = {
  nume_element: string;
  categorie_element: 'equipment' | 'chemical' | 'crop' | 'material' | 'fuel';
  cantitate_status?: string | null;
  locatia?: string | null;
  pret?: number | null;
  tip_tranzactie?: 'income' | 'expense' | null;
};

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Local storage inventory management
  const fetchInventory = () => {
    try {
      const stored = localStorage.getItem('agromind-inventory');
      if (stored) {
        setInventory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  // Add item to local inventory
  const addInventoryItem = async (item: NewInventoryItem) => {
    try {
      const newItem: InventoryItem = {
        ...item,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const newInventory = [newItem, ...inventory];
      setInventory(newInventory);
      localStorage.setItem('agromind-inventory', JSON.stringify(newInventory));
      return true;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga elementul în inventar.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update inventory item locally
  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const newInventory = inventory.map(item => 
        item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      );
      setInventory(newInventory);
      localStorage.setItem('agromind-inventory', JSON.stringify(newInventory));
      return true;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza elementul.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete inventory item locally
  const deleteInventoryItem = async (id: string) => {
    try {
      const newInventory = inventory.filter(item => item.id !== id);
      setInventory(newInventory);
      localStorage.setItem('agromind-inventory', JSON.stringify(newInventory));
      return true;
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge elementul.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    refreshInventory: fetchInventory
  };
};
