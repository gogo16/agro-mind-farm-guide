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
import { MapPin, Sprout, Calendar, DollarSign, Sun, Snowflake, Leaf, CloudRain } from 'lucide-react';
const Index = () => {
  const {
    fields,
    tasks,
    transactions,
    currentSeason
  } = useAppContext();
  const [seasonalBackground, setSeasonalBackground] = useState('');
  const [seasonalTips, setSeasonalTips] = useState<string[]>([]);
  const [seasonIcon, setSeasonIcon] = useState<React.ReactNode>(null);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const totalArea = fields.reduce((sum, field) => sum + field.size, 0);
  useEffect(() => {
    const month = new Date().getMonth();
    let season = '';
    let background = '';
    let tips: string[] = [];
    let icon: React.ReactNode = null;
    if (month >= 2 && month <= 4) {
      season = 'Primăvară';
      background = 'from-green-50 to-emerald-100';
      tips = ['Pregătirea solului pentru însămânțare', 'Verificarea și întreținerea utilajelor', 'Aplicarea îngrășămintelor de bază', 'Monitorizarea temperaturilor pentru însămânțare'];
      icon = <Leaf className="h-6 w-6 text-green-600" />;
    } else if (month >= 5 && month <= 7) {
      season = 'Vară';
      background = 'from-yellow-50 to-amber-100';
      tips = ['Irigarea regulată a culturilor', 'Monitorizarea și combaterea dăunătorilor', 'Aplicarea tratamentelor foliare', 'Pregătirea pentru recoltare'];
      icon = <Sun className="h-6 w-6 text-yellow-600" />;
    } else if (month >= 8 && month <= 10) {
      season = 'Toamnă';
      background = 'from-orange-50 to-red-100';
      tips = ['Recoltarea culturilor mature', 'Pregătirea terenului pentru culturile de toamnă', 'Depozitarea și conservarea recoltei', 'Planificarea rotației culturilor'];
      icon = <CloudRain className="h-6 w-6 text-orange-600" />;
    } else {
      season = 'Iarnă';
      background = 'from-blue-50 to-cyan-100';
      tips = ['Întreținerea și repararea utilajelor', 'Planificarea culturilor pentru anul următor', 'Gestionarea stocurilor și inventarului', 'Pregătirea documentelor și rapoartelor'];
      icon = <Snowflake className="h-6 w-6 text-blue-600" />;
    }
    setSeasonalBackground(background);
    setSeasonalTips(tips);
    setSeasonIcon(icon);
  }, []);
  return <div className={`min-h-screen bg-gradient-to-br ${seasonalBackground}`}>
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            {seasonIcon}
            <h1 className="text-4xl font-bold text-green-800">
              Bună ziua! 👋
            </h1>
          </div>
          <p className="text-green-600 text-lg mb-2">
            Gestionează-ți ferma inteligent cu AgroMind
          </p>
          <div className="flex items-center space-x-2">
            
            
          </div>
        </div>

        {/* Seasonal Tips */}
        

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
    </div>;
};
export default Index;