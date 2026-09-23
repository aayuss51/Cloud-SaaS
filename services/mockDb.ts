import {
  Property,
  RoomType,
  HousekeepingRoom,
  Booking,
  Review,
  Task,
  User,
  OTAChannel,
  SaaSInvoice,
  Facility,
  PropertyStats,
  PlatformSaaSStats,
  UserRole,
  PaymentStatus,
  SaaSTier
} from '../types';

// Helper for simulated async network response
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

const KEYS = {
  PROPERTIES: 'saas_properties',
  CURRENT_PROPERTY_ID: 'saas_current_prop_id',
  ROOMS: 'saas_rooms',
  HOUSEKEEPING: 'saas_housekeeping',
  BOOKINGS: 'saas_bookings',
  REVIEWS: 'saas_reviews',
  TASKS: 'saas_tasks',
  USERS: 'saas_users',
  CHANNELS: 'saas_channels',
  INVOICES: 'saas_invoices',
  FACILITIES: 'saas_facilities',
};

// Initial Multi-Tenant Properties
export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop_grand_royal',
    name: 'Grand Royal Palace & Spa',
    slug: 'grand-royal-palace',
    tier: 'GROWTH',
    subscriptionStatus: 'ACTIVE',
    billingCycle: 'MONTHLY',
    planPrice: 149,
    tagline: '5-Star Luxury Heritage Retreat in the Diplomatic Enclave',
    address: 'Durbar Marg, Ward 1',
    city: 'Kathmandu',
    country: 'Nepal',
    currency: 'USD',
    currencySymbol: '$',
    taxRate: 0.13,
    phone: '+977 1 4220011',
    email: 'gm@grandroyalpalace.com',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    roomLimit: 50,
    staffLimit: 25,
    features: ['Channel Manager', 'Interactive Tape Chart', 'Folio & Pos', 'AI Guest Concierge', 'Housekeeping Kanban'],
    coverUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=200&auto=format&fit=crop',
    createdAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'prop_annapurna_eco',
    name: 'Annapurna Lakeside Eco-Resort',
    slug: 'annapurna-lakeside',
    tier: 'STARTER',
    subscriptionStatus: 'ACTIVE',
    billingCycle: 'MONTHLY',
    planPrice: 49,
    tagline: 'Sustainable Wellness & Serenity on Phewa Lake',
    address: 'Lakeside Baidam, Ward 6',
    city: 'Pokhara',
    country: 'Nepal',
    currency: 'USD',
    currencySymbol: '$',
    taxRate: 0.13,
    phone: '+977 61 460022',
    email: 'contact@annapurnaecoresort.com',
    checkInTime: '13:00',
    checkOutTime: '11:00',
    roomLimit: 20,
    staffLimit: 8,
    features: ['Central Reservation System', 'Online Booking Engine', 'Housekeeping Board'],
    coverUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=200&auto=format&fit=crop',
    createdAt: '2025-02-15T10:00:00Z',
  },
  {
    id: 'prop_himalayan_horizon',
    name: 'Himalayan Horizon Boutique Resort',
    slug: 'himalayan-horizon',
    tier: 'ENTERPRISE',
    subscriptionStatus: 'ACTIVE',
    billingCycle: 'ANNUAL',
    planPrice: 349,
    tagline: 'Panoramic Sunrise Over the 8,000m Himalayan Giants',
    address: 'Club Hill Road',
    city: 'Nagarkot',
    country: 'Nepal',
    currency: 'USD',
    currencySymbol: '$',
    taxRate: 0.13,
    phone: '+977 1 6680123',
    email: 'reservations@himalayanhorizon.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    roomLimit: 150,
    staffLimit: 100,
    features: ['Multi-Property Hub', 'Dedicated Account Manager', 'Custom API & Webhooks', 'Unlimited Staff', 'Full OTA Channel Sync'],
    coverUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2000&auto=format&fit=crop',
    logoUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=200&auto=format&fit=crop',
    createdAt: '2024-11-20T12:00:00Z',
  }
];

export const INITIAL_FACILITIES: Facility[] = [
  { id: 'f1', name: 'High-Speed Wi-Fi 6', icon: 'Wifi' },
  { id: 'f2', name: 'Heated Infinity Pool', icon: 'Waves' },
  { id: 'f3', name: 'Ayurvedic Wellness Spa', icon: 'Sparkles' },
  { id: 'f4', name: 'Fitness Studio', icon: 'Dumbbell' },
  { id: 'f5', name: 'Complimentary Artisan Breakfast', icon: 'Coffee' },
  { id: 'f6', name: 'Executive Airport Chauffeur', icon: 'Car' },
  { id: 'f7', name: '24/7 Dedicated Butler', icon: 'Bell' },
  { id: 'f8', name: 'Smart Climate & Alexa Hub', icon: 'Tv' },
];

