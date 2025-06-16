
import React from 'react';

interface TaskBadgesProps {
  fieldName: string;
  tasks: any[];
}

const TaskBadges = ({ fieldName, tasks }: TaskBadgesProps) => {
  const getTodayTaskStats = (fieldName: string) => {
    const today = new Date().toISOString().split('T')[0];
    const fieldTasks = tasks.filter(task => 
      task.field_name === fieldName && 
      task.date === today && 
      task.status === 'pending'
    );
    
    const highPriority = fieldTasks.filter(task => task.priority === 'high').length;
    const mediumPriority = fieldTasks.filter(task => task.priority === 'medium').length;
    const lowPriority = fieldTasks.filter(task => task.priority === 'low').length;
    
    const badges = [];
    
    if (highPriority > 0) {
      badges.push({
        count: highPriority,
        color: 'bg-red-500',
        textColor: 'text-white'
      });
    }
    
    if (mediumPriority > 0) {
      badges.push({
        count: mediumPriority,
        color: 'bg-amber-500',
        textColor: 'text-white'
      });
    }
    
    if (lowPriority > 0) {
      badges.push({
        count: lowPriority,
        color: 'bg-green-500',
        textColor: 'text-white'
      });
    }
    
    return badges;
  };

  const taskStats = getTodayTaskStats(fieldName);

  return (
    <div className="flex items-center space-x-2">
      {taskStats.map((stat, index) => (
        <div key={index} className={`${stat.color} ${stat.textColor} rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium`}>
          {stat.count}
        </div>
      ))}
    </div>
  );
};

export default TaskBadges;
