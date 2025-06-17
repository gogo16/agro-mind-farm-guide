import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import WeatherWidget from '@/components/WeatherWidget';
import FieldsOverview from '@/components/FieldsOverview';
import TasksWidget from '@/components/TasksWidget';
import AIAssistant from '@/components/AIAssistant';
import SeasonalGuidanceAI from '@/components/SeasonalGuidanceAI';
import Navigation from '@/components/Navigation';
import { useAppContext } from '@/contexts/AppContext';
import { MapPin, Sprout, Calendar, Package, Sun, Snowflake, Leaf, CloudRain, TrendingUp, BarChart, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';

const Index = () => {
  const {
    fields,
    tasks,
    transactions,
    generateReport,
    currentSeason,
    inventory
  } = useAppContext();
  const { toast } = useToast();
  const [seasonalBackground, setSeasonalBackground] = useState('');
  const [seasonalTips, setSeasonalTips] = useState<string[]>([]);
  const [seasonIcon, setSeasonIcon] = useState<React.ReactNode>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [reportType, setReportType] = useState<string>('');
  const [generatingReports, setGeneratingReports] = useState<Record<number, boolean>>({});
  
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  // Calculez sarcinile de astăzi și totalul de sarcini
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => {
    const taskDate = t.dueDate || t.date;
    return taskDate === today && t.status === 'pending';
  }).length;
  const totalTasks = tasks.length;
  
  const totalArea = fields.reduce((sum, field) => sum + field.size, 0);
  const profit = totalIncome - totalExpenses;
  const efficiency = totalExpenses > 0 ? ((profit / totalExpenses) * 100) : 0;
  
  // Calculează numărul de culturi plantate (terenuri care au o cultură introdusă și diferită de 'Necunoscută')
  const plantedCrops = fields.filter(field => 
    field.crop && 
    field.crop.trim() !== '' && 
    field.crop !== 'Necunoscută'
  ).length;

  // Calculează statisticile inventarului - numărul de elemente (nu suma cantităților)
  const inventoryItemsCount = inventory ? inventory.length : 0;
  
  // Simulez schimbarea față de luna precedentă (în realitate ar trebui să compar cu datele de luna trecută)
  const monthlyInventoryChange = Math.floor(Math.random() * 20) - 10; // Simulare: -10 la +10 articole
  
  const { getRecommendationsByZone, isLoading: aiLoading, refreshRecommendations } = useAIRecommendations();
  
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

  const generateReportHandler = (reportId: number, type: string, reportTitle: string) => {
    setGeneratingReports(prev => ({ ...prev, [reportId]: true }));
    
    setTimeout(() => {
      const report = generateReport(type);
      setGeneratedReport(report);
      setReportType(type);
      setGeneratingReports(prev => ({ ...prev, [reportId]: false }));
      toast({
        title: "Raport generat cu succes",
        description: `${reportTitle} a fost generat și este gata pentru vizualizare.`,
      });
    }, 2000);
  };

  const reportTypes = [
    {
      id: 1,
      title: 'Raport Productivitate',
      description: 'Analiza randamentului pe hectar pentru fiecare parcelă',
      icon: TrendingUp,
      color: 'text-green-600',
      lastGenerated: '2024-06-05',
      status: 'ready',
      type: 'productivity'
    },
    {
      id: 2,
      title: 'Raport Financiar',
      description: 'Analiza cheltuielilor, veniturilor și profitabilității',
      icon: BarChart,
      color: 'text-blue-600',
      lastGenerated: '2024-06-03',
      status: 'ready',
      type: 'financial'
    },
    {
      id: 3,
      title: 'Raport Sezonier',
      description: 'Comparația performanței între sezoane',
      icon: Calendar,
      color: 'text-purple-600',
      lastGenerated: '2024-05-28',
      status: 'ready',
      type: 'seasonal'
    }
  ];

  const renderGeneratedReport = () => {
    if (!generatedReport || !reportType) return null;

    switch (reportType) {
      case 'productivity':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Raport Productivitate</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Total terenuri:</strong> {generatedReport.totalFields}</p>
                <p><strong>Suprafață totală:</strong> {generatedReport.totalArea.toFixed(1)} ha</p>
              </div>
              <div>
                <p><strong>Productivitate medie:</strong> {generatedReport.avgProductivity} t/ha</p>
                <p><strong>Cel mai productiv teren:</strong> {generatedReport.topPerformingField?.name}</p>
              </div>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Raport Financiar</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Venituri totale:</strong> {generatedReport.totalIncome.toLocaleString()} RON</p>
                <p><strong>Cheltuieli totale:</strong> {generatedReport.totalExpenses.toLocaleString()} RON</p>
              </div>
              <div>
                <p><strong>Profit net:</strong> {generatedReport.profit.toLocaleString()} RON</p>
                <p><strong>ROI:</strong> {generatedReport.roi}%</p>
              </div>
            </div>
          </div>
        );
      case 'seasonal':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Raport Sezonier</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Sezonul curent:</strong> {generatedReport.currentSeason}</p>
              <p><strong>Sarcini completate:</strong> {generatedReport.completedTasks}</p>
              <p><strong>Sarcini pendente:</strong> {generatedReport.pendingTasks}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderAIRecommendations = (zoneId: string, recommendations: any[]) => {
    if (aiLoading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/15 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white/10 rounded-lg p-3 relative">
            {rec.isNew && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
            )}
            <p className="text-sm font-medium mb-1">{rec.title}</p>
            <p className="text-xs">{rec.content}</p>
            {rec.priority === 'high' && (
              <div className="mt-2">
                <span className="text-xs bg-red-500/20 text-red-100 px-2 py-1 rounded">Prioritate înaltă</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return <div className={`min-h-screen bg-gradient-to-br ${seasonalBackground}`}>
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header without AI refresh button */}
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
                  <p className="text-3xl font-bold text-green-800">{plantedCrops}</p>
                  <p className="text-xs text-green-500">terenuri cu cultură</p>
                </div>
                <Sprout className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Sarcini Astăzi</p>
                  <p className="text-3xl font-bold text-green-800">{todayTasks}</p>
                  <p className="text-xs text-green-500">{totalTasks} total înregistrate</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Stoc Inventar</p>
                  <p className="text-3xl font-bold text-green-800">{inventoryItemsCount}</p>
                  <p className="text-xs text-green-500">
                    articole în inventar
                    {monthlyInventoryChange !== 0 && (
                      <span className={`ml-1 ${monthlyInventoryChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {monthlyInventoryChange > 0 ? '+' : ''}{monthlyInventoryChange}
                      </span>
                    )}
                  </p>
                </div>
                <Package className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[350px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Prezentare</TabsTrigger>
            <TabsTrigger value="tasks">Sarcini</TabsTrigger>
            <TabsTrigger value="seasonal">AI Sezonier</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <WeatherWidget />
                <FieldsOverview />
                
                {/* Reports Section */}
                <Card className="bg-white border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">Rapoarte și Analize</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reportTypes.map((report) => {
                      const IconComponent = report.icon;
                      const isGenerating = generatingReports[report.id];
                      return (
                        <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gray-100 p-3 rounded-lg">
                              <IconComponent className={`h-6 w-6 ${report.color}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{report.title}</h4>
                              <p className="text-sm text-gray-600">{report.description}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isGenerating}
                            onClick={() => generateReportHandler(report.id, report.type, report.title)}
                          >
                            {isGenerating ? 'În progres...' : 'Generează'}
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <TasksWidget />
                
                {/* Generated Report Preview */}
                {generatedReport && (
                  <Card className="bg-white border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800">Previzualizare Raport</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderGeneratedReport()}
                      <div className="mt-4 space-y-2">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Download className="h-4 w-4 mr-2" />
                          Descarcă PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Main Insights */}
                <Card 
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0"
                  data-ai-zone="ai-main-insights"
                >
                  <CardHeader>
                    <CardTitle>🤖 Perspective AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderAIRecommendations('ai-main-insights', getRecommendationsByZone('ai-main-insights'))}
                  </CardContent>
                </Card>

                {/* AI Daily Recommendation */}
                <Card 
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0"
                  data-ai-zone="ai-daily-recommendation"
                >
                  <CardHeader>
                    <CardTitle>💡 Recomandarea Zilei</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderAIRecommendations('ai-daily-recommendation', getRecommendationsByZone('ai-daily-recommendation'))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <TasksWidget />
          </TabsContent>

          <TabsContent value="seasonal" data-ai-zone="ai-seasonal-guidance">
            <SeasonalGuidanceAI />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};

export default Index;
