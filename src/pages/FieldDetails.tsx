
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Sprout, Calendar, ArrowLeft, Edit, History, Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FieldDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - în aplicația reală ar veni din API
  const fieldData = {
    1: {
      id: 1,
      name: 'Parcela Nord',
      area: '12.5 ha',
      crop: 'Grâu',
      variety: 'Glosa',
      plantingDate: '2024-10-15',
      status: 'healthy',
      coords: '45.7489, 21.2087',
      soilType: 'Cernoziom',
      lastActivity: 'Fertilizare',
      nextTask: 'Irigare'
    }
  };

  const field = fieldData[id as keyof typeof fieldData];

  const activities = [
    {
      id: 1,
      date: '2024-06-01',
      activity: 'Fertilizare NPK',
      details: 'Aplicat 300 kg/ha îngrășământ complex NPK 16:16:16',
      cost: 1800,
      weather: 'Însorit, 22°C'
    },
    {
      id: 2,
      date: '2024-05-20',
      activity: 'Tratament herbicid',
      details: 'Aplicat herbicid selectiv pentru controlul buruienilor',
      cost: 450,
      weather: 'Înnorat, vânt slab'
    },
    {
      id: 3,
      date: '2024-05-10',
      activity: 'Irigare',
      details: 'Irigare prin aspersie - 35mm apă',
      cost: 280,
      weather: 'Uscat, 28°C'
    }
  ];

  const soilAnalysis = {
    pH: 7.2,
    nitrogen: 85,
    phosphorus: 45,
    potassium: 120,
    organicMatter: 3.8,
    lastAnalysis: '2024-03-15'
  };

  const financialData = {
    totalCosts: 15600,
    expectedRevenue: 24000,
    projectedProfit: 8400,
    costPerHa: 1248
  };

  if (!field) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Parcela nu a fost găsită</h1>
            <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
              Înapoi la Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-green-700 hover:text-green-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-green-800">{field.name}</h1>
              <p className="text-green-600">{field.crop} • {field.area}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Adaugă poză
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Edit className="h-4 w-4 mr-2" />
              Editează
            </Button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sprout className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Cultură</span>
              </div>
              <p className="text-lg font-bold text-green-800">{field.crop}</p>
              <p className="text-sm text-gray-600">{field.variety}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Suprafață</span>
              </div>
              <p className="text-lg font-bold text-green-800">{field.area}</p>
              <p className="text-sm text-gray-600">{field.coords}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Plantat</span>
              </div>
              <p className="text-lg font-bold text-green-800">{field.plantingDate}</p>
              <p className="text-sm text-gray-600">Acum 8 luni</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Status</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Sănătos</Badge>
              <p className="text-sm text-gray-600 mt-1">Dezvoltare normală</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Prezentare</TabsTrigger>
            <TabsTrigger value="activities">Activități</TabsTrigger>
            <TabsTrigger value="soil">Sol</TabsTrigger>
            <TabsTrigger value="financial">Financiar</TabsTrigger>
            <TabsTrigger value="weather">Meteo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Informații Generale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tip sol</p>
                      <p className="font-medium">{soilAnalysis.pH ? 'Cernoziom' : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">pH sol</p>
                      <p className="font-medium">{soilAnalysis.pH}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ultima activitate</p>
                      <p className="font-medium">{field.lastActivity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Următoarea sarcină</p>
                      <p className="font-medium text-green-600">{field.nextTask}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Progres Sezon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progres dezvoltare</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Zile până la recoltare</span>
                        <span>45 zile</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-800 flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Istoric Activități</span>
                </CardTitle>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Adaugă activitate
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                      <Badge variant="secondary" className="text-xs">{activity.date}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">🌤️ {activity.weather}</span>
                      <span className="font-medium text-green-600">{activity.cost} RON</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-green-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Costuri totale</p>
                  <p className="text-xl font-bold text-red-600">{financialData.totalCosts.toLocaleString()} RON</p>
                  <p className="text-xs text-gray-500">{financialData.costPerHa} RON/ha</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Venituri estimate</p>
                  <p className="text-xl font-bold text-blue-600">{financialData.expectedRevenue.toLocaleString()} RON</p>
                  <p className="text-xs text-gray-500">La preț curent</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Profit proiectat</p>
                  <p className="text-xl font-bold text-green-600">{financialData.projectedProfit.toLocaleString()} RON</p>
                  <p className="text-xs text-gray-500">Marjă 35%</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">ROI estimat</p>
                  <p className="text-xl font-bold text-purple-600">54%</p>
                  <p className="text-xs text-gray-500">Return on Investment</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FieldDetails;
