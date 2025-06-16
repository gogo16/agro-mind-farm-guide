import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

// Type definitions
type Field = Database['public']['Tables']['fields']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type FieldPhoto = Database['public']['Tables']['field_photos']['Row'];
type InventoryItem = Database['public']['Tables']['inventory']['Row'];
type Transaction = Database['public']['Tables']['financial_transactions']['Row'];
type PropertyDocument = Database['public']['Tables']['property_documents']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];
type SatelliteData = Database['public']['Tables']['satellite_monitoring']['Row'];

interface AppContextType {
  // Data
  fields: Field[];
  tasks: Task[];
  fieldPhotos: FieldPhoto[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  propertyDocuments: PropertyDocument[];
  notifications: Notification[];
  satelliteData: SatelliteData[];
  currentSeason: string;
  
  // Field operations
  addField: (field: Omit<Field, 'id'>) => Promise<void>;
  updateField: (id: string, field: Partial<Field>) => Promise<void>;
  deleteField: (id: string) => Promise<void>;
  
  // Task operations
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Photo operations
  addFieldPhoto: (photo: Omit<FieldPhoto, 'id'>) => Promise<void>;
  
  // Inventory operations
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'user_id'>) => Promise<void>;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  
  // Transaction operations
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Document operations
  addPropertyDocument: (doc: Omit<PropertyDocument, 'id' | 'user_id'>) => Promise<void>;
  updatePropertyDocument: (id: string, doc: Partial<PropertyDocument>) => Promise<void>;
  deletePropertyDocument: (id: string) => Promise<void>;
  
