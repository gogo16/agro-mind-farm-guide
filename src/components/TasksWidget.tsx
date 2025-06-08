
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, AlertTriangle, Plus, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const TasksWidget = () => {
  const { toast } = useToast();
  const { tasks, fields, addTask, updateTask } = useAppContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    field: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    date: '',
    time: '',
    description: '',
    estimatedDuration: ''
  });

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      case 'medium':
        return <Clock className="h-3 w-3" />;
      case 'low':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.field || !newTask.date) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    addTask({
      title: newTask.title,
      field: newTask.field,
      priority: newTask.priority,
      date: newTask.date,
      time: newTask.time,
      status: 'pending',
      aiSuggested: false,
      description: newTask.description,
      estimatedDuration: newTask.estimatedDuration
    });

    toast({
      title: "Succes",
      description: `Sarcina "${newTask.title}" a fost adăugată cu succes.`,
    });
    
    setNewTask({
      title: '',
      field: '',
      priority: 'medium',
      date: '',
      time: '',
      description: '',
      estimatedDuration: ''
    });
    setIsAddingTask(false);
  };

  const handleCompleteTask = (taskId: number) => {
    updateTask(taskId, { status: 'completed' });
    toast({
      title: "Sarcină completată",
      description: "Sarcina a fost marcată ca finalizată.",
    });
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-800">Sarcini de astăzi</CardTitle>
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-1" />
              Adaugă sarcină
            </Button>
          </DialogTrigger>
          <DialogContent>
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
                  placeholder="ex: Irigarea parcelei"
                />
              </div>
              <div>
                <Label htmlFor="field">Teren *</Label>
                <Select value={newTask.field} onValueChange={(value) => setNewTask({...newTask, field: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează terenul" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map(field => (
                      <SelectItem key={field.id} value={field.name}>{field.name} ({field.parcelCode})</SelectItem>
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
                <Label htmlFor="priority">Prioritate</Label>
                <Select value={newTask.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTask({...newTask, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Scăzută</SelectItem>
                    <SelectItem value="medium">Medie</SelectItem>
                    <SelectItem value="high">Înaltă</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Durată estimată</Label>
                <Input
                  id="duration"
                  value={newTask.estimatedDuration}
                  onChange={(e) => setNewTask({...newTask, estimatedDuration: e.target.value})}
                  placeholder="ex: 2 ore"
                />
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
      <CardContent className="space-y-3">
        {pendingTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nu ai sarcini programate pentru astăzi</p>
        ) : (
          pendingTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {task.aiSuggested && (
                  <div className="bg-blue-100 p-1 rounded">
                    <Bot className="h-3 w-3 text-blue-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.field} • {task.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityIcon(task.priority)}
                  <span className="ml-1 capitalize">{task.priority === 'high' ? 'Înaltă' : task.priority === 'medium' ? 'Medie' : 'Scăzută'}</span>
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  Finalizează
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TasksWidget;
