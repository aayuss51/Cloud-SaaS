import React, { useState } from 'react';
import {
  X,
  FileText,
  User,
  Calendar,
  CreditCard,
  Plus,
  Printer,
  CheckCircle2,
  LogOut,
  LogIn,
  BedDouble,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { Booking, FolioCharge, BookingStatus, PaymentStatus } from '../types';
import {
  updateBookingStatus,
  updateBookingPaymentStatus,
  addFolioCharge,
} from '../services/mockDb';

interface FolioModalProps {
  booking: Booking | null;
  currencySymbol?: string;
  onClose: () => void;
  onUpdated: () => void;
}

export const FolioModal: React.FC<FolioModalProps> = ({
  booking,
  currencySymbol = '$',
  onClose,
  onUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'FOLIO' | 'DETAILS'>('FOLIO');
  const [newChargeDesc, setNewChargeDesc] = useState('');
  const [newChargeCategory, setNewChargeCategory] = useState<FolioCharge['category']>('DINING');
  const [newChargeAmount, setNewChargeAmount] = useState('');
  const [isAddingCharge, setIsAddingCharge] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!booking) return null;

  const totalCharges = booking.charges.reduce((sum, c) => sum + c.amount, 0);

  const handleStatusChange = async (newStatus: BookingStatus) => {
    setIsProcessing(true);
    try {
      await updateBookingStatus(booking.id, newStatus);
      onUpdated();
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentStatusChange = async (newPayStatus: PaymentStatus) => {
    setIsProcessing(true);
    try {
      await updateBookingPaymentStatus(booking.id, newPayStatus);
      onUpdated();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newChargeAmount);
    if (!newChargeDesc.trim() || isNaN(amountNum) || amountNum <= 0) return;

    setIsProcessing(true);
    try {
      await addFolioCharge(booking.id, {
        description: newChargeDesc,
        category: newChargeCategory,
        amount: amountNum,
      });
      setNewChargeDesc('');
      setNewChargeAmount('');
      setIsAddingCharge(false);
      onUpdated();
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Guest Folio & Billing</h3>
                <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-blue-300 font-semibold">
                  {booking.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Room {booking.roomNumber || 'TBD'} • {booking.guestName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Print Guest Folio Receipt"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Action Strip (Check In / Check Out / Status) */}
        <div className="bg-slate-100/80 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Front Desk Actions:</span>
            {booking.status === 'CONFIRMED' && (
              <button
                disabled={isProcessing}
                onClick={() => handleStatusChange('CHECKED_IN')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-sm transition-all"
              >
                <LogIn size={13} />
                <span>Check-In Guest</span>
              </button>
            )}
            {booking.status === 'CHECKED_IN' && (
              <button
                disabled={isProcessing}
                onClick={() => handleStatusChange('CHECKED_OUT')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-sm transition-all"
              >
                <LogOut size={13} />
                <span>Complete Check-Out</span>
              </button>
            )}
            <span
              className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                booking.status === 'CHECKED_IN'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : booking.status === 'CHECKED_OUT'
                  ? 'bg-slate-200 text-slate-700'
                  : booking.status === 'CONFIRMED'
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {booking.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Payment:</span>
            <button
              onClick={() =>
                handlePaymentStatusChange(booking.paymentStatus === 'PAID' ? 'PENDING' : 'PAID')
              }
              className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] transition-all ${
                booking.paymentStatus === 'PAID'
                  ? 'bg-purple-100 text-purple-900 border border-purple-300 hover:bg-purple-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
              }`}
            >
              {booking.paymentStatus} ({booking.paymentMethod || 'KHALTI'})
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {/* Reservation Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-slate-500">Guest</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.guestName}</p>
              <p className="text-[11px] text-slate-500 truncate">{booking.guestEmail}</p>
            </div>
            <div>
              <p className="text-slate-500">Dates</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {booking.checkIn} → {booking.checkOut}
              </p>
              <p className="text-[11px] text-slate-500">{booking.nights} Nights</p>
            </div>
            <div>
              <p className="text-slate-500">Room Allocated</p>
              <p className="font-bold text-slate-900 mt-0.5">Room {booking.roomNumber || 'Not Assigned'}</p>
              <p className="text-[11px] text-slate-500 truncate">{booking.roomTypeName}</p>
            </div>
            <div>
              <p className="text-slate-500">Source / Channel</p>
              <p className="font-bold text-slate-900 mt-0.5 capitalize">
                {booking.channel.replace('_', '.')}
              </p>
              <p className="text-[11px] text-slate-500">{booking.adults} Adults, {booking.children} Kids</p>
            </div>
          </div>

          {/* Folio Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Itemized Folio Charges</span>
                <span className="text-xs font-normal text-slate-500">({booking.charges.length} items)</span>
              </h4>
              <button
                onClick={() => setIsAddingCharge(!isAddingCharge)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Plus size={13} />
                <span>Add Charge</span>
              </button>
            </div>

            {/* Add Charge Form */}
            {isAddingCharge && (
              <form
                onSubmit={handleAddCharge}
                className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl mb-4 space-y-3 animate-fade-in-up"
              >
                <div className="font-semibold text-xs text-blue-950">Add Extra Service / Charge to Room Folio:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="sm:col-span-1">
                    <select
                      value={newChargeCategory}
                      onChange={e => setNewChargeCategory(e.target.value as FolioCharge['category'])}
                      className="w-full px-2.5 py-2 rounded-lg border border-blue-300 bg-white text-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="DINING">Restaurant & Bar</option>
                      <option value="SPA">Spa & Wellness</option>
                      <option value="MINIBAR">Minibar Snacks</option>
                      <option value="LAUNDRY">Laundry Service</option>
                      <option value="ROOM">Room Extension</option>
                      <option value="SERVICE">Airport Chauffeur</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      required
                      placeholder="Description (e.g. Vintage Merlot)"
                      value={newChargeDesc}
                      onChange={e => setNewChargeDesc(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-blue-300 bg-white text-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-1 flex gap-2">
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="Amount ($)"
                      value={newChargeAmount}
                      onChange={e => setNewChargeAmount(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-blue-300 bg-white text-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shrink-0"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {booking.charges.map(chg => (
                    <tr key={chg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{chg.date}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {chg.category}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-900">{chg.description}</td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        {currencySymbol}
                        {chg.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/90 border-t border-slate-200">
                  <tr>
                    <td colSpan={3} className="p-3.5 text-right font-bold text-slate-700 text-xs uppercase tracking-wider">
                      Total Balance Due
                    </td>
                    <td className="p-3.5 text-right font-black text-slate-950 text-sm">
                      {currencySymbol}
                      {totalCharges.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900">
              <p className="font-bold text-amber-950 uppercase tracking-wider text-[10px] mb-1">
                Guest Requests & Front Desk Notes
              </p>
              <p>{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Created on {new Date(booking.createdAt).toLocaleDateString()}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Close Folio
          </button>
        </div>
      </div>
    </div>
  );
};
