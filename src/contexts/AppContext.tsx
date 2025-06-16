
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

interface Transaction {
  id: string;
  user_id: string;
  field_id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
  date: string;
  roi_impact?: number;
  budget_category?: string;
}

interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  type: 'equipment' | 'chemical' | 'seeds' | 'fuel' | 'other';
  quantity: string;
  unit?: string;
  condition?: string;
  location?: string;
  last_used?: string;
  next_maintenance?: string;
  expiration_date?: string;
  purpose?: string;
  stock_level?: 'low' | 'normal' | 'high';
  purchase_cost?: number;
  current_value?: number;
}

interface PropertyDocument {
  id: string;
  user_id: string;
  field_id?: string;
  document_type: string;
  name: string;
  file_name?: string;
  file_url?: string;
  upload_date?: string;
  issue_date?: string;
  valid_until?: string;
  status?: 'verified' | 'missing' | 'expired' | 'complete';
  notes?: string;
}

interface Notification {
  id: string;
  user_id: string;
  type: 'task' | 'weather' | 'inventory' | 'ai' | 'financial' | 'system';
  title: string;
  message: string;
  priority?: 'high' | 'medium' | 'low';
  is_read?: boolean;
  read_at?: string;
  created_at: string;
}

interface SatelliteData {
  id: string;
  user_id: string;
  field_id: string;
  current_image_url?: string;
  previous_image_url?: string;
  comparison_image_url?: string;
  change_detected?: boolean;
  change_percentage?: number;
  analysis_date: string;
  next_analysis_date?: string;
  ai_insights?: any;
}

interface AppContextType {
  fields: Field[];
  tasks: Task[];
  fieldPhotos: FieldPhoto[];
  transactions: Transaction[];
  inventory: InventoryItem[];
  propertyDocuments: PropertyDocument[];
  notifications: Notification[];
  satelliteData: SatelliteData[];
  loading: boolean;
  user: any;
  addField: (field: Omit<Field, 'id'>) => Promise<void>;
  updateField: (id: string, updates: Partial<Field>) => Promise<void>;
  deleteField: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addFieldPhoto: (photo: Omit<FieldPhoto, 'id'>) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id'>) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'user_id'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  addPropertyDocument: (doc: Omit<PropertyDocument, 'id' | 'user_id'>) => Promise<void>;
  updatePropertyDocument: (id: string, updates: Partial<PropertyDocument>) => Promise<void>;
  deletePropertyDocument: (id: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  fetchSatelliteData: (fieldId: string) => Promise<void>;
  generateAPIADocument: (templateId: string, data: any) => any;
  refetchData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fieldPhotos, setFieldPhotos] = useState<FieldPhoto[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [propertyDocuments, setPropertyDocuments] = useState<PropertyDocument[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);
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

      // Fetch financial transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Fetch inventory
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id);

      if (inventoryError) throw inventoryError;

      // Fetch property documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('property_documents')
        .select('*')
        .eq('user_id', user.id);

      if (documentsError) throw documentsError;

      // Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (notificationsError) throw notificationsError;

      // Fetch satellite data
      const { data: satelliteDataResult, error: satelliteError } = await supabase
        .from('satellite_monitoring')
        .select('*')
        .eq('user_id', user.id);

      if (satelliteError) throw satelliteError;

      setFields(fieldsData || []);
      setTasks(tasksData || []);
      setFieldPhotos(photosData || []);
      setTransactions(transactionsData || []);
      setInventory(inventoryData || []);
      setPropertyDocuments(documentsData || []);
      setNotifications(notificationsData || []);
      setSatelliteData(satelliteDataResult || []);
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
      setTransactions([]);
      setInventory([]);
      setPropertyDocuments([]);
      setNotifications([]);
      setSatelliteData([]);
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

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{ ...transactionData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      toast({
        title: "Succes",
        description: "Tranzacția a fost adăugată cu succes."
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga tranzacția.",
        variant: "destructive"
      });
    }
  };

  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert([{ ...itemData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setInventory(prev => [...prev, data]);
      toast({
        title: "Succes",
        description: "Articolul a fost adăugat în inventar."
      });
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga articolul în inventar.",
        variant: "destructive"
      });
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setInventory(prev => prev.map(item => item.id === id ? data : item));
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  const deleteInventoryItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const addPropertyDocument = async (docData: Omit<PropertyDocument, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('property_documents')
        .insert([{ ...docData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setPropertyDocuments(prev => [...prev, data]);
      toast({
        title: "Succes",
        description: "Documentul a fost adăugat cu succes."
      });
    } catch (error) {
      console.error('Error adding property document:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga documentul.",
        variant: "destructive"
      });
    }
  };

  const updatePropertyDocument = async (id: string, updates: Partial<PropertyDocument>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('property_documents')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPropertyDocuments(prev => prev.map(doc => doc.id === id ? data : doc));
    } catch (error) {
      console.error('Error updating property document:', error);
    }
  };

  const deletePropertyDocument = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('property_documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPropertyDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting property document:', error);
    }
  };

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{ ...notificationData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setNotifications(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setNotifications(prev => prev.map(notif => notif.id === id ? data : notif));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const fetchSatelliteData = async (fieldId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('satellite_monitoring')
        .select('*')
        .eq('user_id', user.id)
        .eq('field_id', fieldId);

      if (error) throw error;

      setSatelliteData(prev => [...prev.filter(s => s.field_id !== fieldId), ...(data || [])]);
    } catch (error) {
      console.error('Error fetching satellite data:', error);
    }
  };

  const generateAPIADocument = (templateId: string, data: any) => {
    // Mock implementation for document generation
    const baseData = {
      documentType: templateId,
      farmerCode: 'FM001',
      farmName: user?.email || 'Ferma AgroMind',
      location: 'România',
      generatedDate: new Date().toLocaleDateString('ro-RO'),
      totalArea: fields.reduce((sum, field) => sum + field.size, 0),
      parcels: fields.map(field => ({
        name: field.name,
        parcelCode: field.parcel_code,
        crop: field.crop,
        size: field.size,
        plantingDate: field.planting_date,
        costs: field.costs
      }))
    };

    if (templateId === 'apia-cereale') {
      return {
        ...baseData,
        estimatedProduction: baseData.totalArea * 4.5, // 4.5 tone/ha average
      };
    }

    if (templateId === 'apia-eco-scheme') {
      return {
        ...baseData,
        ecoMeasures: [
          'Agricultură ecologică',
          'Rotația culturilor',
          'Menținerea pășunilor permanente'
        ],
        totalEcoArea: baseData.totalArea
      };
    }

    if (templateId === 'afir-modernizare') {
      return {
        ...baseData,
        investmentType: 'Modernizare echipamente agricole',
        requestedAmount: 150000,
        cofinancing: 30000,
        timeline: '24 luni',
        equipment: inventory.filter(item => item.type === 'equipment').map(item => ({
          name: item.name,
          condition: item.condition
        }))
      };
    }

    return baseData;
  };

  const refetchData = async () => {
    await fetchData();
  };

  return (
    <AppContext.Provider value={{
      fields,
      tasks,
      fieldPhotos,
      transactions,
      inventory,
      propertyDocuments,
      notifications,
      satelliteData,
      loading,
      user,
      addField,
      updateField,
      deleteField,
      addTask,
      updateTask,
      deleteTask,
      addFieldPhoto,
      addTransaction,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      addPropertyDocument,
      updatePropertyDocument,
      deletePropertyDocument,
      addNotification,
      markNotificationAsRead,
      fetchSatelliteData,
      generateAPIADocument,
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