export const INITIAL_ROOMS: RoomType[] = [
  // Grand Royal Palace (prop_grand_royal)
  {
    id: 'rm_royal_suite',
    propertyId: 'prop_grand_royal',
    name: 'Presidential Himalayan Penthouse',
    code: 'PRES-PNT',
    description: 'Split-level signature penthouse with private rooftop heated plunge pool, handcrafted marble fireplace, and panoramic Himalayan vistas.',
    pricePerNight: 550,
    capacity: 4,
    totalStock: 3,
    facilityIds: ['f1', 'f2', 'f3', 'f5', 'f6', 'f7'],
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop',
    baseRoomNumbers: ['PH-1', 'PH-2', 'PH-3'],
  },
  {
    id: 'rm_exec_deluxe',
    propertyId: 'prop_grand_royal',
    name: 'Executive Heritage Club King',
    code: 'EXEC-KG',
    description: 'Generous 52-sqm luxury sanctuary featuring hand-carved Newari woodwork, plush king bedding, soaking tub, and club lounge privileges.',
    pricePerNight: 280,
    capacity: 2,
    totalStock: 8,
    facilityIds: ['f1', 'f3', 'f4', 'f5'],
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
    baseRoomNumbers: ['101', '102', '103', '104', '201', '202', '203', '204'],
  },
  {
    id: 'rm_garden_villa',
    propertyId: 'prop_grand_royal',
    name: 'Royal Courtyard Garden Villa',
    code: 'GDN-VIL',
    description: 'Private detached residence with botanical garden terrace, outdoor daybeds, rain shower, and secluded reading alcove.',
    pricePerNight: 390,
    capacity: 3,
    totalStock: 4,
    facilityIds: ['f1', 'f2', 'f5', 'f6', 'f8'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    baseRoomNumbers: ['VIL-1', 'VIL-2', 'VIL-3', 'VIL-4'],
  },

  // Annapurna Eco Resort (prop_annapurna_eco)
  {
    id: 'rm_lake_chalet',
    propertyId: 'prop_annapurna_eco',
    name: 'Phewa Lakeside Bamboo Chalet',
    code: 'LAKE-CHL',
    description: 'Solar-powered artisan chalet right at the water’s edge with unobstructed views of Mt. Fishtail and serene boat docking.',
    pricePerNight: 160,
    capacity: 2,
    totalStock: 6,
    facilityIds: ['f1', 'f5', 'f2'],
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?q=80&w=1200&auto=format&fit=crop',
    baseRoomNumbers: ['BAM-01', 'BAM-02', 'BAM-03', 'BAM-04', 'BAM-05', 'BAM-06'],
  },
  {
    id: 'rm_mountain_cottage',
    propertyId: 'prop_annapurna_eco',
    name: 'Peace Pagoda Hillside Cottage',
    code: 'HILL-COT',
    description: 'Surrounded by organic coffee plantations, birdwatchers paradise with wraparound wooden verandas and stone fireplace.',
    pricePerNight: 120,
    capacity: 3,
    totalStock: 5,
    facilityIds: ['f1', 'f5', 'f4'],
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop',
    baseRoomNumbers: ['COT-10', 'COT-11', 'COT-12', 'COT-13', 'COT-14'],
  },

  // Himalayan Horizon (prop_himalayan_horizon)
  {
    id: 'rm_everest_panorama',
    propertyId: 'prop_himalayan_horizon',
    name: 'Everest Sunrise Cloud Villa',
    code: 'EVR-SUN',
    description: 'Perched on the mountain ridge with floor-to-ceiling glass, private jacuzzi overlooking the Annapurna to Everest ranges.',
    pricePerNight: 420,
    capacity: 2,
    totalStock: 10,
    facilityIds: ['f1', 'f2', 'f3', 'f5', 'f7', 'f8'],
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop',
    baseRoomNumbers: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310'],
  }
];

// Helper to calculate date offsets in YYYY-MM-DD
const getDateOffset = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-78901',
    propertyId: 'prop_grand_royal',
    roomId: 'rm_royal_suite',
    roomTypeName: 'Presidential Himalayan Penthouse',
    roomNumber: 'PH-1',
    userId: 'u_vip_alex',
    guestName: 'Eleanor Vance',
    guestEmail: 'eleanor.vance@vanguard.co',
    guestPhone: '+1 415 890 1234',
    checkIn: getDateOffset(-1),
    checkOut: getDateOffset(3),
    nights: 4,
    adults: 2,
    children: 0,
    channel: 'DIRECT',
    totalPrice: 2200,
    status: 'CHECKED_IN',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    notes: 'VIP Guest. Preferred quiet floor, sparkling water, late checkout requested.',
    charges: [
      { id: 'c1', description: 'Room Rent (4 Nights)', category: 'ROOM', amount: 2200, date: getDateOffset(-1) },
      { id: 'c2', description: 'Ayurvedic Massage (2 Persons)', category: 'SPA', amount: 180, date: getDateOffset(0) },
      { id: 'c3', description: 'Imperial Dinner Room Service', category: 'DINING', amount: 115, date: getDateOffset(0) },
    ],
    createdAt: getDateOffset(-10) + 'T14:22:00Z',
  },
  {
    id: 'BK-78902',
    propertyId: 'prop_grand_royal',
    roomId: 'rm_exec_deluxe',
    roomTypeName: 'Executive Heritage Club King',
    roomNumber: '102',
    userId: 'u_guest_david',
    guestName: 'Marcus Sterling',
    guestEmail: 'marcus@sterlingfin.com',
    guestPhone: '+44 20 7946 0991',
    checkIn: getDateOffset(0),
    checkOut: getDateOffset(4),
    nights: 4,
    adults: 1,
    children: 0,
    channel: 'BOOKING_COM',
    totalPrice: 1120,
    status: 'CONFIRMED',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    notes: 'Arriving late at 20:30 via British Airways.',
    charges: [
      { id: 'c4', description: 'Room Rent (4 Nights)', category: 'ROOM', amount: 1120, date: getDateOffset(0) },
    ],
    createdAt: getDateOffset(-4) + 'T10:15:00Z',
  },
  {
    id: 'BK-78903',
    propertyId: 'prop_grand_royal',
    roomId: 'rm_garden_villa',
    roomTypeName: 'Royal Courtyard Garden Villa',
    roomNumber: 'VIL-2',
    userId: 'u_guest_sophia',
    guestName: 'Sophia Lin & Kenji Sato',
    guestEmail: 'sophia.lin@zenith.sg',
    guestPhone: '+65 9123 4567',
    checkIn: getDateOffset(-2),
    checkOut: getDateOffset(1),
    nights: 3,
    adults: 2,
    children: 1,
    channel: 'AIRBNB',
    totalPrice: 1170,
    status: 'CHECKED_IN',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    notes: 'Anniversary celebration. Complimentary champagne sent.',
    charges: [
      { id: 'c5', description: 'Room Rent (3 Nights)', category: 'ROOM', amount: 1170, date: getDateOffset(-2) },
      { id: 'c6', description: 'Minibar Refreshments', category: 'MINIBAR', amount: 45, date: getDateOffset(-1) }
    ],
    createdAt: getDateOffset(-14) + 'T09:00:00Z',
  },
  {
    id: 'BK-78904',
    propertyId: 'prop_grand_royal',
    roomId: 'rm_exec_deluxe',
    roomTypeName: 'Executive Heritage Club King',
    roomNumber: '201',
    userId: 'u_guest_arjun',
    guestName: 'Arjun Sharma',
    guestEmail: 'arjun.sharma@techcorp.in',
    guestPhone: '+91 98200 12345',
    checkIn: getDateOffset(2),
    checkOut: getDateOffset(5),
    nights: 3,
    adults: 2,
    children: 0,
    channel: 'EXPEDIA',
    totalPrice: 840,
    status: 'CONFIRMED',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    notes: 'Corporate rate applied. High floor request.',
    charges: [
      { id: 'c7', description: 'Room Rent (3 Nights)', category: 'ROOM', amount: 840, date: getDateOffset(2) }
    ],
    createdAt: getDateOffset(-2) + 'T16:40:00Z',
  },
  {
    id: 'BK-78905',
    propertyId: 'prop_annapurna_eco',
    roomId: 'rm_lake_chalet',
    roomTypeName: 'Phewa Lakeside Bamboo Chalet',
    roomNumber: 'BAM-01',
    userId: 'u_guest_clara',
    guestName: 'Clara Dubois',
    guestEmail: 'clara.dubois@paris.fr',
    guestPhone: '+33 6 12 34 56 78',
    checkIn: getDateOffset(-1),
    checkOut: getDateOffset(3),
    nights: 4,
    adults: 2,
    children: 0,
    channel: 'DIRECT',
    totalPrice: 640,
    status: 'CHECKED_IN',
    paymentMethod: 'ESEWA',
    paymentStatus: 'PAID',
    notes: 'Requested lakeside yoga mat and early kayak departure.',
    charges: [
      { id: 'c8', description: 'Room Rent (4 Nights)', category: 'ROOM', amount: 640, date: getDateOffset(-1) }
    ],
    createdAt: getDateOffset(-7) + 'T11:20:00Z',
  },
  {
    id: 'BK-78906',
    propertyId: 'prop_himalayan_horizon',
    roomId: 'rm_everest_panorama',
    roomTypeName: 'Everest Sunrise Cloud Villa',
    roomNumber: '301',
    userId: 'u_guest_liam',
    guestName: 'Liam & Olivia Becker',
    guestEmail: 'becker.liam@munich.de',
    guestPhone: '+49 89 123456',
    checkIn: getDateOffset(0),
    checkOut: getDateOffset(2),
    nights: 2,
    adults: 2,
    children: 0,
    channel: 'AGODA',
    totalPrice: 840,
    status: 'CONFIRMED',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    notes: 'Honeymoon couple. Mountain binoculars and herbal tea basket provided.',
    charges: [
      { id: 'c9', description: 'Room Rent (2 Nights)', category: 'ROOM', amount: 840, date: getDateOffset(0) }
    ],
    createdAt: getDateOffset(-3) + 'T08:30:00Z',
  }
];

