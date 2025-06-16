
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const Planning = () => {
  const { toast } = useToast();
  const { tasks, fields, addTask, updateTask, addNotification } = useAppContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    field_name: '',
    date: '',
    time: '08:00',
    due_date: '',
    due_time: '17:00',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: '',
    estimated_duration: '2 ore'
  });

  const handleAddTask = async () => {
    if (!taskForm.title || !taskForm.field_name || !taskForm.date) {
      toast({
        title: "Eroare",
        description: "Vă rugăm completați toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addNotification({
        type: 'task',
        title: 'Sarcină nouă adăugată',
        message: `Sarcina "${taskForm.title}" a fost programată pentru ${taskForm.date}`,
        read: false,
        is_read: false,
        priority: taskForm.priority,
        read_at: null,
      });

      const selectedFieldObj = fields.find(f => f.name === taskForm.field_name);

      await addTask({
        title: taskForm.title,
        description: taskForm.description,
        field_name: taskForm.field_name,
        field_id: selectedFieldObj?.id || null,
        date: taskForm.date,
        time: taskForm.time,
        due_date: taskForm.due_date || taskForm.date,
        due_time: taskForm.due_time,
        priority: taskForm.priority,
        status: 'pending',
        ai_suggested: false,
        estimated_duration: taskForm.estimated_duration,
        duration: parseInt(taskForm.estimated_duration.split(' ')[0]) || 0,
        category: taskForm.category,
        completed_at: null,
      });

      setTaskForm({
        title: '',
        description: '',
        field_name: '',
        date: '',
        time: '08:00',
        due_date: '',
        due_time: '17:00',
        priority: 'medium',
        category: '',
        estimated_duration: '2 ore'
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

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, { 
        status: 'completed',
        completed_at: new Date().toISOString()
      });
      toast({
        title: "Succes",
        description: "Sarcina a fost marcată ca finalizată."
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la finalizarea sarcinii.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

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

  // Group tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Planificare</h1>
            <p className="text-green-600">Gestionează sarcinile fermei tale</p>
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
                  <Label htmlFor="title">Titlu *</Label>
                  <Input
                    id="title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Irrigare grâu"
                  />
                </div>

                <div>
                  <Label htmlFor="field">Parcelă *</Label>
                  <Select value={taskForm.field_name} onValueChange={(value) => setTaskForm(prev => ({ ...prev, field_name: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează parcela" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map(field => (
                        <SelectItem key={field.id} value={field.name}>
                          {field.name} ({field.crop})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={taskForm.date}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Ora</Label>
                    <Input
                      id="time"
                      type="time"
                      value={taskForm.time}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority">Prioritate</Label>
                  <Select value={taskForm.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setTaskForm(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Înaltă</SelectItem>
                      <SelectItem value="medium">Medie</SelectItem>
                      <SelectItem value="low">Scăzută</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Categorie</Label>
                  <Input
                    id="category"
                    value={taskForm.category}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: Îngrijire, Recoltare"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descriere</Label>
                  <Textarea
                    id="description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detalii despre sarcină..."
                    rows={3}
                  />
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

        {/* Task Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <Circle className="h-5 w-5 text-gray-400" />
                <span>În așteptare ({pendingTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTasks.map(task => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority || 'medium')}>
                      {task.priority === 'high' ? 'Înaltă' : 
                       task.priority === 'medium' ? 'Medie' : 'Scăzută'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.field_name}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{task.due_date || task.date}</span>
                      <Clock className="h-4 w-4" />
                      <span>{task.time || '08:00'}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      Finalizează
                    </Button>
                  </div>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nu există sarcini în așteptare</p>
              )}
            </CardContent>
          </Card>

          {/* In Progress Tasks */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span>În progres ({inProgressTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inProgressTasks.map(task => (
                <div key={task.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority || 'medium')}>
                      {task.priority === 'high' ? 'Înaltă' : 
                       task.priority === 'medium' ? 'Medie' : 'Scăzută'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.field_name}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{task.due_date || task.date}</span>
                      <Clock className="h-4 w-4" />
                      <span>{task.time || '08:00'}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      Finalizează
                    </Button>
                  </div>
                </div>
              ))}
              {inProgressTasks.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nu există sarcini în progres</p>
              )}
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Finalizate ({completedTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedTasks.slice(0, 5).map(task => (
                <div key={task.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.field_name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{task.due_date || task.date}</span>
                    <span>•</span>
                    <span>Completat</span>
                  </div>
                </div>
              ))}
              {completedTasks.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nu există sarcini finalizate</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Planning;
