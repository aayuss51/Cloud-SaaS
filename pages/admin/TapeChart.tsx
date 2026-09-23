import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Sparkles,
  BedDouble,
  Info,
  CheckCircle2,
  Clock,
  User,
  Layers,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import {
  getRooms,
  getBookings,
  getHousekeeping,
} from '../../services/mockDb';
import { RoomType, Booking, HousekeepingRoom } from '../../types';
import { FolioModal } from '../../components/FolioModal';
import { QuickBookingModal } from '../../components/QuickBookingModal';

export const TapeChart: React.FC = () => {
  const { currentProperty } = useTenant();

  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [housekeeping, setHousekeeping] = useState<HousekeepingRoom[]>([]);
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2); // Start 2 days before today for good context
    return d;
  });

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [quickBookConfig, setQuickBookConfig] = useState<{
    isOpen: boolean;
    roomId?: string;
    roomNumber?: string;
    date?: string;
  }>({ isOpen: false });

  const numDays = 14; // 14-day tape chart horizon

  const loadData = async () => {
    if (!currentProperty) return;
    const [rms, bks, hk] = await Promise.all([
      getRooms(currentProperty.id),
      getBookings(currentProperty.id),
      getHousekeeping(currentProperty.id),
    ]);
    setRooms(rms);
    setBookings(bks);
    setHousekeeping(hk);
  };

  useEffect(() => {
    loadData();
  }, [currentProperty]);

  // Generate 14-day array
  const dateColumns: { date: Date; dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < numDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    dateColumns.push({
      date: d,
      dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }

  const shiftDays = (offset: number) => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + offset);
    setStartDate(newDate);
  };

  const jumpToToday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    setStartDate(d);
  };

  // Build a flat list of room units for the Y axis
  interface RoomUnit {
    roomNumber: string;
    roomType: RoomType;
    housekeepingStatus?: HousekeepingRoom['status'];
  }

  const roomUnits: RoomUnit[] = [];
  rooms.forEach(r => {
    r.baseRoomNumbers.forEach(num => {
      const hk = housekeeping.find(h => h.roomNumber === num);
      roomUnits.push({
        roomNumber: num,
        roomType: r,
        housekeepingStatus: hk?.status || 'CLEAN',
      });
    });
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Tape Chart & Room Rack
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              14-Day Visual Grid
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visual room inventory calendar. Click any reservation to open guest folio or click empty slots to reserve.
          </p>
        </div>

        {/* Date Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => shiftDays(-7)}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Previous 7 Days"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={jumpToToday}
              className="px-3 py-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => shiftDays(7)}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Next 7 Days"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setQuickBookConfig({ isOpen: true })}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus size={14} />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-4 text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-300">Reservation Status:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-400"></span>
            <span className="text-slate-300">Checked In</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-600 border border-indigo-400"></span>
            <span className="text-slate-300">Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 border border-amber-300"></span>
            <span className="text-slate-300">Pending</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-300">Housekeeping:</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Clean</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Inspected</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Dirty</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>In-Progress</span>
          </div>
        </div>
      </div>

      {/* Interactive Tape Chart Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            {/* Table Header: Dates */}
            <thead>
              <tr className="bg-slate-850 border-b border-slate-800">
                <th className="sticky left-0 z-20 bg-slate-850 p-3.5 w-48 min-w-[190px] border-r border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
                  Room Units ({roomUnits.length})
                </th>
                {dateColumns.map(col => (
                  <th
                    key={col.dateStr}
                    className={`p-2.5 text-center min-w-[70px] border-r border-slate-800/60 ${
                      col.isToday ? 'bg-emerald-950/40 text-emerald-300 font-black' : 'text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-semibold">{col.dayName}</div>
                    <div
                      className={`text-sm mt-0.5 inline-block w-6 h-6 leading-6 rounded-full ${
                        col.isToday ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-white'
                      }`}
                    >
                      {col.dayNum}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body: Rooms & Booking Blocks */}
            <tbody className="divide-y divide-slate-800/60">
              {roomUnits.map(unit => {
                // Find all bookings for this room number
                const unitBookings = bookings.filter(
                  b =>
                    (b.roomNumber === unit.roomNumber || b.roomId === unit.roomType.id) &&
                    b.status !== 'CANCELLED' &&
                    b.status !== 'REJECTED'
                );

                return (
                  <tr key={unit.roomNumber} className="hover:bg-slate-850/40 transition-colors h-14">
                    {/* Room Info Cell (Sticky Left) */}
                    <td className="sticky left-0 z-10 bg-slate-900 border-r border-slate-800 p-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              unit.housekeepingStatus === 'CLEAN'
                                ? 'bg-emerald-400'
                                : unit.housekeepingStatus === 'INSPECTED'
                                ? 'bg-cyan-400'
                                : unit.housekeepingStatus === 'DIRTY'
                                ? 'bg-rose-400'
                                : 'bg-amber-400'
                            }`}
                            title={`Housekeeping: ${unit.housekeepingStatus}`}
                          />
                          <span className="font-bold text-white text-xs">Room {unit.roomNumber}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                          {unit.roomType.name}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        ${unit.roomType.pricePerNight}
                      </span>
                    </td>

                    {/* Date Matrix Cells */}
                    {dateColumns.map(col => {
                      // Check if any booking covers this date
                      const bookingOnDate = unitBookings.find(
                        b => col.dateStr >= b.checkIn && col.dateStr < b.checkOut
                      );

                      if (bookingOnDate) {
                        const isFirstDay = bookingOnDate.checkIn === col.dateStr;
                        const isLastDay =
                          new Date(new Date(bookingOnDate.checkOut).getTime() - 86400000)
                            .toISOString()
                            .split('T')[0] === col.dateStr;

                        return (
                          <td
                            key={col.dateStr}
                            onClick={() => setSelectedBooking(bookingOnDate)}
                            className="p-1 border-r border-slate-800/40 relative cursor-pointer group"
                            title={`${bookingOnDate.guestName} (${bookingOnDate.status}) - Click to view folio`}
                          >
                            <div
                              className={`h-9 px-2 flex items-center text-[11px] font-bold text-white shadow-md transition-all ${
                                isFirstDay ? 'rounded-l-lg' : ''
                              } ${isLastDay ? 'rounded-r-lg' : ''} ${
                                bookingOnDate.status === 'CHECKED_IN'
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                                  : bookingOnDate.status === 'CONFIRMED'
                                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500'
                                  : 'bg-amber-600 hover:bg-amber-500'
                              }`}
                            >
                              {isFirstDay && (
                                <span className="truncate flex items-center gap-1">
                                  <User size={11} className="shrink-0" />
                                  <span className="truncate">{bookingOnDate.guestName}</span>
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      }

                      // Empty Slot - Clickable to create booking
                      return (
                        <td
                          key={col.dateStr}
                          onClick={() =>
                            setQuickBookConfig({
                              isOpen: true,
                              roomId: unit.roomType.id,
                              roomNumber: unit.roomNumber,
                              date: col.dateStr,
                            })
                          }
                          className={`p-1 border-r border-slate-800/40 hover:bg-emerald-950/20 cursor-pointer transition-colors group ${
                            col.isToday ? 'bg-emerald-950/10' : ''
                          }`}
                          title={`Available. Click to reserve Room ${unit.roomNumber} on ${col.dateStr}`}
                        >
                          <div className="h-9 w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] bg-slate-800 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-slate-700">
                              + Book
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Folio Modal */}
      <FolioModal
        booking={selectedBooking}
        currencySymbol={currentProperty?.currencySymbol || '$'}
        onClose={() => setSelectedBooking(null)}
        onUpdated={() => {
          setSelectedBooking(null);
          loadData();
        }}
      />

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={quickBookConfig.isOpen}
        initialRoomId={quickBookConfig.roomId}
        initialRoomNumber={quickBookConfig.roomNumber}
        initialCheckIn={quickBookConfig.date}
        rooms={rooms}
        onClose={() => setQuickBookConfig({ isOpen: false })}
        onCreated={() => {
          setQuickBookConfig({ isOpen: false });
          loadData();
        }}
      />
    </div>
  );
};
