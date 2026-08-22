import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, LogOut, PlusCircle, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 bg-sky-600 dark:bg-sky-500 text-white rounded-xl shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            TripWise <span className="text-sky-600 dark:text-sky-400 font-light">AI</span>
          </span>
        </Link>

        <nav className="flex items-center space-x-3">
          {/* Light / Dark Mode Switcher */}
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-2 py-1"
              >
                Dashboard
              </Link>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="h-4 w-4" />}
                onClick={() => navigate('/trips/create')}
              >
                Plan New Trip
              </Button>
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <UserIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="hidden sm:inline">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
