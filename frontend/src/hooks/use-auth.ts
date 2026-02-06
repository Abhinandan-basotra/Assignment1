import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logout, type User } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication...');
      try {
        const result = await getCurrentUser();
        console.log('Auth check result:', result);
        if (result.success && result.data) {
          setUser(result.data);
          setIsAuthenticated(true);
          console.log('User authenticated:', result.data);
        } else {
          setIsAuthenticated(false);
          console.log('User not authenticated:', result.error);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      console.log('Logging out...');
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout: handleLogout,
  };
}
