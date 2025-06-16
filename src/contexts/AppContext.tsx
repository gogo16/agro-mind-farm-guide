import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Field = Database['public']['Tables']['fields']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type Transaction = Database['public']['Tables']['financial_transactions']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];
type FieldPhoto = Database['public']['Tables']['field_photos']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type InventoryItem = Database['public']['Tables']['inventory']['Row'];

interface AppContextType {
  fields: Field[];
  tasks: Task[];
  transactions: Transaction[];
  notifications: Notification[];
  fieldPhotos: FieldPhoto[];
  profile: Profile | null;
  inventory: InventoryItem[];
  
  // Field operations
  addField: (field: Omit<Field, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateField: (id: string, field: Partial<Field>) => void;
  deleteField: (id: string) => void;
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Transaction operations
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Notification operations
  addNotification: (notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => void;
  markNotificationAsRead: (id: string) => void;
  
  // Photo operations
  addFieldPhoto: (photo: Omit<FieldPhoto, 'id' | 'user_id' | 'created_at'>) => void;
  
  // Profile operations
  updateProfile: (profile: Partial<Profile>) => void;
  
  // Inventory operations
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Utility functions
  getFieldById: (id: string) => Field | undefined;
  getTasksByField: (fieldId: string) => Task[];
  
  // Loading states
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fieldPhotos, setFieldPhotos] = useState<FieldPhoto[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // Fetch all data in parallel
        const [
          fieldsData,
          tasksData,
          transactionsData,
          notificationsData,
          photosData,
          profileData,
          inventoryData
        ] = await Promise.all([
          supabase.from('fields').select('*').eq('user_id', session.user.id),
          supabase.from('tasks').select('*').eq('user_id', session.user.id),
          supabase.from('financial_transactions').select('*').eq('user_id', session.user.id),
          supabase.from('notifications').select('*').eq('user_id', session.user.id),
          supabase.from('field_photos').select('*').eq('user_id', session.user.id),
          supabase.from('profiles').select('*').eq('id', session.user.id).single(),
          supabase.from('inventory').select('*').eq('user_id', session.user.id)
        ]);

        if (fieldsData.data) setFields(fieldsData.data);
        if (tasksData.data) setTasks(tasksData.data);
        if (transactionsData.data) setTransactions(transactionsData.data);
        if (notificationsData.data) setNotifications(notificationsData.data);
        if (photosData.data) setFieldPhotos(photosData.data);
        if (profileData.data) setProfile(profileData.data);
        if (inventoryData.data) setInventory(inventoryData.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Eroare",
          description: "Nu am putut încărca datele.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Field operations
  const addField = async (fieldData: Omit<Field, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('fields')
        .insert({
          ...fieldData,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setFields(prev => [...prev, data]);
        toast({
          title: "Succes",
          description: "Terenul a fost adăugat cu succes."
        });
      }
    } catch (error) {
      console.error('Error adding field:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut adăuga terenul.",
        variant: "destructive"
      });
    }
  };

  const updateField = async (id: string, fieldData: Partial<Field>) => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .update(fieldData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setFields(prev => prev.map(field => field.id === id ? data : field));
        toast({
          title: "Succes",
          description: "Terenul a fost actualizat."
        });
      }
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza terenul.",
        variant: "destructive"
      });
    }
  };

  const deleteField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFields(prev => prev.filter(field => field.id !== id));
      toast({
        title: "Succes",
        description: "Terenul a fost șters."
      });
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge terenul.",
        variant: "destructive"
      });
    }
  };

  // Task operations
  const addTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTasks(prev => [...prev, data]);
        toast({
          title: "Succes",
          description: "Sarcina a fost adăugată."
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut adăuga sarcina.",
        variant: "destructive"
      });
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTasks(prev => prev.map(task => task.id === id ? data : task));
        toast({
          title: "Succes",
          description: "Sarcina a fost actualizată."
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza sarcina.",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Succes",
        description: "Sarcina a fost ștersă."
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge sarcina.",
        variant: "destructive"
      });
    }
  };

  // Transaction operations
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert({
          ...transactionData,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTransactions(prev => [...prev, data]);
        toast({
          title: "Succes",
          description: "Tranzacția a fost adăugată."
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut adăuga tranzacția.",
        variant: "destructive"
      });
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(transactionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTransactions(prev => prev.map(transaction => transaction.id === id ? data : transaction));
        toast({
          title: "Succes",
          description: "Tranzacția a fost actualizată."
        });
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza tranzacția.",
        variant: "destructive"
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      toast({
        title: "Succes",
        description: "Tranzacția a fost ștersă."
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge tranzacția.",
        variant: "destructive"
      });
    }
  };

  // Notification operations
  const addNotification = async (notificationData: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notificationData,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setNotifications(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setNotifications(prev => prev.map(notification => 
          notification.id === id ? data : notification
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Photo operations
  const addFieldPhoto = async (photoData: Omit<FieldPhoto, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('field_photos')
        .insert({
          ...photoData,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setFieldPhotos(prev => [...prev, data]);
        toast({
          title: "Succes",
          description: "Fotografia a fost adăugată."
        });
      }
    } catch (error) {
      console.error('Error adding field photo:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut adăuga fotografia.",
        variant: "destructive"
      });
    }
  };

  // Profile operations
  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        toast({
          title: "Succes",
          description: "Profilul a fost actualizat."
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza profilul.",
        variant: "destructive"
      });
    }
  };

  // Inventory operations
  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('inventory')
        .insert({
          ...itemData,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setInventory(prev => [...prev, data]);
        toast({
          title: "Succes",
          description: "Elementul a fost adăugat în inventar."
        });
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut adăuga elementul în inventar.",
        variant: "destructive"
      });
    }
  };

  const updateInventoryItem = async (id: string, itemData: Partial<InventoryItem>) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setInventory(prev => prev.map(item => item.id === id ? data : item));
        toast({
          title: "Succes",
          description: "Elementul din inventar a fost actualizat."
        });
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza elementul din inventar.",
        variant: "destructive"
      });
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setInventory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Succes",
        description: "Elementul a fost șters din inventar."
      });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge elementul din inventar.",
        variant: "destructive"
      });
    }
  };

  // Utility functions
  const getFieldById = (id: string): Field | undefined => {
    return fields.find(field => field.id === id);
  };

  const getTasksByField = (fieldId: string): Task[] => {
    return tasks.filter(task => task.field_id === fieldId);
  };

  const value: AppContextType = {
    fields,
    tasks,
    transactions,
    notifications,
    fieldPhotos,
    profile,
    inventory,
    
    addField,
    updateField,
    deleteField,
    
    addTask,
    updateTask,
    deleteTask,
    
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    addNotification,
    markNotificationAsRead,
    
    addFieldPhoto,
    
    updateProfile,
    
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    
    getFieldById,
    getTasksByField,
    
    isLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
