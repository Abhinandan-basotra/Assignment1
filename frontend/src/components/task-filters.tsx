import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, RotateCcw } from 'lucide-react';

interface TaskFiltersProps {
  onFilterChange: (filters: {
    status?: string;
    priority?: string;
    sort?: string;
  }) => void;
}

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const handleStatusChange = (value: string) => {
    onFilterChange({
      status: value === 'all' ? undefined : value,
    });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({
      priority: value === 'all' ? undefined : value,
    });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({
      sort: value === 'newest' ? 'newest' : 'oldest',
    });
  };

  const handleReset = () => {
    onFilterChange({});
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Filter Tasks</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select defaultValue="all" onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <Select defaultValue="all" onValueChange={handlePriorityChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sort By</label>
          <Select defaultValue="newest" onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-2 bg-transparent"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filters
        </Button>
      </div>
    </Card>
  );
}
