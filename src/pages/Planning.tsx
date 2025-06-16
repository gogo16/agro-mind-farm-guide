import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const Planning = () => {
  const { tasks, addTask, updateTask, fields, addNotification } = useAppContext();
  const { toast } = useToast();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    field: '',
    priority: 'medium',
    date: '',
    time: '',
    estimatedDuration: ''
  });

  const [taskStatusFilter, setTaskStatusFilter] = useState('pending');

  const today = new Date().toISOString().split('T')[0];

  const getTodayTasks = () => {
    return tasks.filter(task => {
      const taskDate = task.due_date || task.date;
      return taskDate === today;
    });
  };

  const getUpcomingTasks = () => {
    return tasks.filter(task => {
      const taskDate = task.due_date || task.date;
      return taskDate > today;
    });
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, { 
        status: 'completed', 
        completed_at: new Date().toISOString()
      });
      
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await addNotification({
          type: 'task',
          title: 'Sarcină completată',
          message: `Sarcina "${task.title}" a fost marcată ca finalizată`,
          is_read: false,
          priority: 'medium',
          read_at: null
        });
      }
      
      toast({
        title: "Sarcină completată",
        description: "Sarcina a fost marcată ca finalizată."
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la actualizarea sarcinii.",
        variant: "destructive"
      });
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title) return;
    
    try {
      const selectedField = fields.find(f => f.name === newTask.field);
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        field_name: newTask.field,
        date: newTask.date,
        time: newTask.time,
        due_date: newTask.date,
        due_time: newTask.time,
        priority: newTask.priority as "low" | "medium" | "high",
        status: "pending" as const,
        ai_suggested: false,
        estimated_duration: newTask.estimatedDuration,
        duration: parseInt(newTask.estimatedDuration) || 0,
        category: 'manual',
        user_id: '',
        created_at: new Date().toISOString(),
        completed_at: null,
        field_id: selectedField?.id || null,
        updated_at: new Date().toISOString()
      };

      await addTask(taskData);
      toast({
        title: "Sarcină adăugată",
        description: "Sarcina a fost adăugată cu succes."
      });
      
      setNewTask({
        title: '',
        description: '',
        field: '',
        priority: 'medium',
        date: '',
        time: '',
        estimatedDuration: ''
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea sarcinii.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Planificare Sarcini</h1>
          <p className="text-green-600">Organizează și gestionează sarcinile agricole</p>
        </div>

        {/* Task Filtering */}
        <div className="mb-6">
          <Label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700">Filtrează după status:</Label>
          <Select id="taskStatus" onValueChange={setTaskStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Toate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">În așteptare</SelectItem>
              <SelectItem value="completed">Finalizate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Task Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Tasks */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-green-800">Astăzi <Badge variant="secondary">{getTodayTasks().length}</Badge></CardTitle>
                <Calendar className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                {getTodayTasks().length > 0 ? (
                  <ul className="list-none space-y-2">
                    {getTodayTasks().map(task => (
                      <li key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleCompleteTask(task.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Finalizează
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nu există sarcini programate pentru astăzi</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Tasks */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-green-800">Următoarele <Badge variant="secondary">{getUpcomingTasks().length}</Badge></CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                {getUpcomingTasks().length > 0 ? (
                  <ul className="list-none space-y-2">
                    {getUpcomingTasks().map(task => (
                      <li key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleCompleteTask(task.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Finalizează
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nu există sarcini viitoare</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filtered Tasks */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-green-800">
                  {taskStatusFilter === 'pending' ? 'În Așteptare' : 'Finalizate'}
                  <Badge variant="secondary">{getTasksByStatus(taskStatusFilter).length}</Badge>
                </CardTitle>
                {taskStatusFilter === 'pending' ? (
                  <AlertTriangle className="h-4 w-4 text-gray-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                )}
              </CardHeader>
              <CardContent>
                {getTasksByStatus(taskStatusFilter).length > 0 ? (
                  <ul className="list-none space-y-2">
                    {getTasksByStatus(taskStatusFilter).map(task => (
                      <li key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        {task.status !== 'completed' && (
                          <Button variant="outline" size="sm" onClick={() => handleCompleteTask(task.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Finalizează
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nu există sarcini cu acest status</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Task Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Adaugă o Sarcină Nouă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700">Titlu</Label>
                <Input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="field" className="block text-sm font-medium text-gray-700">Teren</Label>
                <Select onValueChange={(value) => setNewTask({ ...newTask, field: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează un teren" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map(field => (
                      <SelectItem key={field.id} value={field.name}>{field.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</Label>
                <Input
                  type="date"
                  id="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time" className="block text-sm font-medium text-gray-700">Ora</Label>
                <Input
                  type="time"
                  id="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="priority" className="block text-sm font-medium text-gray-700">Prioritate</Label>
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
                <Label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">Durata estimată (ore)</Label>
                <Input
                  type="number"
                  id="estimatedDuration"
                  value={newTask.estimatedDuration}
                  onChange={(e) => setNewTask({ ...newTask, estimatedDuration: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Descriere</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="mt-1"
              />
            </div>
            <Button className="mt-4 w-full" onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Sarcină
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Planning;
