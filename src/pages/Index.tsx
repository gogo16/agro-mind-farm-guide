
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeatherWidget from '@/components/WeatherWidget';
import FieldsOverview from '@/components/FieldsOverview';
import TasksWidget from '@/components/TasksWidget';
import AIAssistant from '@/components/AIAssistant';
import Navigation from '@/components/Navigation';
import { MapPin, Sprout, Calendar, DollarSign, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
                  <p className="text-3xl font-bold text-green-800">12</p>
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
                  <p className="text-3xl font-bold text-green-800">8</p>
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
                  <p className="text-3xl font-bold text-green-800">5</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Buget Luna</p>
                  <p className="text-3xl font-bold text-green-800">15.2K</p>
                  <p className="text-xs text-green-500">RON</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Prezentare</TabsTrigger>
            <TabsTrigger value="fields">Terenuri</TabsTrigger>
            <TabsTrigger value="tasks">Sarcini</TabsTrigger>
            <TabsTrigger value="ai">AI Asistent</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
