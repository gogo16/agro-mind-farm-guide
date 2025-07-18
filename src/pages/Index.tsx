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
import { useInventory } from '@/hooks/useInventory';
import { useFields } from '@/hooks/useFields';
import { MapPin, Sprout, Calendar, Package, Sun, Snowflake, Leaf, CloudRain, TrendingUp, BarChart, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    tasks,
    transactions,
    generateReport,
    currentSeason
  } = useAppContext();

  const { inventory } = useInventory();
  const { fields } = useFields();
  const { toast } = useToast();
  
  const [seasonalBackground, setSeasonalBackground] = useState('');
  const [seasonalTips, setSeasonalTips] = useState<string[]>([]);
  const [seasonIcon, setSeasonIcon] = useState<React.ReactNode>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [reportType, setReportType] = useState<string>('');
  const [generatingReports, setGeneratingReports] = useState<Record<number, boolean>>({});

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => {
    const taskDate = t.dueDate || t.date;
    return taskDate === today && t.status === 'pending';
  }).length;
  const totalTasks = tasks.length;
  const totalArea = fields.reduce((sum, field) => sum + field.suprafata, 0);
  const profit = totalIncome - totalExpenses;
  const efficiency = totalExpenses > 0 ? profit / totalExpenses * 100 : 0;
  const plantedCrops = fields.filter(field => field.cultura && field.cultura.trim() !== '').length;

  const inventoryItemsCount = inventory ? inventory.length : 0;

  // Actualizăm calculul pentru inventarul din Supabase
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
    setGeneratingReports(prev => ({
      ...prev,
      [reportId]: true
    }));
    setTimeout(() => {
      const report = generateReport(type);
      setGeneratedReport(report);
      setReportType(type);
      setGeneratingReports(prev => ({
        ...prev,
        [reportId]: false
      }));
      toast({
        title: "Raport generat cu succes",
        description: `${reportTitle} a fost generat și este gata pentru vizualizare.`
      });
    }, 2000);
  };

  const reportTypes = [{
    id: 1,
    title: 'Raport Productivitate',
    description: 'Analiza randamentului pe hectar pentru fiecare parcelă',
    icon: TrendingUp,
    color: 'text-green-600',
    lastGenerated: '2024-06-05',
    status: 'ready',
    type: 'productivity'
  }, {
    id: 2,
    title: 'Raport Financiar',
    description: 'Analiza cheltuielilor, veniturilor și profitabilității',
    icon: BarChart,
    color: 'text-blue-600',
    lastGenerated: '2024-06-03',
    status: 'ready',
    type: 'financial'
  }, {
    id: 3,
    title: 'Raport Sezonier',
    description: 'Comparația performanței între sezoane',
    icon: Calendar,
    color: 'text-purple-600',
    lastGenerated: '2024-05-28',
    status: 'ready',
    type: 'seasonal'
  }];

  const renderGeneratedReport = () => {
    if (!generatedReport || !reportType) return null;
    switch (reportType) {
      case 'productivity':
        return <div className="space-y-4">
            <h3 className="text-lg font-semibold">Raport Productivitate</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Total terenuri:</strong> {generatedReport.totalFields || fields.length}</p>
                <p><strong>Suprafață totală:</strong> {totalArea.toFixed(1)} ha</p>
              </div>
              <div>
                <p><strong>Productivitate medie:</strong> {generatedReport.avgProductivity || 0} t/ha</p>
                <p><strong>Cel mai productiv teren:</strong> {generatedReport.topPerformingField?.nume_teren || 'N/A'}</p>
              </div>
            </div>
          </div>;
      case 'financial':
        return <div className="space-y-4">
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
          </div>;
      case 'seasonal':
        return <div className="space-y-4">
            <h3 className="text-lg font-semibold">Raport Sezonier</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Sezonul curent:</strong> {generatedReport.currentSeason}</p>
              <p><strong>Sarcini completate:</strong> {generatedReport.completedTasks}</p>
              <p><strong>Sarcini pendente:</strong> {generatedReport.pendingTasks}</p>
            </div>
          </div>;
      default:
        return null;
    }
  };

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
                    {reportTypes.map(report => {
                    const IconComponent = report.icon;
                    const isGenerating = generatingReports[report.id];
                    return <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gray-100 p-3 rounded-lg">
                              <IconComponent className={`h-6 w-6 ${report.color}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{report.title}</h4>
                              <p className="text-sm text-gray-600">{report.description}</p>
                            </div>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={isGenerating} onClick={() => generateReportHandler(report.id, report.type, report.title)}>
                            {isGenerating ? 'În progres...' : 'Generează'}
                          </Button>
                        </div>;
                  })}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <TasksWidget />
                
                {/* Generated Report Preview */}
                {generatedReport && <Card className="bg-white border-green-200">
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
                  </Card>}

                {/* TODO: Reconnect AI Recommendations */}
                <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
                  <CardHeader>
                    <CardTitle>🤖 Perspective AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-white/80">Recomandările AI vor fi disponibile în curând</p>
                      <p className="text-xs text-white/60 mt-2">În proces de reconectare la noua structură</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
                  <CardHeader>
                    <CardTitle>💡 Recomandarea Zilei</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-white/80">Verificarea echipamentelor este esențială în această perioadă</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <TasksWidget />
          </TabsContent>

          <TabsContent value="seasonal">
            <SeasonalGuidanceAI />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default Index;
