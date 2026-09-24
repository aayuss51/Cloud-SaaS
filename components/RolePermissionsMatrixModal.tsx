import React, { useState } from 'react';
import { X, Check, Lock, ShieldCheck, UserCheck, Sparkles, Building2, Crown, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { PERMISSIONS_MATRIX, ROLE_CONFIGS } from '../services/permissions';
import { RoleBadge } from './RoleGuard';

interface RolePermissionsMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RolePermissionsMatrixModal: React.FC<RolePermissionsMatrixModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, switchUserRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const currentRole = user?.role || 'GUEST';

  const roles: { role: UserRole; title: string; colKey: 'superAdmin' | 'admin' | 'hotelAdmin' | 'frontDesk' | 'housekeeping' | 'guest' }[] = [
    { role: 'SUPER_ADMIN', title: 'SuperAdmin', colKey: 'superAdmin' },
    { role: 'HOTEL_ADMIN', title: 'Hotel GM', colKey: 'hotelAdmin' },
    { role: 'ADMIN', title: 'Ent. Admin', colKey: 'admin' },
    { role: 'FRONT_DESK', title: 'Front Desk', colKey: 'frontDesk' },
    { role: 'HOUSEKEEPING', title: 'Housekeeping', colKey: 'housekeeping' },
    { role: 'GUEST', title: 'Guest', colKey: 'guest' },
  ];

  const filteredMatrix = PERMISSIONS_MATRIX.filter(row => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return row.module.toLowerCase().includes(q) || row.description.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-5xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Live RBAC Architecture
              </span>
              <span className="text-xs text-slate-400">• Click any column to switch role instantly</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Role-Based Access Control (RBAC) Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive security and privilege breakdown across all modules of Mero Booking PMS.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search permissions or modules..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Currently Active:</span>
            <RoleBadge role={currentRole} size="md" />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-y-auto flex-1 custom-scrollbar p-6">
          <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-slate-300">
                  <th className="p-4 font-bold min-w-[240px] text-slate-200">System Capability / Module</th>
                  {roles.map(r => {
                    const isCurrent = currentRole === r.role;
                    return (
                      <th
                        key={r.role}
                        className={`p-3 text-center min-w-[110px] transition-colors ${
                          isCurrent ? 'bg-blue-600/20 border-x border-blue-500/40' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="font-bold text-white text-xs">{r.title}</span>
                          <RoleBadge role={r.role} size="sm" showIcon={false} />
                          {isCurrent ? (
                            <span className="text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded font-black uppercase">
                              Active
                            </span>
                          ) : (
                            <button
                              onClick={() => switchUserRole(r.role)}
                              className="text-[9px] text-slate-300 hover:text-white bg-slate-800 hover:bg-blue-600 px-2 py-0.5 rounded font-bold transition-all border border-slate-700 hover:border-blue-500"
                            >
                              Switch →
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white text-xs">{row.module}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{row.description}</p>
                    </td>

                    {roles.map(r => {
                      const hasAccess = row[r.colKey];
                      const isCurrent = currentRole === r.role;

                      return (
                        <td
                          key={r.role}
                          className={`p-3 text-center ${
                            isCurrent ? 'bg-blue-600/10 border-x border-blue-500/30' : ''
                          }`}
                        >
                          {hasAccess ? (
                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <Check size={16} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 text-slate-600">
                              <Lock size={13} />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
          <p className="text-slate-400 text-[11px]">
            Roles enforce strict access boundaries across URL routes, action buttons, API mutations, and navigation links.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
