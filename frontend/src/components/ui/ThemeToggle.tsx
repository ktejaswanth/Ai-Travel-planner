import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${className}`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 transition-transform duration-200 hover:-rotate-12 text-slate-700" />
      ) : (
        <Sun className="h-5 w-5 transition-transform duration-200 hover:rotate-45 text-amber-400" />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-medium capitalize text-slate-700 dark:text-slate-300">
          {theme} Mode
        </span>
      )}
    </button>
  );
};
