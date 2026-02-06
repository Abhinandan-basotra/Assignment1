import { useState } from 'react';
import { login } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success('Logged in successfully');
      router('/');
    } else {
      setError(result.error || 'Login failed');
      toast.error(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <LogIn className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Task<span className="text-blue-600">Manager</span></h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Login to Your Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
