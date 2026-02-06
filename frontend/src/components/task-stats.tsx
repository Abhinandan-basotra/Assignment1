import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, AlertCircle, TrendingUp } from 'lucide-react';
import type { Task } from '@/lib/api';

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: total,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'In Progress',
      value: inProgress,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'To Do',
      value: todo,
      icon: Circle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
      
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
          </div>
          <div className="w-12 h-12 relative">
            <svg className="transform -rotate-90 w-12 h-12">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#9333ea"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - completionRate / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
          </div>
        </div>
      </Card>

      {highPriority > 0 && (
        <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{highPriority}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
