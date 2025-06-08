import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle, AlertTriangle, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import WorkHistory from '@/components/WorkHistory';

const Planning = () => {
  const { toast } = useToast();
  const { tasks, addTask, updateTask, fields, currentSeason } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    field: '',
    priority: '',
    date: '',
    time: '',
    description: ''
  });

  const seasons = [
    {
      name: 'Primăvara',
      tasks: ['Pregătirea solului', 'Semănat', 'Fertilizare de bază'],
      color: 'bg-green-100 text-green-800',
      recommendations: [
        'Pregătirea și fertilizarea solului',
        'Semănatul culturilor de primăvară',
        'Verificarea și întreținerea utilajelor',
        'Aplicarea tratamentelor pre-emergente'
      ]
    },
    {
      name: 'Vara',
      tasks: ['Irigare', 'Tratamente fitosanitare', 'Fertilizare foliară'],
      color: 'bg-yellow-100 text-yellow-800',
      recommendations: [
        'Irigarea regulată a culturilor',
        'Monitorizarea și combaterea dăunătorilor',
        'Aplicarea tratamentelor foliare',
        'Pregătirea pentru recoltare'
      ]
    },
    {
      name: 'Toamna',
      tasks: ['Recoltare', 'Lucru sol după recoltare', 'Semănat culturi de toamnă'],
      color: 'bg-orange-100 text-orange-800',
      recommendations: [
        'Recoltarea culturilor mature',
        'Pregătirea terenului pentru culturile de toamnă',
        'Depozitarea și conservarea recoltei',
        'Planificarea rotației culturilor'
      ]
    },
    {
      name: 'Iarna',
      tasks: ['Întreținere echipamente', 'Planificare sezon următor', 'Administrare'],
      color: 'bg-blue-100 text-blue-800',
      recommendations: [
        'Întreținerea și repararea utilajelor',
        'Planificarea culturilor pentru anul următor',
        'Gestionarea stocurilor și inventarului',
        'Pregătirea documentelor și rapoartelor'
      ]
    }
  ];

  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

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

  const handleAddTask = () => {
    if (!newTask.title || !newTask.field || !newTask.priority || !newTask.date) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    const task = {
      title: newTask.title,
      field: newTask.field,
      priority: newTask.priority as 'high' | 'medium' | 'low',
      date: newTask.date,
      time: newTask.time,
      status: 'pending' as 'pending' | 'completed',
      aiSuggested: false,
      description: newTask.description,
      estimatedDuration: '1 oră'
    };

    if (editingTask) {
      updateTask(editingTask, task);
      setEditingTask(null);
      toast({
        title: "Succes",
        description: "Sarcina a fost actualizată cu succes."
      });
    } else {
      addTask(task);
      toast({
        title: "Succes",
        description: "Sarcina a fost adăugată cu succes."
      });
    }

    setNewTask({ title: '', field: '', priority: '', date: '', time: '', description: '' });
    setIsAddingTask(false);
  };

  const handleCompleteTask = (taskId: number) => {
    updateTask(taskId, { status: 'completed' });
    toast({
      title: "Sarcină completată",
      description: "Sarcina a fost marcată ca fiind completată."
    });
  };

  const handleEditTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setNewTask({
        title: task.title,
        field: task.field,
        priority: task.priority,
        date: task.date,
        time: task.time,
        description: task.description
      });
      setEditingTask(taskId);
      setIsAddingTask(true);
    }
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateStr);
  };

  const getDateColor = (date: Date) => {
    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length === 0) return '';
    
    const hasHighPriority = tasksForDate.some(t => t.priority === 'high');
    const hasCompletedTasks = tasksForDate.some(t => t.status === 'completed');
    
    if (hasHighPriority && !hasCompletedTasks) return 'bg-red-200 text-red-800';
    if (hasCompletedTasks) return 'bg-gray-200 text-gray-600';
    return 'bg-yellow-200 text-yellow-800';
  };

  const handleQuickAddTask = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setNewTask({
      ...newTask,
      date: dateStr
    });
    setIsAddingTask(true);
  };

  const getSeasonRecommendations = (seasonName: string) => {
    const season = seasons.find(s => s.name === seasonName);
    if (!season) return [];

    return season.recommendations.map((rec, index) => ({
      id: index,
      title: rec,
      field: 'Toate parcelele',
      priority: 'medium' as 'medium',
      description: `Recomandare sezonieră pentru ${seasonName.toLowerCase()}`,
      estimatedDuration: '2-4 ore'
    }));
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
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="seasonal">Sezonier</TabsTrigger>
            <TabsTrigger value="history">Istoric</TabsTrigger>
            <TabsTrigger value="ai-planner">AI Planificare</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enhanced Calendar Widget */}
              <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Calendar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                    modifiers={{
                      hasHighTasks: (date) => getDateColor(date).includes('red'),
                      hasCompletedTasks: (date) => getDateColor(date).includes('gray'),
                      hasNormalTasks: (date) => getDateColor(date).includes('yellow')
                    }}
                    modifiersClassNames={{
                      hasHighTasks: 'bg-red-100 text-red-800 font-bold',
                      hasCompletedTasks: 'bg-gray-100 text-gray-600',
                      hasNormalTasks: 'bg-yellow-100 text-yellow-800'
                    }}
                  />
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Sarcini pentru {selectedDate.toLocaleDateString('ro-RO')}:
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickAddTask(selectedDate)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adaugă
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {getTasksForDate(selectedDate).map((task) => (
                        <div key={task.id} className="text-xs p-2 bg-green-100 rounded">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{task.title}</p>
                            {getPriorityBadge(task.priority)}
                          </div>
                          <p className="text-gray-600">{task.time} - {task.field}</p>
                        </div>
                      ))}
                      {getTasksForDate(selectedDate).length === 0 && (
                        <p className="text-sm text-gray-500">Nu există sarcini programate.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-green-800">Sarcini programate</h3>
                  <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Sarcină nouă
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingTask ? 'Editează sarcina' : 'Adaugă sarcină nouă'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Titlu sarcină *</Label>
                          <Input
                            id="title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            placeholder="ex: Irigarea parcelei"
                          />
                        </div>
                        <div>
                          <Label htmlFor="field">Teren *</Label>
                          <Select onValueChange={(value) => setNewTask({...newTask, field: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selectează terenul" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Parcela Nord">Parcela Nord</SelectItem>
                              <SelectItem value="Câmp Sud">Câmp Sud</SelectItem>
                              <SelectItem value="Livada Est">Livada Est</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="priority">Prioritate *</Label>
                          <Select onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selectează prioritatea" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">Urgent</SelectItem>
                              <SelectItem value="medium">Mediu</SelectItem>
                              <SelectItem value="low">Scăzut</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Data *</Label>
                            <Input
                              id="date"
                              type="date"
                              value={newTask.date}
                              onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="time">Ora</Label>
                            <Input
                              id="time"
                              type="time"
                              value={newTask.time}
                              onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Descriere</Label>
                          <Textarea
                            id="description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                            placeholder="Detalii despre sarcină..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => {
                              setIsAddingTask(false);
                              setEditingTask(null);
                              setNewTask({ title: '', field: '', priority: '', date: '', time: '', description: '' });
                            }} 
                            variant="outline" 
                            className="flex-1"
                          >
                            Anulează
                          </Button>
                          <Button 
                            onClick={editingTask ? handleAddTask : handleAddTask} 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {editingTask ? 'Actualizează' : 'Adaugă sarcină'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                            <CalendarIcon className="h-4 w-4" />
                            <span>{task.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{task.time}</span>
                          </div>
                          <span>⏱️ {task.estimatedDuration}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditTask(task.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editează
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCompleteTask(task.id)}
                          >
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full mt-3"
                          onClick={() => setSelectedSeason(season.name)}
                        >
                          Vezi planificarea detaliată
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Planificare detaliată - {season.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-gray-600">
                            Recomandări sezoniere pentru {season.name.toLowerCase()} bazate pe culturile active și perioada anului:
                          </p>
                          <div className="space-y-3">
                            {getSeasonRecommendations(season.name).map((rec) => (
                              <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                                    <p className="text-sm text-gray-600">{rec.field}</p>
                                  </div>
                                  <div className="flex space-x-2">
                                    {getPriorityBadge(rec.priority)}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">⏱️ {rec.estimatedDuration}</span>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      setNewTask({
                                        title: rec.title,
                                        field: rec.field,
                                        priority: rec.priority,
                                        date: new Date().toISOString().split('T')[0],
                                        time: '09:00',
                                        description: rec.description
                                      });
                                      setIsAddingTask(true);
                                    }}
                                  >
                                    Adaugă ca sarcină
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <WorkHistory />
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