export const INITIAL_HOUSEKEEPING: HousekeepingRoom[] = [
  {
    roomNumber: 'PH-1',
    roomTypeId: 'rm_royal_suite',
    roomTypeName: 'Presidential Penthouse',
    propertyId: 'prop_grand_royal',
    floor: 4,
    status: 'CLEAN',
    assignedStaff: 'Sunita Thapa',
    priority: 'HIGH',
    lastCleaned: 'Today, 10:30 AM',
    notes: 'VIP occupied. Daily afternoon linen turn-down scheduled.',
  },
  {
    roomNumber: 'PH-2',
    roomTypeId: 'rm_royal_suite',
    roomTypeName: 'Presidential Penthouse',
    propertyId: 'prop_grand_royal',
    floor: 4,
    status: 'INSPECTED',
    assignedStaff: 'Supervisor Rajesh',
    priority: 'NORMAL',
    lastCleaned: 'Today, 09:15 AM',
    notes: 'Ready for check-in.',
  },
  {
    roomNumber: '101',
    roomTypeId: 'rm_exec_deluxe',
    roomTypeName: 'Executive Club King',
    propertyId: 'prop_grand_royal',
    floor: 1,
    status: 'DIRTY',
    assignedStaff: 'Bikash KC',
    priority: 'HIGH',
    lastCleaned: 'Yesterday, 04:00 PM',
    notes: 'Guest checked out 11:00 AM. Deep sanitation required.',
  },
  {
    roomNumber: '102',
    roomTypeId: 'rm_exec_deluxe',
    roomTypeName: 'Executive Club King',
    propertyId: 'prop_grand_royal',
    floor: 1,
    status: 'IN_PROGRESS',
    assignedStaff: 'Kavita Rai',
    priority: 'HIGH',
    lastCleaned: 'In progress',
    notes: 'Next guest arrives 14:00.',
  },
  {
    roomNumber: '103',
    roomTypeId: 'rm_exec_deluxe',
    roomTypeName: 'Executive Club King',
    propertyId: 'prop_grand_royal',
    floor: 1,
    status: 'CLEAN',
    assignedStaff: 'Bikash KC',
    priority: 'NORMAL',
    lastCleaned: 'Today, 11:45 AM',
  },
  {
    roomNumber: 'VIL-1',
    roomTypeId: 'rm_garden_villa',
    roomTypeName: 'Garden Villa',
    propertyId: 'prop_grand_royal',
    floor: 1,
    status: 'OUT_OF_ORDER',
    assignedStaff: 'Pramod Maintenance',
    priority: 'NORMAL',
    lastCleaned: '2 days ago',
    notes: 'HVAC filter inspection and thermostat calibration.',
  },
  {
    roomNumber: 'VIL-2',
    roomTypeId: 'rm_garden_villa',
    roomTypeName: 'Garden Villa',
    propertyId: 'prop_grand_royal',
    floor: 1,
    status: 'CLEAN',
    assignedStaff: 'Sunita Thapa',
    priority: 'NORMAL',
    lastCleaned: 'Today, 11:00 AM',
  },
  // Annapurna Eco Rooms
  {
    roomNumber: 'BAM-01',
    roomTypeId: 'rm_lake_chalet',
    roomTypeName: 'Phewa Bamboo Chalet',
    propertyId: 'prop_annapurna_eco',
    floor: 1,
    status: 'CLEAN',
    assignedStaff: 'Dawa Sherpa',
    priority: 'NORMAL',
    lastCleaned: 'Today, 10:00 AM',
  },
  {
    roomNumber: 'BAM-02',
    roomTypeId: 'rm_lake_chalet',
    roomTypeName: 'Phewa Bamboo Chalet',
    propertyId: 'prop_annapurna_eco',
    floor: 1,
    status: 'DIRTY',
    assignedStaff: 'Maya Gurung',
    priority: 'HIGH',
    lastCleaned: 'Yesterday',
  }
];

