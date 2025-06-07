
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Field {
  id: number;
  name: string;
  size: number;
  crop: string;
  status: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
}

interface Task {
  id: number;
  title: string;
  field: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  time: string;
  status: 'pending' | 'completed';
  aiSuggested: boolean;
  description: string;
  estimatedDuration?: string;
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

interface AppContextType {
  fields: Field[];
  tasks: Task[];
  transactions: Transaction[];
  inventory: InventoryItem[];
  notifications: Notification[];
  user: User;
  addField: (field: Omit<Field, 'id'>) => void;
  updateField: (id: number, field: Partial<Field>) => void;
  deleteField: (id: number) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: number) => void;
  markNotificationAsRead: (id: number) => void;
  updateUser: (userData: Partial<User>) => void;
  generateReport: (type: string) => any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [fields, setFields] = useState<Field[]>([
    { id: 1, name: 'Parcela Nord', size: 15.5, crop: 'Grâu de toamnă', status: 'Plantat', location: 'Nord', coordinates: { lat: 44.4268, lng: 26.1025 } },
    { id: 2, name: 'Câmp Sud', size: 22.3, crop: 'Porumb', status: 'Pregătire teren', location: 'Sud', coordinates: { lat: 44.4168, lng: 26.1125 } },
    { id: 3, name: 'Livada Est', size: 8.7, crop: 'Măr', status: 'Maturitate', location: 'Est', coordinates: { lat: 44.4368, lng: 26.1225 } }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Irigarea Parcelei Nord',
      field: 'Parcela Nord',
      priority: 'high',
      date: '2024-06-06',
      time: '06:00',
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

  const [user, setUser] = useState<User>({
    name: 'Ion Popescu',
    email: 'ion.popescu@email.com',
    phone: '+40 123 456 789',
    location: 'Buzău, România',
    farmName: 'Ferma AgroMind'
  });

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
    const newItem = { ...item, id: Date.now() };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: number, itemUpdate: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...itemUpdate } : item));
  };

  const deleteInventoryItem = (id: number) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...userData }));
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

  return (
    <AppContext.Provider value={{
      fields,
      tasks,
      transactions,
      inventory,
      notifications,
      user,
      addField,
      updateField,
      deleteField,
      addTask,
      updateTask,
      deleteTask,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      markNotificationAsRead,
      updateUser,
      generateReport
    }}>
      {children}
    </AppContext.Provider>
  );
};
