import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, CheckCircle2, AlertCircle, Sprout, Wrench, Target } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
const Planning = () => {
  const {
    toast
  } = useToast();
  const {
    tasks,
    fields,
    addTask,
    addNotification
  } = useAppContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    field_name: '',
    date: '',
    time: '',
    due_date: '',
    due_time: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: '',
    estimated_duration: ''
  });
  const handleAddTask = async () => {
    if (!newTask.title || !newTask.field_name || !newTask.date) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }
    const selectedField = fields.find(f => f.name === newTask.field_name);
    try {
      await addTask({
        title: newTask.title,
        description: newTask.description,
        field_name: newTask.field_name,
        field_id: selectedField?.id || null,
        date: newTask.date,
        time: newTask.time,
        due_date: newTask.due_date || newTask.date,
        due_time: newTask.due_time || newTask.time,
        priority: newTask.priority,
        status: 'pending',
        ai_suggested: false,
        estimated_duration: newTask.estimated_duration,
        duration: parseInt(newTask.estimated_duration) || null,
        category: newTask.category,
        completed_at: null
      });

      // Add notification for high priority tasks
      if (newTask.priority === 'high') {
        await addNotification({
          type: 'task',
          title: 'Sarcină urgentă adăugată',
          message: `Sarcina "${newTask.title}" a fost programată pentru ${newTask.date}`,
          read: false,
          is_read: false,
          priority: newTask.priority,
          read_at: null
        });
      }
      setNewTask({
        title: '',
        description: '',
        field_name: '',
        date: '',
        time: '',
        due_date: '',
        due_time: '',
        priority: 'medium',
        category: '',
        estimated_duration: ''
      });
      setIsAddingTask(false);
      toast({
        title: "Succes",
        description: "Sarcina a fost adăugată cu succes."
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea sarcinii.",
        variant: "destructive"
      });
    }
  };

  // Group tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');

  // Get upcoming tasks (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingTasks = pendingTasks.filter(task => {
    const taskDate = new Date(task.due_date || task.date);
    return taskDate >= today && taskDate <= nextWeek;
  }).sort((a, b) => new Date(a.due_date || a.date).getTime() - new Date(b.due_date || b.date).getTime());
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Plantare':
        return <Sprout className="h-4 w-4" />;
      case 'Mentenanță':
        return <Wrench className="h-4 w-4" />;
      case 'Recoltare':
        return <Target className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Planificare Activități</h1>
            <p className="text-green-600">Organizează și monitorizează sarcinile fermei</p>
          </div>

          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Sarcină
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adaugă Sarcină Nouă</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titlu sarcină *</Label>
                  <Input id="title" value={newTask.title} onChange={e => setNewTask(prev => ({
                  ...prev,
                  title: e.target.value
                }))} placeholder="Ex: Aplicare îngrășământ" />
                </div>

                <div>
                  <Label htmlFor="description">Descriere</Label>
                  <Textarea id="description" value={newTask.description} onChange={e => setNewTask(prev => ({
                  ...prev,
                  description: e.target.value
                }))} placeholder="Detalii despre sarcină..." />
                </div>

                <div>
                  <Label htmlFor="field_name">Teren *</Label>
                  <Select value={newTask.field_name} onValueChange={value => setNewTask(prev => ({
                  ...prev,
                  field_name: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează terenul" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map(field => <SelectItem key={field.id} value={field.name}>
                          {field.name} ({field.crop})
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data *</Label>
                    <Input id="date" type="date" value={newTask.date} onChange={e => setNewTask(prev => ({
                    ...prev,
                    date: e.target.value
                  }))} />
                  </div>
                  <div>
                    <Label htmlFor="time">Ora</Label>
                    <Input id="time" type="time" value={newTask.time} onChange={e => setNewTask(prev => ({
                    ...prev,
                    time: e.target.value
                  }))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioritate</Label>
                    <Select value={newTask.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTask(prev => ({
                    ...prev,
                    priority: value
                  }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Urgent</SelectItem>
                        <SelectItem value="medium">Mediu</SelectItem>
                        <SelectItem value="low">Scăzut</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Categorie</Label>
                    <Select value={newTask.category} onValueChange={value => setNewTask(prev => ({
                    ...prev,
                    category: value
                  }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Plantare">Plantare</SelectItem>
                        <SelectItem value="Îngrijire">Îngrijire</SelectItem>
                        <SelectItem value="Tratamente">Tratamente</SelectItem>
                        <SelectItem value="Recoltare">Recoltare</SelectItem>
                        <SelectItem value="Mentenanță">Mentenanță</SelectItem>
                        <SelectItem value="Altele">Altele</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="estimated_duration">Durata estimată (minute)</Label>
                  <Input id="estimated_duration" type="number" value={newTask.estimated_duration} onChange={e => setNewTask(prev => ({
                  ...prev,
                  estimated_duration: e.target.value
                }))} placeholder="Ex: 120" />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                    Anulează
                  </Button>
                  <Button onClick={handleAddTask} className="bg-green-600 hover:bg-green-700">
                    Adaugă Sarcina
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-800">{pendingTasks.length}</p>
                  <p className="text-sm text-orange-600">În așteptare</p>
                </div>
              </div>
            </CardContent>
          </Card>

          

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-800">{completedTasks.length}</p>
                  <p className="text-sm text-green-600">Completate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-800">{upcomingTasks.length}</p>
                  <p className="text-sm text-purple-600">Săptămâna aceasta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Sarcini viitoare</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.length > 0 ? upcomingTasks.map(task => <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Mediu' : 'Scăzut'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(task.category)}
                      <span className="text-gray-500">{task.field_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">
                        {task.due_date} {task.due_time && `la ${task.due_time}`}
                      </span>
                    </div>
                  </div>
                </div>) : <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nu există sarcini programate pentru săptămâna aceasta</p>
                  <p className="text-sm">Adaugă sarcini noi pentru a le vedea aici</p>
                </div>}
            </CardContent>
          </Card>

          {/* All Tasks */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Toate sarcinile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {tasks.length > 0 ? tasks.slice(0, 10).map(task => <div key={task.id} className={`border rounded-lg p-3 ${task.status === 'completed' ? 'bg-green-50 border-green-200' : task.status === 'in_progress' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-medium text-gray-900">{task.title}</h5>
                    <div className="flex items-center space-x-1">
                      <Badge variant="secondary" className="text-xs">{task.category}</Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority === 'high' ? 'H' : task.priority === 'medium' ? 'M' : 'L'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{task.field_name}</span>
                    <span className="text-gray-500">{task.due_date || task.date}</span>
                  </div>
                </div>) : <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nu există sarcini create</p>
                  <p className="text-sm">Începe prin a adăuga prima sarcină</p>
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default Planning;