export const INITIAL_CHANNELS: OTAChannel[] = [
  {
    id: 'ch_direct',
    propertyId: 'prop_grand_royal',
    name: 'Direct Booking Engine',
    code: 'DIRECT',
    logo: '🏨',
    connected: true,
    status: 'SYNCED',
    lastSync: 'Real-time (Active)',
    markupPercent: 0,
    commissionPercent: 0,
    activeListings: 15,
  },
  {
    id: 'ch_booking',
    propertyId: 'prop_grand_royal',
    name: 'Booking.com',
    code: 'BOOKING_COM',
    logo: '🟦',
    connected: true,
    status: 'SYNCED',
    lastSync: '2 minutes ago',
    markupPercent: 12,
    commissionPercent: 15,
    activeListings: 15,
  },
  {
    id: 'ch_airbnb',
    propertyId: 'prop_grand_royal',
    name: 'Airbnb',
    code: 'AIRBNB',
    logo: '🔴',
    connected: true,
    status: 'SYNCED',
    lastSync: '5 minutes ago',
    markupPercent: 15,
    commissionPercent: 14,
    activeListings: 8,
  },
  {
    id: 'ch_expedia',
    propertyId: 'prop_grand_royal',
    name: 'Expedia Partner Central',
    code: 'EXPEDIA',
    logo: '🟡',
    connected: true,
    status: 'SYNCED',
    lastSync: '12 minutes ago',
    markupPercent: 10,
    commissionPercent: 18,
    activeListings: 12,
  },
  {
    id: 'ch_agoda',
    propertyId: 'prop_grand_royal',
    name: 'Agoda YCS Hub',
    code: 'AGODA',
    logo: '🟢',
    connected: false,
    status: 'DISCONNECTED',
    lastSync: 'Never',
    markupPercent: 10,
    commissionPercent: 15,
    activeListings: 0,
  }
];

export const INITIAL_INVOICES: SaaSInvoice[] = [
  {
    id: 'inv_10492',
    propertyId: 'prop_grand_royal',
    propertyName: 'Grand Royal Palace & Spa',
    invoiceNumber: 'INV-2025-00492',
    amount: 149,
    currency: 'USD',
    status: 'PAID',
    date: '2025-03-01',
    period: 'March 01 - March 31, 2025',
    planTier: 'GROWTH',
    billingCycle: 'MONTHLY',
  },
  {
    id: 'inv_10381',
    propertyId: 'prop_grand_royal',
    propertyName: 'Grand Royal Palace & Spa',
    invoiceNumber: 'INV-2025-00381',
    amount: 149,
    currency: 'USD',
    status: 'PAID',
    date: '2025-02-01',
    period: 'Feb 01 - Feb 28, 2025',
    planTier: 'GROWTH',
    billingCycle: 'MONTHLY',
  },
  {
    id: 'inv_10214',
    propertyId: 'prop_annapurna_eco',
    propertyName: 'Annapurna Lakeside Eco-Resort',
    invoiceNumber: 'INV-2025-00214',
    amount: 49,
    currency: 'USD',
    status: 'PAID',
    date: '2025-03-01',
    period: 'March 01 - March 31, 2025',
    planTier: 'STARTER',
    billingCycle: 'MONTHLY',
  },
  {
    id: 'inv_10105',
    propertyId: 'prop_himalayan_horizon',
    propertyName: 'Himalayan Horizon Boutique',
    invoiceNumber: 'INV-2025-00105',
    amount: 3490,
    currency: 'USD',
    status: 'PAID',
    date: '2024-11-20',
    period: 'Nov 2024 - Nov 2025 (Annual)',
    planTier: 'ENTERPRISE',
    billingCycle: 'ANNUAL',
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_super_saas',
    name: 'Sagar Adhikari',
    email: 'admin@cloudinn-saas.com',
    role: 'SUPER_ADMIN',
    department: 'Platform Architecture',
    designation: 'SaaS Platform Owner',
    phone: '+977 9801000000',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    bio: 'Oversees multi-tenant platform infrastructure, subscription billing, and SLA uptime.'
  },
  {
    id: 'user_gm_royal',
    name: 'General Manager Sandeep',
    email: 'gm@grandroyalpalace.com',
    role: 'HOTEL_ADMIN',
    propertyId: 'prop_grand_royal',
    department: 'Executive Management',
    designation: 'General Manager',
    phone: '+977 9851012345',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    bio: 'Oversees Grand Royal operations, revenue strategy, and luxury guest relations.'
  },
  {
    id: 'user_frontdesk',
    name: 'Aayush Karki',
    email: 'frontdesk@grandroyalpalace.com',
    role: 'FRONT_DESK',
    propertyId: 'prop_grand_royal',
    department: 'Front Office',
    designation: 'Chief Concierge & Duty Manager',
    phone: '+977 9841112233',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'user_housekeeping',
    name: 'Sunita Thapa',
    email: 'housekeeping@grandroyalpalace.com',
    role: 'HOUSEKEEPING',
    propertyId: 'prop_grand_royal',
    department: 'Housekeeping & Rooms',
    designation: 'Housekeeping Lead',
    phone: '+977 9813445566',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'user_guest_alex',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@vanguard.co',
    role: 'GUEST',
    phone: '+1 415 890 1234',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rv-1',
    propertyId: 'prop_grand_royal',
    bookingId: 'BK-78901',
    roomId: 'rm_royal_suite',
    userId: 'user_guest_alex',
    userName: 'Eleanor Vance',
    rating: 5,
    comment: 'Exceptional hospitality. The private plunge pool in the penthouse overlooking the valley was unforgettable. Butler service was prompt and discreet.',
    createdAt: '2025-03-12T14:30:00Z',
  },
  {
    id: 'rv-2',
    propertyId: 'prop_grand_royal',
    bookingId: 'BK-78903',
    roomId: 'rm_garden_villa',
    userId: 'u_guest_sophia',
    userName: 'Sophia Lin',
    rating: 5,
    comment: 'The garden villa was heaven on earth! Beautiful Newari architecture with all the modern 5-star comforts.',
    createdAt: '2025-03-10T10:15:00Z',
  },
  {
    id: 'rv-3',
    propertyId: 'prop_annapurna_eco',
    bookingId: 'BK-78905',
    roomId: 'rm_lake_chalet',
    userId: 'u_guest_clara',
    userName: 'Clara Dubois',
    rating: 5,
    comment: 'Waking up to the reflections of Fishtail Mountain in the lake is priceless. Staff was so warm and thoughtful.',
    createdAt: '2025-03-08T09:00:00Z',
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    propertyId: 'prop_grand_royal',
    text: 'Inspect HVAC maintenance completion in Garden Villa VIL-1',
    assignedTo: 'Rajesh (Maintenance)',
    priority: 'HIGH',
    category: 'MAINTENANCE',
    isCompleted: false,
    dueDate: getDateOffset(1),
    createdAt: getDateOffset(-1) + 'T08:00:00Z',
  },
  {
    id: 't-2',
    propertyId: 'prop_grand_royal',
    text: 'Confirm VIP airport chauffeur pickup for Marcus Sterling (20:30 arrival)',
    assignedTo: 'Aayush (Front Desk)',
    priority: 'HIGH',
    category: 'FRONT_DESK',
    isCompleted: true,
    dueDate: getDateOffset(0),
    createdAt: getDateOffset(-2) + 'T09:30:00Z',
  },
  {
    id: 't-3',
    propertyId: 'prop_grand_royal',
    text: 'Prepare organic lavender bath ritual for Presidential Penthouse PH-1',
    assignedTo: 'Sunita (Housekeeping)',
    priority: 'MEDIUM',
    category: 'HOUSEKEEPING',
    isCompleted: false,
    dueDate: getDateOffset(0),
    createdAt: getDateOffset(0) + 'T07:15:00Z',
  },
  {
    id: 't-4',
    propertyId: 'prop_grand_royal',
    text: 'Monthly OTA Channel sync audit and rate parity review',
    assignedTo: 'Sandeep (GM)',
    priority: 'MEDIUM',
    category: 'GENERAL',
    isCompleted: false,
    dueDate: getDateOffset(4),
    createdAt: getDateOffset(-3) + 'T12:00:00Z',
  }
];

