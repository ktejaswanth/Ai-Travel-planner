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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Compass className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
              TripWise AI
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400">Sign in to manage your travel itineraries</p>
        </div>

        <Card className="border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
