
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeatherWidget from '@/components/WeatherWidget';
import FieldsOverview from '@/components/FieldsOverview';
import TasksWidget from '@/components/TasksWidget';
import AIAssistant from '@/components/AIAssistant';
import SeasonalGuidanceAI from '@/components/SeasonalGuidanceAI';
import Navigation from '@/components/Navigation';
import { useAppContext } from '@/contexts/AppContext';
import { MapPin, Sprout, Calendar, DollarSign } from 'lucide-react';

const Index = () => {
  const { fields, tasks, transactions } = useAppContext();
  const [currentSeason, setCurrentSeason] = useState('');
  const [seasonalBackground, setSeasonalBackground] = useState('');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const totalArea = fields.reduce((sum, field) => sum + field.size, 0);

  useEffect(() => {
    const getCurrentSeason = () => {
      const month = new Date().getMonth();
      if (month >= 2 && month <= 4) return 'spring';
      if (month >= 5 && month <= 7) return 'summer';
      if (month >= 8 && month <= 10) return 'autumn';
      return 'winter';
    };

    const season = getCurrentSeason();
    setCurrentSeason(season);

    const backgrounds = {
      spring: 'from-green-50 to-emerald-100',
      summer: 'from-yellow-50 to-amber-100',
      autumn: 'from-orange-50 to-red-100',
      winter: 'from-blue-50 to-cyan-100'
    };

    setSeasonalBackground(backgrounds[season as keyof typeof backgrounds] || 'from-green-50 to-emerald-100');
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${seasonalBackground}`}>
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Bună ziua! 👋
          </h1>
          <p className="text-green-600 text-lg">
            Gestionează-ți ferma inteligent cu AgroMind
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Terenuri Active</p>
                  <p className="text-3xl font-bold text-green-800">{fields.length}</p>
                  <p className="text-xs text-green-500">{totalArea.toFixed(1)} ha total</p>
                </div>
                <MapPin className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Culturi Plantate</p>
                  <p className="text-3xl font-bold text-green-800">{fields.filter(f => f.status === 'Plantat').length}</p>
                </div>
                <Sprout className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Sarcini Pendente</p>
                  <p className="text-3xl font-bold text-green-800">{pendingTasks}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Profit Net</p>
                  <p className="text-3xl font-bold text-green-800">{((totalIncome - totalExpenses) / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-green-500">RON</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[500px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Prezentare</TabsTrigger>
            <TabsTrigger value="fields">Terenuri</TabsTrigger>
            <TabsTrigger value="tasks">Sarcini</TabsTrigger>
            <TabsTrigger value="ai">AI Asistent</TabsTrigger>
            <TabsTrigger value="seasonal">AI Sezonier</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <WeatherWidget />
                <FieldsOverview />
              </div>
              <div className="space-y-6">
                <TasksWidget />
                <AIAssistant />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fields">
            <FieldsOverview detailed={true} />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksWidget detailed={true} />
          </TabsContent>

          <TabsContent value="ai">
            <AIAssistant detailed={true} />
          </TabsContent>

          <TabsContent value="seasonal">
            <SeasonalGuidanceAI />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
