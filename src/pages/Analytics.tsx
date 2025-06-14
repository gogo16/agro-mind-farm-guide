
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import AIRecommendationsCard from '@/components/AIRecommendationsCard';
import { useAppContext } from '@/contexts/AppContext';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Lightbulb, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sprout,
  Wrench
} from 'lucide-react';

const Analytics = () => {
  const { fields, transactions } = useAppContext();
  const { getRecommendationsByZone, isLoading } = useAIRecommendations();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const profit = totalIncome - totalExpenses;
  const roi = totalExpenses > 0 ? ((profit / totalExpenses) * 100).toFixed(1) : '0';

  // Mock comparative data
  const nationalAverage = {
    roi: 18.5,
    yieldPerHa: 5.2,
    costPerHa: 4200
  };

  const yourPerformance = {
    roi: parseFloat(roi),
    yieldPerHa: 6.1, // Mock data
    costPerHa: 4700 // Mock data
  };

  const getPerformanceColor = (your: number, average: number, higher_is_better: boolean = true) => {
    const isGood = higher_is_better ? your > average : your < average;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  const getPerformanceIcon = (your: number, average: number, higher_is_better: boolean = true) => {
    const isGood = higher_is_better ? your > average : your < average;
    return isGood ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-blue-800">
              Analize & Previziuni
            </h1>
          </div>
          <p className="text-blue-600 text-lg">
            Perspective AI avansate pentru optimizarea fermei tale
          </p>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">ROI Fermă</p>
                  <p className="text-3xl font-bold text-blue-800">{roi}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className={`text-sm ${getPerformanceColor(yourPerformance.roi, nationalAverage.roi)}`}>
                      vs {nationalAverage.roi}% media
                    </span>
                    {getPerformanceIcon(yourPerformance.roi, nationalAverage.roi)}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Randament/Ha</p>
                  <p className="text-3xl font-bold text-blue-800">{yourPerformance.yieldPerHa}t</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className={`text-sm ${getPerformanceColor(yourPerformance.yieldPerHa, nationalAverage.yieldPerHa)}`}>
                      vs {nationalAverage.yieldPerHa}t media
                    </span>
                    {getPerformanceIcon(yourPerformance.yieldPerHa, nationalAverage.yieldPerHa)}
                  </div>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Costuri/Ha</p>
                  <p className="text-3xl font-bold text-blue-800">{yourPerformance.costPerHa.toLocaleString()}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className={`text-sm ${getPerformanceColor(yourPerformance.costPerHa, nationalAverage.costPerHa, false)}`}>
                      vs {nationalAverage.costPerHa.toLocaleString()} media
                    </span>
                    {getPerformanceIcon(yourPerformance.costPerHa, nationalAverage.costPerHa, false)}
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="analytics">Analize</TabsTrigger>
            <TabsTrigger value="rotation">Rotația Culturilor</TabsTrigger>
            <TabsTrigger value="planning">Planificare</TabsTrigger>
            <TabsTrigger value="maintenance">Mentenanță</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIRecommendationsCard
                zoneId="ai-analytics"
                title="Analize Comparative"
                icon={<BarChart3 className="h-5 w-5" />}
                gradientClass="from-blue-500 to-purple-600"
              />
              
              <Card className="bg-white border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Prognoze 6 Luni</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">+15%</p>
                      <p className="text-sm text-green-700">Profit estimat</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">+8%</p>
                      <p className="text-sm text-blue-700">Randament</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Bazat pe tendințele de piață și condițiile meteo prognozate
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rotation" className="space-y-6">
            <AIRecommendationsCard
              zoneId="ai-crop-rotation"
              title="Optimizare Rotația Culturilor"
              icon={<Sprout className="h-5 w-5" />}
              gradientClass="from-green-500 to-teal-600"
            />
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <AIRecommendationsCard
              zoneId="ai-seasonal-planning"
              title="Planificare Sezonieră"
              icon={<Calendar className="h-5 w-5" />}
              gradientClass="from-orange-500 to-red-600"
            />
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <AIRecommendationsCard
              zoneId="ai-equipment-maintenance"
              title="Mentenanța Utilajelor"
              icon={<Wrench className="h-5 w-5" />}
              gradientClass="from-gray-500 to-slate-600"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
