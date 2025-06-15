
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { WeatherSyncService } from '@/utils/weatherSync';
import { useToast } from '@/hooks/use-toast';

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
  // Add missing properties that other components expect
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
  status: 'pending' | 'completed';
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
  const [fields, setFields] = useState<Field[]>([
    {
      id: '1',
      name: 'Parcela Nord',
      location: 'Bulzești, Dolj',
      area: 12.5,
      crop: 'Grâu',
      coordinates: {
        lat: 44.5642,
        lng: 23.8822
      },
      soilType: 'Cernoziom',
      lastActivity: 'Semănat - 15 Oct 2024',
      notes: 'Teren cu productivitate ridicată, necesită atenție specială la irigare în perioada de vară.',
      photos: [],
      parcelCode: 'PN-001',
      size: 12.5,
      status: 'healthy',
      color: '#22c55e',
      plantingDate: '2024-10-15',
      harvestDate: '2025-07-15',
      workType: 'Arătură conventională',
      inputs: 'NPK 16:16:16',
      variety: 'Antonius',
      costs: 2500,
      roi: 15,
      weather: {
        temperature: 22,
        condition: 'sunny',
        humidity: 65,
        windSpeed: 12
      }
    },
    {
      id: '2',
      name: 'Parcela Sud',
      location: 'Bulzești, Dolj',
      area: 8.3,
      crop: 'Porumb',
      coordinates: {
        lat: 44.5580,
        lng: 23.8900
      },
      soilType: 'Luto-argilos',
      lastActivity: 'Fertilizat - 20 Mar 2024',
      notes: 'Zonă cu drenaj moderat, potrivită pentru culturile de vară.',
      photos: [],
      parcelCode: 'PS-002',
      size: 8.3,
      status: 'excellent',
      color: '#f59e0b',
      plantingDate: '2024-04-15',
      harvestDate: '2024-09-20',
      workType: 'No-till',
      inputs: 'Uree',
      variety: 'Pioneer',
      costs: 1800,
      roi: 20,
      weather: {
        temperature: 24,
        condition: 'cloudy',
        humidity: 70,
        windSpeed: 8
      }
    },
    {
      id: '3',
      name: 'Parcela Est',
      location: 'Bulzești, Dolj',
      area: 15.2,
      crop: 'Floarea-soarelui',
      coordinates: {
        lat: 44.5700,
        lng: 23.8950
      },
      soilType: 'Aluvionar',
      lastActivity: 'Recoltat - 05 Sep 2024',
      notes: 'Teren nou achiziționat, în proces de optimizare a fertilității solului.',
      photos: [],
      parcelCode: 'PE-003',
      size: 15.2,
      status: 'attention',
      color: '#ef4444',
      plantingDate: '2024-03-20',
      harvestDate: '2024-09-05',
      workType: 'Cultivare minimă',
      inputs: 'NPK 20:20:0',
      variety: 'Limagrain',
      costs: 3200,
      roi: 12,
      weather: {
        temperature: 20,
        condition: 'rainy',
        humidity: 80,
        windSpeed: 15
      }
    }
  ]);

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

  // Auto-sync weather data for existing fields when user logs in
  useEffect(() => {
    if (user && fields.length > 0) {
      const firstField = fields[0];
      if (firstField.coordinates) {
        WeatherSyncService.syncForUser(user.id, firstField.coordinates)
          .then(result => {
            if (result.success) {
              console.log('Weather data synced for user fields');
            }
          })
          .catch(error => {
            console.error('Failed to sync weather data:', error);
          });
      }
    }
  }, [user, fields.length]);

  const addField = async (fieldData: Omit<Field, 'id'>) => {
    const newField: Field = {
      ...fieldData,
      id: Date.now().toString(),
      size: fieldData.area,
      parcelCode: fieldData.parcelCode || `P-${Date.now()}`,
      status: fieldData.status || 'healthy',
      color: fieldData.color || '#22c55e'
    };
    
    setFields(prev => [...prev, newField]);

    if (user && fieldData.coordinates) {
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
          description: "Terenul a fost adăugat, dar sincronizarea meteo a eșuat. Încercați să actualizați manual.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Teren adăugat",
        description: "Terenul a fost adăugat cu succes.",
      });
    }
  };

  const updateField = (id: string, fieldData: Partial<Field>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { 
        ...field, 
        ...fieldData,
        size: fieldData.area || field.size
      } : field
    ));
    
    toast({
      title: "Teren actualizat",
      description: "Informațiile terenului au fost actualizate cu succes.",
    });
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
    
    toast({
      title: "Teren șters",
      description: "Terenul a fost șters cu succes.",
    });
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
    // Mock implementation
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
      user
    }}>
      {children}
    </AppContext.Provider>
  );
};
