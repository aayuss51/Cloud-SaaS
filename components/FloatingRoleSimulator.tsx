import React, { useState } from 'react';
import { UserCheck, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Building2, Crown, Grid, ExternalLink, ArrowRight, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { ROLE_CONFIGS, isStaffRole } from '../services/permissions';
import { RoleBadge } from './RoleGuard';

interface FloatingRoleSimulatorProps {
  onOpenMatrix: () => void;
}

export const FloatingRoleSimulator: React.FC<FloatingRoleSimulatorProps> = ({ onOpenMatrix }) => {
  const { user, switchUserRole } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentRole = user?.role || 'GUEST';
  const meta = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.GUEST;

  const roleList: UserRole[] = [
    'SUPER_ADMIN',
    'HOTEL_ADMIN',
    'FRONT_DESK',
    'HOUSEKEEPING',
    'GUEST',
  ];

  const handleRoleSelect = (role: UserRole) => {
    switchUserRole(role);
    if (role === 'GUEST' && location.pathname.startsWith('/admin')) {
      navigate('/my-bookings');
    } else if (role !== 'GUEST' && location.pathname === '/my-bookings') {
      navigate('/admin');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 print:hidden font-sans">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white rounded-2xl shadow-2xl transition-all overflow-hidden max-w-sm">
        {/* Header Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Role Simulator:
            </span>
            <RoleBadge role={currentRole} size="sm" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={e => {
                e.stopPropagation();
                onOpenMatrix();
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition-colors text-[10px] flex items-center gap-1"
              title="View full permissions matrix"
            >
              <Grid size={13} />
            </button>
            <div className="text-slate-400">
              {isExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            </div>
          </div>
        </div>

        {/* Expanded Drawer */}
        {isExpanded && (
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5 text-xs animate-fade-in-up">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Switch persona to test live UI:</span>
              <span className="text-[10px] text-blue-400 font-mono">Real-time RBAC</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto custom-scrollbar">
              {roleList.map(r => {
                const isSelected = currentRole === r;
                const rMeta = ROLE_CONFIGS[r];

                return (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <RoleBadge role={r} size="sm" showIcon={false} />
                      <span className="truncate">{rMeta.title}</span>
                    </div>

                    {isSelected && (
                      <span className="text-[9px] bg-blue-800 text-blue-100 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <button
                onClick={onOpenMatrix}
                className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
              >
                <Grid size={13} />
                <span>View Full RBAC Matrix</span>
              </button>

              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                Minimize
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