  // Notification operations
  addNotification: (notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  
  // Satellite operations
  fetchSatelliteData: (fieldId: string) => Promise<void>;
  
  // Other operations
  generateAPIADocument: (data: any) => Promise<void>;
  generateReport: (type: string, params: any) => Promise<void>;
  user: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fieldPhotos, setFieldPhotos] = useState<FieldPhoto[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [propertyDocuments, setPropertyDocuments] = useState<PropertyDocument[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);
  const [user, setUser] = useState<any>(null);
  const [currentSeason, setCurrentSeason] = useState('Primăvara 2024');

  // Initialize data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await Promise.all([
          fetchFields(),
          fetchTasks(),
          fetchFieldPhotos(),
          fetchInventory(),
          fetchTransactions(),
          fetchPropertyDocuments(),
          fetchNotifications(),
          fetchSatelliteDataList()
        ]);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  // Fetch functions
  const fetchFields = async () => {
    const { data } = await supabase.from('fields').select('*');
    if (data) setFields(data);
  };

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*');
    if (data) setTasks(data);
  };

  const fetchFieldPhotos = async () => {
    const { data } = await supabase.from('field_photos').select('*');
    if (data) setFieldPhotos(data);
  };

  const fetchInventory = async () => {
    const { data } = await supabase.from('inventory').select('*');
    if (data) setInventory(data);
  };

  const fetchTransactions = async () => {
    const { data } = await supabase.from('financial_transactions').select('*');
    if (data) setTransactions(data);
  };

  const fetchPropertyDocuments = async () => {
    const { data } = await supabase.from('property_documents').select('*');
    if (data) setPropertyDocuments(data);
  };

  const fetchNotifications = async () => {
    const { data } = await supabase.from('notifications').select('*');
    if (data) setNotifications(data);
  };

  const fetchSatelliteDataList = async () => {
    const { data } = await supabase.from('satellite_monitoring').select('*');
    if (data) setSatelliteData(data);
  };

  // Field operations
  const addField = async (field: Omit<Field, 'id'>) => {
    const { data, error } = await supabase.from('fields').insert([field]).select();
    if (error) throw error;
    if (data) setFields(prev => [...prev, ...data]);
  };

  const updateField = async (id: string, field: Partial<Field>) => {
    const { data, error } = await supabase.from('fields').update(field).eq('id', id).select();
    if (error) throw error;
    if (data) setFields(prev => prev.map(f => f.id === id ? data[0] : f));
  };

  const deleteField = async (id: string) => {
    const { error } = await supabase.from('fields').delete().eq('id', id);
    if (error) throw error;
    setFields(prev => prev.filter(f => f.id !== id));
  };

  // Task operations
  const addTask = async (task: Omit<Task, 'id'>) => {
    const { data, error } = await supabase.from('tasks').insert([task]).select();
    if (error) throw error;
    if (data) setTasks(prev => [...prev, ...data]);
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    const { data, error } = await supabase.from('tasks').update(task).eq('id', id).select();
    if (error) throw error;
    if (data) setTasks(prev => prev.map(t => t.id === id ? data[0] : t));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Photo operations
  const addFieldPhoto = async (photo: Omit<FieldPhoto, 'id'>) => {
    const { data, error } = await supabase.from('field_photos').insert([photo]).select();
    if (error) throw error;
    if (data) setFieldPhotos(prev => [...prev, ...data]);
  };

  // Inventory operations
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'user_id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase.from('inventory').insert([{ ...item, user_id: user.id }]).select();
    if (error) throw error;
    if (data) setInventory(prev => [...prev, ...data]);
  };

  const updateInventoryItem = async (id: string, item: Partial<InventoryItem>) => {
    const { data, error } = await supabase.from('inventory').update(item).eq('id', id).select();
    if (error) throw error;
    if (data) setInventory(prev => prev.map(i => i.id === id ? data[0] : i));
  };

  const deleteInventoryItem = async (id: string) => {
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) throw error;
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  // Transaction operations
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase.from('financial_transactions').insert([{ ...transaction, user_id: user.id }]).select();
    if (error) throw error;
    if (data) setTransactions(prev => [...prev, ...data]);
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    const { data, error } = await supabase.from('financial_transactions').update(transaction).eq('id', id).select();
    if (error) throw error;
    if (data) setTransactions(prev => prev.map(t => t.id === id ? data[0] : t));
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('financial_transactions').delete().eq('id', id);
    if (error) throw error;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Document operations
  const addPropertyDocument = async (doc: Omit<PropertyDocument, 'id' | 'user_id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase.from('property_documents').insert([{ ...doc, user_id: user.id }]).select();
    if (error) throw error;
    if (data) setPropertyDocuments(prev => [...prev, ...data]);
  };

  const updatePropertyDocument = async (id: string, doc: Partial<PropertyDocument>) => {
    const { data, error } = await supabase.from('property_documents').update(doc).eq('id', id).select();
    if (error) throw error;
    if (data) setPropertyDocuments(prev => prev.map(d => d.id === id ? data[0] : d));
  };

  const deletePropertyDocument = async (id: string) => {
    const { error } = await supabase.from('property_documents').delete().eq('id', id);
    if (error) throw error;
    setPropertyDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Notification operations
  const addNotification = async (notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase.from('notifications').insert([{ ...notification, user_id: user.id }]).select();
    if (error) throw error;
    if (data) setNotifications(prev => [...prev, ...data]);
  };

  const markNotificationAsRead = async (id: string) => {
    const { data, error } = await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', id).select();
    if (error) throw error;
    if (data) setNotifications(prev => prev.map(n => n.id === id ? data[0] : n));
  };

  // Satellite operations - renamed to avoid conflict
  const fetchSatelliteData = async (fieldId: string) => {
    // Simulate satellite data fetching
    const mockData: Omit<SatelliteData, 'id'> = {
      field_id: fieldId,
      user_id: user?.id || '',
      analysis_date: new Date().toISOString(),
      change_detected: Math.random() > 0.7,
      change_percentage: Math.random() * 15,
      current_image_url: null,
      previous_image_url: null,
      comparison_image_url: null,
      ai_insights: {},
      next_analysis_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('satellite_monitoring').insert([mockData]).select();
    if (error) throw error;
    if (data) setSatelliteData(prev => [...prev, ...data]);
  };

  // Other operations
  const generateAPIADocument = async (data: any) => {
    // Mock implementation
    toast({
      title: "Document generat",
      description: "Documentul APIA a fost generat cu succes."
    });
  };

  const generateReport = async (type: string, params: any) => {
    // Mock implementation
    toast({
      title: "Raport generat",
      description: `Raportul ${type} a fost generat cu succes.`
    });
  };

  const value: AppContextType = {
    // Data
    fields,
    tasks,
    fieldPhotos,
    inventory,
    transactions,
    propertyDocuments,
    notifications,
    satelliteData,
    currentSeason,
    
    // Operations
    addField,
    updateField,
    deleteField,
    addTask,
    updateTask,
    deleteTask,
    addFieldPhoto,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addPropertyDocument,
    updatePropertyDocument,
    deletePropertyDocument,
    addNotification,
    markNotificationAsRead,
    fetchSatelliteData,
    generateAPIADocument,
    generateReport,
    user
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
