import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  Plus,
  Crown,
  ExternalLink,
  Sparkles,
  Check,
  UserCheck,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface SaaSTopBarProps {
  onOpenNewPropertyModal?: () => void;
  onOpenUpgradeModal?: () => void;
}

export const SaaSTopBar: React.FC<SaaSTopBarProps> = ({
  onOpenNewPropertyModal,
  onOpenUpgradeModal,
}) => {
  const { currentProperty, properties, switchProperty, isAllPropertiesView, setAllPropertiesView } = useTenant();
  const { user, switchUserRole, logout } = useAuth();
  const navigate = useNavigate();

  const [isPropDropdownOpen, setIsPropDropdownOpen] = useState(false);
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const personas: { role: UserRole; title: string; desc: string; badge: string }[] = [
    { role: 'SUPER_ADMIN', title: 'Platform SuperAdmin', desc: 'SaaS Platform Owner (All properties & MRR)', badge: 'Owner' },
    { role: 'HOTEL_ADMIN', title: 'General Manager (GM)', desc: 'Full hotel operational & revenue control', badge: 'Executive' },
    { role: 'FRONT_DESK', title: 'Front Desk / Concierge', desc: 'Fast check-in, folio billing, tape chart', badge: 'Operations' },
    { role: 'HOUSEKEEPING', title: 'Housekeeping Lead', desc: 'Room cleaning board, maintenance tickets', badge: 'Staff' },
    { role: 'GUEST', title: 'Guest / Traveler', desc: 'Direct booking portal, digital room key', badge: 'Traveler' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: SaaS Brand & Property Switcher */}
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-black text-sm tracking-wider">
              MB
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-sans">Mero-Booking</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase tracking-widest">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Hospitality Cloud OS</p>
            </div>
          </Link>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Multi-Tenant Property Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsPropDropdownOpen(!isPropDropdownOpen);
                setIsPersonaDropdownOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-sm text-slate-200 transition-all group"
            >
              <Building2 size={16} className="text-emerald-400 shrink-0" />
              <div className="text-left max-w-[140px] sm:max-w-[200px] truncate">
                <div className="font-semibold text-xs text-white truncate">
                  {isAllPropertiesView ? '🌐 All Properties (Global)' : currentProperty?.name || 'Select Hotel'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {isAllPropertiesView ? 'Multi-tenant overview' : `${currentProperty?.city}, ${currentProperty?.country}`}
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-transform" />
            </button>

            {isPropDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-fade-in-up">
                <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Tenant Properties</span>
                  <span className="text-[10px] text-emerald-400">{properties.length} Active</span>
                </div>

                {user?.role === 'SUPER_ADMIN' && (
                  <button
                    onClick={() => {
                      setAllPropertiesView(true);
                      setIsPropDropdownOpen(false);
                      navigate('/admin');
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs mb-1 transition-colors ${
                      isAllPropertiesView ? 'bg-emerald-600/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-emerald-400" />
                      <span>All Properties (Consolidated)</span>
                    </div>
                    {isAllPropertiesView && <Check size={14} className="text-emerald-400" />}
                  </button>
                )}

                <div className="space-y-1 my-1 max-h-56 overflow-y-auto custom-scrollbar">
                  {properties.map(prop => {
                    const isSelected = !isAllPropertiesView && currentProperty?.id === prop.id;
                    return (
                      <button
                        key={prop.id}
                        onClick={() => {
                          switchProperty(prop.id);
                          setIsPropDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold truncate">{prop.name}</p>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {prop.city} • <span className="uppercase">{prop.tier}</span> Plan
                          </p>
                        </div>
                        {isSelected && <Check size={14} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-800 pt-2 mt-1">
                  <button
                    onClick={() => {
                      setIsPropDropdownOpen(false);
                      if (onOpenNewPropertyModal) onOpenNewPropertyModal();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-500/30 transition-all"
                  >
                    <Plus size={14} />
                    <span>Onboard New Property</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center/Right: Subscription Quota & Quick Persona Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* SaaS Tier & Quota Indicator */}
          {currentProperty && (
            <button
              onClick={onOpenUpgradeModal}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-amber-500/10 to-amber-600/20 border border-amber-500/30 rounded-lg text-amber-300 text-xs hover:border-amber-400 transition-all"
            >
              <Crown size={14} className="text-amber-400" />
              <span className="font-semibold capitalize">{currentProperty.tier.toLowerCase()} Tier</span>
              <span className="text-[10px] text-amber-200/80 bg-amber-500/20 px-1.5 py-0.5 rounded">
                Max {currentProperty.roomLimit} Rooms
              </span>
            </button>
          )}

          {/* Quick Persona Switcher (Interactive Demo superpower) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsPersonaDropdownOpen(!isPersonaDropdownOpen);
                setIsPropDropdownOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs text-slate-200 transition-all"
              title="Switch user role to test permissions"
            >
              <UserCheck size={15} className="text-cyan-400" />
              <span className="hidden md:inline font-medium">Role:</span>
              <span className="font-bold text-white bg-slate-700/60 px-1.5 py-0.5 rounded text-[11px]">
                {user?.role?.replace('_', ' ') || 'Guest'}
              </span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {isPersonaDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-fade-in-up">
                <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Switch Testing Persona</span>
                  <span className="text-[10px] text-cyan-400">Live RBAC</span>
                </div>
                <div className="space-y-1 my-1">
                  {personas.map(p => {
                    const isCurrent = user?.role === p.role;
                    return (
                      <button
                        key={p.role}
                        onClick={() => {
                          switchUserRole(p.role);
                          setIsPersonaDropdownOpen(false);
                          if (p.role === 'GUEST') {
                            navigate('/my-bookings');
                          } else {
                            navigate('/admin');
                          }
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start justify-between ${
                          isCurrent ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-200' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white">{p.title}</span>
                            <span className="text-[9px] uppercase px-1 py-0.2 bg-slate-800 text-slate-300 rounded font-mono">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{p.desc}</p>
                        </div>
                        {isCurrent && <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Public Guest Stays Preview Button */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-all"
            title="Switch to Guest Traveler Website"
          >
            <span>View Guest Website</span>
            <ExternalLink size={13} className="text-emerald-400" />
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsPropDropdownOpen(false);
                setIsPersonaDropdownOpen(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all"
            >
              <div className="w-7 h-7 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden xl:inline max-w-[100px] truncate">
                {user?.name}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-fade-in-up">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                    {user?.role}
                  </span>
                </div>
                <div className="py-1 text-xs text-slate-300">
                  <Link
                    to="/admin/billing"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg"
                  >
                    <CreditCard size={14} className="text-amber-400" />
                    <span>SaaS Subscription</span>
                  </Link>
                  <Link
                    to="/admin/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg"
                  >
                    <UserCheck size={14} className="text-slate-400" />
                    <span>User Profile</span>
                  </Link>
                </div>
                <div className="border-t border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