// --- Property / Tenant Methods ---

export const getProperties = async (): Promise<Property[]> => {
  await delay(150);
  const stored = localStorage.getItem(KEYS.PROPERTIES);
  if (!stored) {
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }
  return JSON.parse(stored);
};

export const getProperty = async (id: string): Promise<Property | undefined> => {
  const props = await getProperties();
  return props.find(p => p.id === id || p.slug === id);
};

export const getCurrentPropertyId = (): string => {
  const stored = localStorage.getItem(KEYS.CURRENT_PROPERTY_ID);
  return stored || 'prop_grand_royal';
};

export const setCurrentPropertyId = (id: string): void => {
  localStorage.setItem(KEYS.CURRENT_PROPERTY_ID, id);
};

export const saveProperty = async (prop: Partial<Property> & { name: string }): Promise<Property> => {
  await delay(300);
  const current = await getProperties();
  let updatedProperty: Property;

  if (prop.id && current.some(p => p.id === prop.id)) {
    updatedProperty = current.map(p => (p.id === prop.id ? { ...p, ...prop } : p)).find(p => p.id === prop.id)!;
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(current.map(p => (p.id === prop.id ? updatedProperty : p))));
  } else {
    const slug = prop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newId = `prop_${Math.random().toString(36).substr(2, 8)}`;
    updatedProperty = {
      id: newId,
      slug: slug || `hotel-${Date.now()}`,
      tier: prop.tier || 'STARTER',
      subscriptionStatus: 'ACTIVE',
      billingCycle: prop.billingCycle || 'MONTHLY',
      planPrice: prop.tier === 'ENTERPRISE' ? 349 : prop.tier === 'GROWTH' ? 149 : 49,
      tagline: prop.tagline || 'Modern boutique hospitality',
      address: prop.address || 'Central District',
      city: prop.city || 'Kathmandu',
      country: prop.country || 'Nepal',
      currency: prop.currency || 'USD',
      currencySymbol: prop.currencySymbol || '$',
      taxRate: prop.taxRate ?? 0.13,
      phone: prop.phone || '+977 1 4000000',
      email: prop.email || `contact@${slug}.com`,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      roomLimit: prop.tier === 'ENTERPRISE' ? 150 : prop.tier === 'GROWTH' ? 50 : 20,
      staffLimit: prop.tier === 'ENTERPRISE' ? 100 : prop.tier === 'GROWTH' ? 25 : 8,
      features: ['Tape Chart', 'Central Reservations', 'Housekeeping Board', 'Booking Engine'],
      createdAt: new Date().toISOString(),
      ...prop,
      name: prop.name,
    };
    const updatedList = [...current, updatedProperty];
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(updatedList));

    // Seed default starter rooms & housekeeping for newly onboarded property
    const defaultRoom: RoomType = {
      id: `rm_${newId}_std`,
      propertyId: newId,
      name: 'Deluxe Heritage King',
      code: 'DLX-K',
      description: 'Spacious boutique room with king size comfort, marble bathroom, and city views.',
      pricePerNight: 180,
      capacity: 2,
      totalStock: 5,
      facilityIds: ['f1', 'f4', 'f5'],
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
      baseRoomNumbers: ['101', '102', '103', '104', '105'],
    };
    await saveRoom(defaultRoom);
  }
  return updatedProperty;
};

