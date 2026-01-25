import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckSquare, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Estudiar', category: 'Pre-Market', completed: false },
  { id: '2', title: 'Backtesting / analizar mercado', category: 'Pre-Market', completed: false },
  { id: '3', title: 'Lectura 30 mins', category: 'Pre-Market', completed: false },
];

export function TasksCard({ className }: { className?: string }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState('');

  const pendingCount = tasks.filter(t => !t.completed).length;

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      title: newTask,
      category: 'Pre-Market',
      completed: false,
    }]);
    setNewTask('');
  };

  return (
    <div className={cn('p-5 rounded-xl glass-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-success" />
          <h3 className="text-sm font-medium">Tareas del Día</h3>
        </div>
        <Badge className="bg-primary/10 text-primary text-xs">
          {pendingCount} Pendientes
        </Badge>
      </div>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nueva tarea..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="flex-1 bg-muted/30 backdrop-blur-sm border-border/30 text-sm"
        />
        <Button 
          size="icon" 
          onClick={addTask}
          className="bg-primary hover:bg-primary/90 shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all',
              task.completed 
                ? 'bg-success/5 border border-success/20' 
                : 'bg-muted/30 hover:bg-muted/50'
            )}
          >
            <div className={cn(
              'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all',
              task.completed 
                ? 'bg-success border-success' 
                : 'border-muted-foreground/30'
            )}>
              {task.completed && <Check className="h-3 w-3 text-success-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm transition-all',
                task.completed && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {task.category}
              </p>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Lista vacía</p>
          </div>
        )}
      </div>
    </div>
  );
}
