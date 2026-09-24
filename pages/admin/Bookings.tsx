import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileText,
  LogIn,
  LogOut,
  Calendar,
  User,
  CreditCard,
  Download,
  Building2,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { getBookings, getRooms, updateBookingStatus } from '../../services/mockDb';
import { Booking, BookingStatus, BookingChannel, RoomType } from '../../types';
import { FolioModal } from '../../components/FolioModal';
import { QuickBookingModal } from '../../components/QuickBookingModal';
import { RoleGuard } from '../../components/RoleGuard';

export const Bookings: React.FC = () => {
  const { currentProperty } = useTenant();
  const { can } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!currentProperty) return;
    setIsLoading(true);
    try {
      const [bks, rms] = await Promise.all([
        getBookings(currentProperty.id),
        getRooms(currentProperty.id),
      ]);
      setBookings(bks);
      setRooms(rms);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentProperty]);

  const handleQuickStatus = async (id: string, status: BookingStatus) => {
    await updateBookingStatus(id, status);
    await loadData();
  };

  const filteredBookings = bookings.filter(b => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (channelFilter !== 'ALL' && b.channel !== channelFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = b.guestName.toLowerCase().includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      const matchEmail = b.guestEmail.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchEmail) return false;
    }
    return true;
  });

  const currency = currentProperty?.currencySymbol || '$';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Central Reservation System (CRS)
            </h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Omnichannel CRS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-channel guest reservations, folio management, and instant check-in/check-out.
          </p>
        </div>

        <RoleGuard
          permission="pms:bookings:create"
          renderDisabled={true}
          disabledTooltip="Front Desk & Admin role required to create reservations"
        >
          <button
            onClick={() => setIsQuickBookOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus size={15} />
            <span>New Reservation</span>
          </button>
        </RoleGuard>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by guest name, email, or BK-..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-850 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2.5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-850 border border-slate-700/80 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Channel Filter */}
          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="bg-slate-850 border border-slate-700/80 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Channels</option>
            <option value="DIRECT">Direct Desk</option>
            <option value="BOOKING_COM">Booking.com</option>
            <option value="AIRBNB">Airbnb</option>
            <option value="EXPEDIA">Expedia</option>
            <option value="AGODA">Agoda</option>
          </select>

          <span className="text-slate-400 text-[11px] whitespace-nowrap pl-1">
            {filteredBookings.length} bookings
          </span>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-4">ID / Ref</th>
                <th className="p-4">Guest Details</th>
                <th className="p-4">Stay Dates</th>
                <th className="p-4">Room Unit</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Folio Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No reservations found matching this query.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-850/50 transition-colors cursor-pointer group"
                  >
                    <td
                      onClick={() => setSelectedBooking(b)}
                      className="p-4 font-mono font-bold text-blue-400"
                    >
                      {b.id}
                    </td>

                    <td onClick={() => setSelectedBooking(b)} className="p-4">
                      <p className="font-bold text-white text-xs">{b.guestName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{b.guestEmail}</p>
                    </td>

                    <td onClick={() => setSelectedBooking(b)} className="p-4">
                      <p className="font-medium text-slate-200">
                        {b.checkIn} → {b.checkOut}
                      </p>
                      <p className="text-[11px] text-slate-400">{b.nights} Nights</p>
                    </td>

                    <td onClick={() => setSelectedBooking(b)} className="p-4">
                      <span className="bg-slate-800 px-2 py-0.5 rounded font-mono font-semibold text-white text-[11px]">
                        Room {b.roomNumber || 'TBD'}
                      </span>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{b.roomTypeName}</p>
                    </td>

                    <td onClick={() => setSelectedBooking(b)} className="p-4">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                        {b.channel.replace('_', '.')}
                      </span>
                    </td>

                    <td onClick={() => setSelectedBooking(b)} className="p-4">
                      <p className="font-black text-white text-xs">
                        {currency}{b.totalPrice.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] font-bold ${
                            b.paymentStatus === 'PAID' ? 'text-blue-400' : 'text-amber-400'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider">
                          {b.paymentMethod}
                        </span>
                      </div>
                    </td>

                    <td onClick={() => setSelectedBooking(b)} className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'CHECKED_IN'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : b.status === 'CHECKED_OUT'
                            ? 'bg-slate-800 text-slate-400'
                            : b.status === 'CONFIRMED'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      {b.status === 'CONFIRMED' && (
                        <RoleGuard
                          permission="pms:bookings:check_in_out"
                          renderDisabled={true}
                          disabledTooltip="Front Desk & Admin role required"
                        >
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleQuickStatus(b.id, 'CHECKED_IN');
                            }}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] shadow-sm transition-all"
                            title="Quick Check-In"
                          >
                            Check In
                          </button>
                        </RoleGuard>
                      )}
                      {b.status === 'CHECKED_IN' && (
                        <RoleGuard
                          permission="pms:bookings:check_in_out"
                          renderDisabled={true}
                          disabledTooltip="Front Desk & Admin role required"
                        >
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleQuickStatus(b.id, 'CHECKED_OUT');
                            }}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] shadow-sm transition-all"
                            title="Quick Check-Out"
                          >
                            Check Out
                          </button>
                        </RoleGuard>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-semibold text-[11px] transition-colors"
                      >
                        Folio Bill
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
