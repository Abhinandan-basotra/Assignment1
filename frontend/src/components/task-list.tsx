import { useState, useEffect } from 'react';
import { getTasks, deleteTask, updateTask, type Task } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import TaskModal from './task-modal';

interface TaskListProps {
  filters?: {
    status?: string;
    priority?: string;
  };
  refreshTrigger?: number;
}

export default function TaskList({ filters, refreshTrigger }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    const result = await getTasks(filters);
    if (result.success && Array.isArray(result.data)) {
      setTasks(result.data);
    } else {
      toast.error(result.error || 'Failed to load tasks');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [filters, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(id);
      if (result.success) {
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success('Task deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (task: Task) => {
    const statusCycle = { 'todo': 'in-progress', 'in-progress': 'completed', 'completed': 'todo' };
    const newStatus = statusCycle[task.status as keyof typeof statusCycle] as Task['status'];

    const result = await updateTask(task._id || '', { status: newStatus });
    if (result.success) {
      setTasks(tasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)));
      toast.success(`Task status updated to ${newStatus}`);
    } else {
      toast.error(result.error || 'Failed to update task');
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskSaved = () => {
    loadTasks();
    handleModalClose();
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Circle className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600">No tasks found</h3>
        <p className="text-gray-500 mt-1">Create your first task to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card
            key={task._id}
            className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 hover:scale-[1.02] cursor-pointer"
            style={{
              borderLeftColor: task.priority === 'high' ? '#ef4444' : 
                              task.priority === 'medium' ? '#f59e0b' : '#10b981'
            }}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleStatusChange(task)}
                className="mt-1 flex-shrink-0 hover:opacity-70 transition-opacity"
                title="Click to change status"
              >
                {getStatusIcon(task.status)}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3
                    className={`text-lg font-semibold ${
                      task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.priority && (
                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {task.status}
                  </Badge>
                </div>

                {task.description && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{task.description}</p>
                )}

                {task.createdAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Created {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditTask(task)}
                  className="h-9 w-9 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task._id || '')}
                  className="h-9 w-9 p-0 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedTask && (
        <TaskModal
          isOpen={isModalOpen}
          task={selectedTask}
          onClose={handleModalClose}
          onSave={handleTaskSaved}
        />
      )}
    </>
  );
}
