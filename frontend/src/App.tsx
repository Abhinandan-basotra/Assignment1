import { useState, useEffect } from 'react';
import AddTaskForm from '@/components/add-task-form';
import TaskFilters from './components/task-filters';
import TaskList from './components/task-list';
import TaskStats from './components/task-stats';
import { getTasks, type Task } from '@/lib/api';

export default function Page() {
  const [filters, setFilters] = useState<{
    status?: string;
    priority?: string;
    sort?: string;
  }>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    const result = await getTasks(filters);
    if (result.success && Array.isArray(result.data)) {
      setTasks(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [filters, refreshTrigger]);

  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFilterChange = (newFilters: {
    status?: string;
    priority?: string;
    sort?: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
            Your Tasks
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Organize your work, boost productivity, and achieve more with intelligent task management
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading your tasks...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <div className="mb-12">
              <TaskStats tasks={tasks} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                    <h2 className="text-white font-semibold text-lg">Create New Task</h2>
                  </div>
                  <div className="p-6">
                    <AddTaskForm onTaskCreated={handleTaskCreated} />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                    <h2 className="text-white font-semibold text-lg">Filter & Sort Tasks</h2>
                  </div>
                  <div className="p-6">
                    <TaskFilters onFilterChange={handleFilterChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                <h2 className="text-white font-semibold text-lg">Task List</h2>
              </div>
              <div className="p-6">
                <TaskList filters={filters} refreshTrigger={refreshTrigger} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
