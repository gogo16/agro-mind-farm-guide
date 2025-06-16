import { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';

export interface AIRecommendation {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  type: 'financial' | 'inventory' | 'seasonal' | 'market' | 'general' | 'field-status' | 'soil' | 'progress' | 'crop-rotation' | 'equipment-maintenance' | 'seasonal-planning' | 'analytics';
  timestamp: string;
  isNew?: boolean;
  actionable?: boolean;
  estimatedSavings?: number;
}

export interface AIZoneContent {
  'ai-main-insights': AIRecommendation[];
  'ai-financial-tips': AIRecommendation[];
  'ai-inventory-recommendations': AIRecommendation[];
  'ai-daily-recommendation': AIRecommendation[];
  'ai-market-insights': AIRecommendation[];
  'ai-seasonal-guidance': AIRecommendation[];
  'ai-field-status': AIRecommendation[];
  'ai-season-progress': AIRecommendation[];
  'ai-soil-recommendations': AIRecommendation[];
  'ai-crop-rotation': AIRecommendation[];
  'ai-equipment-maintenance': AIRecommendation[];
  'ai-seasonal-planning': AIRecommendation[];
  'ai-analytics': AIRecommendation[];
}

export const useAIRecommendations = () => {
  const { fields, transactions, inventory, tasks } = useAppContext();
  const [aiContent, setAiContent] = useState<AIZoneContent>({
    'ai-main-insights': [],
    'ai-financial-tips': [],
    'ai-inventory-recommendations': [],
    'ai-daily-recommendation': [],
    'ai-market-insights': [],
    'ai-seasonal-guidance': [],
    'ai-field-status': [],
    'ai-season-progress': [],
    'ai-soil-recommendations': [],
    'ai-crop-rotation': [],
    'ai-equipment-maintenance': [],
    'ai-seasonal-planning': [],
    'ai-analytics': []
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
        'ai-seasonal-guidance': generateSeasonalGuidance(),
        'ai-field-status': generateFieldStatus(),
        'ai-season-progress': generateSeasonProgress(),
        'ai-soil-recommendations': generateSoilRecommendations(),
        'ai-crop-rotation': generateCropRotationRecommendations(),
        'ai-equipment-maintenance': generateEquipmentMaintenanceRecommendations(),
        'ai-seasonal-planning': generateSeasonalPlanningRecommendations(),
        'ai-analytics': generateAnalyticsRecommendations()
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

  const generateFieldStatus = (): AIRecommendation[] => {
    const currentField = fields[0]; // In real implementation, this would be passed as parameter
    if (!currentField) return [];

    const daysSincePlanting = currentField.plantingDate ? 
      Math.floor((new Date().getTime() - new Date(currentField.plantingDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    let healthStatus = 'Sănătos';
    let developmentStage = 'Dezvoltare normală';
    let priority: 'high' | 'medium' | 'low' = 'low';

    if (daysSincePlanting > 180) {
      developmentStage = 'Aproape de maturitate';
      priority = 'medium';
    } else if (daysSincePlanting > 90) {
      developmentStage = 'Dezvoltare activă';
    } else if (daysSincePlanting > 30) {
      developmentStage = 'Creștere timpurie';
    }

    // Weather impact
    if (currentField.weather?.condition === 'rainy') {
      healthStatus = 'Risc umiditate';
      priority = 'high';
    } else if (currentField.weather?.temperature && currentField.weather.temperature > 35) {
      healthStatus = 'Stres termic';
      priority = 'high';
    }

    return [
      {
        id: 'field-status-1',
        title: healthStatus,
        content: developmentStage,
        priority,
        type: 'field-status',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateSeasonProgress = (): AIRecommendation[] => {
    const currentField = fields[0];
    if (!currentField) return [];

    const plantingDate = currentField.plantingDate ? new Date(currentField.plantingDate) : new Date();
    const harvestDate = currentField.harvestDate ? new Date(currentField.harvestDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    
    const totalDays = Math.floor((harvestDate.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSincePlanting = Math.floor((new Date().getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysToHarvest = Math.floor((harvestDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    const developmentProgress = Math.min(100, Math.max(0, (daysSincePlanting / totalDays) * 100));

    return [
      {
        id: 'progress-1',
        title: 'Progres Dezvoltare',
        content: `${developmentProgress.toFixed(0)}% - ${daysSincePlanting} zile de la plantare`,
        priority: 'medium',
        type: 'progress',
        timestamp: new Date().toISOString()
      },
      {
        id: 'progress-2',
        title: 'Zile până la Recoltare',
        content: `${Math.max(0, daysToHarvest)} zile rămase`,
        priority: daysToHarvest < 30 ? 'high' : 'medium',
        type: 'progress',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateSoilRecommendations = (): AIRecommendation[] => {
    // Mock soil data - in real implementation would come from soil analysis
    const mockSoilData = {
      pH: 7.2,
      nitrogen: 85,
      phosphorus: 45,
      potassium: 120,
      organicMatter: 3.8
    };

    const recommendations = [];

    if (mockSoilData.pH > 7.5) {
      recommendations.push({
        id: 'soil-1',
        title: 'pH Bazic Detectat',
        content: 'pH-ul solului este bazic (7.2). Consideră aplicarea de sulf pentru acidifiere.',
        priority: 'medium' as const,
        type: 'soil' as const,
        timestamp: new Date().toISOString()
      });
    }

    if (mockSoilData.phosphorus < 50) {
      recommendations.push({
        id: 'soil-2',
        title: 'Deficit de Fosfor',
        content: 'Nivelul de fosfor este scăzut (45 mg/kg). Recomandăm fertilizare fosfatică.',
        priority: 'high' as const,
        type: 'soil' as const,
        timestamp: new Date().toISOString()
      });
    }

    if (mockSoilData.organicMatter > 3.5) {
      recommendations.push({
        id: 'soil-3',
        title: 'Materie Organică Optimă',
        content: 'Conținutul de materie organică este excelent (3.8%). Menține practicile actuale.',
        priority: 'low' as const,
        type: 'soil' as const,
        timestamp: new Date().toISOString()
      });
    }

    return recommendations;
  };

  const generateCropRotationRecommendations = (): AIRecommendation[] => {
    const cropHistory = fields.map(field => ({
      id: field.id,
      name: field.name,
      crop: field.crop,
      size: field.size,
      lastYearCrop: 'Grâu' // Mock data - should come from historical records
    }));

    return [
      {
        id: 'rotation-1',
        title: 'Rotația Optimă pentru 2024',
        content: `Pe parcela "${fields[0]?.name || 'Teren 1'}", treci de la grâu la rapiță pentru reducerea presiunii dăunătorilor și creșterea profitului cu ~12%.`,
        priority: 'high',
        type: 'crop-rotation',
        timestamp: new Date().toISOString(),
        actionable: true,
        estimatedSavings: 2400
      },
      {
        id: 'rotation-2',
        title: 'Diversificare Culturi',
        content: 'Consideră introducerea unei culturi leguminoase (soia/mazăre) pentru îmbunătățirea fertilității solului natural.',
        priority: 'medium',
        type: 'crop-rotation',
        timestamp: new Date().toISOString()
      },
      {
        id: 'rotation-3',
        title: 'Analiză Compatibilitate Sol',
        content: 'Solul tău este optim pentru culturi de toamnă. Planifică însămânțarea timpurie pentru randament maxim.',
        priority: 'medium',
        type: 'crop-rotation',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateEquipmentMaintenanceRecommendations = (): AIRecommendation[] => {
    // Mock equipment data - in real implementation would come from equipment tracking
    const mockEquipment = [
      { name: 'Tractor Fendt 724', lastMaintenance: '2024-03-15', hours: 1250 },
      { name: 'Combină John Deere S760', lastMaintenance: '2024-02-20', hours: 520 },
      { name: 'Semănătoarea Amazone', lastMaintenance: '2024-01-10', hours: 180 }
    ];

    return [
      {
        id: 'maintenance-1',
        title: 'Verificare Filtru Aer - Tractor',
        content: 'Tractorul Fendt 724 necesită schimbarea filtrului de aer (1250h). Programează în următoarele 2 săptămâni.',
        priority: 'high',
        type: 'equipment-maintenance',
        timestamp: new Date().toISOString(),
        actionable: true
      },
      {
        id: 'maintenance-2',
        title: 'Service Anual Combină',
        content: 'Combina John Deere S760 necesită service anual complet înainte de sezonul de recoltare.',
        priority: 'medium',
        type: 'equipment-maintenance',
        timestamp: new Date().toISOString(),
        actionable: true
      },
      {
        id: 'maintenance-3',
        title: 'Calibrare Semănătoare',
        content: 'Verifică și calibrează semănătoarea Amazone pentru uniformitatea distribuției semințelor.',
        priority: 'medium',
        type: 'equipment-maintenance',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateSeasonalPlanningRecommendations = (): AIRecommendation[] => {
    const currentMonth = new Date().getMonth();
    
    return [
      {
        id: 'planning-1',
        title: 'Calendar Lucrări 2024',
        content: 'Planifică: Februarie - pregătire sol, Martie - semănat porumb, Aprilie - tratamente, Mai - fertilizare.',
        priority: 'high',
        type: 'seasonal-planning',
        timestamp: new Date().toISOString()
      },
      {
        id: 'planning-2',
        title: 'Buget Sezonier',
        content: 'Estimare costuri pentru 2024: 45.000 RON/ha (semințe: 8.000, tratamente: 12.000, combustibil: 15.000, altele: 10.000).',
        priority: 'high',
        type: 'seasonal-planning',
        timestamp: new Date().toISOString()
      },
      {
        id: 'planning-3',
        title: 'Previziuni Meteo pe Termen Lung',
        content: 'Primăvara 2024: temperaturi cu 1°C peste medie, precipitații normale. Ideal pentru cultura de porumb.',
        priority: 'medium',
        type: 'seasonal-planning',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateAnalyticsRecommendations = (): AIRecommendation[] => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return [
      {
        id: 'analytics-1',
        title: 'Comparație vs Media Națională',
        content: 'Randamentul tău este cu 18% peste media națională pentru grâu. Costurile sunt însă cu 12% mai mari.',
        priority: 'medium',
        type: 'analytics',
        timestamp: new Date().toISOString()
      },
      {
        id: 'analytics-2',
        title: 'Eficiență Financiară',
        content: 'ROI-ul fermei tale: 23%. Recomandare: optimizează costurile cu tratamentele pentru +5% profit.',
        priority: 'high',
        type: 'analytics',
        timestamp: new Date().toISOString(),
        estimatedSavings: 3500
      },
      {
        id: 'analytics-3',
        title: 'Proiecție 6 Luni',
        content: 'Bazat pe tendințele actuale, profitul estimat pentru următoarele 6 luni: +15% vs perioada similară anul trecut.',
        priority: 'medium',
        type: 'analytics',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateFieldRecommendations = (field: Field): string[] => {
    const recommendations: string[] = [];
    const today = new Date();
    
    // Planting date recommendations
    if (field.planting_date) {
      const plantingDate = new Date(field.planting_date);
      const daysSinceSeeded = Math.floor((today.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceSeeded > 30 && daysSinceSeeded < 60) {
        recommendations.push('Este timpul pentru prima fertilizare cu azot');
      }
    }

    // Crop-specific recommendations
    if (field.crop?.toLowerCase() === 'grau') {
      recommendations.push('Monitorizează apariția bolilor foliare în această perioadă');
    }

    // Weather-based recommendations (simplified since weather property doesn't exist on Field)
    recommendations.push('Verifică prognoza meteo pentru planificarea tratamentelor');

    return recommendations;
  };

  const getFieldStatus = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return { status: 'Necunoscut', description: 'Date indisponibile', color: 'gray' };

    // Calculate status based on planting and harvest dates
    const today = new Date();
    const plantingDate = field.planting_date ? new Date(field.planting_date) : null;
    const harvestDate = field.harvest_date ? new Date(field.harvest_date) : null;

    if (plantingDate && harvestDate) {
      if (today < plantingDate) {
        return { status: 'Pregătire', description: 'În pregătire pentru însămânțare', color: 'blue' };
      } else if (today > harvestDate) {
        return { status: 'Recoltat', description: 'Sezonul s-a încheiat', color: 'gray' };
      } else {
        return { status: 'În dezvoltare', description: 'Cultura se dezvoltă normal', color: 'green' };
      }
    }

    return { status: 'Activ', description: 'În monitorizare', color: 'green' };
  };

  const getFieldProgress = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return { developmentProgress: 0, daysToHarvest: 0 };

    const today = new Date();
    const plantingDate = field.planting_date ? new Date(field.planting_date) : null;
    const harvestDate = field.harvest_date ? new Date(field.harvest_date) : null;

    if (plantingDate && harvestDate) {
      const totalDays = Math.floor((harvestDate.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysPassed = Math.floor((today.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysToHarvest = Math.floor((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const developmentProgress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

      return {
        developmentProgress: Math.round(developmentProgress),
        daysToHarvest: Math.max(0, daysToHarvest)
      };
    }

    return { developmentProgress: 50, daysToHarvest: 60 }; // Default values
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
    getRecommendationsByZone,
    generateFieldRecommendations,
    getFieldStatus,
    getFieldProgress
  };
};
