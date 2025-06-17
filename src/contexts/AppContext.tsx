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

interface Task {
  id: number;
  title: string;
  field: string;
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

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  field: string;
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
  fields: Field[];
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
  addField: (field: Omit<Field, 'id'>) => void;
  updateField: (id: number, field: Partial<Field>) => void;
  deleteField: (id: number) => void;
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
  const [fields, setFields] = useState<Field[]>([
    { 
      id: 1, 
      name: 'Parcela Nord', 
      parcelCode: 'PN-001',
      size: 15.5, 
      crop: 'Grâu de toamnă', 
      status: 'Plantat', 
      location: 'Nord', 
      coordinates: { lat: 44.4268, lng: 26.1025 },
      plantingDate: '2024-10-15',
      harvestDate: '2024-07-20',
      workType: 'Arătură conventională',
      costs: 2500,
      inputs: 'NPK 16:16:16, Herbicid',
      roi: 15.2,
      color: '#22c55e',
      weather: {
        temperature: 18,
        condition: 'cloudy',
        humidity: 68,
        windSpeed: 15,
        windDirection: 'NV',
        pressure: 1015,
        uvIndex: 4,
        visibility: 10,
        lastUpdated: 'acum 25 min'
      }
    },
    { 
      id: 2, 
      name: 'Câmp Sud', 
      parcelCode: 'CS-002',
      size: 22.3, 
      crop: 'Porumb', 
      status: 'Pregătire teren', 
      location: 'Sud', 
      coordinates: { lat: 44.4168, lng: 26.1125 },
      plantingDate: '2024-04-20',
      harvestDate: '2024-09-15',
      workType: 'Arătură + Grăpare',
      costs: 3200,
      inputs: 'Semințe hibrid, Îngrășământ starter',
      roi: 18.7,
      color: '#3b82f6',
      weather: {
        temperature: 24,
        condition: 'sunny',
        humidity: 45,
        windSpeed: 8,
        windDirection: 'S',
        pressure: 1018,
        uvIndex: 7,
        visibility: 15,
        lastUpdated: 'acum 15 min'
      }
    },
    { 
      id: 3, 
      name: 'Livada Est', 
      parcelCode: 'LE-003',
      size: 8.7, 
      crop: 'Măr', 
      status: 'Maturitate', 
      location: 'Est', 
      coordinates: { lat: 44.4368, lng: 26.1225 },
      plantingDate: '2020-03-10',
      harvestDate: '2024-08-30',
      workType: 'Întreținere livadă',
      costs: 1800,
      inputs: 'Fungicide, Insecticide',
      roi: 22.1,
      color: '#f59e0b',
      weather: {
        temperature: 20,
        condition: 'rainy',
        humidity: 85,
        windSpeed: 12,
        windDirection: 'E',
        pressure: 1010,
        uvIndex: 2,
        visibility: 8,
        lastUpdated: 'acum 10 min'
      }
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Irigarea Parcelei Nord',
      field: 'Parcela Nord',
      priority: 'high',
      date: '2024-06-06',
      time: '06:00',
      dueDate: '2024-06-06',
      dueTime: '06:00',
      status: 'pending',
      aiSuggested: true,
      description: 'Condițiile meteo sunt ideale pentru irigare dimineața devreme.',
      estimatedDuration: '2 ore'
    },
    {
      id: 2,
      title: 'Fertilizare Câmp Sud',
      field: 'Câmp Sud',
      priority: 'medium',
      date: '2024-06-07',
      time: '14:00',
      dueDate: '2024-06-07',
      dueTime: '14:00',
      status: 'pending',
      aiSuggested: true,
      description: 'Aplicare îngrășământ NPK conform planificării.',
      estimatedDuration: '3 ore'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'expense',
      amount: 1800,
      description: 'Îngrășământ NPK 16:16:16',
      category: 'Fertilizatori',
      field: 'Parcela Nord',
      date: '2024-06-01'
    },
    {
      id: 2,
      type: 'income',
      amount: 12000,
      description: 'Vânzare grâu - 20 tone',
      category: 'Vânzări',
      field: 'Parcela Nord',
      date: '2024-05-15'
    }
  ]);

