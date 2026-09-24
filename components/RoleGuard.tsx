import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Permission, hasPermission, hasAnyRole, ROLE_CONFIGS } from '../services/permissions';
import { ShieldAlert, Lock, ArrowRight, CheckCircle2, UserCheck, Sparkles, Building2, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  permission?: Permission;
  fallback?: ReactNode;
  /**
   * If true, will render the children in a disabled state with a lock tooltip
   * instead of completely hiding them or rendering fallback.
   */
  renderDisabled?: boolean;
  disabledTooltip?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  permission,
  fallback = null,
  renderDisabled = false,
  disabledTooltip,
}) => {
  const { user } = useAuth();
  const currentRole = user?.role;

  let hasAccess = true;

  if (allowedRoles && allowedRoles.length > 0) {
    hasAccess = hasAnyRole(currentRole, allowedRoles);
  }

  if (hasAccess && permission) {
    hasAccess = hasPermission(currentRole, permission);
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (renderDisabled) {
    const requiredTitle = allowedRoles?.map(r => ROLE_CONFIGS[r]?.title || r).join(', ') || 'Authorized Staff';
    return (
      <div className="relative group inline-block cursor-not-allowed">
        <div className="opacity-45 pointer-events-none filter grayscale select-none">
          {children}
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-slate-900/95 text-white text-[10px] font-semibold py-1 px-2 rounded shadow-xl border border-slate-700 flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md">
            <Lock size={12} className="text-amber-400" />
            <span>{disabledTooltip || `Requires: ${requiredTitle}`}</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{fallback}</>;
};

export const RoleBadge: React.FC<{
  role?: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}> = ({ role = 'GUEST', size = 'sm', showIcon = true, className = '' }) => {
  const meta = ROLE_CONFIGS[role] || ROLE_CONFIGS.GUEST;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  const getIcon = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Crown size={size === 'lg' ? 16 : 12} className="text-purple-400" />;
      case 'ADMIN':
      case 'HOTEL_ADMIN':
        return <Building2 size={size === 'lg' ? 16 : 12} className="text-blue-400" />;
      case 'FRONT_DESK':
        return <UserCheck size={size === 'lg' ? 16 : 12} className="text-cyan-400" />;
      case 'HOUSEKEEPING':
        return <Sparkles size={size === 'lg' ? 16 : 12} className="text-amber-400" />;
      default:
        return <ShieldAlert size={size === 'lg' ? 16 : 12} className="text-emerald-400" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg font-semibold border ${meta.color.badgeBg} ${meta.color.badgeText} ${sizeClasses} ${className}`}
      title={`${meta.title} — ${meta.description}`}
    >
      {showIcon && getIcon()}
      <span>{meta.badge}</span>
    </span>
  );
};

export const AccessDenied: React.FC<{
  requiredRoles?: UserRole[];
  requiredPermission?: string;
  moduleName?: string;
  onOpenMatrix?: () => void;
}> = ({ requiredRoles = ['HOTEL_ADMIN', 'ADMIN', 'SUPER_ADMIN'], requiredPermission, moduleName, onOpenMatrix }) => {
  const { user, switchUserRole } = useAuth();
  const currentRole = user?.role || 'GUEST';
  const currentMeta = ROLE_CONFIGS[currentRole];

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center space-y-6 animate-fade-in-up">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
        <ShieldAlert size={32} />
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          Role-Based Access Control (RBAC)
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Access Restricted {moduleName ? `to ${moduleName}` : ''}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Your current account role does not have administrative authorization to view or modify this operational section.
        </p>
      </div>

      {/* Role State Comparer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left p-4 bg-slate-850 rounded-2xl border border-slate-800 text-xs">
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Your Active Role</p>
          <div className="flex items-center gap-2 mt-1.5">
            <RoleBadge role={currentRole} size="md" />
            <span className="font-bold text-white text-xs">{currentMeta?.title}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{currentMeta?.description}</p>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Required Privileges</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {requiredRoles.map(r => (
              <RoleBadge key={r} role={r} size="sm" />
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {requiredPermission ? `Needs '${requiredPermission}'` : 'Elevated staff credentials required'}
          </p>
        </div>
      </div>

      {/* Quick Role Simulation (RBAC Tester) */}
      <div className="pt-2 border-t border-slate-800/80 space-y-3">
        <p className="text-xs font-semibold text-slate-300">
          Switch to an authorized role to test this page:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {requiredRoles.map(role => (
            <button
              key={role}
              onClick={() => switchUserRole(role)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              <span>Switch to {ROLE_CONFIGS[role]?.title}</span>
              <ArrowRight size={13} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs pt-2">
        <Link
          to="/admin"
          className="text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Operations Overview
        </Link>
        {onOpenMatrix && (
          <button
            onClick={onOpenMatrix}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            View Full Permissions Matrix
          </button>
        )}
      </div>
    </div>
  );
};
