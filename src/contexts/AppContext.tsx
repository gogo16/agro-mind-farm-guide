import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Json = Database['public']['Tables']['fields']['Row']['coordinates']

interface Field {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  size: number;
  crop: string;
  location: string;
  coordinates: Json;
  parcel_code: string;
  planting_date: string;
  harvest_date: string;
  costs: number;
  inputs: string;
  notes: string;
  roi: number;
  color: string;
  work_type: string;
  status: string;
  soil_data: Json;
}

interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  due_date: string;
  due_time: string;
  status: 'pending' | 'completed' | 'in_progress' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  category: string;
  duration: number;
  estimated_duration: string;
  field_name: string;
  field_id: string;
  ai_suggested: boolean;
  completed_at: string | null;
}

interface FieldPhoto {
  id: string;
  created_at: string;
  user_id: string;
  field_id: string;
  image_url: string;
  date: string;
  activity: string;
  crop_stage: string;
  weather_conditions: string;
  notes: string;
}

interface Transaction {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  field_id: string;
}

interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  is_read: boolean;
  read_at: string | null;
  priority: 'high' | 'medium' | 'low';
}

interface InventoryItem {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  type: 'seed' | 'fertilizer' | 'pesticide' | 'equipment' | 'other';
  quantity: string;
  unit: string;
  purchase_date: string;
  expiry_date: string;
  cost_per_unit: number;
  notes: string;
  condition: string;
  location: string;
  last_used: string;
  next_maintenance: string;
  expiration_date: string;
  stock_level: string;
  purchase_cost: number;
  current_value: number;
  purpose: string;
}

interface PropertyDocument {
  id: string;
  created_at: string;
  user_id: string;
  field_id?: string;
  document_type: string;
  name: string;
  file_name: string;
  upload_date: string;
  issue_date?: string;
  valid_until?: string;
  status: 'verified' | 'missing' | 'expired' | 'complete';
  notes?: string;
  file_url?: string;
}

interface AppContextType {
  fields: Field[];
  tasks: Task[];
  fieldPhotos: FieldPhoto[];
  financialTransactions: Transaction[];
  transactions: Transaction[];
  notifications: Notification[];
  inventory: InventoryItem[];
  propertyDocuments: PropertyDocument[];
  
  // User
  user: { id: string; email: string; first_name?: string; last_name?: string; } | null;
  
  // Field methods
  addField: (field: Omit<Field, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateField: (id: string, updates: Partial<Field>) => Promise<void>;
  deleteField: (id: string) => Promise<void>;
  
  // Task methods  
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Photo methods
  addFieldPhoto: (photo: Omit<FieldPhoto, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  
  // Transaction methods
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Property document methods
  addPropertyDocument: (doc: Omit<PropertyDocument, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updatePropertyDocument: (id: string, updates: Partial<PropertyDocument>) => Promise<void>;
  deletePropertyDocument: (id: string) => Promise<void>;
  
  // Notification methods
  addNotification: (notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  
  // Inventory methods
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  
  // APIA methods
  generateAPIADocument: (templateId: string, data: any) => any;
  
  // Report methods
  generateReport: (type: string, data: any) => Promise<void>;
  currentSeason: { name: string; startDate: string; endDate: string; };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fieldPhotos, setFieldPhotos] = useState<FieldPhoto[]>([]);
  const [financialTransactions, setFinancialTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [user, setUser] = useState<{ id: string; email: string; first_name?: string; last_name?: string; } | null>(null);
  const [propertyDocuments, setPropertyDocuments] = useState<PropertyDocument[]>([]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast({ title: "Eroare", description: "Failed to fetch user profile.", variant: "destructive" });
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            first_name: profile?.first_name,
            last_name: profile?.last_name
          });
        }
      }
    };

    getSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || '',
          first_name: profile?.first_name,
          last_name: profile?.last_name
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
  }, [toast]);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userId = user.id;

      try {
        const { data: fieldsData, error: fieldsError } = await supabase
          .from('fields')
          .select('*')
          .eq('user_id', userId);

        if (fieldsError) {
          console.error("Error fetching fields:", fieldsError);
          toast({ title: "Eroare", description: "Failed to load fields.", variant: "destructive" });
        } else {
          setFields(fieldsData || []);
        }

        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId);

        if (tasksError) {
          console.error("Error fetching tasks:", tasksError);
          toast({ title: "Eroare", description: "Failed to load tasks.", variant: "destructive" });
        } else {
          setTasks(tasksData || []);
        }

        const { data: photosData, error: photosError } = await supabase
          .from('field_photos')
          .select('*')
          .eq('user_id', userId);

        if (photosError) {
          console.error("Error fetching field photos:", photosError);
        } else {
          setFieldPhotos(photosData || []);
        }

        const { data: transactionsData, error: transactionsError } = await supabase
          .from('financial_transactions')
          .select('*')
          .eq('user_id', userId);

        if (transactionsError) {
          console.error("Error fetching financial transactions:", transactionsError);
        } else {
          setFinancialTransactions(transactionsData || []);
        }

        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId);

        if (notificationsError) {
          console.error("Error fetching notifications:", notificationsError);
        } else {
          setNotifications(notificationsData || []);
        }

        const { data: inventoryData, error: inventoryError } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', userId);

        if (inventoryError) {
          console.error("Error fetching inventory:", inventoryError);
        } else {
          setInventory(inventoryData || []);
        }

        const { data: propertyDocumentsData, error: propertyDocumentsError } = await supabase
          .from('property_documents')
          .select('*')
          .eq('user_id', userId);

        if (propertyDocumentsError) {
          console.error("Error fetching property documents:", propertyDocumentsError);
        } else {
          setPropertyDocuments(propertyDocumentsData || []);
        }

      } catch (error: any) {
        console.error("Error loading data:", error);
        toast({ title: "Eroare", description: error.message, variant: "destructive" });
      }
    };

    loadData();
  }, [toast]);

  // Field methods
  const addField = async (fieldData: Omit<Field, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('fields')
      .insert([{ ...fieldData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setFields(prev => [...prev, data]);
  };

  const updateField = async (id: string, updates: Partial<Field>) => {
    const { error } = await supabase
      .from('fields')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setFields(prev => prev.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const deleteField = async (id: string) => {
    const { error } = await supabase
      .from('fields')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setFields(prev => prev.filter(field => field.id !== id));
  };

  // Task methods
  const addTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setTasks(prev => [...prev, data]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Field Photo methods
  const addFieldPhoto = async (photoData: Omit<FieldPhoto, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('field_photos')
      .insert([{ ...photoData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setFieldPhotos(prev => [...prev, data]);
  };

  // Transaction methods
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([{ ...transactionData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setFinancialTransactions(prev => [...prev, data]);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const { error } = await supabase
      .from('financial_transactions')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setFinancialTransactions(prev => prev.map(transaction => transaction.id === id ? { ...transaction, ...updates } : transaction));
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setFinancialTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  // Property Documents methods
  const addPropertyDocument = async (docData: Omit<PropertyDocument, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('property_documents')
      .insert([{ ...docData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setPropertyDocuments(prev => [...prev, data]);
  };

  const updatePropertyDocument = async (id: string, updates: Partial<PropertyDocument>) => {
    const { error } = await supabase
      .from('property_documents')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setPropertyDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc));
  };

  const deletePropertyDocument = async (id: string) => {
    const { error } = await supabase
      .from('property_documents')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setPropertyDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Notification methods
  const addNotification = async (notificationData: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .insert([{ ...notificationData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setNotifications(prev => [...prev, data]);
  };

  const markNotificationAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setNotifications(prev => prev.map(notification => notification.id === id ? { ...notification, read: true, is_read: true } : notification));
  };

  // Inventory methods
  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('inventory')
      .insert([{ ...itemData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setInventory(prev => [...prev, data]);
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    const { error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteInventoryItem = async (id: string) => {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }

    setInventory(prev => prev.filter(item => item.id !== id));
  };

  // APIA Document Generator
  const generateAPIADocument = (templateId: string, data: any) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const baseData = {
      documentType: templateId,
      farmerCode: user?.id?.substring(0, 8) || 'FARM001',
      farmName: `Ferma ${user?.first_name || 'Agricola'}`,
      location: 'România',
      generatedDate: currentDate,
    };

    if (templateId === 'apia-cereale') {
      const cerealFields = fields.filter(f => 
        ['grau', 'porumb', 'orz', 'ovaz', 'secara'].includes(f.crop?.toLowerCase() || '')
      );
      
      return {
        ...baseData,
        parcels: cerealFields.map(field => ({
          name: field.name,
          parcel_code: field.parcel_code,
          crop: field.crop,
          size: field.size,
          plantingDate: field.planting_date,
          costs: field.costs || 0
        })),
        totalArea: cerealFields.reduce((sum, f) => sum + f.size, 0),
        estimatedProduction: cerealFields.reduce((sum, f) => sum + (f.size * 4), 0)
      };
    }

    return baseData;
  };

  // Report methods
  const generateReport = async (type: string, data: any) => {
    toast({ title: "Raport generat", description: `Raportul ${type} a fost generat cu succes.` });
  };

  const currentSeason = {
    name: 'Sezonul 2024',
    startDate: '2024-03-01',
    endDate: '2024-11-30'
  };

  const value: AppContextType = {
    fields,
    tasks,
    fieldPhotos,
    financialTransactions,
    transactions: financialTransactions,
    notifications,
    inventory,
    user,
    propertyDocuments,
    addField,
    updateField,
    deleteField,
    addTask,
    updateTask,
    deleteTask,
    addFieldPhoto,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addPropertyDocument,
    updatePropertyDocument,
    deletePropertyDocument,
    addNotification,
    markNotificationAsRead,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    generateAPIADocument,
    generateReport,
    currentSeason,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