  // Inventarul vechi rămâne pentru compatibilitate, dar este deprecated
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
      title: 'Sarcină urgentă',
      message: 'Irigarea Parcelei Nord trebuie efectuată mâine dimineață',
      date: '2024-06-05',
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Stoc scăzut',
      message: 'NPK 16-16-16 este la nivel scăzut (500kg rămase)',
      date: '2024-06-05',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'ai',
      title: 'Recomandare AI',
      message: 'Condițiile meteo sunt optime pentru tratamente în următoarele 3 zile',
      date: '2024-06-04',
      isRead: true,
      priority: 'low'
    }
  ]);

  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);

  const [workHistory, setWorkHistory] = useState<WorkHistory[]>([
    {
      id: 1,
      parcelId: 1,
      workType: 'Arătură',
      date: '2024-03-15',
      description: 'Arătură de primăvară cu tractorul',
      worker: 'Ion Popescu',
      cost: 500
    },
    {
      id: 2,
      parcelId: 1,
      workType: 'Însămânțare',
      date: '2024-04-10',
      description: 'Însămânțare grâu de toamnă',
      worker: 'Maria Ionescu',
      cost: 800
    }
  ]);

  const [ownerHistory, setOwnerHistory] = useState<OwnerHistory[]>([
    {
      id: 1,
      parcelId: 1,
      ownerName: 'Ion Popescu',
      startDate: '2020-01-01',
      ownershipType: 'Proprietar',
      notes: 'Cumpărat prin succesiune'
    },
    {
      id: 2,
      parcelId: 2,
      ownerName: 'Ferma AgroMind SRL',
      startDate: '2021-06-15',
      ownershipType: 'Închiriere',
      notes: 'Contract închiriere pe 10 ani'
    }
  ]);

  const [propertyDocuments, setPropertyDocuments] = useState<PropertyDocument[]>([
    {
      id: 1,
      parcelId: 1,
      type: 'Certificat de Atestare Fiscală',
      name: 'CF Parcela Nord',
      fileName: 'cf_parcela_nord.pdf',
      uploadDate: '2024-01-15',
      issueDate: '2024-01-10',
      validUntil: '2025-01-10',
      status: 'complete',
      notes: 'Document valabil pentru APIA'
    },
    {
      id: 2,
      parcelId: 2,
      type: 'Contract închiriere',
      name: 'Contract Câmp Sud',
      fileName: 'contract_camp_sud.pdf',
      uploadDate: '2024-02-01',
      issueDate: '2021-06-15',
      validUntil: '2031-06-15',
      status: 'verified'
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

  const addField = (field: Omit<Field, 'id'>) => {
    const newField = { ...field, id: Date.now() };
    setFields(prev => [...prev, newField]);
  };

  const updateField = (id: number, fieldUpdate: Partial<Field>) => {
    setFields(prev => prev.map(field => field.id === id ? { ...field, ...fieldUpdate } : field));
  };

  const deleteField = (id: number) => {
    setFields(prev => prev.filter(field => field.id !== id));
  };

  const updateFieldWeather = (fieldId: number, weatherData: WeatherData) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, weather: weatherData } : field
    ));
  };

  const fetchWeatherData = async (fieldId: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.coordinates) return;

    try {
      console.log(`Fetching weather for field ${fieldId} at coordinates ${field.coordinates.lat}, ${field.coordinates.lng}`);
      
      const newNotification: Notification = {
        id: Date.now(),
        type: 'weather',
        title: 'Date meteo actualizate',
        message: `Informațiile meteo pentru ${field.name} au fost actualizate`,
        date: new Date().toISOString().split('T')[0],
        isRead: false,
        priority: 'low'
      };
      setNotifications(prev => [newNotification, ...prev]);
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

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
          parcels: fields.filter(f => ['Grâu', 'Orz', 'Ovăz'].includes(f.crop.split(' ')[0])),
          totalArea: fields.reduce((sum, field) => sum + field.size, 0),
          estimatedProduction: fields.reduce((sum, field) => sum + (field.size * 4.5), 0)
        };
      case 'apia-eco-scheme':
        return {
          documentType: 'APIA - Eco-scheme',
          ...baseData,
          ecoMeasures: ['Rotația culturilor', 'Zone tampon', 'Păstrarea vegetației permanente'],
          parcels: fields,
          totalEcoArea: fields.reduce((sum, field) => sum + field.size, 0)
        };
      case 'afir-modernizare':
        return {
          documentType: 'AFIR - Modernizare Exploatații',
          ...baseData,
          investmentType: 'Modernizare echipamente agricole',
          requestedAmount: 150000,
          cofinancing: 75000,
          timeline: '24 luni',
          equipment: inventory.filter(item => item.type === 'equipment')
        };
      default:
        return baseData;
    }
  };

  const fetchSatelliteData = (parcelId: number) => {
    setTimeout(() => {
      const mockData: SatelliteData = {
        parcelId,
        currentImage: `/api/satellite/current/${parcelId}`,
        previousImage: `/api/satellite/previous/${parcelId}`,
        changeDetected: Math.random() > 0.7,
        changePercentage: Math.random() * 15,
        lastUpdated: new Date().toISOString()
      };

      setSatelliteData(prev => [...prev.filter(d => d.parcelId !== parcelId), mockData]);

      if (mockData.changeDetected) {
        const field = fields.find(f => f.id === parcelId);
        const newNotification: Notification = {
          id: Date.now(),
          type: 'ai',
          title: 'Modificare teren detectată',
          message: `Modificare detectată pe ${field?.name} (${field?.parcelCode}) în ultimele 7 zile - ${mockData.changePercentage.toFixed(1)}% din suprafață`,
          date: new Date().toISOString().split('T')[0],
          isRead: false,
          priority: 'high'
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 2000);
  };

  const generateReport = (type: string) => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const profit = totalIncome - totalExpenses;
    const roi = totalExpenses > 0 ? ((profit / totalExpenses) * 100) : 0;

    switch (type) {
      case 'productivity':
        return {
          totalFields: fields.length,
          totalArea: fields.reduce((sum, field) => sum + field.size, 0),
          avgProductivity: 8.5,
          topPerformingField: fields.reduce((max, field) => field.size > max.size ? field : max, fields[0])
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
          seasonalRecommendations: ['Irigare frecventă', 'Monitorizare dăunători', 'Pregătire recoltare']
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
      fields,
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
      addField,
      updateField,
      deleteField,
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
      updateFieldWeather,
      fetchWeatherData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