export const updateSubscriptionPlan = async (
  propertyId: string,
  tier: SaaSTier,
  billingCycle: 'MONTHLY' | 'ANNUAL'
): Promise<Property> => {
  await delay(300);
  const current = await getProperties();
  const prices: Record<SaaSTier, { monthly: number; annual: number; rooms: number; staff: number }> = {
    STARTER: { monthly: 49, annual: 490, rooms: 20, staff: 8 },
    GROWTH: { monthly: 149, annual: 1490, rooms: 50, staff: 25 },
    ENTERPRISE: { monthly: 349, annual: 3490, rooms: 200, staff: 100 },
  };
  const details = prices[tier];
  const price = billingCycle === 'ANNUAL' ? details.annual : details.monthly;

  let updatedProperty!: Property;
  const updatedList = current.map(p => {
    if (p.id === propertyId) {
      updatedProperty = {
        ...p,
        tier,
        billingCycle,
        planPrice: price,
        roomLimit: details.rooms,
        staffLimit: details.staff,
        subscriptionStatus: 'ACTIVE',
      };
      return updatedProperty;
    }
    return p;
  });

  localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(updatedList));

  // Add invoice record
  const newInvoice: SaaSInvoice = {
    id: `inv_${Date.now()}`,
    propertyId,
    propertyName: updatedProperty?.name || 'Hotel Property',
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: price,
    currency: 'USD',
    status: 'PAID',
    date: new Date().toISOString().split('T')[0],
    period: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - Renewal`,
    planTier: tier,
    billingCycle,
  };
  const invoices = await getInvoices();
  localStorage.setItem(KEYS.INVOICES, JSON.stringify([newInvoice, ...invoices]));

  return updatedProperty;
};

// --- Rooms & Housekeeping ---

export const getRooms = async (propertyId?: string): Promise<RoomType[]> => {
  await delay(150);
  const stored = localStorage.getItem(KEYS.ROOMS);
  const list: RoomType[] = stored ? JSON.parse(stored) : INITIAL_ROOMS;
  if (!stored) localStorage.setItem(KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
  if (!propertyId) return list;
  return list.filter(r => r.propertyId === propertyId);
};

export const getRoom = async (id: string): Promise<RoomType | undefined> => {
  const rooms = await getRooms();
  return rooms.find(r => r.id === id);
};

export const saveRoom = async (room: RoomType): Promise<void> => {
  await delay(300);
  const current = await getRooms();
  const exists = current.find(r => r.id === room.id);
  const updated = exists
    ? current.map(r => (r.id === room.id ? room : r))
    : [...current, { ...room, id: room.id || `rm_${Math.random().toString(36).substr(2, 9)}` }];
  localStorage.setItem(KEYS.ROOMS, JSON.stringify(updated));
};

export const deleteRoom = async (id: string): Promise<void> => {
  await delay(250);
  const current = await getRooms();
  localStorage.setItem(KEYS.ROOMS, JSON.stringify(current.filter(r => r.id !== id)));
};

export const getHousekeeping = async (propertyId?: string): Promise<HousekeepingRoom[]> => {
  await delay(150);
  const stored = localStorage.getItem(KEYS.HOUSEKEEPING);
  const list: HousekeepingRoom[] = stored ? JSON.parse(stored) : INITIAL_HOUSEKEEPING;
  if (!stored) localStorage.setItem(KEYS.HOUSEKEEPING, JSON.stringify(INITIAL_HOUSEKEEPING));
  if (!propertyId) return list;
  return list.filter(h => h.propertyId === propertyId);
};

export const updateHousekeepingStatus = async (
  propertyId: string,
  roomNumber: string,
  status: HousekeepingRoom['status'],
  assignedStaff?: string
): Promise<void> => {
  await delay(200);
  const current = await getHousekeeping();
  const updated = current.map(h => {
    if (h.propertyId === propertyId && h.roomNumber === roomNumber) {
      return {
        ...h,
        status,
        assignedStaff: assignedStaff !== undefined ? assignedStaff : h.assignedStaff,
        lastCleaned: status === 'CLEAN' || status === 'INSPECTED' ? 'Just now' : h.lastCleaned,
      };
    }
    return h;
  });
  localStorage.setItem(KEYS.HOUSEKEEPING, JSON.stringify(updated));
};

// --- Bookings & Folio Service ---

export const getBookings = async (propertyId?: string): Promise<Booking[]> => {
  await delay(200);
  const stored = localStorage.getItem(KEYS.BOOKINGS);
  const list: Booking[] = stored ? JSON.parse(stored) : INITIAL_BOOKINGS;
  if (!stored) localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  if (!propertyId) return list;
  return list.filter(b => b.propertyId === propertyId);
};

export const getBooking = async (id: string): Promise<Booking | undefined> => {
  const bookings = await getBookings();
  return bookings.find(b => b.id === id);
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  await delay(200);
  const all = await getBookings();
  return all.filter(b => b.userId === userId);
};

export function checkAvailability(checkIn: string, checkOut: string): Promise<string[]>;
export function checkAvailability(roomId: string, checkIn: string, checkOut: string): Promise<boolean>;
export async function checkAvailability(
  arg1: string,
  arg2: string,
  arg3?: string
): Promise<string[] | boolean> {
  await delay(150);
  const bookings = await getBookings();
  const rooms = await getRooms();

  if (!arg3) {
    const checkIn = arg1;
    const checkOut = arg2;
    const unavailableIds: string[] = [];

    rooms.forEach(room => {
      const overlapping = bookings.filter(b => {
        if (b.roomId !== room.id) return false;
        if (b.status === 'CANCELLED' || b.status === 'REJECTED') return false;
        return checkIn < b.checkOut && checkOut > b.checkIn;
      });
      if (overlapping.length >= room.totalStock) {
        unavailableIds.push(room.id);
      }
    });
    return unavailableIds;
  }

  const roomId = arg1;
  const checkIn = arg2;
  const checkOut = arg3;
  const overlapping = bookings.filter(b => {
    if (b.roomId !== roomId) return false;
    if (b.status === 'CANCELLED' || b.status === 'REJECTED') return false;
    return checkIn < b.checkOut && checkOut > b.checkIn;
  });
  const room = rooms.find(r => r.id === roomId);
  const maxStock = room ? room.totalStock : 1;
  return overlapping.length < maxStock;
}

export const createBooking = async (data: Partial<Booking>): Promise<Booking> => {
  await delay(400);
  const current = await getBookings();
  const bookingId = `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const newBooking: Booking = {
    id: bookingId,
    propertyId: data.propertyId || 'prop_grand_royal',
    roomId: data.roomId || 'rm_royal_suite',
    roomTypeName: data.roomTypeName || 'Luxury Suite',
    roomNumber: data.roomNumber || '101',
    userId: data.userId || `u_guest_${Date.now()}`,
    guestName: data.guestName || 'Valued Guest',
    guestEmail: data.guestEmail || 'guest@example.com',
    guestPhone: data.guestPhone || '+977 9800000000',
    checkIn: data.checkIn || getDateOffset(0),
    checkOut: data.checkOut || getDateOffset(2),
    nights: data.nights || 2,
    adults: data.adults || 2,
    children: data.children || 0,
    channel: data.channel || 'DIRECT',
    totalPrice: data.totalPrice || 500,
    status: data.status || 'CONFIRMED',
    paymentMethod: data.paymentMethod || 'CARD',
    paymentStatus: data.paymentStatus || 'PAID',
    notes: data.notes || '',
    charges: data.charges || [
      {
        id: `chg_${Date.now()}`,
        description: `Room Booking (${data.nights || 2} Nights)`,
        category: 'ROOM',
        amount: data.totalPrice || 500,
        date: new Date().toISOString().split('T')[0],
      }
    ],
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([newBooking, ...current]));
  return newBooking;
};

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<void> => {
  await delay(250);
  const current = await getBookings();
  const updated = current.map(b => (b.id === id ? { ...b, status } : b));
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
};

