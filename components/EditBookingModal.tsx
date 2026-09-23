import React, { useState, useEffect } from 'react';
import { Booking, RoomType } from '../types';
import { Button } from './Button';
import { X, Calendar, ArrowRight, DollarSign, Loader2, AlertCircle, Calculator } from 'lucide-react';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  room: RoomType;
  onSave: (checkIn: string, checkOut: string) => Promise<void>;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({ isOpen, onClose, booking, room, onSave }) => {
  const [checkIn, setCheckIn] = useState(booking.checkIn);
  const [checkOut, setCheckOut] = useState(booking.checkOut);
  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [priceDetails, setPriceDetails] = useState<{nights: number, base: number, tax: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCheckIn(booking.checkIn);
      setCheckOut(booking.checkOut);
      setNewPrice(null);
      setPriceDetails(null);
      setError('');
    }
  }, [isOpen, booking]);

  // Recalculate price when dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      if (end <= start) {
        setError('Check-out must be after check-in.');
        setNewPrice(null);
        setPriceDetails(null);
        return;
      }

      const today = new Date();
      today.setHours(0,0,0,0);
      const checkInDate = new Date(checkIn);
      checkInDate.setHours(0,0,0,0);

      // Allow keeping same dates, but if changing, check validity
      if (checkIn !== booking.checkIn && checkInDate < today) {
         setError('Check-in date cannot be in the past.');
         setNewPrice(null);
         return;
      }

      setError('');
      const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
      const basePrice = nights * room.pricePerNight;
      const tax = Math.floor(basePrice * 0.13); // 13% tax
      const total = basePrice + tax;
      
      setNewPrice(total);
      setPriceDetails({ nights, base: basePrice, tax });
    }
  }, [checkIn, checkOut, room, booking.checkIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error || !newPrice) return;
    
    setIsSubmitting(true);
    await onSave(checkIn, checkOut);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Edit Booking</h3>
            <p className="text-xs text-gray-500">#{booking.id} • {room.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Check In</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                <input 
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-end justify-center pb-3 text-gray-400">
               <ArrowRight size={20} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Check Out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                <input 
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Price Update Summary */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
             <div className="flex items-center gap-2 mb-3">
               <Calculator size={16} className="text-blue-600" />
               <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Updated Price Summary</h4>
             </div>
             
             <div className="space-y-2 mb-4">
               <div className="flex justify-between items-center text-sm text-gray-600">
                 <span>Current Total</span>
                 <span className="line-through decoration-gray-400">NPR {booking.totalPrice.toLocaleString()}</span>
               </div>
               {priceDetails && (
                 <>
                   <div className="flex justify-between items-center text-xs text-gray-500 pl-2 border-l-2 border-blue-200">
                      <span>Rate ({priceDetails.nights} nights)</span>
                      <span>{priceDetails.base.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs text-gray-500 pl-2 border-l-2 border-blue-200">
                      <span>Tax (13%)</span>
                      <span>{priceDetails.tax.toLocaleString()}</span>
                   </div>
                 </>
               )}
             </div>

             <div className="flex justify-between items-center pt-3 border-t border-blue-200/60">
               <span className="text-sm font-bold text-blue-800">New Total to Pay</span>
               <div className="flex items-center gap-1 font-bold text-xl text-blue-700">
                 {newPrice ? `NPR ${newPrice.toLocaleString()}` : '---'}
               </div>
             </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200">
              Discard
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !!error || !newPrice} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Saving...</span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};