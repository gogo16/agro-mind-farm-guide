
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
}

interface AppContextType {
  fields: Field[];
  addField: (field: Omit<Field, 'id'>) => void;
  updateField: (id: string, field: Partial<Field>) => void;
  deleteField: (id: string) => void;
  getField: (id: string) => Field | undefined;
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
      photos: []
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
      photos: []
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
      photos: []
    }
  ]);

  // Auto-sync weather data for existing fields when user logs in
  useEffect(() => {
    if (user && fields.length > 0) {
      // Sync weather for the first field (representative coordinates)
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
    };
    
    setFields(prev => [...prev, newField]);

    // Auto-sync weather data for new field if it has coordinates and user is logged in
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
      field.id === id ? { ...field, ...fieldData } : field
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

  return (
    <AppContext.Provider value={{
      fields,
      addField,
      updateField,
      deleteField,
      getField
    }}>
      {children}
    </AppContext.Provider>
  );
};
