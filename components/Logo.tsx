import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  theme?: 'auto' | 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = true,
  className = '',
  theme = 'auto',
}) => {
  // Dimensions based on size
  const markDimensions = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const badgeSizes = {
    sm: 'text-[9px] px-1.5 py-0.2',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-0.5',
    xl: 'text-sm px-3 py-1',
  };

  // SVG Mark
  const LogoMark = (
    <div
      className={`relative ${markDimensions[size]} rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-600/25 border border-white/20 shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden`}
    >
      {/* Top Gloss */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 pointer-events-none rounded-t-xl" />

      {/* SVG Icon */}
      <svg
        viewBox="0 0 100 100"
        className="w-[72%] h-[72%] drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mountain/Hotel Roof Peak */}
        <path
          d="M50 14 L72 32 L72 40 L50 22 L28 40 L28 32 Z"
          fill="#38BDF8"
        />
        {/* Booking Star Dot */}
        <circle cx="50" cy="18" r="3.5" fill="#FFFFFF" />
        {/* Stylized 'M' Architecture */}
        <path
          d="M18 82 V36 C18 32.5 20.5 30 24 30 H28 C31.5 30 34 32.5 34 36 V62 L48 50 C49.2 49 50.8 49 52 50 L66 62 V36 C66 32.5 68.5 30 72 30 H76 C79.5 30 82 32.5 82 36 V82 C82 85 79.5 87 76 87 H72 C68.5 87 66 85 66 82 V69 L50 55 L34 69 V82 C34 85 31.5 87 28 87 H24 C20.5 87 18 85 18 82 Z"
          fill="#FFFFFF"
        />
        {/* Base Foundation Bar */}
        <rect x="16" y="85" width="68" height="4.5" rx="2.25" fill="#38BDF8" />
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{LogoMark}</div>;
  }

  const textColorMero =
    theme === 'light'
      ? 'text-slate-900'
      : theme === 'dark'
      ? 'text-white'
      : 'text-slate-900 dark:text-white';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {LogoMark}
      <div className="flex flex-col leading-tight select-none">
        <div className="flex items-center gap-2">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${textColorMero} font-sans`}
          >
            Mero <span className="text-blue-600 dark:text-blue-400">Booking</span>
          </span>
          {variant !== 'compact' && (
            <span
              className={`${badgeSizes[size]} font-extrabold tracking-widest text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 rounded-full uppercase`}
            >
              Nepal
            </span>
          )}
        </div>
        {showTagline && variant !== 'compact' && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide hidden sm:block">
            Hotel, Resort & Stay Reservations
          </p>
        )}
      </div>
    </div>
  );
};
