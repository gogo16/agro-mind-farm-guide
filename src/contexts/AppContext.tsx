import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'rainy' | 'cloudy' | 'partly-cloudy' | 'stormy';
  humidity: number;
  windSpeed: number;
  windDirection?: string;
  pressure?: number;
  uvIndex?: number;
  visibility?: number;
  lastUpdated: string;
  forecast?: {
    date: string;
    temperature: { min: number; max: number };
    condition: string;
    precipitation: number;
  }[];
}

// DEPRECATED: Using Supabase fields table now
interface Field {
  id: number;
  name: string;
  parcelCode: string;
  size: number;
  crop: string;
  status: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  plantingDate?: string;
  harvestDate?: string;
  workType?: string;
  costs?: number;
  inputs?: string;
  roi?: number;
  color?: string;
  weather?: WeatherData;
}

interface WorkHistory {
  id: number;
  parcelId: number;
  workType: string;
  date: string;
  description: string;
  worker: string;
  cost?: number;
}

interface OwnerHistory {
  id: number;
  parcelId: number;
  ownerName: string;
  startDate: string;
  endDate?: string;
  ownershipType: string;
  notes?: string;
}

interface PropertyDocument {
  id: number;
  parcelId?: number;
  type: string;
  name: string;
  fileName: string;
  uploadDate: string;
  issueDate?: string;
  validUntil?: string;
  status: 'verified' | 'missing' | 'expired' | 'complete';
  notes?: string;
}

interface SatelliteData {
  parcelId: number;
  currentImage: string;
  previousImage: string;
  changeDetected: boolean;
  changePercentage: number;
  lastUpdated: string;
}

// TODO: Reconnect with Supabase fields table
interface Task {
  id: number;
  title: string;
  field: string; // Will be changed to field_id when reconnecting
  priority: 'high' | 'medium' | 'low';
  date: string;
  time: string;
  dueDate?: string;
  dueTime?: string;
  status: 'pending' | 'completed' | 'in-progress';
  aiSuggested: boolean;
  description: string;
  estimatedDuration?: string;
  duration?: number;
  category?: string;
}

// TODO: Reconnect with Supabase fields table
interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  field: string; // Will be changed to field_id when reconnecting
  date: string;
}

interface InventoryItem {
  id: number;
  name: string;
  type: string;
  quantity?: string;
  condition?: string;
  location?: string;
  lastUsed?: string;
  nextMaintenance?: string;
  expiration?: string;
  purpose?: string;
  stockLevel?: 'low' | 'normal' | 'high';
}

interface Notification {
  id: number;
  type: 'task' | 'weather' | 'inventory' | 'ai' | 'financial';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface User {
  name: string;
  email: string;
  phone: string;
  location: string;
  farmName: string;
}

interface FieldPhoto {
  id: number;
  fieldId: number;
  fieldName: string;
  date: string;
  activity: string;
  cropStage: string;
  weather: string;
  notes: string;
  imageUrl: string;
}

interface AppContextType {
  // DEPRECATED: Use useFields hook instead
  fields: Field[];
  
  // TODO: Will be reconnected to Supabase fields
  tasks: Task[];
  transactions: Transaction[];
  inventory: InventoryItem[]; // Deprecated - folosește useInventory hook pentru funcționalități noi
  notifications: Notification[];
  satelliteData: SatelliteData[];
  workHistory: WorkHistory[];
  ownerHistory: OwnerHistory[];
  propertyDocuments: PropertyDocument[];
  fieldPhotos: FieldPhoto[];
  user: User;
  currentSeason: string;
  
  // DEPRECATED: Use useFields hook instead
  addField: (field: Omit<Field, 'id'>) => void;
  updateField: (id: number, field: Partial<Field>) => void;
  deleteField: (id: number) => void;
  
