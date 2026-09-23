export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'HOTEL_ADMIN' | 'FRONT_DESK' | 'HOUSEKEEPING' | 'GUEST';

export type SaaSTier = 'STARTER' | 'GROWTH' | 'ENTERPRISE';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  propertyId?: string; // Tenant association (null for platform Super Admin)
  department?: string;
  designation?: string;
  employeeId?: string;
  bio?: string;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  tier: SaaSTier;
  subscriptionStatus: 'ACTIVE' | 'TRIALING' | 'PAST_DUE';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  planPrice: number; // e.g., 49, 149, 399
  logoUrl?: string;
  coverUrl?: string;
  tagline: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // e.g. 0.13 for 13%
  phone: string;
  email: string;
  checkInTime: string; // e.g. "14:00"
  checkOutTime: string; // e.g. "11:00"
  roomLimit: number;
  staffLimit: number;
  features: string[];
  createdAt: string;
}

export interface Facility {
  id: string;
  name: string;
  icon: string; // Name of lucide icon
}

export interface RoomType {
  id: string;
  propertyId: string;
  name: string;
  code: string; // e.g. "DLX-K", "EXEC-STE"
  description: string;
  pricePerNight: number;
  capacity: number;
  totalStock: number;
  facilityIds: string[];
  imageUrl: string;
  baseRoomNumbers: string[]; // e.g. ["101", "102", "103"]
}

export type RoomCleaningStatus = 'CLEAN' | 'DIRTY' | 'IN_PROGRESS' | 'INSPECTED' | 'OUT_OF_ORDER';

export interface HousekeepingRoom {
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  propertyId: string;
  floor: number;
  status: RoomCleaningStatus;
  assignedStaff?: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  lastCleaned: string;
  notes?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'REJECTED';
export type BookingChannel = 'DIRECT' | 'BOOKING_COM' | 'AIRBNB' | 'EXPEDIA' | 'AGODA';
export type PaymentMethod = 'CASH' | 'CARD' | 'ESEWA' | 'KHALTI' | 'STRIPE';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';

export interface FolioCharge {
  id: string;
  description: string;
  category: 'ROOM' | 'DINING' | 'SPA' | 'MINIBAR' | 'LAUNDRY' | 'TAX' | 'SERVICE';
  amount: number;
  date: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  roomId: string;
  roomTypeName: string;
  roomNumber?: string;
  userId: string; // Guest ID
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string; // ISO Date YYYY-MM-DD
  checkOut: string; // ISO Date YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  channel: BookingChannel;
  totalPrice: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  charges: FolioCharge[];
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  bookingId: string;
  roomId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  propertyId: string;
  text: string;
  assignedTo?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'MAINTENANCE' | 'FRONT_DESK' | 'HOUSEKEEPING' | 'GENERAL';
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface OTAChannel {
  id: string;
  propertyId: string;
  name: string;
  code: BookingChannel;
  logo: string;
  connected: boolean;
  status: 'SYNCED' | 'SYNCING' | 'ERROR' | 'DISCONNECTED';
  lastSync: string;
  markupPercent: number; // e.g. 15% rate markup on OTAs
  commissionPercent: number; // e.g. 15-18% OTA commission
  activeListings: number;
}

export interface SaaSInvoice {
  id: string;
  propertyId: string;
  propertyName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'PENDING' | 'VOID';
  date: string;
  period: string;
  planTier: SaaSTier;
  billingCycle: 'MONTHLY' | 'ANNUAL';
}

export interface PropertyStats {
  propertyId: string;
  totalRooms: number;
  occupiedRoomsToday: number;
  availableRoomsToday: number;
  occupancyRate: number; // 0 - 100%
  revPar: number; // Revenue per available room
  adr: number; // Average daily rate
  newBookings24h: number;
  upcomingArrivalsToday: number;
  departuresToday: number;
  monthlyRevenue: number;
  directBookingRatio: number; // e.g. 64%
}

export interface PlatformSaaSStats {
  totalProperties: number;
  activeProperties: number;
  totalMrr: number; // Monthly Recurring Revenue
  totalArr: number;
  totalRoomsManaged: number;
  totalBookingsProcessed: number;
  churnRate: number;
  activeStaffUsers: number;
}
