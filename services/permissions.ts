import { UserRole } from '../types';

export type Permission =
  // Overview & Analytics
  | 'pms:dashboard:view'
  | 'pms:financial_kpis:view'
  // Tape Chart & Room Rack
  | 'pms:tape_chart:view'
  | 'pms:tape_chart:assign_room'
  | 'pms:tape_chart:block_room'
  // CRS Reservations
  | 'pms:bookings:view'
  | 'pms:bookings:create'
  | 'pms:bookings:check_in_out'
  | 'pms:bookings:modify_folio'
  | 'pms:bookings:cancel'
  // Rooms & Inventory
  | 'pms:rooms:view'
  | 'pms:rooms:create'
  | 'pms:rooms:edit_rates'
  | 'pms:rooms:delete'
  // Channel Manager
  | 'pms:channels:view'
  | 'pms:channels:sync'
  | 'pms:channels:configure'
  // Housekeeping & Maintenance
  | 'pms:housekeeping:view'
  | 'pms:housekeeping:update_status'
  | 'pms:housekeeping:approve_inspection'
  | 'pms:housekeeping:assign_staff'
  // Operational Tasks
  | 'pms:tasks:view'
  | 'pms:tasks:create'
  | 'pms:tasks:complete'
  // Reviews & Reputation
  | 'pms:reviews:view'
  | 'pms:reviews:reply'
  // Staff & User Governance
  | 'pms:users:view'
  | 'pms:users:invite'
  | 'pms:users:change_role'
  | 'pms:users:delete'
  // Billing & Subscription
  | 'pms:billing:view'
  | 'pms:billing:manage_subscription'
  | 'pms:billing:upgrade'
  // SaaS Multi-Property Hub
  | 'pms:tenants:view'
  | 'pms:tenants:onboard_property'
  | 'pms:tenants:manage_all'
  // Settings
  | 'pms:settings:view'
  | 'pms:settings:edit'
  // Guest Portal
  | 'guest:portal:view'
  | 'guest:book_stay'
  | 'guest:view_own_trips';

