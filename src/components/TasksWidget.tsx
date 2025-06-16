import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, AlertTriangle, Plus, Bot, Check, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const TasksWidget = () => {
  const { toast } = useToast();
  const { tasks, fields, addTask, updateTask, deleteTask } = useAppContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [lastTaskCount, setLastTaskCount] = useState(tasks.length);
  const [newTask, setNewTask] = useState({
    title: '',
    field_name: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    date: '',
    time: '',
    description: '',
    estimated_duration: ''
  });

  // Check for new tasks and show notification
  useEffect(() => {
    if (tasks.length > lastTaskCount) {
      const newTaskAdded = tasks[tasks.length - 1];
      toast({
        title: "Sarcină nouă adăugată",
        description: `"${newTaskAdded.title}" a fost adăugată cu succes.`,
      });
    }
    setLastTaskCount(tasks.length);
  }, [tasks.length, lastTaskCount, toast]);

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
    if (!newTask.title || !newTask.field_name || !newTask.date) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    const selectedField = fields.find(f => f.name === newTask.field_name);

    addTask({
      title: newTask.title,
      field_name: newTask.field_name,
      field_id: selectedField?.id,
      priority: newTask.priority,
      date: newTask.date,
      due_date: newTask.date,
      due_time: newTask.time || null,
      status: 'pending' as const,
      ai_suggested: false,
      description: newTask.description || null,
      estimated_duration: newTask.estimated_duration || null,
      duration: null,
      category: null,
      completed_at: null
    });

    setNewTask({
      title: '',
      field_name: '',
      priority: 'medium',
      date: '',
      time: '',
      description: '',
      estimated_duration: ''
    });
    setIsAddingTask(false);
  };

  const handleCompleteTask = (taskId: string) => {
    updateTask(taskId, { 
      status: 'completed'
    });
    toast({
      title: "Sarcină completată",
      description: "Sarcina a fost marcată ca finalizată.",
    });
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    deleteTask(taskId);
    toast({
      title: "Sarcină ștearsă",
      description: `"${taskTitle}" a fost ștearsă cu succes.`,
    });
  };

  // Filter tasks for today only
  const today = new Date().toISOString().split('T')[0];
  const todayPendingTasks = tasks.filter(task => 
    task.status === 'pending' && task.date === today
  );
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const renderTaskTooltip = (task: any) => (
    <div className="space-y-2 text-sm">
      <div><strong>Titlu:</strong> {task.title}</div>
      <div><strong>Teren:</strong> {task.field_name}</div>
      <div><strong>Data:</strong> {task.date}</div>
      {task.time && <div><strong>Ora:</strong> {task.time}</div>}
      <div><strong>Prioritate:</strong> {task.priority === 'high' ? 'Înaltă' : task.priority === 'medium' ? 'Medie' : 'Scăzută'}</div>
      {task.estimated_duration && <div><strong>Durată:</strong> {task.estimated_duration}</div>}
      {task.description && <div><strong>Descriere:</strong> {task.description}</div>}
    </div>
  );

  return (
    <TooltipProvider>
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Sarcini</CardTitle>
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
                  <Select value={newTask.field_name} onValueChange={(value) => setNewTask({...newTask, field_name: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează terenul" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map(field => (
                        <SelectItem key={field.id} value={field.name}>{field.name} ({field.parcel_code})</SelectItem>
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
                    value={newTask.estimated_duration}
                    onChange={(e) => setNewTask({...newTask, estimated_duration: e.target.value})}
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
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">De astăzi ({todayPendingTasks.length})</TabsTrigger>
              <TabsTrigger value="completed">Completate ({completedTasks.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-3 mt-4">
              {todayPendingTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nu ai sarcini programate pentru astăzi</p>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-3 pr-4">
                    {todayPendingTasks.map((task) => (
                      <Tooltip key={task.id}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3">
                              {task.ai_suggested && (
                                <div className="bg-blue-100 p-1 rounded">
                                  <Bot className="h-3 w-3 text-blue-600" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{task.title}</p>
                                <p className="text-sm text-gray-600">{task.field_name} • {task.time}</p>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompleteTask(task.id);
                                }}
                              >
                                Finalizează
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id, task.title);
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          {renderTaskTooltip(task)}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3 mt-4">
              {completedTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nu ai sarcini completate</p>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-3 pr-4">
                    {completedTasks.map((task) => (
                      <Tooltip key={task.id}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="bg-green-100 p-1 rounded">
                                <Check className="h-3 w-3 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{task.title}</p>
                                <p className="text-sm text-gray-600">{task.field_name} • {task.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">
                                Completată
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task.id, task.title);
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          {renderTaskTooltip(task)}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TasksWidget;
