import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'segmented' | 'compact-segmented';
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className = '',
  showLabels = false,
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'segmented' || variant === 'compact-segmented') {
    const isCompact = variant === 'compact-segmented';
    const modes: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
      { id: 'light', label: 'Light', icon: Sun },
      { id: 'dark', label: 'Dark', icon: Moon },
      { id: 'system', label: 'System', icon: Laptop },
    ];

    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 transition-colors ${className}`}
        role="group"
        aria-label="Theme selector"
      >
        {modes.map(mode => {
          const isActive = theme === mode.id;
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => setTheme(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              } ${isCompact ? 'px-2 py-1 text-[11px]' : ''}`}
              title={`Switch to ${mode.label} Mode`}
              type="button"
            >
              <Icon size={isCompact ? 13 : 14} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : ''} />
              {(showLabels || !isCompact) && <span>{mode.label}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'icon' button
  const isDark = resolvedTheme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2 rounded-xl border transition-all text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun size={16} className="text-amber-400 animate-fade-in-up" />
        ) : (
          <Moon size={16} className="text-indigo-600 animate-fade-in-up" />
        )}
      </div>
    </button>
  );
};
