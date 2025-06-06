
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Planning = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tasks = [
    {
      id: 1,
      title: 'Irigarea Parcelei Nord',
      field: 'Parcela Nord',
      priority: 'high',
      date: '2024-06-06',
      time: '06:00',
      status: 'pending',
      aiSuggested: true,
      description: 'Condițiile meteo sunt ideale pentru irigare dimineața devreme.',
      estimatedDuration: '2 ore'
    },
    {
      id: 2,
      title: 'Fertilizare Câmp Sud',
      field: 'Câmp Sud',
      priority: 'medium',
      date: '2024-06-07',
      time: '14:00',
      status: 'pending',
      aiSuggested: true,
      description: 'Aplicare îngrășământ NPK conform planificării.',
      estimatedDuration: '3 ore'
    },
    {
      id: 3,
      title: 'Monitorizare dăunători',
      field: 'Livada Est',
      priority: 'low',
      date: '2024-06-08',
      time: '10:00',
      status: 'completed',
      aiSuggested: false,
      description: 'Verificare vizuală a semnelor de infestare.',
      estimatedDuration: '1 oră'
    },
    {
      id: 4,
      title: 'Recoltare porumb',
      field: 'Câmp Sud',
      priority: 'high',
      date: '2024-06-10',
      time: '08:00',
      status: 'pending',
      aiSuggested: true,
      description: 'Umiditatea grâului a atins nivelul optim pentru recoltare.',
      estimatedDuration: '6 ore'
    }
  ];

  const seasons = [
    {
      name: 'Primăvara',
      tasks: ['Pregătirea solului', 'Semănat', 'Fertilizare de bază'],
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Vara',
      tasks: ['Irigare', 'Tratamente fitosanitare', 'Fertilizare foliară'],
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      name: 'Toamna',
      tasks: ['Recoltare', 'Lucru sol după recoltare', 'Semănat culturi de toamnă'],
      color: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Iarna',
      tasks: ['Întreținere echipamente', 'Planificare sezon următor', 'Administrare'],
      color: 'bg-blue-100 text-blue-800'
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Urgent</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Mediu</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Scăzut</Badge>;
      default:
        return <Badge variant="secondary">Necunoscut</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Planificare Activități</h1>
          <p className="text-green-600">Organizează-ți eficient activitățile agricole</p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="seasonal">Sezonier</TabsTrigger>
            <TabsTrigger value="ai-planner">AI Planificare</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Widget */}
              <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Iunie 2024</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => (
                      <div key={day} className="p-2 font-medium text-gray-600">{day}</div>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => (
                      <div 
                        key={i + 1}
                        className={`p-2 cursor-pointer hover:bg-green-100 rounded ${
                          i + 1 === 6 ? 'bg-green-600 text-white' :
                          [7, 8, 10].includes(i + 1) ? 'bg-amber-100 text-amber-800' :
                          'text-gray-700'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tasks List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-green-800">Sarcini programate</h3>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Sarcină nouă
                  </Button>
                </div>

                {tasks.filter(task => task.status === 'pending').map((task) => (
                  <Card key={task.id} className="bg-white border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-600">{task.field}</p>
                        </div>
                        <div className="flex space-x-2">
                          {task.aiSuggested && (
                            <Badge className="bg-blue-100 text-blue-800">AI Recomandat</Badge>
                          )}
                          {getPriorityBadge(task.priority)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{task.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{task.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{task.time}</span>
                          </div>
                          <span>⏱️ {task.estimatedDuration}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Editează</Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completează
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {seasons.map((season) => (
                <Card key={season.name} className="bg-white border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">{season.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {season.tasks.map((task, index) => (
                      <div key={index} className={`p-2 rounded-lg ${season.color}`}>
                        <p className="text-sm font-medium">{task}</p>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Vezi planificarea detaliată
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-planner" className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
              <CardHeader>
                <CardTitle>🤖 AI Planificator Inteligent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Lăsați AI-ul să vă planifice activitățile pe baza:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Prognoza meteo pe 14 zile</li>
                  <li>Stadiul de dezvoltare al culturilor</li>
                  <li>Istoricul activităților</li>
                  <li>Resursele disponibile</li>
                </ul>
                <Button className="bg-white text-purple-600 hover:bg-gray-100">
                  Generează planificarea optimă
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Planning;
