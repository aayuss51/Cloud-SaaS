
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
// Fix: Removed non-existent export 'updateBookingDetails' from the import list
import { getUserBookings, getRooms, updateBookingStatus } from '../../services/mockDb';
import { Booking, RoomType } from '../../types';
import { Calendar, BedDouble, CheckCircle, Clock, XCircle, RefreshCw, CheckCheck, History, AlertTriangle, Loader2, Pencil, LogOut, Star, Printer, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { ImageWithSkeleton } from '../../components/ImageWithSkeleton';
import { EditBookingModal } from '../../components/EditBookingModal';
import { ConfirmationModal } from '../../components/ConfirmationModal';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'CONFIRMED': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
    case 'PENDING': return 'bg-amber-50 text-amber-800 border-amber-100';
    case 'COMPLETED': return 'bg-blue-50 text-blue-800 border-blue-100';
    default: return 'bg-gray-50 text-gray-800 border-gray-100';
  }
};

const BookingCard: React.FC<{
  booking: Booking;
  rooms: RoomType[];
  onCancel: (id: string) => void;
  onCheckout: (id: string) => void;
  onPrint: (id: string) => void;
  isHistory?: boolean;
}> = ({ booking, rooms, onCancel, onCheckout, onPrint, isHistory }) => {
  const room = rooms.find(r => r.id === booking.roomId);
  return (
    <div className={`rounded-[32px] p-6 border flex flex-col md:flex-row gap-6 ${isHistory ? 'bg-white/50 border-gray-100' : 'bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow'}`}>
      <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
        <ImageWithSkeleton src={room?.imageUrl} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{room?.name}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ref: #{booking.id}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-bold text-gray-500 mb-6">
          <div className="flex items-center gap-2"><Calendar size={14} className="text-emerald-600" /> {booking.checkIn} — {booking.checkOut}</div>
          <div className="flex items-center gap-2 text-emerald-600 font-black">NPR {booking.totalPrice.toLocaleString()}</div>
        </div>
        <div className="flex justify-end gap-2">
           {['CONFIRMED', 'COMPLETED'].includes(booking.status) && (
             <Button variant="outline" size="sm" onClick={() => onPrint(booking.id)} className="rounded-xl font-bold text-[10px]">Statement</Button>
           )}
           {!isHistory && booking.status === 'CONFIRMED' && (
             <Button size="sm" onClick={() => onCheckout(booking.id)} className="rounded-xl font-bold text-[10px]">Checkout</Button>
           )}
           {!isHistory && ['PENDING', 'CONFIRMED'].includes(booking.status) && (
             <Button variant="danger" size="sm" onClick={() => onCancel(booking.id)} className="rounded-xl font-bold text-[10px]">Cancel</Button>
           )}
        </div>
      </div>
    </div>
  );
};

export const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const fetchData = async () => {
    if (user) {
      setIsLoading(true);
      try {
        const [b, r] = await Promise.all([getUserBookings(user.id), getRooms()]);
        setBookings(b.sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setRooms(r);
      } catch (error) {
        showToast('error', 'Failed to load reservations.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleCancel = async () => {
    if (bookingToCancel) {
      try {
        await updateBookingStatus(bookingToCancel, 'CANCELLED');
        await fetchData();
        showToast('success', 'Reservation cancelled.');
      } catch (error) {
        showToast('error', 'Failed to cancel.');
      } finally {
        setIsCancelModalOpen(false);
        setBookingToCancel(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-gray-500 font-black tracking-widest text-xs uppercase animate-pulse">Synchronizing Stays</p>
      </div>
    );
  }

  const active = bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status));
  const history = bookings.filter(b => ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(b.status));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-emerald-600 transition-all shadow-sm group"
          >
            <ChevronLeft size={20} className="group-active:scale-90 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Manage Stays</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Timeline of your Mero-Booking residences.</p>
          </div>
        </div>
        <Link to="/"><Button className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20">New Reservation</Button></Link>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-emerald-600" /> Active Bookings
          </h2>
          <div className="grid gap-6">
            {active.map(b => (
              <BookingCard key={b.id} booking={b} rooms={rooms} onPrint={id => navigate(`/receipt/${id}`)} onCancel={id => {setBookingToCancel(id); setIsCancelModalOpen(true);}} onCheckout={id => navigate(`/review/${id}`)} />
            ))}
            {active.length === 0 && <p className="text-gray-400 font-medium italic py-10 text-center border-2 border-dashed border-gray-200 rounded-[32px]">No active reservations.</p>}
          </div>
        </section>

        {history.length > 0 && (
          <section className="pt-12 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 text-gray-400">
              <History size={20} /> Past Experiences
            </h2>
            <div className="grid gap-6">
              {history.map(b => (
                <BookingCard key={b.id} booking={b} rooms={rooms} onPrint={id => navigate(`/receipt/${id}`)} onCancel={()=>{}} onCheckout={()=>{}} isHistory={true} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ConfirmationModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={handleCancel} title="Cancel?" message="Confirm cancellation of this luxury stay." />
    </div>
  );
};
