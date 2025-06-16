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
    return [
      {
        id: 'main-1',
        title: 'Analiză completă fermă',
        content: `Ferma ta are ${fields.length} terenuri active cu o productivitate optimă.`,
        priority: 'medium',
        type: 'general',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateFinancialTips = (): AIRecommendation[] => {
    const totalRevenue = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    
    return [
      {
        id: 'financial-1',
        title: 'Situație financiară',
        content: `Venituri: ${totalRevenue} RON | Cheltuieli: ${totalExpenses} RON`,
        priority: 'medium',
        type: 'financial',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateInventoryRecommendations = (): AIRecommendation[] => {
    return [
      {
        id: 'inventory-1',
        title: 'Stocuri disponibile',
        content: `Monitorizează ${inventory.length} articole din inventar`,
        priority: 'low',
        type: 'inventory',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateDailyRecommendation = (): AIRecommendation[] => {
    const todayTasks = tasks.filter(task => 
      task.due_date === new Date().toISOString().split('T')[0]
    );

    return [
      {
        id: 'daily-1',
        title: 'Recomandarea zilei',
        content: `Ai ${todayTasks.length} sarcini programate pentru astăzi`,
        priority: 'high',
        type: 'general',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateMarketInsights = (): AIRecommendation[] => {
    return [
      {
        id: 'market-1',
        title: 'Tendințe piață',
        content: 'Prețurile cerealelor sunt în creștere cu 5% față de luna trecută',
        priority: 'medium',
        type: 'market',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateSeasonalGuidance = (): AIRecommendation[] => {
    return [
      {
        id: 'seasonal-1',
        title: 'Ghid sezonier',
        content: 'Este timpul optim pentru fertilizarea de primăvară',
        priority: 'medium',
        type: 'seasonal',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateFieldStatus = (): AIRecommendation[] => {
    const currentField = fields[0];
    if (!currentField) return [];

    const daysSincePlanting = currentField.planting_date ? 
      Math.floor((new Date().getTime() - new Date(currentField.planting_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;

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

    const plantingDate = currentField.planting_date ? new Date(currentField.planting_date) : new Date();
    const harvestDate = currentField.harvest_date ? new Date(currentField.harvest_date) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    
    const totalDays = Math.floor((harvestDate.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSincePlanting = Math.floor((new Date().getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysToHarvest = Math.floor((harvestDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 1000));
    
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
    return [
      {
        id: 'soil-1',
        title: 'Calitatea solului',
        content: 'Solul prezintă condiții optime pentru cultură',
        priority: 'low',
        type: 'soil',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateCropRotationRecommendations = (): AIRecommendation[] => {
    return [
      {
        id: 'rotation-1',
        title: 'Rotația culturilor',
        content: 'Recomandăm porumb pentru sezonul următor',
        priority: 'medium',
        type: 'crop-rotation',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateEquipmentMaintenanceRecommendations = (): AIRecommendation[] => {
    return [
      {
        id: 'equipment-1',
        title: 'Mentenanță echipamente',
        content: 'Verifică tractorul înainte de sezonul de lucru',
        priority: 'medium',
        type: 'equipment-maintenance',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateSeasonalPlanningRecommendations = (): AIRecommendation[] => {
    return [
      {
        id: 'planning-1',
        title: 'Planificare sezonieră',
        content: 'Planifică semănatul pentru următoarele 2 săptămâni',
        priority: 'high',
        type: 'seasonal-planning',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const generateAnalyticsRecommendations = (): AIRecommendation[] => {
    return [
      {
        id: 'analytics-1',
        title: 'Analiză performanță',
        content: 'Productivitatea a crescut cu 8% față de anul trecut',
        priority: 'medium',
        type: 'analytics',
        timestamp: new Date().toISOString()
      }
    ];
  };

  // Helper functions for field analysis
  const getFieldStatus = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return { status: 'Necunoscut', description: 'Date indisponibile', color: 'gray' };

    const daysSincePlanting = field.planting_date ? 
      Math.floor((new Date().getTime() - new Date(field.planting_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    if (daysSincePlanting > 120) {
      return { status: 'Maturitate', description: 'Aproape de recoltare', color: 'blue' };
    } else if (daysSincePlanting > 60) {
      return { status: 'Dezvoltare', description: 'Creștere activă', color: 'green' };
    } else if (daysSincePlanting > 0) {
      return { status: 'Tânăr', description: 'Dezvoltare timpurie', color: 'yellow' };
    }

    return { status: 'Pregătit', description: 'Gata pentru plantare', color: 'gray' };
  };

  const getFieldProgress = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return { developmentProgress: 0, daysToHarvest: 0 };

    const plantingDate = field.planting_date ? new Date(field.planting_date) : new Date();
    const harvestDate = field.harvest_date ? new Date(field.harvest_date) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    
    const totalDays = Math.floor((harvestDate.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSincePlanting = Math.floor((new Date().getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysToHarvest = Math.floor((harvestDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 1000));
    
    const developmentProgress = Math.min(100, Math.max(0, (daysSincePlanting / totalDays) * 100));

    return {
      developmentProgress: Math.round(developmentProgress),
      daysToHarvest: Math.max(0, daysToHarvest)
    };
  };

  const getRecommendationsByZone = (zone: keyof AIZoneContent) => {
    return aiContent[zone] || [];
  };

  const refreshRecommendations = () => {
    generateRecommendations();
  };

  useEffect(() => {
    generateRecommendations();
  }, [fields, transactions, inventory, tasks]);

  return {
    aiContent,
    isLoading,
    lastUpdate,
    generateRecommendations,
    getFieldStatus,
    getFieldProgress,
    getRecommendationsByZone,
    refreshRecommendations
  };
};
