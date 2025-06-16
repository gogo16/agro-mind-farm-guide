import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, Plus } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const TasksWidget = () => {
  const { tasks, addTask, updateTask, fields } = useAppContext();
  const { toast } = useToast();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    field: '',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    estimatedDuration: ''
  });

  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDate = task.due_date || task.date;
      return taskDate === today && task.status === 'pending';
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDate = task.due_date || task.date;
      return taskDate > today && task.status === 'pending';
    });
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, { status: 'completed' });
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
        field_name: newTask.field,
        priority: newTask.priority as "high" | "low" | "medium",
        date: newTask.dueDate,
        due_date: newTask.dueDate,
        due_time: newTask.dueTime,
        status: "pending" as const,
        ai_suggested: false,
        description: newTask.description,
        estimated_duration: newTask.estimatedDuration,
        duration: 0,
        category: 'manual',
        user_id: '',
        created_at: new Date().toISOString(),
        completed_at: null,
        field_id: selectedField?.id || null,
        updated_at: new Date().toISOString(),
        time: newTask.dueTime
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
        dueDate: '',
        dueTime: '',
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
    <Card className="bg-white border-green-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-800 flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Sarcini</span>
        </CardTitle>
        <Badge variant="secondary">{tasks.length} sarcini</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Task Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">Titlu</Label>
            <Input 
              type="text" 
              id="title" 
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="field" className="text-sm font-medium text-gray-700">Teren</Label>
            <Select onValueChange={(value) => setNewTask({ ...newTask, field: value })} value={newTask.field}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează terenul..." />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem key={field.id} value={field.name}>{field.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700">Prioritate</Label>
            <Select onValueChange={(value) => setNewTask({ ...newTask, priority: value })} value={newTask.priority}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează prioritatea..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Scăzută</SelectItem>
                <SelectItem value="medium">Medie</SelectItem>
                <SelectItem value="high">Ridicată</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">Data</Label>
            <Input 
              type="date" 
              id="dueDate" 
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="dueTime" className="text-sm font-medium text-gray-700">Ora</Label>
            <Input 
              type="time" 
              id="dueTime" 
              value={newTask.dueTime}
              onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="estimatedDuration" className="text-sm font-medium text-gray-700">Durata estimată</Label>
            <Input 
              type="text" 
              id="estimatedDuration" 
              value={newTask.estimatedDuration}
              onChange={(e) => setNewTask({ ...newTask, estimatedDuration: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descriere</Label>
            <Input 
              type="text" 
              id="description" 
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="mt-1" 
            />
          </div>
        </div>

        <Button onClick={handleAddTask} className="w-full bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Adaugă Sarcină
        </Button>

        {/* Task Lists */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <span>Sarcini de azi</span>
          </h3>
          <div className="mt-2 space-y-2">
            {getTodayTasks().length > 0 ? (
              getTodayTasks().map(task => (
                <Card key={task.id} className="bg-green-50 border border-green-200">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                        {task.priority}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => handleCompleteTask(task.id)}>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Nu există sarcini programate pentru astăzi</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span>Sarcini viitoare</span>
          </h3>
          <div className="mt-2 space-y-2">
            {getUpcomingTasks().length > 0 ? (
              getUpcomingTasks().map(task => (
                <Card key={task.id} className="bg-green-50 border border-green-200">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                        {task.priority}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => handleCompleteTask(task.id)}>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Nu există sarcini viitoare programate</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksWidget;
