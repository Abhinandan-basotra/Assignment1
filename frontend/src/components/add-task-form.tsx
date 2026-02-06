import React from "react"

import { useState } from 'react';
import { createTask } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from "react-toastify";

interface AddTaskFormProps {
  onTaskCreated: () => void;
}

export default function AddTaskForm({ onTaskCreated }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'completed'>('todo');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.info('Please enter a task title');
      return;
    }

    setIsLoading(true);

    const result = await createTask({
      title,
      description,
      status,
      priority,
    });

    if (result.success) {
      toast.success('Task created successfully');
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      onTaskCreated();
    } else {
      toast.error( result.error || 'Failed to create task');
    }

    setIsLoading(false);
  };

  return (
    <Card className="p-6 border-t-4 border-t-blue-500">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Create New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Task Title *
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            maxLength={100}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this task..."
            maxLength={500}
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/500</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger id="priority" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger id="status" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
          {isLoading ? 'Creating...' : 'Create Task'}
        </Button>
      </form>
    </Card>
  );
}
