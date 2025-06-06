import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, TrendingUp, BarChart, Calendar, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const { toast } = useToast();
  const [generatingReports, setGeneratingReports] = useState<Record<number, boolean>>({});

  const generateReport = (reportId: number, reportTitle: string) => {
    setGeneratingReports(prev => ({ ...prev, [reportId]: true }));
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReports(prev => ({ ...prev, [reportId]: false }));
      toast({
        title: "Raport generat cu succes",
        description: `${reportTitle} a fost generat și este gata pentru descărcare.`,
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
      status: 'ready'
    },
    {
      id: 2,
      title: 'Raport Financiar',
      description: 'Analiza cheltuielilor, veniturilor și profitabilității',
      icon: BarChart,
      color: 'text-blue-600',
      lastGenerated: '2024-06-03',
      status: 'ready'
    },
    {
      id: 3,
      title: 'Raport Sezonier',
      description: 'Comparația performanței între sezoane',
      icon: Calendar,
      color: 'text-purple-600',
      lastGenerated: '2024-05-28',
      status: 'ready'
    },
    {
      id: 4,
      title: 'Raport Culturi',
      description: 'Analiza detaliată per tip de cultură',
      icon: Sprout,
      color: 'text-amber-600',
      lastGenerated: '2024-06-01',
      status: 'generating'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Analiza_Productivitate_Iunie_2024.pdf',
      type: 'Productivitate',
      date: '2024-06-05',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Raport_Financiar_Q2_2024.xlsx',
      type: 'Financiar',
      date: '2024-06-03',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Comparatie_Sezoane_2023_2024.pdf',
      type: 'Sezonier',
      date: '2024-05-28',
      size: '3.1 MB'
    }
  ];

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
      value: '87%',
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Parcele analizate',
      value: '12',
      change: '0',
      changeType: 'neutral'
    }
  ];

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
                          onClick={() => generateReport(report.id, report.title)}
                        >
                          {isGenerating ? 'În progres...' : 'Generează'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Custom Report Builder */}
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Constructor Raport Personalizat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Perioada</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>Ultima lună</option>
                      <option>Ultimele 3 luni</option>
                      <option>Ultimul an</option>
                      <option>Personalizat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parcele</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>Toate parcelele</option>
                      <option>Parcela Nord</option>
                      <option>Câmp Sud</option>
                      <option>Livada Est</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tip Date</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>Productivitate</option>
                      <option>Financiar</option>
                      <option>Activități</option>
                      <option>Toate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Generează Raport Personalizat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <div className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Rapoarte Recente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {report.name}
                      </h4>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <Badge variant="secondary">{report.type}</Badge>
                      <span>{report.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{report.size}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
              <CardHeader>
                <CardTitle>🤖 AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Tendință Pozitivă</p>
                  <p className="text-xs">
                    Productivitatea a crescut cu 15% față de anul trecut datorită optimizării irigației.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Recomandare</p>
                  <p className="text-xs">
                    Considerați extinderea culturii de floarea-soarelui pe baza marjei de profit ridicate.
                  </p>
                </div>
                <Button size="sm" className="w-full bg-white text-purple-600 hover:bg-gray-100">
                  Vezi toate insights-urile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
