import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Clock, Plus, MapPin, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, parseISO, isSameDay } from 'date-fns';
import { ro } from 'date-fns/locale';

const Planning = () => {
  const {
    fields,
    tasks,
    addTask,
    notifications,
    markNotificationAsRead,
    addNotification
  } = useAppContext();
  const { toast } = useToast();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  // Actualizare automată a notificărilor pentru sarcinile zilei curente
  useEffect(() => {
    const updateDailyNotifications = () => {
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = tasks.filter(task => {
        const taskDate = task.dueDate || task.date;
        return taskDate === today && task.status === 'pending';
      });

      // Adaugă notificări pentru sarcinile de astăzi
      todayTasks.forEach(task => {
        const notificationExists = notifications.some(n => 
          n.type === 'task' && 
          n.message.includes(task.title) && 
          n.date === today
        );
        
        if (!notificationExists) {
          addNotification({
            type: 'task',
            title: 'Sarcină programată astăzi',
            message: `"${task.title}" este programată pentru astăzi pe ${task.field}`,
            date: today,
            isRead: false,
            priority: task.priority
          });
        }
      });
    };

    updateDailyNotifications();

    // Actualizare la fiecare schimbare de zi (la miezul nopții)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      updateDailyNotifications();
      // Apoi actualizare zilnică
      const intervalId = setInterval(updateDailyNotifications, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, [tasks, notifications, addNotification]);

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
      date: newTask.dueDate,
      time: newTask.dueTime || '08:00',
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      priority: newTask.priority as 'low' | 'medium' | 'high',
      status: 'pending',
      aiSuggested: false,
      estimatedDuration: newTask.duration ? `${newTask.duration} ore` : undefined,
      duration: newTask.duration ? parseInt(newTask.duration) : undefined,
      category: newTask.category
    });

    toast({
      title: "Succes",
      description: `Sarcina "${newTask.title}" a fost adăugată cu succes.`
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

  // Filtrare sarcini pentru data curentă
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => {
    const taskDate = task.dueDate || task.date;
    return taskDate === today;
  });

  // Filtrare sarcini pentru data selectată în calendar
  const selectedDateTasks = tasks.filter(task => {
    const taskDate = task.dueDate || task.date;
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return taskDate === selectedDateStr;
  });

  // Verifică dacă o zi are sarcini programate
  const hasTasksOnDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.some(task => {
      const taskDate = task.dueDate || task.date;
      return taskDate === dateStr;
    });
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
            <TabsTrigger value="today">De astăzi</TabsTrigger>
            <TabsTrigger value="tasks">Sarcini</TabsTrigger>
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
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          placeholder="ex: Fertilizare NPK"
                        />
                      </div>
                      <div>
                        <Label htmlFor="field">Teren *</Label>
                        <Select onValueChange={(value) => setNewTask({ ...newTask, field: value })}>
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
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dueTime">Ora</Label>
                          <Input
                            id="dueTime"
                            type="time"
                            value={newTask.dueTime}
                            onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="priority">Prioritate</Label>
                        <Select onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
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
                          onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                          placeholder="ex: 3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descriere</Label>
                        <Textarea
                          id="description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      locale={ro}
                      className="rounded-lg border p-3 pointer-events-auto"
                      modifiers={{
                        hasTask: (date) => hasTasksOnDate(date)
                      }}
                      modifiersStyles={{
                        hasTask: {
                          backgroundColor: '#22c55e',
                          color: 'white',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-4">
                      Sarcini pentru {format(selectedDate, 'dd MMMM yyyy', { locale: ro })}
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedDateTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          Nu există sarcini programate pentru această zi
                        </p>
                      ) : (
                        selectedDateTasks.map((task) => (
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
                            <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                              <Clock className="h-3 w-3" />
                              <span>{(task.dueTime || task.time) && `${task.dueTime || task.time}`}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status === 'pending' ? 'În așteptare' : task.status === 'in-progress' ? 'În progres' : 'Completat'}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-xs text-gray-600 mt-2">{task.description}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="today" className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-green-600" />
                  <span>Sarcini de astăzi ({todayTasks.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nu aveți sarcini programate pentru astăzi</p>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <div key={task.id} className="border border-green-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-green-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Ridicată' : task.priority === 'medium' ? 'Medie' : 'Scăzută'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{task.field}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>{task.dueTime || task.time ? `${task.dueTime || task.time}` : 'Oră neprecizată'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === 'pending' ? 'În așteptare' : task.status === 'in-progress' ? 'În progres' : 'Completat'}
                        </Badge>
                        {task.estimatedDuration && (
                          <span className="text-xs text-gray-500">Durată: {task.estimatedDuration}</span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-2 p-2 bg-white rounded border-l-4 border-green-200">
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
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
                        <CalendarIcon className="h-3 w-3" />
                        <span>{task.dueDate || task.date} {(task.dueTime || task.time) && `la ${task.dueTime || task.time}`}</span>
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
                        <CalendarIcon className="h-3 w-3" />
                        <span>{task.dueDate || task.date} {(task.dueTime || task.time) && `la ${task.dueTime || task.time}`}</span>
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
                    <CalendarIcon className="h-5 w-5 text-green-600" />
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
                        <CalendarIcon className="h-3 w-3" />
                        <span>{task.dueDate || task.date} {(task.dueTime || task.time) && `la ${task.dueTime || task.time}`}</span>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Planning;
