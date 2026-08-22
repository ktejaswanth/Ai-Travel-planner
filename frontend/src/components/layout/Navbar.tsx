import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, LogOut, PlusCircle, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent tracking-tight">
            TripWise <span className="text-sky-400 font-light">AI</span>
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
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
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
                <div className="flex items-center space-x-2 text-slate-300 text-sm font-medium">
                  <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">
                    <UserIcon className="h-4 w-4 text-sky-400" />
                  </div>
                  <span className="hidden sm:inline">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2">
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