export const updateBookingPaymentStatus = async (id: string, paymentStatus: PaymentStatus): Promise<void> => {
  await delay(250);
  const current = await getBookings();
  const updated = current.map(b => (b.id === id ? { ...b, paymentStatus } : b));
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
};

export const addFolioCharge = async (
  bookingId: string,
  charge: { description: string; category: Booking['charges'][0]['category']; amount: number }
): Promise<Booking> => {
  await delay(250);
  const current = await getBookings();
  let updatedBooking!: Booking;

  const updated = current.map(b => {
    if (b.id === bookingId) {
      const newCharge = {
        id: `chg_${Date.now()}`,
        ...charge,
        date: new Date().toISOString().split('T')[0],
      };
      const charges = [...b.charges, newCharge];
      const newTotal = charges.reduce((acc, c) => acc + c.amount, 0);
      updatedBooking = { ...b, charges, totalPrice: newTotal };
      return updatedBooking;
    }
    return b;
  });

  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
  return updatedBooking;
};

// --- Channels (OTA) ---

export const getChannels = async (propertyId?: string): Promise<OTAChannel[]> => {
  await delay(150);
  const stored = localStorage.getItem(KEYS.CHANNELS);
  const list: OTAChannel[] = stored ? JSON.parse(stored) : INITIAL_CHANNELS;
  if (!stored) localStorage.setItem(KEYS.CHANNELS, JSON.stringify(INITIAL_CHANNELS));
  if (!propertyId) return list;
  return list.filter(c => c.propertyId === propertyId);
};

export const toggleChannelConnection = async (channelId: string): Promise<void> => {
  await delay(250);
  const current = await getChannels();
  const updated = current.map(c => {
    if (c.id === channelId) {
      const nextConnected = !c.connected;
      return {
        ...c,
        connected: nextConnected,
        status: nextConnected ? ('SYNCED' as const) : ('DISCONNECTED' as const),
        lastSync: nextConnected ? 'Just now' : c.lastSync,
      };
    }
    return c;
  });
  localStorage.setItem(KEYS.CHANNELS, JSON.stringify(updated));
};

export const triggerChannelSync = async (channelId: string): Promise<void> => {
  await delay(500);
  const current = await getChannels();
  const updated = current.map(c => (c.id === channelId ? { ...c, status: 'SYNCED' as const, lastSync: 'Just now' } : c));
  localStorage.setItem(KEYS.CHANNELS, JSON.stringify(updated));
};

// --- Invoices ---

