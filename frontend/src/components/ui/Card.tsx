import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-sm dark:shadow-card-dark transition-all duration-200 ${
        hoverEffect ? 'hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-lg hover:border-sky-500/40 dark:hover:border-sky-500/40 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
