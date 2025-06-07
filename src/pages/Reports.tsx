
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, TrendingUp, BarChart, Calendar, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const Reports = () => {
  const { toast } = useToast();
  const { generateReport, fields, tasks, transactions } = useAppContext();
  const [generatingReports, setGeneratingReports] = useState<Record<number, boolean>>({});
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [reportType, setReportType] = useState<string>('');

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

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const profit = totalIncome - totalExpenses;
  const efficiency = totalExpenses > 0 ? ((profit / totalExpenses) * 100) : 0;

  const quickStats = [
    {
      label: 'Rapoarte generate luna aceasta',
      value: '12',
      change: '+3',
      changeType: 'positive'
    },
    {
      label: 'Productivitate medie (t/ha)',
      value: '8.5',
      change: '+1.2',
      changeType: 'positive'
    },
    {
      label: 'Eficiență costuri (%)',
      value: `${efficiency.toFixed(0)}%`,
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Parcele analizate',
      value: fields.length.toString(),
      change: '0',
      changeType: 'neutral'
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
                <p><strong>Marjă profit:</strong> {generatedReport.profitMargin}%</p>
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
              <div>
                <p><strong>Recomandări sezoniere:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  {generatedReport.seasonalRecommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Rapoarte și Analize</h1>
          <p className="text-green-600">Generează și accesează rapoarte detaliate despre ferma ta</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardContent className="p-6">
                <p className="text-sm text-green-600 font-medium mb-1">{stat.label}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-green-800">{stat.value}</p>
                  {stat.change !== '0' && (
                    <Badge className={`text-xs ${
                      stat.changeType === 'positive' ? 'bg-green-100 text-green-800' :
                      stat.changeType === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {stat.change}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generate Reports */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Generează Rapoarte Noi</CardTitle>
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
                          <p className="text-xs text-gray-500 mt-1">
                            Ultima generare: {report.lastGenerated}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isGenerating ? (
                          <Badge className="bg-amber-100 text-amber-800">Se generează...</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">Disponibil</Badge>
                        )}
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isGenerating}
                          onClick={() => generateReportHandler(report.id, report.type, report.title)}
                        >
                          {isGenerating ? 'În progres...' : 'Generează'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Generated Report Preview */}
          <div className="space-y-6">
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
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Descarcă Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Insights */}
            <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
              <CardHeader>
                <CardTitle>🤖 AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Tendință Pozitivă</p>
                  <p className="text-xs">
                    Profitul a crescut cu {efficiency.toFixed(0)}% față de luna trecută datorită optimizării costurilor.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Recomandare</p>
                  <p className="text-xs">
                    Considerați extinderea terenurilor productive pe baza marjei de profit ridicate.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
