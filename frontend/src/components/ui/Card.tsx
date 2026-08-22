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
      className={`glass-panel rounded-2xl p-6 shadow-xl transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-2xl hover:border-sky-500/30 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
