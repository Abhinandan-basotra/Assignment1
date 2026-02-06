import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface Task {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: string;
  _id?: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  message?: string;
}

export interface TaskResponse {
  success: boolean;
  data?: Task | Task[];
  error?: string;
  message?: string;
}

export const register = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.error || 'Registration failed',
    };
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.error || 'Login failed',
    };
  }
};

export const logout = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.error || 'Logout failed',
    };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<{
  success: boolean;
  data?: User;
  error?: string;
}> => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.error || 'Failed to fetch user',
    };
  }
};

export const getTasks = async (filters?: {
  status?: string;
  priority?: string;
  sort?: string;
}): Promise<TaskResponse> => {
  try {
    const response = await api.get('/api/tasks', { params: filters });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.error || 'Failed to fetch tasks',
    };
  }
};

export const getTask = async (id: string): Promise<TaskResponse> => {
  try {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.error || 'Failed to fetch task',
    };
  }
};

export const createTask = async (task: Task): Promise<TaskResponse> => {
  try {
    const response = await api.post('/api/tasks', task);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.error || 'Failed to create task',
    };
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<TaskResponse> => {
  try {
    const response = await api.put(`/api/tasks/${id}`, updates);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.error || 'Failed to update task',
    };
  }
};

export const deleteTask = async (id: string): Promise<TaskResponse> => {
  try {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: axiosError.response?.data?.error || 'Failed to delete task',
    };
  }
};
