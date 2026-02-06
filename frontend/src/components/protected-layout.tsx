import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutGrid } from 'lucide-react';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Task<span className="text-blue-600">Manager</span>
              </h1>
              <p className="text-xs text-gray-500">Productivity Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:block text-right">
                <p className="text-gray-700 font-medium text-sm">{user.username}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
            )}
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Outlet />
      </div>
    </main>
  );
}