export interface RoleConfig {
  role: UserRole;
  title: string;
  badge: string;
  description: string;
  level: number; // 1 to 5 privilege level
  color: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
  defaultNavPath: string;
  sampleUser: {
    name: string;
    designation: string;
    email: string;
  };
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'Platform SuperAdmin',
    badge: 'SaaS Owner',
    description: 'Full multi-tenant root access. Controls all properties, SaaS subscription MRR, global database, and platform architecture.',
    level: 5,
    color: {
      bg: 'bg-purple-950/40',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
      badgeBg: 'bg-purple-500/20',
      badgeText: 'text-purple-300 border-purple-500/30',
      accent: 'text-purple-400',
    },
    defaultNavPath: '/admin',
    sampleUser: {
      name: 'Sagar Adhikari',
      designation: 'SaaS Platform Owner',
      email: 'admin@cloudinn-saas.com',
    },
  },
  ADMIN: {
    role: 'ADMIN',
    title: 'Hospitality Enterprise Admin',
    badge: 'Enterprise Admin',
    description: 'Enterprise organization admin with complete authority over hotel property, finance, staff roles, and channel integrations.',
    level: 4,
    color: {
      bg: 'bg-indigo-950/40',
      text: 'text-indigo-300',
      border: 'border-indigo-500/40',
      badgeBg: 'bg-indigo-500/20',
      badgeText: 'text-indigo-300 border-indigo-500/30',
      accent: 'text-indigo-400',
    },
    defaultNavPath: '/admin',
    sampleUser: {
      name: 'Pooja Shrestha',
      designation: 'VP of Hotel Operations',
      email: 'admin@grandroyalpalace.com',
    },
  },
  HOTEL_ADMIN: {
    role: 'HOTEL_ADMIN',
    title: 'General Manager (GM)',
    badge: 'General Manager',
    description: 'Hotel property general manager. Manages hotel inventory, pricing rates, staff management, reviews, and daily operations.',
    level: 4,
    color: {
      bg: 'bg-blue-950/40',
      text: 'text-blue-300',
      border: 'border-blue-500/40',
      badgeBg: 'bg-blue-500/20',
      badgeText: 'text-blue-300 border-blue-500/30',
      accent: 'text-blue-400',
    },
    defaultNavPath: '/admin',
    sampleUser: {
      name: 'General Manager Sandeep',
      designation: 'General Manager',
      email: 'gm@grandroyalpalace.com',
    },
  },
  FRONT_DESK: {
    role: 'FRONT_DESK',
    title: 'Front Desk / Concierge',
    badge: 'Front Office',
    description: 'Front office duty manager. Operates Central CRS, interactive tape chart, room assignments, folio check-in & check-out.',
    level: 3,
    color: {
      bg: 'bg-cyan-950/40',
      text: 'text-cyan-300',
      border: 'border-cyan-500/40',
      badgeBg: 'bg-cyan-500/20',
      badgeText: 'text-cyan-300 border-cyan-500/30',
      accent: 'text-cyan-400',
    },
    defaultNavPath: '/admin/tape-chart',
    sampleUser: {
      name: 'Aayush Karki',
      designation: 'Chief Concierge & Duty Manager',
      email: 'frontdesk@grandroyalpalace.com',
    },
  },
  HOUSEKEEPING: {
    role: 'HOUSEKEEPING',
    title: 'Housekeeping Lead',
    badge: 'Housekeeping',
    description: 'Housekeeping lead & floor sanitation team. Room sanitization board, room status shifts, and operational maintenance tickets.',
    level: 2,
    color: {
      bg: 'bg-amber-950/40',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300 border-amber-500/30',
      accent: 'text-amber-400',
    },
    defaultNavPath: '/admin/housekeeping',
    sampleUser: {
      name: 'Sunita Thapa',
      designation: 'Housekeeping Lead',
      email: 'housekeeping@grandroyalpalace.com',
    },
  },
  GUEST: {
    role: 'GUEST',
    title: 'Guest / Traveler',
    badge: 'Traveler',
    description: 'Luxury traveler & hotel guest. Public stay booking, trip reservations, personal profile, and guest stay reviews.',
    level: 1,
    color: {
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300 border-emerald-500/30',
      accent: 'text-emerald-400',
    },
    defaultNavPath: '/my-bookings',
    sampleUser: {
      name: 'Eleanor Vance',
      designation: 'VIP Guest',
      email: 'eleanor.vance@vanguard.co',
    },
  },
};

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'pms:dashboard:view',
    'pms:financial_kpis:view',
    'pms:tape_chart:view',
    'pms:tape_chart:assign_room',
    'pms:tape_chart:block_room',
    'pms:bookings:view',
    'pms:bookings:create',
    'pms:bookings:check_in_out',
    'pms:bookings:modify_folio',
    'pms:bookings:cancel',
    'pms:rooms:view',
    'pms:rooms:create',
    'pms:rooms:edit_rates',
    'pms:rooms:delete',
    'pms:channels:view',
    'pms:channels:sync',
    'pms:channels:configure',
    'pms:housekeeping:view',
    'pms:housekeeping:update_status',
    'pms:housekeeping:approve_inspection',
    'pms:housekeeping:assign_staff',
    'pms:tasks:view',
    'pms:tasks:create',
    'pms:tasks:complete',
    'pms:reviews:view',
    'pms:reviews:reply',
    'pms:users:view',
    'pms:users:invite',
    'pms:users:change_role',
    'pms:users:delete',
    'pms:billing:view',
    'pms:billing:manage_subscription',
    'pms:billing:upgrade',
    'pms:tenants:view',
    'pms:tenants:onboard_property',
    'pms:tenants:manage_all',
    'pms:settings:view',
    'pms:settings:edit',
    'guest:portal:view',
    'guest:book_stay',
    'guest:view_own_trips',
  ],
  ADMIN: [
    'pms:dashboard:view',
    'pms:financial_kpis:view',
    'pms:tape_chart:view',
    'pms:tape_chart:assign_room',
    'pms:tape_chart:block_room',
    'pms:bookings:view',
    'pms:bookings:create',
    'pms:bookings:check_in_out',
    'pms:bookings:modify_folio',
    'pms:bookings:cancel',
    'pms:rooms:view',
    'pms:rooms:create',
    'pms:rooms:edit_rates',
    'pms:rooms:delete',
    'pms:channels:view',
    'pms:channels:sync',
    'pms:channels:configure',
    'pms:housekeeping:view',
    'pms:housekeeping:update_status',
    'pms:housekeeping:approve_inspection',
    'pms:housekeeping:assign_staff',
    'pms:tasks:view',
    'pms:tasks:create',
    'pms:tasks:complete',
    'pms:reviews:view',
    'pms:reviews:reply',
    'pms:users:view',
    'pms:users:invite',
    'pms:users:change_role',
    'pms:users:delete',
    'pms:billing:view',
    'pms:billing:manage_subscription',
    'pms:billing:upgrade',
    'pms:settings:view',
    'pms:settings:edit',
    'guest:portal:view',
    'guest:book_stay',
    'guest:view_own_trips',
  ],
  HOTEL_ADMIN: [
    'pms:dashboard:view',
    'pms:financial_kpis:view',
    'pms:tape_chart:view',
    'pms:tape_chart:assign_room',
    'pms:tape_chart:block_room',
    'pms:bookings:view',
    'pms:bookings:create',
    'pms:bookings:check_in_out',
    'pms:bookings:modify_folio',
    'pms:bookings:cancel',
    'pms:rooms:view',
    'pms:rooms:create',
    'pms:rooms:edit_rates',
    'pms:rooms:delete',
    'pms:channels:view',
    'pms:channels:sync',
    'pms:channels:configure',
    'pms:housekeeping:view',
    'pms:housekeeping:update_status',
    'pms:housekeeping:approve_inspection',
    'pms:housekeeping:assign_staff',
    'pms:tasks:view',
    'pms:tasks:create',
    'pms:tasks:complete',
    'pms:reviews:view',
    'pms:reviews:reply',
    'pms:users:view',
    'pms:users:invite',
    'pms:users:change_role',
    'pms:billing:view',
    'pms:billing:upgrade',
    'pms:settings:view',
    'pms:settings:edit',
    'guest:portal:view',
    'guest:book_stay',
    'guest:view_own_trips',
  ],
  FRONT_DESK: [
    'pms:dashboard:view',
    'pms:tape_chart:view',
    'pms:tape_chart:assign_room',
    'pms:bookings:view',
    'pms:bookings:create',
    'pms:bookings:check_in_out',
    'pms:bookings:modify_folio',
    'pms:rooms:view',
    'pms:channels:view',
    'pms:housekeeping:view',
    'pms:housekeeping:update_status',
    'pms:tasks:view',
    'pms:tasks:create',
    'pms:tasks:complete',
    'pms:reviews:view',
    'pms:reviews:reply',
    'guest:portal:view',
    'guest:book_stay',
  ],
  HOUSEKEEPING: [
    'pms:dashboard:view',
    'pms:housekeeping:view',
    'pms:housekeeping:update_status',
    'pms:tasks:view',
    'pms:tasks:complete',
  ],
  GUEST: [
    'guest:portal:view',
    'guest:book_stay',
    'guest:view_own_trips',
    'pms:reviews:reply',
  ],
};

