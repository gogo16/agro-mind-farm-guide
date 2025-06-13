
import { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';

export interface AIRecommendation {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  type: 'financial' | 'inventory' | 'seasonal' | 'market' | 'general';
  timestamp: string;
  isNew?: boolean;
}

export interface AIZoneContent {
  'ai-main-insights': AIRecommendation[];
  'ai-financial-tips': AIRecommendation[];
  'ai-inventory-recommendations': AIRecommendation[];
  'ai-daily-recommendation': AIRecommendation[];
  'ai-market-insights': AIRecommendation[];
  'ai-seasonal-guidance': AIRecommendation[];
}

export const useAIRecommendations = () => {
  const { fields, transactions, inventory, tasks } = useAppContext();
  const [aiContent, setAiContent] = useState<AIZoneContent>({
    'ai-main-insights': [],
    'ai-financial-tips': [],
    'ai-inventory-recommendations': [],
    'ai-daily-recommendation': [],
    'ai-market-insights': [],
    'ai-seasonal-guidance': []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Generate AI recommendations based on farm data
  const generateRecommendations = () => {
    setIsLoading(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const newContent: AIZoneContent = {
        'ai-main-insights': generateMainInsights(),
        'ai-financial-tips': generateFinancialTips(),
        'ai-inventory-recommendations': generateInventoryRecommendations(),
        'ai-daily-recommendation': generateDailyRecommendation(),
        'ai-market-insights': generateMarketInsights(),
        'ai-seasonal-guidance': generateSeasonalGuidance()
      };
      
      setAiContent(newContent);
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1500);
  };

  const generateMainInsights = (): AIRecommendation[] => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const profit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : '0';

    return [
      {
        id: 'main-1',
        title: 'Performanță Financiară',
        content: `Marja ta de profit este ${profitMargin}%. ${parseFloat(profitMargin) > 20 ? 'Excelentă performanță!' : 'Consideră optimizarea costurilor pentru îmbunătățire.'}`,
        priority: 'high',
        type: 'financial',
        timestamp: new Date().toISOString(),
        isNew: true
      },
      {
        id: 'main-2',
        title: 'Managementul Terenurilor',
        content: `Ai ${fields.length} terenuri active. ${fields.length < 5 ? 'Poți considera extinderea pentru diversificare.' : 'Concentrează-te pe optimizarea randamentului actual.'}`,
        priority: 'medium',
        type: 'general',
        timestamp: new Date().toISOString()
      },
      {
        id: 'main-3',
        title: 'Sarcini Pendente',
        content: `${tasks.filter(t => t.status === 'pending').length} sarcini necesită atenție. Prioritizează activitățile sezoniere critice.`,
        priority: tasks.filter(t => t.status === 'pending').length > 5 ? 'high' : 'medium',
        type: 'general',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateFinancialTips = (): AIRecommendation[] => {
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return [
      {
        id: 'financial-1',
        title: 'Optimizare Costuri',
        content: `Cheltuielile lunare sunt ${monthlyExpenses.toLocaleString()} RON. Analizează categoriile cu cele mai mari costuri pentru economii potențiale.`,
        priority: 'high',
        type: 'financial',
        timestamp: new Date().toISOString()
      },
      {
        id: 'financial-2',
        title: 'Diversificare Venituri',
        content: 'Consideră introducerea unor culturi secundare sau produse procesate pentru fluxuri de venit suplimentare.',
        priority: 'medium',
        type: 'financial',
        timestamp: new Date().toISOString()
      },
      {
        id: 'financial-3',
        title: 'Planificare Bugetară',
        content: 'Stabilește un buget lunar pentru următoarea perioadă bazat pe cheltuielile istorice și veniturile estimate.',
        priority: 'medium',
        type: 'financial',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateInventoryRecommendations = (): AIRecommendation[] => {
    const inventoryCount = inventory.length;
    
    return [
      {
        id: 'inventory-1',
        title: 'Stoc Semințe',
        content: `Verifică stocurile de semințe pentru sezonul următor. ${inventoryCount < 10 ? 'Stocul pare redus, consideră reaprovizionarea.' : 'Stocul pare adecvat.'}`,
        priority: inventoryCount < 10 ? 'high' : 'medium',
        type: 'inventory',
        timestamp: new Date().toISOString()
      },
      {
        id: 'inventory-2',
        title: 'Întreținere Utilaje',
        content: 'Programează verificarea și întreținerea utilajelor agricole înainte de sezonul de lucru intens.',
        priority: 'high',
        type: 'inventory',
        timestamp: new Date().toISOString()
      },
      {
        id: 'inventory-3',
        title: 'Gestionare Îngrășăminte',
        content: 'Monitorizează termenele de valabilitate ale îngrășămintelor și produselor fitosanitare din stoc.',
        priority: 'medium',
        type: 'inventory',
        timestamp: new Date().toISOString()
      },
      {
        id: 'inventory-4',
        title: 'Optimizare Spațiu Depozitare',
        content: 'Reorganizează depozitul pentru acces mai eficient la materialele frecvent utilizate.',
        priority: 'low',
        type: 'inventory',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateDailyRecommendation = (): AIRecommendation[] => {
    const currentHour = new Date().getHours();
    const season = new Date().getMonth();
    
    let recommendation = '';
    if (currentHour < 12) {
      recommendation = 'Dimineața este ideală pentru verificarea culturilor și planificarea activităților zilei.';
    } else if (currentHour < 18) {
      recommendation = 'Perioada de după-amiază este potrivită pentru lucrările de teren și întreținere.';
    } else {
      recommendation = 'Seara este momentul perfect pentru actualizarea înregistrărilor și planificarea zilei următoare.';
    }

    return [
      {
        id: 'daily-1',
        title: 'Recomandarea Zilei',
        content: recommendation,
        priority: 'medium',
        type: 'general',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateMarketInsights = (): AIRecommendation[] => {
    return [
      {
        id: 'market-1',
        title: 'Tendințe Prețuri',
        content: 'Prețurile cerealelor au crescut cu 2.1% în ultimele 7 zile. Momentul favorabil pentru vânzare.',
        priority: 'high',
        type: 'market',
        timestamp: new Date().toISOString()
      },
      {
        id: 'market-2',
        title: 'Oportunități Piață',
        content: 'Creștere în cererea pentru produse organice. Consideră tranziția către agricultura ecologică.',
        priority: 'medium',
        type: 'market',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateSeasonalGuidance = (): AIRecommendation[] => {
    const month = new Date().getMonth();
    let seasonalTips = [];

    if (month >= 2 && month <= 4) { // Primăvară
      seasonalTips = [
        {
          id: 'seasonal-1',
          title: 'Pregătire Sezon',
          content: 'Verifică și pregătește utilajele pentru începutul sezonului de lucru.',
          priority: 'high',
          type: 'seasonal',
          timestamp: new Date().toISOString()
        },
        {
          id: 'seasonal-2',
          title: 'Însămânțare',
          content: 'Monitorizează condițiile meteo pentru momentul optim de însămânțare.',
          priority: 'high',
          type: 'seasonal',
          timestamp: new Date().toISOString()
        }
      ];
    } else if (month >= 5 && month <= 7) { // Vară
      seasonalTips = [
        {
          id: 'seasonal-1',
          title: 'Irigare',
          content: 'Monitorizează necesarul de apă al culturilor în perioada caldă.',
          priority: 'high',
          type: 'seasonal',
          timestamp: new Date().toISOString()
        }
      ];
    }
    // Add more seasonal logic...

    return seasonalTips;
  };

  // Refresh recommendations when farm data changes
  useEffect(() => {
    generateRecommendations();
  }, [fields.length, transactions.length, inventory.length, tasks.length]);

  const refreshRecommendations = () => {
    generateRecommendations();
  };

  const getRecommendationsByZone = (zoneId: keyof AIZoneContent) => {
    return aiContent[zoneId] || [];
  };

  return {
    aiContent,
    isLoading,
    lastUpdate,
    refreshRecommendations,
    getRecommendationsByZone
  };
};
