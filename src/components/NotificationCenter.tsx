
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, CheckCircle, Brain, TrendingDown } from 'lucide-react';

const NotificationCenter = () => {
  const { notifications, markNotificationAsRead, tasks, addNotification } = useAppContext();
  const navigate = useNavigate();
  
  // Add today's tasks as notifications
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => {
      const taskDate = task.due_date || task.date;
      return taskDate === today && task.status === 'pending';
    });

    // Add notifications for today's tasks that don't already exist
    todayTasks.forEach(task => {
      const notificationExists = notifications.some(n => 
        n.type === 'task' && 
        n.message.includes(task.title) && 
        n.created_at.split('T')[0] === today
      );
      
      if (!notificationExists) {
        addNotification({
          type: 'task',
          title: 'Sarcină programată astăzi',
          message: `"${task.title}" este programată pentru astăzi pe ${task.field_name}`,
          priority: task.priority,
          read: false,
          is_read: false,
          read_at: null
        });
      }
    });
  }, [tasks, notifications, addNotification]);

  const unreadCount = notifications.filter(n => !n.read && !n.is_read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'inventory':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'ai':
        return <Brain className="h-4 w-4 text-purple-600" />;
      case 'weather':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'financial':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-amber-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read && !notification.is_read) {
      markNotificationAsRead(notification.id);
    }

    // Redirecționare în funcție de tipul notificării
    switch (notification.type) {
      case 'task':
        navigate('/planning');
        break;
      case 'inventory':
        navigate('/inventory');
        break;
      case 'ai':
        if (notification.message.includes('teren detectată')) {
          navigate('/map');
        } else {
          navigate('/');
        }
        break;
      case 'weather':
        navigate('/');
        break;
      case 'financial':
        navigate('/finance');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-green-700" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notificări ({unreadCount} necitite)</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nu aveți notificări</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} bg-gray-50 rounded-r-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                  !notification.read && !notification.is_read ? 'bg-blue-50 hover:bg-blue-100' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium text-sm ${!notification.read && !notification.is_read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title || notification.message.substring(0, 30) + '...'}
                      </h4>
                      {!notification.read && !notification.is_read && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">Nou</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString('ro-RO')}</p>
                      <span className="text-xs text-blue-600 hover:text-blue-800">Click pentru a vedea detalii →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {unreadCount > 0 && (
          <div className="mt-6">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => notifications.filter(n => !n.read && !n.is_read).forEach(n => markNotificationAsRead(n.id))}
            >
              Marchează toate ca citite
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
