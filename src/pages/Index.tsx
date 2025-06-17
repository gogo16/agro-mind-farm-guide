
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import FieldsOverview from '@/components/FieldsOverview';
import TasksWidget from '@/components/TasksWidget';
import WeatherWidget from '@/components/WeatherWidget';
import NotificationCenter from '@/components/NotificationCenter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const {
    tasks,
    fields,
    notifications,
    markNotificationAsRead
  } = useAppContext();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bună dimineața');
    } else if (hour < 17) {
      setGreeting('Bună ziua');
    } else {
      setGreeting('Bună seara');
    }
  }, []);

  // Get today's tasks and upcoming ones
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.date === today || task.due_date === today);
  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.due_date || task.date);
    const currentDate = new Date();
    const daysDiff = Math.ceil((taskDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    return daysDiff > 0 && daysDiff <= 7;
  }).slice(0, 3);

  // Calculate total area
  const totalArea = fields.reduce((sum, field) => sum + Number(field.size), 0);

  // Get recent notifications  
  const recentNotifications = notifications.filter(n => !n.is_read).slice(0, 3);

  // Quick stats
  const stats = {
    totalFields: fields.length,
    totalArea: totalArea,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length
  };

  const handleNotificationClick = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    toast({
      title: "Notificare citită",
      description: "Notificarea a fost marcată ca citită."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            {greeting}! 👋
          </h1>
          <p className="text-green-600">
            Aici este prezentarea generală a fermei tale
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-800">{stats.totalFields}</div>
              <p className="text-sm text-green-600">Parcele totale</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-800">{totalArea.toFixed(1)} ha</div>
              <p className="text-sm text-green-600">Suprafață totală</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-800">{stats.pendingTasks}</div>
              <p className="text-sm text-green-600">Sarcini în așteptare</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-800">{stats.completedTasks}</div>
              <p className="text-sm text-green-600">Sarcini completate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Notifications */}
          <NotificationCenter />
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TasksWidget />
          
          {/* Simple Tips Card instead of AI */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
            <CardHeader>
              <CardTitle>💡 Sfaturi Agricole</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm font-medium mb-1">Sezon de iarnă</p>
                <p className="text-xs">Pregătește planul de însămânțare pentru primăvara viitoare.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm font-medium mb-1">Monitorizare utilaje</p>
                <p className="text-xs">Verifică și întreține utilajele agricole în perioada de repaus.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather and Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WeatherWidget />
          <div className="lg:col-span-2">
            <FieldsOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
