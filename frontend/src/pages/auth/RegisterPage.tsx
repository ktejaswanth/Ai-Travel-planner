import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Toast, ToastMessage } from '../../components/ui/Toast';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setToast(null);
    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create account';
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Registration Error',
        message: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

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
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h2>
          <p className="text-sm text-slate-400">Start planning personalized travel itineraries</p>
        </div>

        <Card className="border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              icon={<UserIcon className="h-4 w-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jane@example.com"
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
