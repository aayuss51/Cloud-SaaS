import React, { useState } from 'react';
import { X, Calendar, User, BedDouble, DollarSign, CheckCircle2 } from 'lucide-react';
import { RoomType, BookingChannel, PaymentMethod } from '../types';
import { createBooking } from '../services/mockDb';
import { useTenant } from '../context/TenantContext';

interface QuickBookingModalProps {
  isOpen: boolean;
  initialRoomId?: string;
  initialRoomNumber?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  rooms: RoomType[];
  onClose: () => void;
  onCreated: () => void;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  initialRoomId,
  initialRoomNumber,
  initialCheckIn,
  initialCheckOut,
  rooms,
  onClose,
  onCreated,
}) => {
  const { currentProperty } = useTenant();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [roomId, setRoomId] = useState(initialRoomId || rooms[0]?.id || '');
  const [roomNumber, setRoomNumber] = useState(initialRoomNumber || '');
  const [checkIn, setCheckIn] = useState(initialCheckIn || new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(
    initialCheckOut || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [adults, setAdults] = useState(2);
  const [channel, setChannel] = useState<BookingChannel>('DIRECT');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('KHALTI');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedRoom = rooms.find(r => r.id === roomId) || rooms[0];

  const calculateNights = () => {
    const d1 = new Date(checkIn).getTime();
    const d2 = new Date(checkOut).getTime();
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const totalPrice = selectedRoom ? selectedRoom.pricePerNight * nights : 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !selectedRoom) return;

    setIsSubmitting(true);
    try {
      await createBooking({
        propertyId: currentProperty?.id || 'prop_grand_royal',
        roomId: selectedRoom.id,
        roomTypeName: selectedRoom.name,
        roomNumber: roomNumber || selectedRoom.baseRoomNumbers[0] || '101',
        guestName,
        guestEmail: guestEmail || `${guestName.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
        guestPhone,
        checkIn,
        checkOut,
        nights,
        adults,
        children: 0,
        channel,
        totalPrice,
        status: 'CONFIRMED',
        paymentMethod,
        paymentStatus: 'PAID',
        notes,
      });
      onCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create booking', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Create New Reservation</h3>
              <p className="text-xs text-slate-400">Tape Chart & Central CRS Direct Booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Guest Full Name *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="e.g., Katherine Jenkins"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
                placeholder="guest@domain.com"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
                placeholder="+1 555 0192"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Room Category *
              </label>
              <select
                value={roomId}
                onChange={e => {
                  setRoomId(e.target.value);
                  const found = rooms.find(r => r.id === e.target.value);
                  if (found && found.baseRoomNumbers.length > 0) {
                    setRoomNumber(found.baseRoomNumbers[0]);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} (${r.pricePerNight}/nt)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Assigned Unit / Room #
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                placeholder={selectedRoom?.baseRoomNumbers[0] || '101'}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Check-In Date *
              </label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Check-Out Date *
              </label>
              <input
                type="date"
                required
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Booking Channel
              </label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as BookingChannel)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs"
              >
                <option value="DIRECT">Direct Desk / Phone</option>
                <option value="BOOKING_COM">Booking.com</option>
                <option value="AIRBNB">Airbnb</option>
                <option value="EXPEDIA">Expedia</option>
                <option value="AGODA">Agoda</option>
              </select>
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                <span>Payment Gateway</span>
                <span className="text-[10px] text-purple-600 font-semibold lowercase">exclusive</span>
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-2.5 py-2 rounded-lg border border-purple-300 bg-purple-50/50 text-purple-950 font-medium text-xs focus:ring-2 focus:ring-purple-500"
              >
                <option value="KHALTI">Khalti Digital Wallet (Active)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Direct Nepal NPR settlement via Khalti</p>
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Adults
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={adults}
                onChange={e => setAdults(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
              Guest Requests / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Honeymoon anniversary, late check-in, dietary restrictions"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs"
            />
          </div>

          {/* Pricing Estimation Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-medium">Estimated Stay ({nights} Nights)</p>
              <p className="text-slate-400 text-[11px]">${selectedRoom?.pricePerNight} × {nights} nights</p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-emerald-600">${totalPrice.toLocaleString()}</span>
              <p className="text-[10px] text-slate-500">Taxes & charges included</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? <span>Creating...</span> : <span>Confirm & Post Reservation</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
