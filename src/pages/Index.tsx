
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import FieldCard from '@/components/FieldCard';
import TasksWidget from '@/components/TasksWidget';
import WeatherWidget from '@/components/WeatherWidget';
import TaskBadges from '@/components/TaskBadges';
import NotificationCenter from '@/components/NotificationCenter';
import AIInsights from '@/components/AIInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const Index = () => {
  const { 
    fields, 
    tasks, 
    transactions, 
    generateReport, 
    currentSeason 
  } = useAppContext();

  // Calculate dashboard statistics
  const totalFields = fields.length;
  const totalRevenue = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const profitLoss = totalRevenue - totalExpenses;
  
  const urgentTasks = tasks.filter(task => {
    const taskDate = task.due_date || task.date;
    return taskDate === new Date().toISOString().split('T')[0] && task.priority === 'high';
  }).length;

  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Dashboard Principal</h1>
          <p className="text-green-600">Bun venit înapoi! Iată o privire de ansamblu asupra fermei tale.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terenuri Active</p>
                  <p className="text-2xl font-bold text-green-800">{totalFields}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit/Pierdere</p>
                  <p className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profitLoss >= 0 ? '+' : ''}{profitLoss.toLocaleString()} RON
                  </p>
                </div>
                <TrendingUp className={`h-8 w-8 ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sarcini Urgente</p>
                  <p className="text-2xl font-bold text-red-600">{urgentTasks}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sarcini Completate</p>
                  <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Fields and Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fields Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-800">Terenurile Tale</CardTitle>
                <Badge variant="secondary">{totalFields} terenuri</Badge>
              </CardHeader>
              <CardContent>
                {fields.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.slice(0, 4).map((field) => (
                      <FieldCard key={field.id} field={field} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>Nu ai terenuri adăugate încă</p>
                    <p className="text-sm">Începe prin a adăuga primul teren</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <AIInsights />
          </div>

          {/* Right Column - Widgets */}
          <div className="space-y-6">
            {/* Current Season */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Sezon Curent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                    {currentSeason}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Perioada activă de lucru agricol
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Task Badges */}
            <TaskBadges />

            {/* Tasks Widget */}
            <TasksWidget />

            {/* Weather Widget */}
            <WeatherWidget />

            {/* Notifications */}
            <NotificationCenter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