  // TODO: Will be updated to work with Supabase fields
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void; // Deprecated
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => void; // Deprecated
  deleteInventoryItem: (id: number) => void; // Deprecated
  addWorkHistory: (work: Omit<WorkHistory, 'id'>) => void;
  updateWorkHistory: (id: number, work: Partial<WorkHistory>) => void;
  deleteWorkHistory: (id: number) => void;
  addOwnerHistory: (owner: Omit<OwnerHistory, 'id'>) => void;
  updateOwnerHistory: (id: number, owner: Partial<OwnerHistory>) => void;
  deleteOwnerHistory: (id: number) => void;
  addPropertyDocument: (doc: Omit<PropertyDocument, 'id'>) => void;
  updatePropertyDocument: (id: number, doc: Partial<PropertyDocument>) => void;
  deletePropertyDocument: (id: number) => void;
  addFieldPhoto: (photo: Omit<FieldPhoto, 'id'>) => void;
  markNotificationAsRead: (id: number) => void;
  updateUser: (userData: Partial<User>) => void;
  generateReport: (type: string) => any;
  generateAPIADocument: (type: string, data: any) => any;
  fetchSatelliteData: (parcelId: number) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  updateFieldWeather: (fieldId: number, weatherData: WeatherData) => void;
  fetchWeatherData: (fieldId: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Primăvară';
  if (month >= 5 && month <= 7) return 'Vară';
  if (month >= 8 && month <= 10) return 'Toamnă';
  return 'Iarnă';
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // DEPRECATED: Empty fields array - use useFields hook instead
  const [fields, setFields] = useState<Field[]>([]);

  // TODO: Tasks will be reconnected to Supabase fields table
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Verificare generală terenuri',
      field: 'General', // Temporary generic field
      priority: 'medium',
      date: '2024-06-06',
      time: '08:00',
      dueDate: '2024-06-06',
      dueTime: '08:00',
      status: 'pending',
      aiSuggested: false,
      description: 'Verificare stare generală terenuri și echipamente.',
      estimatedDuration: '2 ore'
    }
  ]);

  // TODO: Transactions will be reconnected to Supabase fields table
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'expense',
      amount: 1800,
      description: 'Îngrășământ NPK 16:16:16',
      category: 'Fertilizatori',
      field: 'General', // Temporary generic field
      date: '2024-06-01'
    },
    {
      id: 2,
      type: 'income',
      amount: 12000,
      description: 'Vânzare produse agricole',
      category: 'Vânzări',
      field: 'General', // Temporary generic field
      date: '2024-05-15'
    }
  ]);

  // ... keep existing code (inventory, notifications, satelliteData, workHistory, ownerHistory, propertyDocuments, fieldPhotos, user, currentSeason state)
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 1,
      name: 'Tractor Fendt 724',
      type: 'equipment',
      condition: 'Bună',
      location: 'Hangar Principal',
      lastUsed: '2024-06-05',
      nextMaintenance: '2024-07-01'
    },
    {
      id: 2,
      name: 'NPK 16-16-16',
      type: 'chemical',
      quantity: '500kg',
      expiration: '2025-12-31',
      purpose: 'Fertilizare de bază',
      stockLevel: 'low'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'task',
      title: 'Sarcină programată',
      message: 'Verificare echipamente programată pentru astăzi',
      date: '2024-06-05',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Stoc scăzut',
      message: 'NPK 16-16-16 este la nivel scăzut (500kg rămase)',
      date: '2024-06-05',
      isRead: false,
      priority: 'medium'
    }
  ]);

  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);

  const [workHistory, setWorkHistory] = useState<WorkHistory[]>([]);

  const [ownerHistory, setOwnerHistory] = useState<OwnerHistory[]>([]);

  const [propertyDocuments, setPropertyDocuments] = useState<PropertyDocument[]>([
    {
      id: 1,
      type: 'Certificat de Atestare Fiscală',
      name: 'CF General',
      fileName: 'cf_general.pdf',
      uploadDate: '2024-01-15',
      issueDate: '2024-01-10',
      validUntil: '2025-01-10',
      status: 'complete',
      notes: 'Document valabil pentru APIA'
    }
  ]);

  const [fieldPhotos, setFieldPhotos] = useState<FieldPhoto[]>([]);

  const [user, setUser] = useState<User>({
    name: 'Ion Popescu',
    email: 'ion.popescu@email.com',
    phone: '+40 123 456 789',
    location: 'Buzău, România',
    farmName: 'Ferma AgroMind'
  });

  const [currentSeason, setCurrentSeason] = useState(getCurrentSeason());

  // DEPRECATED: Empty functions - use useFields hook instead
  const addField = (field: Omit<Field, 'id'>) => {
    console.warn('addField is deprecated. Use useFields hook instead.');
  };

  const updateField = (id: number, fieldUpdate: Partial<Field>) => {
    console.warn('updateField is deprecated. Use useFields hook instead.');
  };

  const deleteField = (id: number) => {
    console.warn('deleteField is deprecated. Use useFields hook instead.');
  };

  const updateFieldWeather = (fieldId: number, weatherData: WeatherData) => {
    console.warn('updateFieldWeather is deprecated. Use useFields hook instead.');
  };

  const fetchWeatherData = async (fieldId: number) => {
    console.warn('fetchWeatherData is deprecated. Use useFields hook instead.');
  };

  // ... keep existing code (all other functions remain the same)
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now() };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: number, taskUpdate: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...taskUpdate } : task));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now() };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: number, transactionUpdate: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...transactionUpdate } : transaction
    ));
  };

  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    console.warn('addInventoryItem is deprecated. Use useInventory hook instead.');
    const newItem = { ...item, id: Date.now() };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: number, itemUpdate: Partial<InventoryItem>) => {
    console.warn('updateInventoryItem is deprecated. Use useInventory hook instead.');
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...itemUpdate } : item));
  };

  const deleteInventoryItem = (id: number) => {
    console.warn('deleteInventoryItem is deprecated. Use useInventory hook instead.');
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const addWorkHistory = (work: Omit<WorkHistory, 'id'>) => {
    const newWork = { ...work, id: Date.now() };
    setWorkHistory(prev => [...prev, newWork]);
  };

  const updateWorkHistory = (id: number, workUpdate: Partial<WorkHistory>) => {
    setWorkHistory(prev => prev.map(work => work.id === id ? { ...work, ...workUpdate } : work));
  };

  const deleteWorkHistory = (id: number) => {
    setWorkHistory(prev => prev.filter(work => work.id !== id));
  };

  const addOwnerHistory = (owner: Omit<OwnerHistory, 'id'>) => {
    const newOwner = { ...owner, id: Date.now() };
    setOwnerHistory(prev => [...prev, newOwner]);
  };

  const updateOwnerHistory = (id: number, ownerUpdate: Partial<OwnerHistory>) => {
    setOwnerHistory(prev => prev.map(owner => owner.id === id ? { ...owner, ...ownerUpdate } : owner));
  };

  const deleteOwnerHistory = (id: number) => {
    setOwnerHistory(prev => prev.filter(owner => owner.id !== id));
  };

  const addPropertyDocument = (doc: Omit<PropertyDocument, 'id'>) => {
    const newDoc = { ...doc, id: Date.now() };
    setPropertyDocuments(prev => [...prev, newDoc]);
  };

  const updatePropertyDocument = (id: number, docUpdate: Partial<PropertyDocument>) => {
    setPropertyDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...docUpdate } : doc));
  };

  const deletePropertyDocument = (id: number) => {
    setPropertyDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const addFieldPhoto = (photo: Omit<FieldPhoto, 'id'>) => {
    const newPhoto = { ...photo, id: Date.now() };
    setFieldPhotos(prev => [...prev, newPhoto]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const generateAPIADocument = (type: string, data: any) => {
    // TODO: Will be updated to work with Supabase fields
    const baseData = {
      farmerCode: user.farmName.substring(0, 8).toUpperCase(),
      farmName: user.farmName,
      location: user.location,
      generatedDate: new Date().toLocaleDateString('ro-RO'),
      ...data
    };

    switch (type) {
      case 'apia-cereale':
        return {
          documentType: 'APIA - Cerere Cereale',
          ...baseData,
          parcels: [], // Empty until reconnected
          totalArea: 0,
          estimatedProduction: 0
        };
      default:
        return baseData;
    }
  };

  const fetchSatelliteData = (parcelId: number) => {
    // TODO: Will be updated to work with Supabase fields
    console.warn('fetchSatelliteData temporarily disabled during field migration');
  };

  const generateReport = (type: string) => {
    // TODO: Will be updated to work with Supabase fields
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const profit = totalIncome - totalExpenses;
    const roi = totalExpenses > 0 ? ((profit / totalExpenses) * 100) : 0;

    switch (type) {
      case 'productivity':
        return {
          totalFields: 0, // Will be updated when reconnected
          totalArea: 0,
          avgProductivity: 0,
          topPerformingField: null
        };
      case 'financial':
        return {
          totalIncome,
          totalExpenses,
          profit,
          roi: roi.toFixed(1),
          profitMargin: totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : 0
        };
      case 'seasonal':
        return {
          currentSeason: 'Vară',
          completedTasks: tasks.filter(t => t.status === 'completed').length,
          pendingTasks: tasks.filter(t => t.status === 'pending').length,
          seasonalRecommendations: ['Verificare echipamente', 'Monitorizare stocuri']
        };
      default:
        return {};
    }
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = { ...notification, id: Date.now() };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      fields, // DEPRECATED: Empty array
      tasks,
      transactions,
      inventory, // Deprecated - folosește useInventory hook pentru funcționalități noi
      notifications,
      satelliteData,
      workHistory,
      ownerHistory,
      propertyDocuments,
      fieldPhotos,
      user,
      currentSeason,
      addField, // DEPRECATED
      updateField, // DEPRECATED
      deleteField, // DEPRECATED
      addTask,
      updateTask,
      deleteTask,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addInventoryItem, // Deprecated
      updateInventoryItem, // Deprecated
      deleteInventoryItem, // Deprecated
      addWorkHistory,
      updateWorkHistory,
      deleteWorkHistory,
      addOwnerHistory,
      updateOwnerHistory,
      deleteOwnerHistory,
      addPropertyDocument,
      updatePropertyDocument,
      deletePropertyDocument,
      addFieldPhoto,
      markNotificationAsRead,
      updateUser,
      generateReport,
      generateAPIADocument,
      fetchSatelliteData,
      addNotification,
      updateFieldWeather, // DEPRECATED
      fetchWeatherData // DEPRECATED
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
