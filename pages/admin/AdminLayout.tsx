import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BookmarkCheck,
  BedDouble,
  RefreshCw,
  Sparkles,
  CreditCard,
  Building2,
  Users,
  CheckSquare,
  Star,
  Settings,
  Menu,
  X,
  Lock,
  Grid,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { SaaSTopBar } from '../../components/SaaSTopBar';
import { NewPropertyModal } from '../../components/NewPropertyModal';
import { UpgradePlanModal } from '../../components/UpgradePlanModal';
import { RolePermissionsMatrixModal } from '../../components/RolePermissionsMatrixModal';
import { RoleBadge } from '../../components/RoleGuard';
import { UserRole } from '../../types';
import { hasAnyRole, ROLE_CONFIGS } from '../../services/permissions';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: string;
  allowedRoles?: UserRole[];
}

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const { currentProperty, isAllPropertiesView } = useTenant();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewPropModalOpen, setIsNewPropModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [showLockedItems, setShowLockedItems] = useState(true);
  const location = useLocation();

  const currentRole = user?.role || 'GUEST';
  const roleMeta = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.GUEST;

  const navItems: NavItem[] = [
    { to: '/admin', label: 'Overview & KPIs', icon: LayoutDashboard, exact: true },
    {
      to: '/admin/tape-chart',
      label: 'Tape Chart (Room Rack)',
      icon: CalendarDays,
      badge: 'Live',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK'],
    },
    {
      to: '/admin/bookings',
      label: 'Central CRS Bookings',
      icon: BookmarkCheck,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK'],
    },
    {
      to: '/admin/rooms',
      label: 'Rooms & Inventory',
      icon: BedDouble,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK'],
    },
    {
      to: '/admin/channels',
      label: 'OTA Channel Manager',
      icon: RefreshCw,
      badge: '2-Way',
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK'],
    },
    {
      to: '/admin/housekeeping',
      label: 'Housekeeping Dispatch',
      icon: Sparkles,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK', 'HOUSEKEEPING'],
    },
    {
      to: '/admin/tasks',
      label: 'Operational Tasks',
      icon: CheckSquare,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK', 'HOUSEKEEPING'],
    },
    {
      to: '/admin/reviews',
      label: 'Guest Reputation',
      icon: Star,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK'],
    },
    {
      to: '/admin/users',
      label: 'Staff & Permissions',
      icon: Users,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN'],
    },
    {
      to: '/admin/billing',
      label: 'SaaS Subscription & Plan',
      icon: CreditCard,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN'],
    },
    {
      to: '/admin/tenants',
      label: 'Multi-Property Hub',
      icon: Building2,
      badge: 'SaaS Owner',
      allowedRoles: ['SUPER_ADMIN'],
    },
    {
      to: '/admin/settings',
      label: 'Property Settings',
      icon: Settings,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN'],
    },
  ];

  const visibleNav = navItems.filter(item => {
    if (!item.allowedRoles) return true;
    if (showLockedItems) return true; // Show with lock badge
    return hasAnyRole(currentRole, item.allowedRoles);
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Universal SaaS Top Bar */}
      <SaaSTopBar
        onOpenNewPropertyModal={() => setIsNewPropModalOpen(true)}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        onOpenMatrixModal={() => setIsMatrixOpen(true)}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Nav Toggle */}
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white">{currentProperty?.name}</span>
            <RoleBadge role={currentRole} size="sm" />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <aside
          className={`
          ${isMobileMenuOpen ? 'block' : 'hidden'} md:block
          w-full md:w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors
        `}
        >
          <div className="p-4 space-y-4">
            {/* Active Role & Persona Banner */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider">
                  Active Persona
                </span>
                <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono px-1.5 py-0.2 rounded font-semibold">
                  Tier {roleMeta.level}/5
                </span>
              </div>

              <div className="flex items-center gap-2">
                <RoleBadge role={currentRole} size="md" />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {user?.name} • {user?.designation || roleMeta.title}
              </p>

              <button
                onClick={() => setIsMatrixOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-bold border border-blue-500/20 transition-all text-center"
              >
                <Grid size={12} />
                <span>View RBAC Matrix</span>
              </button>
            </div>

            {/* Active Property Card */}
            {currentProperty && !isAllPropertiesView ? (
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Active Property
                  </span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono font-semibold">
                    {currentProperty.tier}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{currentProperty.name}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {currentProperty.city}, {currentProperty.country}
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300">
                <p className="font-bold text-xs">Global SaaS View</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400/80 mt-0.5">All properties aggregated</p>
              </div>
            )}

            {/* Menu Items */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Operations & Management
                </p>
                <button
                  onClick={() => setShowLockedItems(!showLockedItems)}
                  className="text-[10px] text-slate-400 hover:text-blue-500 flex items-center gap-1"
                  title="Toggle locked role items visibility"
                >
                  <SlidersHorizontal size={11} />
                  <span>{showLockedItems ? 'All' : 'Filtered'}</span>
                </button>
              </div>

              {visibleNav.map(item => {
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

                const hasAccess = !item.allowedRoles || hasAnyRole(currentRole, item.allowedRoles);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                        : hasAccess
                        ? 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <item.icon
                        size={16}
                        className={
                          isActive
                            ? 'text-white'
                            : hasAccess
                            ? 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            : 'text-slate-400 dark:text-slate-600'
                        }
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!hasAccess && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1"
                          title={`Locked for ${roleMeta.title}`}
                        >
                          <Lock size={9} />
                          <span>Locked</span>
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            isActive
                              ? 'bg-blue-800 text-blue-100'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer: SaaS Upgrade Callout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-white text-[11px]">SaaS Cloud Status</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">99.98% SLA • 2-Way Sync Active</p>
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="mt-2 w-full py-1.5 bg-blue-500/10 dark:bg-blue-500/20 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 text-blue-700 dark:text-blue-300 border border-blue-500/30 dark:border-blue-500/40 rounded-lg text-[11px] font-bold transition-all text-center"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </aside>

        {/* Main Operational Viewport */}
        <main className="flex-1 bg-slate-100/70 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden transition-colors duration-200">
          <Outlet />
        </main>
      </div>

      {/* Global SaaS Modals */}
      <NewPropertyModal
        isOpen={isNewPropModalOpen}
        onClose={() => setIsNewPropModalOpen(false)}
      />
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
      <RolePermissionsMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />
    </div>
  );
};

