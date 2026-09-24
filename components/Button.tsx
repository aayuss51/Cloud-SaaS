import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'liquid';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "group relative inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.97] backdrop-blur-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: `
      bg-blue-600/95 text-white 
      hover:bg-blue-500 
      border-t border-white/25 border-b border-blue-900/20
      shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(37,99,235,0.7)]
      ring-1 ring-white/10
    `,
    liquid: `
      bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white
      border-t border-white/40 border-b border-black/20
      shadow-[0_20px_50px_-15px_rgba(37,99,235,0.5)]
      hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.7)]
      ring-1 ring-white/20
    `,
    secondary: `
      bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-white
      hover:bg-white dark:hover:bg-slate-700
      border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg
      ring-1 ring-black/5
    `,
    danger: `
      bg-rose-600/90 text-white 
      hover:bg-rose-500/95 
      border-t border-white/25 border-b border-rose-900/20
      shadow-[0_10px_30px_-10px_rgba(225,29,72,0.4)]
      ring-1 ring-white/10
    `,
    outline: `
      bg-transparent text-slate-700 dark:text-slate-200
      border border-slate-200 dark:border-slate-700
      hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600
      hover:shadow-sm
    `
  };

  const sizes = {
    sm: "px-4 py-2 text-xs tracking-widest uppercase",
    md: "px-6 py-3 text-sm tracking-widest uppercase",
    lg: "px-10 py-5 text-base tracking-widest uppercase"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Internal Gloss Highlight */}
      <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none transition-opacity group-hover:opacity-100"></div>
      
      {/* Moving Shimmer Effect */}
      <div className="absolute inset-0 w-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm">
        {children}
      </span>
    </button>
  );
};