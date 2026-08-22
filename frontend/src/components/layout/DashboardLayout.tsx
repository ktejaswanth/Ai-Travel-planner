import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Menu, Plus, Search, User as UserIcon } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../features/auth/AuthContext';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  searchQuery,
  onSearchChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/trips/create') return 'Dashboard / Create New Trip';
    if (path.startsWith('/trips/')) return 'Dashboard / Trip Details';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Left Navigation Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Workspace */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors duration-200">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Title */}
            <div className="truncate">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {getBreadcrumbs()}
              </span>
            </div>
          </div>

          {/* Header Action Items */}
          <div className="flex items-center space-x-3">
            {/* Search Input (If handler provided) */}
            {onSearchChange !== undefined && (
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search trips..."
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>
            )}

            {/* Light / Dark Mode Switcher */}
            <ThemeToggle />

            {/* Quick Action Button */}
            <button
              onClick={() => navigate('/trips/create')}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 text-white shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Plan Trip</span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 text-xs font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};
