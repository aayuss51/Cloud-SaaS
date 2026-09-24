import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  BedDouble,
  DollarSign,
  CalendarCheck,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  CalendarDays,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import {
  getPropertyStats,
  getBookings,
  getRooms,
  getHousekeeping,
  getPlatformSaaSStats,
} from '../../services/mockDb';
import { PropertyStats, Booking, RoomType, HousekeepingRoom, PlatformSaaSStats } from '../../types';
import { FolioModal } from '../../components/FolioModal';
import { QuickBookingModal } from '../../components/QuickBookingModal';

export const Dashboard: React.FC = () => {
  const { currentProperty, isAllPropertiesView } = useTenant();
  const { user } = useAuth();

  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformSaaSStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [housekeeping, setHousekeeping] = useState<HousekeepingRoom[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (currentProperty) {
        const [st, bks, rms, hk] = await Promise.all([
          getPropertyStats(currentProperty.id),
          getBookings(currentProperty.id),
          getRooms(currentProperty.id),
          getHousekeeping(currentProperty.id),
        ]);
        setStats(st);
        setRecentBookings(bks.slice(0, 6));
        setRooms(rms);
        setHousekeeping(hk);
      }
      if (user?.role === 'SUPER_ADMIN') {
        const pSt = await getPlatformSaaSStats();
        setPlatformStats(pSt);
      }
    } catch (e) {
      console.error('Error loading dashboard stats', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentProperty, isAllPropertiesView]);

  const currency = currentProperty?.currencySymbol || '$';

  // Sample trend data for visual revenue curve
  const revenueTrendData = [
    { day: 'Mon', revenue: 1420, occupancy: 65 },
    { day: 'Tue', revenue: 1850, occupancy: 72 },
    { day: 'Wed', revenue: 2100, occupancy: 80 },
    { day: 'Thu', revenue: 1950, occupancy: 75 },
    { day: 'Fri', revenue: 2780, occupancy: 92 },
    { day: 'Sat', revenue: 3100, occupancy: 96 },
    { day: 'Sun', revenue: 2400, occupancy: 84 },
  ];

  const channelDistributionData = [
    { name: 'Direct Booking', value: 45, color: '#10B981' },
    { name: 'Booking.com', value: 30, color: '#3B82F6' },
    { name: 'Airbnb', value: 15, color: '#F43F5E' },
    { name: 'Expedia', value: 10, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
              {isAllPropertiesView ? 'Global Multi-Tenant Hub' : currentProperty?.name}
            </h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {currentProperty?.tier} Tier
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAllPropertiesView
              ? 'Consolidated SaaS portfolio operations & multi-hotel performance metrics'
              : `${currentProperty?.tagline} • ${currentProperty?.city}, ${currentProperty?.country}`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/tape-chart"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <CalendarDays size={14} className="text-blue-400" />
            <span>Open Tape Chart</span>
          </Link>
          <button
            onClick={() => setIsQuickBookOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <CalendarCheck size={14} />
            <span>+ Quick Reservation</span>
          </button>
        </div>
      </div>

      {/* Super Admin Platform MRR Callout (if Super Admin role) */}
      {user?.role === 'SUPER_ADMIN' && platformStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              Platform MRR (SaaS)
            </span>
            <p className="text-xl font-black text-white mt-0.5">
              ${platformStats.totalMrr.toLocaleString()}
              <span className="text-[10px] text-slate-400 font-normal"> / mo</span>
            </p>
            <p className="text-[10px] text-slate-400">ARR: ${platformStats.totalArr.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Hotels
            </span>
            <p className="text-xl font-black text-white mt-0.5">
              {platformStats.activeProperties}
              <span className="text-[10px] text-blue-400 font-normal"> / {platformStats.totalProperties}</span>
            </p>
            <p className="text-[10px] text-slate-400">Churn Rate: {platformStats.churnRate}%</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Rooms Managed
            </span>
            <p className="text-xl font-black text-white mt-0.5">{platformStats.totalRoomsManaged} Units</p>
            <p className="text-[10px] text-slate-400">Across 3 properties</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              SaaS Bookings Vol.
            </span>
            <p className="text-xl font-black text-white mt-0.5">{platformStats.totalBookingsProcessed}</p>
            <p className="text-[10px] text-blue-400">Platform Health: 99.98%</p>
          </div>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Occupancy Rate</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {stats?.occupancyRate || 72}%
            </span>
            <span className="text-[11px] text-blue-400 flex items-center font-semibold">
              <ArrowUpRight size={13} />
              +5.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats?.occupiedRoomsToday || 6} of {stats?.totalRooms || 15} rooms occupied
          </p>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${stats?.occupancyRate || 72}%` }}
            />
          </div>
        </div>

        {/* RevPAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">RevPAR</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {currency}{stats?.revPar || 185}
            </span>
            <span className="text-[11px] text-cyan-400 flex items-center font-semibold">
              <ArrowUpRight size={13} />
              +8.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Revenue per available room</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>

        {/* ADR (Average Daily Rate) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">ADR (Daily Rate)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <BedDouble size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {currency}{stats?.adr || 280}
            </span>
            <span className="text-[11px] text-indigo-300 flex items-center font-semibold">
              <ArrowUpRight size={13} />
              +3.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average guest spending / night</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Daily Front Desk Movements */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Traffic</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="bg-slate-800/80 p-2 rounded-xl text-center">
              <p className="text-[10px] text-slate-400">Arrivals</p>
              <p className="text-lg font-black text-blue-400 mt-0.5">
                {stats?.upcomingArrivalsToday || 2}
              </p>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl text-center">
              <p className="text-[10px] text-slate-400">Departures</p>
              <p className="text-lg font-black text-amber-400 mt-0.5">
                {stats?.departuresToday || 1}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            {stats?.availableRoomsToday || 9} rooms ready for immediate check-in
          </p>
        </div>
      </div>

      {/* Analytics & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Curve Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Weekly Revenue & Occupancy Trends</h3>
              <p className="text-xs text-slate-400">Dynamic rates & bookings performance</p>
            </div>
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 font-semibold">
              Live Real-Time Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">OTA Channel Breakdown</h3>
            <p className="text-xs text-slate-400">Direct booking vs external OTAs</p>

            <div className="h-44 w-full my-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {channelDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {channelDistributionData.map(c => (
              <div key={c.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-bold text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Housekeeping Quick Dispatch & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Housekeeping Quick Monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Housekeeping Status</h3>
              <p className="text-xs text-slate-400">Live room cleaning readiness</p>
            </div>
            <Link
              to="/admin/housekeeping"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Dispatch Board
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
            {housekeeping.slice(0, 5).map(hk => (
              <div
                key={hk.roomNumber}
                className="bg-slate-850/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Room {hk.roomNumber}</span>
                    <span className="text-[10px] text-slate-400">{hk.roomTypeName}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Assigned: {hk.assignedStaff || 'None'}</p>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    hk.status === 'CLEAN'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : hk.status === 'INSPECTED'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : hk.status === 'DIRTY'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {hk.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Central CRS Recent Bookings Feed */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Recent Reservations</h3>
              <p className="text-xs text-slate-400">Live incoming guest bookings across all channels</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              View All CRS Bookings
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Guest</th>
                  <th className="pb-3">Dates</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Folio Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {recentBookings.map(b => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-mono font-semibold text-blue-400">{b.id}</td>
                    <td className="py-3 font-medium text-white">{b.guestName}</td>
                    <td className="py-3 text-slate-400">
                      {b.checkIn} → {b.checkOut}
                    </td>
                    <td className="py-3">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">
                        Room {b.roomNumber || 'TBD'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'CHECKED_IN'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : b.status === 'CONFIRMED'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right font-black text-white">
                      {currency}{b.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Folio Modal */}
      <FolioModal
        booking={selectedBooking}
        currencySymbol={currency}
        onClose={() => setSelectedBooking(null)}
        onUpdated={() => {
          setSelectedBooking(null);
          loadData();
        }}
      />

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={isQuickBookOpen}
        rooms={rooms}
        onClose={() => setIsQuickBookOpen(false)}
        onCreated={() => {
          setIsQuickBookOpen(false);
          loadData();
        }}
      />
    </div>
  );
};
