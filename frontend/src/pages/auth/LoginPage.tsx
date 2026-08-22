import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Toast, ToastMessage } from '../../components/ui/Toast';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [toast, setToast] = useState<ToastMessage | null>(
    searchParams.get('expired')
      ? { id: '1', type: 'info', title: 'Session Expired', message: 'Please log in again to continue.' }
      : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setToast(null);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Invalid email or password';
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Authentication Failed',
        message: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      {/* Top Bar with Theme Toggle */}
      <div className="flex justify-between items-center max-w-7xl w-full mx-auto p-2">
        <Link to="/" className="flex items-center space-x-2">
          <div className="p-1.5 bg-sky-600 dark:bg-sky-500 text-white rounded-xl shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">TripWise AI</span>
        </Link>
        <ThemeToggle showLabel />
      </div>

      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}

      <div className="w-full max-w-md mx-auto my-auto space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to manage your travel itineraries</p>
        </div>

        <Card className="shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>

      <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 py-2">
        © {new Date().getFullYear()} TripWise AI. All rights reserved.
      </div>
    </div>
  );
};
