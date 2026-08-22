import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  LogOut,
  MapPin,
  PlusCircle,
  Settings,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Plan New Trip', path: '/trips/create', icon: <PlusCircle className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Header & Logo */}
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2.5 group">
              <div className="p-2 bg-sky-600 dark:bg-sky-500 rounded-xl shadow-md shadow-sky-500/20 text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                TripWise <span className="text-sky-600 dark:text-sky-400 font-light">AI</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Create Action Button */}
          <button
            onClick={() => {
              navigate('/trips/create');
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-medium text-sm rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Trip</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Menu
            </p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 font-semibold border border-sky-200 dark:border-sky-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: User Card & Theme Switcher */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Appearance
            </span>
            <ThemeToggle showLabel />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg shrink-0">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || 'Traveler'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
