
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Plus, MapPin, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const Planning = () => {
  const { fields, tasks, addTask } = useAppContext();
  const { toast } = useToast();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    field: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    duration: '',
    category: 'maintenance'
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.field || !newTask.dueDate) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    addTask({
      title: newTask.title,
      description: newTask.description,
      field: newTask.field,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      priority: newTask.priority as 'low' | 'medium' | 'high',
      status: 'pending',
      duration: newTask.duration ? parseInt(newTask.duration) : undefined,
      category: newTask.category
    });

    toast({
      title: "Succes",
      description: `Sarcina "${newTask.title}" a fost adăugată cu succes.`,
    });

    setNewTask({
      title: '',
      description: '',
      field: '',
      dueDate: '',
      dueTime: '',
      priority: 'medium',
      duration: '',
      category: 'maintenance'
    });
    setIsAddingTask(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Planificare Activități</h1>
          <p className="text-green-600">Organizează și urmărește toate activitățile fermei</p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="tasks">Sarcini</TabsTrigger>
            <TabsTrigger value="overview">Prezentare</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-800">Calendar Activități</CardTitle>
                <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Adaugă sarcină
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Adaugă sarcină nouă</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Titlu sarcină *</Label>
                        <Input
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          placeholder="ex: Fertilizare NPK"
                        />
                      </div>
                      <div>
                        <Label htmlFor="field">Teren *</Label>
                        <Select onValueChange={(value) => setNewTask({...newTask, field: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează terenul" />
                          </SelectTrigger>
                          <SelectContent>
                            {fields.map((field) => (
                              <SelectItem key={field.id} value={field.name}>
                                {field.name} ({field.parcelCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="dueDate">Data *</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dueTime">Ora</Label>
                          <Input
                            id="dueTime"
                            type="time"
                            value={newTask.dueTime}
                            onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="priority">Prioritate</Label>
                        <Select onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează prioritatea" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Scăzută</SelectItem>
                            <SelectItem value="medium">Medie</SelectItem>
                            <SelectItem value="high">Ridicată</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duration">Durata estimată (ore)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={newTask.duration}
                          onChange={(e) => setNewTask({...newTask, duration: e.target.value})}
                          placeholder="ex: 3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descriere</Label>
                        <Textarea
                          id="description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          placeholder="Detalii suplimentare despre sarcină..."
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => setIsAddingTask(false)} variant="outline" className="flex-1">
                          Anulează
                        </Button>
                        <Button onClick={handleAddTask} className="flex-1 bg-green-600 hover:bg-green-700">
                          Adaugă sarcină
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Calendar interactiv</h3>
                  <p className="text-gray-600">
                    Aici va fi implementat calendarul interactiv pentru vizualizarea și gestionarea activităților.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pending Tasks */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span>În așteptare ({pendingTasks.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Ridicată' : task.priority === 'medium' ? 'Medie' : 'Scăzută'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{task.field}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{task.dueDate} {task.dueTime && `la ${task.dueTime}`}</span>
                      </div>
                    </div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Nu există sarcini în așteptare</p>
                  )}
                </CardContent>
              </Card>

              {/* In Progress Tasks */}
              <Card className="bg-white border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    <span>În progres ({inProgressTasks.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {inProgressTasks.map((task) => (
                    <div key={task.id} className="border border-blue-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Ridicată' : task.priority === 'medium' ? 'Medie' : 'Scăzută'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{task.field}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{task.dueDate} {task.dueTime && `la ${task.dueTime}`}</span>
                      </div>
                    </div>
                  ))}
                  {inProgressTasks.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Nu există sarcini în progres</p>
                  )}
                </CardContent>
              </Card>

              {/* Completed Tasks */}
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span>Completate ({completedTasks.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {completedTasks.map((task) => (
                    <div key={task.id} className="border border-green-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Finalizat
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{task.field}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{task.dueDate} {task.dueTime && `la ${task.dueTime}`}</span>
                      </div>
                    </div>
                  ))}
                  {completedTasks.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Nu există sarcini completate</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Total Sarcini</p>
                      <p className="text-3xl font-bold text-green-800">{tasks.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600 font-medium">În așteptare</p>
                      <p className="text-3xl font-bold text-amber-800">{pendingTasks.length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Completate</p>
                      <p className="text-3xl font-bold text-green-800">{completedTasks.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Activități pe terenuri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field) => {
                    const fieldTasks = tasks.filter(task => task.field === field.name);
                    const pendingCount = fieldTasks.filter(task => task.status === 'pending').length;
                    const completedCount = fieldTasks.filter(task => task.status === 'completed').length;
                    
                    return (
                      <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{field.name}</p>
                            <p className="text-sm text-gray-600">{field.crop} • {field.size} ha</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-amber-600">{pendingCount}</p>
                            <p className="text-xs text-gray-500">Pendente</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-green-600">{completedCount}</p>
                            <p className="text-xs text-gray-500">Completate</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Planning;
