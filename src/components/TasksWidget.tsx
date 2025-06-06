import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TasksWidgetProps {
  detailed?: boolean;
}

const TasksWidget = ({ detailed = false }: TasksWidgetProps) => {
  const { toast } = useToast();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    field: '',
    priority: '',
    dueDate: '',
    time: ''
  });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Irigarea Parcelei Nord',
      field: 'Parcela Nord',
      priority: 'high',
      dueDate: '2024-06-06',
      time: '06:00',
      status: 'pending',
      aiSuggested: true,
      description: 'Condițiile meteo sunt ideale pentru irigare dimineața devreme.'
    },
    {
      id: 2,
      title: 'Fertilizare Câmp Sud',
      field: 'Câmp Sud',
      priority: 'medium',
      dueDate: '2024-06-07',
      time: '14:00',
      status: 'pending',
      aiSuggested: true,
      description: 'Aplicare îngrășământ NPK conform planificării.'
    },
    {
      id: 3,
      title: 'Monitorizare dăunători',
      field: 'Livada Est',
      priority: 'low',
      dueDate: '2024-06-08',
      time: '10:00',
      status: 'completed',
      aiSuggested: false,
      description: 'Verificare vizuală a semnelor de infestare.'
    },
    {
      id: 4,
      title: 'Recoltare porumb',
      field: 'Câmp Sud',
      priority: 'high',
      dueDate: '2024-06-10',
      time: '08:00',
      status: 'pending',
      aiSuggested: true,
      description: 'Umiditatea grâului a atins nivelul optim pentru recoltare.'
    }
  ]);

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
    if (!newTask.title || !newTask.field || !newTask.priority) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    const task = {
      id: Date.now(),
      ...newTask,
      status: 'pending',
      aiSuggested: false,
      description: 'Sarcină adăugată manual.'
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', field: '', priority: '', dueDate: '', time: '' });
    setIsAddingTask(false);

    toast({
      title: "Succes",
      description: "Sarcina a fost adăugată cu succes.",
    });
  };

  if (!detailed) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Sarcini astăzi</CardTitle>
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adaugă
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
                    <Label htmlFor="dueDate">Data</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
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
          {tasks.filter(task => task.status === 'pending').slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  {task.aiSuggested && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      AI
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">{task.field}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{task.time}</span>
                  </div>
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">Planificarea Sarcinilor</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Sarcină nouă
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Sarcini urgente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.filter(task => task.priority === 'high' && task.status === 'pending').map((task) => (
              <div key={task.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  {task.aiSuggested && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">AI Recomandat</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{task.field}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{task.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{task.time}</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Marchează completă
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Sarcini completate</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.filter(task => task.status === 'completed').map((task) => (
              <div key={task.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 line-through">{task.title}</h4>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{task.field}</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TasksWidget;
