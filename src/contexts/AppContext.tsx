import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { WeatherSyncService } from '@/utils/weatherSync';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Field {
  id: string;
  name: string;
  location: string;
  area: number;
  crop: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  soilType?: string;
  lastActivity?: string;
  notes?: string;
  photos?: string[];
  // Required properties that other components expect
  parcelCode: string;
  size: number;
  status: string;
  color: string;
  plantingDate?: string;
  harvestDate?: string;
  workType?: string;
  inputs?: string;
  variety?: string;
  costs?: number;
  roi?: number;
  weather?: {
    temperature?: number;
    condition?: string;
    humidity?: number;
    windSpeed?: number;
  };
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  field?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  fieldName?: string;
  field?: string;
  dueDate?: string;
  date?: string;
  status: 'pending' | 'completed' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
  time?: string;
  aiSuggested?: boolean;
  estimatedDuration?: string;
  dueTime?: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  type?: string;
  quantity: number;
  unit: string;
  location?: string;
}

interface AppContextType {
  fields: Field[];
  addField: (field: Omit<Field, 'id'>) => void;
  updateField: (id: string, field: Partial<Field>) => void;
  deleteField: (id: string) => void;
  getField: (id: string) => Field | undefined;
  transactions: Transaction[];
  tasks: Task[];
  inventory: InventoryItem[];
  currentSeason: string;
  generateReport: (type: string) => any;
  addTask?: (task: Omit<Task, 'id'>) => void;
  updateTask?: (id: string, task: Partial<Task>) => void;
  deleteTask?: (id: string) => void;
  addInventoryItem?: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem?: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem?: (id: string) => void;
  addTransaction?: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction?: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction?: (id: string) => void;
  notifications?: any[];
  markNotificationAsRead?: (id: string) => void;
  addNotification?: (notification: any) => void;
  propertyDocuments?: any[];
  addPropertyDocument?: (doc: any) => void;
  updatePropertyDocument?: (id: string, doc: any) => void;
  deletePropertyDocument?: (id: string) => void;
  satelliteData?: any[];
  fetchSatelliteData?: (fieldId: string) => void;
  fieldPhotos?: any[];
  addFieldPhoto?: (photo: any) => void;
  generateAPIADocument?: (fieldId: string) => any;
  user?: any;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 15000,
      description: 'Vânzare grâu',
      date: '2024-07-15',
      category: 'Venituri din vânzări',
      field: 'Parcela Nord'
    },
    {
      id: '2',
      type: 'expense',
      amount: 3500,
      description: 'Semințe porumb',
      date: '2024-04-10',
      category: 'Semințe',
      field: 'Parcela Sud'
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Verificare sistem irigare',
      description: 'Verificarea și întreținerea sistemului de irigare pentru parcela nord',
      fieldName: 'Parcela Nord',
      field: 'Parcela Nord',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      priority: 'high',
      time: '09:00',
      aiSuggested: false,
      estimatedDuration: '2 ore',
      dueTime: '09:00'
    }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Îngrășământ NPK',
      category: 'Fertilizatori',
      type: 'solid',
      quantity: 500,
      unit: 'kg',
      location: 'Depozit principal'
    }
  ]);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [propertyDocuments, setPropertyDocuments] = useState<any[]>([]);
  const [satelliteData, setSatelliteData] = useState<any[]>([]);
  const [fieldPhotos, setFieldPhotos] = useState<any[]>([]);

  const currentSeason = 'Vară';

  // Fetch fields from database
  const fetchFields = async () => {
    if (!user) {
      setFields([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching fields:', error);
        toast({
          title: "Eroare",
          description: "Nu s-au putut încărca terenurile.",
          variant: "destructive"
        });
        return;
      }

      const formattedFields: Field[] = (data || []).map(field => ({
        id: field.id,
        name: field.name,
        location: field.location,
        area: Number(field.area),
        crop: field.crop,
        coordinates: field.coordinates_lat && field.coordinates_lng ? {
          lat: Number(field.coordinates_lat),
          lng: Number(field.coordinates_lng)
        } : undefined,
        soilType: field.soil_type || undefined,
        lastActivity: field.last_activity || undefined,
        notes: field.notes || undefined,
        photos: [],
        parcelCode: field.parcel_code,
        size: Number(field.area),
        status: field.status,
        color: field.color,
        plantingDate: field.planting_date || undefined,
        harvestDate: field.harvest_date || undefined,
        workType: field.work_type || undefined,
        inputs: field.inputs || undefined,
        variety: field.variety || undefined,
        costs: field.costs ? Number(field.costs) : undefined,
        roi: field.roi ? Number(field.roi) : undefined,
        weather: {
          temperature: 22,
          condition: 'sunny',
          humidity: 65,
          windSpeed: 12
        }
      }));

      setFields(formattedFields);

      // Auto-sync weather data for each field
      for (const field of formattedFields) {
        if (field.coordinates) {
          WeatherSyncService.syncForUser(user.id, field.coordinates)
            .then(result => {
              if (result.success) {
                console.log(`Weather data synced for field ${field.name}`);
              }
            })
            .catch(error => {
              console.error(`Failed to sync weather for field ${field.name}:`, error);
            });
        }
      }
    } catch (error) {
      console.error('Error in fetchFields:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [user]);

  const addField = async (fieldData: Omit<Field, 'id'>) => {
    if (!user) {
      toast({
        title: "Eroare",
        description: "Trebuie să fii autentificat pentru a adăuga terenuri.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('fields')
        .insert([{
          user_id: user.id,
          name: fieldData.name,
          location: fieldData.location,
          area: fieldData.area,
          crop: fieldData.crop,
          coordinates_lat: fieldData.coordinates?.lat,
          coordinates_lng: fieldData.coordinates?.lng,
          soil_type: fieldData.soilType,
          last_activity: fieldData.lastActivity,
          notes: fieldData.notes,
          parcel_code: fieldData.parcelCode || `P-${Date.now()}`,
          status: fieldData.status || 'healthy',
          color: fieldData.color || '#22c55e',
          planting_date: fieldData.plantingDate,
          harvest_date: fieldData.harvestDate,
          work_type: fieldData.workType,
          inputs: fieldData.inputs,
          variety: fieldData.variety,
          costs: fieldData.costs,
          roi: fieldData.roi
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding field:', error);
        toast({
          title: "Eroare",
          description: "Nu s-a putut adăuga terenul.",
          variant: "destructive"
        });
        return;
      }

      // Refresh fields list
      await fetchFields();

      if (fieldData.coordinates) {
        try {
          await WeatherSyncService.syncForUser(user.id, fieldData.coordinates);
          toast({
            title: "Teren adăugat",
            description: "Datele meteo au fost sincronizate automat pentru noul teren.",
          });
        } catch (error) {
          console.error('Failed to sync weather for new field:', error);
          toast({
            title: "Teren adăugat",
            description: "Terenul a fost adăugat, dar sincronizarea meteo a eșuat.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Teren adăugat",
          description: "Terenul a fost adăugat cu succes.",
        });
      }
    } catch (error) {
      console.error('Error in addField:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare neașteptată.",
        variant: "destructive"
      });
    }
  };

  const updateField = async (id: string, fieldData: Partial<Field>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('fields')
        .update({
          name: fieldData.name,
          location: fieldData.location,
          area: fieldData.area,
          crop: fieldData.crop,
          coordinates_lat: fieldData.coordinates?.lat,
          coordinates_lng: fieldData.coordinates?.lng,
          soil_type: fieldData.soilType,
          last_activity: fieldData.lastActivity,
          notes: fieldData.notes,
          parcel_code: fieldData.parcelCode,
          status: fieldData.status,
          color: fieldData.color,
          planting_date: fieldData.plantingDate,
          harvest_date: fieldData.harvestDate,
          work_type: fieldData.workType,
          inputs: fieldData.inputs,
          variety: fieldData.variety,
          costs: fieldData.costs,
          roi: fieldData.roi
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating field:', error);
        toast({
          title: "Eroare",
          description: "Nu s-a putut actualiza terenul.",
          variant: "destructive"
        });
        return;
      }

      // Refresh fields list
      await fetchFields();
      
      toast({
        title: "Teren actualizat",
        description: "Informațiile terenului au fost actualizate cu succes.",
      });
    } catch (error) {
      console.error('Error in updateField:', error);
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

      if (error) {
        console.error('Error deleting field:', error);
        toast({
          title: "Eroare",
          description: "Nu s-a putut șterge terenul.",
          variant: "destructive"
        });
        return;
      }

      // Refresh fields list
      await fetchFields();
      
      toast({
        title: "Teren șters",
        description: "Terenul a fost șters cu succes.",
      });
    } catch (error) {
      console.error('Error in deleteField:', error);
    }
  };

  const getField = (id: string) => {
    return fields.find(field => field.id === id);
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...taskData } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, transactionData: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...transactionData } : transaction
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: Date.now().toString()
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, itemData: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...itemData } : item
    ));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const addFieldPhoto = (photo: any) => {
    setFieldPhotos(prev => [...prev, photo]);
  };

  const addPropertyDocument = (doc: any) => {
    setPropertyDocuments(prev => [...prev, { ...doc, id: Date.now().toString() }]);
  };

  const updatePropertyDocument = (id: string, doc: any) => {
    setPropertyDocuments(prev => prev.map(document => 
      document.id === id ? { ...document, ...doc } : document
    ));
  };

  const deletePropertyDocument = (id: string) => {
    setPropertyDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const fetchSatelliteData = (fieldId: string) => {
    console.log('Fetching satellite data for field:', fieldId);
  };

  const generateAPIADocument = (fieldId: string) => {
    const field = getField(fieldId);
    return {
      fieldId,
      fieldName: field?.name || 'Unknown',
      generatedAt: new Date().toISOString()
    };
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now().toString() }]);
  };

  const generateReport = (type: string) => {
    switch (type) {
      case 'productivity':
        return {
          totalFields: fields.length,
          totalArea: fields.reduce((sum, field) => sum + field.area, 0),
          avgProductivity: 4.2,
          topPerformingField: fields[0]
        };
      case 'financial':
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return {
          totalIncome,
          totalExpenses,
          profit: totalIncome - totalExpenses,
          roi: totalExpenses > 0 ? ((totalIncome - totalExpenses) / totalExpenses * 100).toFixed(1) : '0'
        };
      case 'seasonal':
        return {
          currentSeason,
          completedTasks: tasks.filter(t => t.status === 'completed').length,
          pendingTasks: tasks.filter(t => t.status === 'pending').length
        };
      default:
        return {};
    }
  };

  return (
    <AppContext.Provider value={{
      fields,
      addField,
      updateField,
      deleteField,
      getField,
      transactions,
      tasks,
      inventory,
      currentSeason,
      generateReport,
      addTask,
      updateTask,
      deleteTask,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      notifications,
      markNotificationAsRead,
      addNotification,
      propertyDocuments,
      addPropertyDocument,
      updatePropertyDocument,
      deletePropertyDocument,
      satelliteData,
      fetchSatelliteData,
      fieldPhotos,
      addFieldPhoto,
      generateAPIADocument,
      user,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
