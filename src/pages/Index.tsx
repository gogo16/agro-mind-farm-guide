
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import FieldsOverview from '@/components/FieldsOverview';
import TasksWidget from '@/components/TasksWidget';
import WeatherWidget from '@/components/WeatherWidget';
import AIRecommendationsCard from '@/components/AIRecommendationsCard';
import NotificationCenter from '@/components/NotificationCenter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const { tasks, fields, notifications, markNotificationAsRead } = useAppContext();
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
  const todayTasks = tasks.filter(task => 
    task.date === today || task.due_date === today
  );
  
  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.due_date || task.date);
    const currentDate = new Date();
    const daysDiff = Math.ceil((taskDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    return daysDiff > 0 && daysDiff <= 7;
  }).slice(0, 3);

  // Calculate total area
  const totalArea = fields.reduce((sum, field) => sum + Number(field.size), 0);

  // Get recent notifications  
  const recentNotifications = notifications.filter(n => !n.read).slice(0, 3);

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
          {/* Tasks for Today */}
          <Card className="bg-white border-green-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-green-800">Sarcini pentru astăzi</CardTitle>
            </CardHeader>
            <CardContent>
              {todayTasks.length > 0 ? (
                <div className="space-y-4">
                  {todayTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-green-800">{task.title}</h4>
                        <p className="text-sm text-green-600">{task.field_name}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-green-600">{task.time || '08:00'}</span>
                        <div className={`inline-block px-2 py-1 rounded text-xs ml-2 ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority === 'high' ? 'Urgent' : 
                           task.priority === 'medium' ? 'Mediu' : 'Scăzut'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-600">Nu există sarcini programate pentru astăzi</p>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <NotificationCenter onNotificationClick={handleNotificationClick} />
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TasksWidget />
          <AIRecommendationsCard />
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