export const getInvoices = async (propertyId?: string): Promise<SaaSInvoice[]> => {
  await delay(150);
  const stored = localStorage.getItem(KEYS.INVOICES);
  const list: SaaSInvoice[] = stored ? JSON.parse(stored) : INITIAL_INVOICES;
  if (!stored) localStorage.setItem(KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
  if (!propertyId) return list;
  return list.filter(i => i.propertyId === propertyId);
};

// --- Facilities ---

export const getFacilities = async (): Promise<Facility[]> => {
  await delay(100);
  const stored = localStorage.getItem(KEYS.FACILITIES);
  return stored ? JSON.parse(stored) : INITIAL_FACILITIES;
};

export const saveFacility = async (facility: Facility): Promise<Facility> => {
  await delay(200);
  const current = await getFacilities();
  const index = current.findIndex(f => f.id === facility.id);
  let updated: Facility[];
  if (index >= 0) {
    updated = current.map(f => (f.id === facility.id ? facility : f));
  } else {
    updated = [...current, facility];
  }
  localStorage.setItem(KEYS.FACILITIES, JSON.stringify(updated));
  return facility;
};

export const deleteFacility = async (id: string): Promise<boolean> => {
  await delay(200);
  const current = await getFacilities();
  const updated = current.filter(f => f.id !== id);
  localStorage.setItem(KEYS.FACILITIES, JSON.stringify(updated));
  return true;
};

// --- Tasks ---

export const getTasks = async (propertyId?: string): Promise<Task[]> => {
  await delay(150);
  const stored = localStorage.getItem(KEYS.TASKS);
  const list: Task[] = stored ? JSON.parse(stored) : INITIAL_TASKS;
  if (!stored) localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
  if (!propertyId) return list;
  return list.filter(t => t.propertyId === propertyId);
};

export const addTask = async (task: Partial<Task> & { text: string; propertyId: string }): Promise<Task> => {
  await delay(200);
  const current = await getTasks();
  const newTask: Task = {
    id: `task_${Date.now()}`,
    text: task.text,
    propertyId: task.propertyId,
    assignedTo: task.assignedTo || 'Unassigned',
    priority: task.priority || 'MEDIUM',
    category: task.category || 'GENERAL',
    isCompleted: false,
    dueDate: task.dueDate || getDateOffset(2),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(KEYS.TASKS, JSON.stringify([newTask, ...current]));
  return newTask;
};

export const toggleTask = async (id: string): Promise<void> => {
  await delay(150);
  const current = await getTasks();
  const updated = current.map(t => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  localStorage.setItem(KEYS.TASKS, JSON.stringify(updated));
};

export const deleteTask = async (id: string): Promise<void> => {
  await delay(150);
  const current = await getTasks();
  localStorage.setItem(KEYS.TASKS, JSON.stringify(current.filter(t => t.id !== id)));
};

// --- Reviews ---

export const getReviews = async (propertyId?: string): Promise<Review[]> => {
  await delay(150);
  const stored = localStorage.getItem(KEYS.REVIEWS);
  const list: Review[] = stored ? JSON.parse(stored) : INITIAL_REVIEWS;
  if (!stored) localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  if (!propertyId) return list;
  return list.filter(r => r.propertyId === propertyId);
};

export const saveReview = async (review: Review): Promise<Review> => {
  await delay(300);
  const current = await getReviews();
  const saved = {
    ...review,
    id: review.id || `rv_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(KEYS.REVIEWS, JSON.stringify([saved, ...current]));
  return saved;
};

// --- Users ---

export const getUsers = async (): Promise<User[]> => {
  await delay(150);
  const stored = localStorage.getItem(KEYS.USERS);
  if (!stored) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const updateUserRole = async (userId: string, role: UserRole): Promise<void> => {
  await delay(250);
  const current = await getUsers();
  const updated = current.map(u => (u.id === userId ? { ...u, role } : u));
  localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  await delay(250);
  const current = await getUsers();
  const index = current.findIndex(u => u.id === userId);
  let updatedUser: User;
  if (index >= 0) {
    updatedUser = { ...current[index], ...updates };
    current[index] = updatedUser;
  } else {
    updatedUser = {
      id: userId,
      name: updates.name || 'User',
      email: updates.email || '',
      role: updates.role || 'GUEST',
      ...updates,
    };
    current.push(updatedUser);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(current));
  return updatedUser;
};

// --- SaaS Stats & KPI Aggregators ---

export const getPropertyStats = async (propertyId: string): Promise<PropertyStats> => {
  const rooms = await getRooms(propertyId);
  const bookings = await getBookings(propertyId);
  const todayStr = new Date().toISOString().split('T')[0];

  let occupiedCount = 0;
  let arrivalsCount = 0;
  let departuresCount = 0;
  let directCount = 0;
  let totalRevenue = 0;

  bookings.forEach(b => {
    if (b.status !== 'CANCELLED' && b.status !== 'REJECTED') {
      totalRevenue += b.totalPrice;
      if (b.channel === 'DIRECT') directCount++;

      if (b.checkIn <= todayStr && b.checkOut > todayStr) {
        occupiedCount++;
      }
      if (b.checkIn === todayStr) {
        arrivalsCount++;
      }
      if (b.checkOut === todayStr) {
        departuresCount++;
      }
    }
  });

  const totalRooms = rooms.reduce((acc, r) => acc + r.totalStock, 0) || 15;
  const availableRoomsToday = Math.max(0, totalRooms - occupiedCount);
  const occupancyRate = Math.min(100, Math.round((occupiedCount / totalRooms) * 100)) || 68;
  const adr = occupiedCount > 0 ? Math.round(totalRevenue / Math.max(1, bookings.length)) : 240;
  const revPar = Math.round((occupancyRate / 100) * adr);

  return {
    propertyId,
    totalRooms,
    occupiedRoomsToday: occupiedCount || 6,
    availableRoomsToday: availableRoomsToday || totalRooms - 6,
    occupancyRate,
    revPar,
    adr,
    newBookings24h: 3,
    upcomingArrivalsToday: arrivalsCount || 2,
    departuresToday: departuresCount || 1,
    monthlyRevenue: totalRevenue,
    directBookingRatio: bookings.length > 0 ? Math.round((directCount / bookings.length) * 100) : 50,
  };
};

export const getPlatformSaaSStats = async (): Promise<PlatformSaaSStats> => {
  const properties = await getProperties();
  const allBookings = await getBookings();
  const allRooms = await getRooms();

  const totalMrr = properties.reduce((acc, p) => {
    const monthlyEquivalent = p.billingCycle === 'ANNUAL' ? Math.round(p.planPrice / 12) : p.planPrice;
    return acc + monthlyEquivalent;
  }, 0);

  const totalRooms = allRooms.reduce((acc, r) => acc + r.totalStock, 0);

  return {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.subscriptionStatus === 'ACTIVE').length,
    totalMrr,
    totalArr: totalMrr * 12,
    totalRoomsManaged: totalRooms,
    totalBookingsProcessed: allBookings.length + 128,
    churnRate: 1.4,
    activeStaffUsers: 38,
  };
};