export const hasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  const list = ROLE_PERMISSIONS[role];
  return list ? list.includes(permission) : false;
};

export const hasAnyRole = (currentRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
  if (!currentRole) return false;
  if (currentRole === 'SUPER_ADMIN') return true; // Super admin always passes role checks
  return allowedRoles.includes(currentRole);
};

export const isStaffRole = (role: UserRole | undefined): boolean => {
  if (!role) return false;
  return ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK', 'HOUSEKEEPING'].includes(role);
};

export interface ModulePermissionRow {
  module: string;
  description: string;
  superAdmin: boolean;
  admin: boolean;
  hotelAdmin: boolean;
  frontDesk: boolean;
  housekeeping: boolean;
  guest: boolean;
}

export const PERMISSIONS_MATRIX: ModulePermissionRow[] = [
  {
    module: 'Multi-Property SaaS Hub',
    description: 'Onboard hotels, manage global SaaS portfolio & tenants',
    superAdmin: true,
    admin: false,
    hotelAdmin: false,
    frontDesk: false,
    housekeeping: false,
    guest: false,
  },
  {
    module: 'SaaS Subscription & Invoices',
    description: 'Manage SaaS tier (Starter/Growth), view billing invoices',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: false,
    housekeeping: false,
    guest: false,
  },
  {
    module: 'Staff Directory & RBAC Roles',
    description: 'Invite team members, assign platform roles and permissions',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: false,
    housekeeping: false,
    guest: false,
  },
  {
    module: 'Property Master Settings',
    description: 'Hotel tax rates, currencies, check-in/out hours, logos',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: false,
    housekeeping: false,
    guest: false,
  },
  {
    module: 'OTA Channel Manager',
    description: 'Booking.com, Airbnb, Expedia 2-way sync & markups',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: false, // Read only
    housekeeping: false,
    guest: false,
  },
  {
    module: 'Room Inventory & Nightly Rates',
    description: 'Create room types, edit pricing rates, manage stock',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: false, // Read only
    housekeeping: false,
    guest: false,
  },
  {
    module: 'Central Reservation System (CRS)',
    description: 'Manage bookings, check-in, check-out, and folio billing',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: true,
    housekeeping: false,
    guest: false,
  },
  {
    module: 'Interactive Tape Chart (Rack)',
    description: 'Drag & drop room grid, assign rooms to reservations',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: true,
    housekeeping: false,
    guest: false,
  },
  {
    module: 'Housekeeping Dispatch Board',
    description: 'Kanban room sanitization, advance rooms from dirty to ready',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: true,
    housekeeping: true,
    guest: false,
  },
  {
    module: 'Operational Tasks & Maintenance',
    description: 'Assign staff tasks, baggage delivery, linen maintenance',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: true,
    housekeeping: true,
    guest: false,
  },
  {
    module: 'Guest Reviews & Reputation',
    description: 'Monitor guest reviews and publish hotelier responses',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: true,
    housekeeping: false,
    guest: false,
  },
  {
    module: 'Traveler Direct Booking Portal',
    description: 'Browse rooms, calculate live rates, create direct stays',
    superAdmin: true,
    admin: true,
    hotelAdmin: true,
    frontDesk: true,
    housekeeping: true,
    guest: true,
  },
];
