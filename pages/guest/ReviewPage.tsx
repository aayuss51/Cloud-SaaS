import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBooking, getRoom, saveReview, getReviews } from '../../services/mockDb';
import { Booking, RoomType, Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { ImageWithSkeleton } from '../../components/ImageWithSkeleton';
import { Star, ArrowLeft, Loader2, CheckCircle2, MessageSquare, BedDouble, Calendar, ShieldCheck } from 'lucide-react';

export const ReviewPage: React.FC = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [existingReview, setExistingReview] = useState<Review | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId || !user) return;
      setIsLoading(true);
      try {
        const b = await getBooking(bookingId);
        // Allow the guest or an administrator to access the review page
        const isOwner = b && b.userId === user.id;
        const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

        if (b && (isOwner || isAdmin)) {
          setBooking(b);
          const r = await getRoom(b.roomId);
          if (r) setRoom(r);
          
          const allReviews = await getReviews();
          const existing = allReviews.find(rev => rev.bookingId === bookingId);
          if (existing) {
            setExistingReview(existing);
            setRating(existing.rating);
            setComment(existing.comment);
          }
        } else {
          showToast('error', 'Booking not found or unauthorized.');
          navigate(user.role === 'GUEST' ? '/my-bookings' : '/admin/bookings');
        }
      } catch (e) {
        showToast('error', 'Failed to load checkout details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [bookingId, user, navigate, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !booking || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await saveReview({
        id: existingReview?.id || '',
        propertyId: booking.propertyId || 'prop_grand_royal',
        bookingId: booking.id,
        roomId: booking.roomId,
        userId: user.id,
        userName: user.name,
        rating,
        comment,
        createdAt: new Date().toISOString()
      });
      showToast('success', 'Thank you for your valuable feedback!');
      navigate(user.role === 'GUEST' ? '/my-bookings' : '/admin/bookings');
    } catch (error) {
      showToast('error', 'Failed to save review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 animate-pulse">Syncing Checkout Data</p>
      </div>
    );
  }

  if (!booking || !room) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(user?.role === 'GUEST' ? '/my-bookings' : '/admin/bookings')} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Summary Section */}
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
                <div className="h-48 relative">
                   <ImageWithSkeleton src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Checked Out Residence</p>
                      <h2 className="text-2xl font-bold font-serif">{room.name}</h2>
                   </div>
                </div>
                <div className="p-8 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><Calendar size={20} /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stay Period</p>
                         <p className="text-sm font-bold text-slate-800">{booking.checkIn} — {booking.checkOut}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><ShieldCheck size={20} /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Total</p>
                         <p className="text-sm font-bold text-slate-800">NPR {booking.totalPrice.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-gray-50">
                      <Link to={`/receipt/${booking.id}`}>
                        <Button variant="outline" className="w-full rounded-2xl py-4 text-xs font-bold gap-2">
                           <CheckCircle2 size={16} /> View Final Statement
                        </Button>
                      </Link>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400"><MessageSquare size={24}/></div>
                   <div>
                      <h4 className="font-bold">Your opinion matters</h4>
                      <p className="text-xs text-white/60 leading-relaxed mt-1">Help us refine the Mero-Booking experience for future residents.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Review Form Section */}
          <div className="lg:col-span-2">
             <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 p-12 ring-1 ring-black/5">
                <h1 className="text-4xl font-bold text-slate-900 font-serif tracking-tight mb-4">Refined Feedback</h1>
                <p className="text-gray-500 font-medium mb-12">How was your stay at the {room.name}? We prioritize your experience above all else.</p>

                <form onSubmit={handleSubmit} className="space-y-10">
                   <div className="flex flex-col items-center py-10 bg-gray-50/50 rounded-[40px] border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Select Rating</p>
                      <div className="flex gap-4">
                         {[1, 2, 3, 4, 5].map((star) => (
                           <button
                             key={star}
                             type="button"
                             onClick={() => setRating(star)}
                             onMouseEnter={() => setHoverRating(star)}
                             onMouseLeave={() => setHoverRating(0)}
                             className="transition-all duration-300 hover:scale-125 focus:outline-none"
                           >
                             <Star 
                               size={48} 
                               className={`${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} transition-colors drop-shadow-sm`} 
                               strokeWidth={1.5}
                             />
                           </button>
                         ))}
                      </div>
                      <p className="mt-6 text-sm font-black text-emerald-600 uppercase tracking-widest animate-fade-in">
                        {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][(hoverRating || rating) - 1]} Experience
                      </p>
                   </div>

                   <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Detail your residency thoughts</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about the service, facilities, and your overall comfort..."
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all min-h-[200px] outline-none font-medium"
                        required
                      />
                   </div>

                   <div className="pt-6">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full h-20 rounded-[28px] text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/20 active:scale-95 transition-all"
                      >
                         {isSubmitting ? <Loader2 className="animate-spin" size={32} /> : existingReview ? 'Update Feedback' : 'Submit Checkout Review'}
                      </Button>
                   </div>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};