import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getRoom, createBooking, getFacilities, getBooking } from '../../services/mockDb';
import { RoomType, Facility, Booking, PaymentMethod } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { ImageWithSkeleton } from '../../components/ImageWithSkeleton';
import { 
  Calendar, 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  FileText, 
  Printer, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  Banknote, 
  ShieldCheck, 
  AlertCircle,
  User as UserIcon,
  Phone,
  Camera,
  ChevronRight,
  ChevronDown,
  Wallet,
  Smartphone,
  Lock,
  Sparkles
} from 'lucide-react';

// Khalti Brand Logo
const KhaltiLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center rounded-2xl bg-[#5c2d91] text-white overflow-hidden shadow-lg ${className}`}>
     <span className="font-black text-xl tracking-tighter font-sans">Khalti</span>
     <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
  </div>
);

export const BookingSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId: urlBookingId } = useParams();
  const { showToast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  const [room, setRoom] = useState<RoomType | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // Payment State - Khalti Exclusive
  const paymentMethod: PaymentMethod = 'KHALTI';
  const [khaltiMobile, setKhaltiMobile] = useState(user?.phone || '9801234567');
  const [khaltiPin, setKhaltiPin] = useState('1234');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'CONNECTING' | 'AUTHORIZING' | 'SUCCESS'>('CONNECTING');

  // Guest Details Edit State
  const [showDetailsEdit, setShowDetailsEdit] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatarUrl: user?.avatarUrl || ''
  });

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (user) {
      setGuestDetails({
        name: user.name,
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (urlBookingId) {
        try {
          const b = await getBooking(urlBookingId);
          if (b) {
            setConfirmedBooking(b);
            const r = await getRoom(b.roomId);
            if (r) setRoom(r);
            const f = await getFacilities();
            setFacilities(f);
          } else {
            showToast('error', 'Booking statement not found.');
            navigate('/');
          }
        } catch (error) {
          showToast('error', 'Failed to generate statement.');
        }
      } else if (roomId) {
        try {
          const [r, f] = await Promise.all([getRoom(roomId), getFacilities()]);
          if (r) setRoom(r);
          setFacilities(f);
        } catch (error) {
           showToast('error', 'Details load error.');
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [roomId, urlBookingId, showToast, navigate]);

  const handleShare = async () => {
    if (!confirmedBooking || !room) return;
    const shareData = {
      title: 'Mero-Booking Statement',
      text: `Statement for #${confirmedBooking.id}\nRoom: ${room.name}\nDates: ${confirmedBooking.checkIn} to ${confirmedBooking.checkOut}`,
      url: window.location.href
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareData.text);
        showToast('success', 'Details copied for sharing.');
      }
    } catch (err) {}
  };

  const handleCopyId = async () => {
    if (confirmedBooking) {
      await navigator.clipboard.writeText(confirmedBooking.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGuestDetails(prev => ({ ...prev, avatarUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 animate-pulse">Generating Secure Statement</p>
      </div>
    );
  }

  if (confirmedBooking && room) {
    const startDate = new Date(confirmedBooking.checkIn);
    const endDate = new Date(confirmedBooking.checkOut);
    const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
    const isPending = confirmedBooking.status === 'PENDING';
    const isPaid = confirmedBooking.paymentStatus === 'PAID';
    const basePrice = room.pricePerNight * nights;
    const taxAmount = confirmedBooking.totalPrice - basePrice;
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in print:bg-white print:p-0">
        <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-2xl w-full text-center border border-gray-100 relative overflow-hidden print:shadow-none print:border-none print:w-full print:max-w-none print:p-8">
           <div className={`absolute top-0 left-0 w-full h-2 print:hidden ${isPending ? 'bg-amber-500' : 'bg-emerald-600'}`}></div>

           <div className="flex justify-between items-center mb-10 print:mb-12">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-serif font-black shadow-lg">MB</div>
                 <div className="text-left">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Mero-Booking</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Official Statement</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Statement No.</p>
                 <p className="text-sm font-black text-slate-900 font-mono tracking-tighter">#{confirmedBooking.id}</p>
              </div>
           </div>

           <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Guest Reservation Statement</h1>
           <p className="text-gray-400 font-medium mb-12">Thank you for choosing Mero-Booking Luxury Residences.</p>
           
           <div className="grid grid-cols-2 gap-8 text-left mb-12 bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 print:bg-white print:border-gray-200">
              <div className="col-span-2 border-b border-gray-200 pb-6 mb-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Accommodation Residence</p>
                 <p className="text-2xl font-bold text-slate-900">{room.name}</p>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Primary Guest</p>
                 <p className="font-bold text-slate-800">{confirmedBooking.guestName}</p>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                 <div className="flex gap-2">
                    <span className="text-[10px] font-black uppercase bg-white px-2 py-0.5 rounded border border-gray-200 text-slate-600">{confirmedBooking.status}</span>
                    <span className="text-[10px] font-black uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-emerald-600">{confirmedBooking.paymentStatus}</span>
                 </div>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Check In</p>
                 <p className="font-bold text-slate-800">{confirmedBooking.checkIn}</p>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Check Out</p>
                 <p className="font-bold text-slate-800">{confirmedBooking.checkOut}</p>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Duration</p>
                 <p className="font-bold text-slate-800">{nights} Total Nights</p>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment Method</p>
                 <p className="font-bold text-purple-900 uppercase flex items-center gap-1.5">
                   <span className="w-2 h-2 rounded-full bg-[#5c2d91] inline-block"></span>
                   Khalti Digital Wallet
                 </p>
                 <p className="text-[10px] font-mono text-purple-700 mt-0.5 font-semibold">Txn: KHLT-{confirmedBooking.id.replace(/[^0-9]/g, '') || '78901'}-NP</p>
              </div>
           </div>

           <div className="border-t-2 border-slate-900 border-dashed pt-8 mb-12">
              <div className="flex justify-between items-center mb-3">
                 <span className="text-sm font-medium text-gray-500">Accommodation Base Rate</span>
                 <span className="font-bold text-slate-900">NPR {basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                 <span className="text-sm font-medium text-gray-500">Government Service Tax (13%)</span>
                 <span className="font-bold text-slate-900">NPR {taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-6 bg-emerald-600 rounded-2xl px-6 text-white print:bg-white print:text-slate-900 print:border-2 print:border-slate-900">
                 <span className="text-xs font-black uppercase tracking-widest opacity-80">Final Settlement Total</span>
                 <span className="text-3xl font-black">NPR {confirmedBooking.totalPrice.toLocaleString()}</span>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 print:hidden">
             <Button onClick={() => navigate(-1)} variant="outline" className="flex-1 h-14 rounded-2xl gap-2 font-bold">
               <ArrowLeft size={18} /> Back
             </Button>
             <Button onClick={() => window.print()} className="flex-1 h-14 rounded-2xl gap-2 font-bold shadow-xl shadow-emerald-600/20">
               <Printer size={18} /> Print Now
             </Button>
             <Button onClick={handleShare} variant="secondary" className="flex-1 h-14 rounded-2xl gap-2 font-bold border-gray-200">
               <Share2 size={18} /> Share
             </Button>
           </div>
           
           <div className="hidden print:block text-center mt-12 border-t pt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Validated Digital Statement</p>
              <div className="mt-4 flex justify-center gap-12">
                 <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Office</p>
                    <p className="text-[10px] font-bold text-slate-900">Kathmandu, NP</p>
                 </div>
                 <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Contact</p>
                    <p className="text-[10px] font-bold text-slate-900">+977 1 4XXXXXX</p>
                 </div>
                 <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Web</p>
                    <p className="text-[10px] font-bold text-slate-900">merobooking.com</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- Summary / New Booking Flow ---
  if (!room || !checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-800">Invalid Session</h2>
        <Button className="mt-4" onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)));
  const totalCost = Math.floor(nights * room.pricePerNight * 1.13);

  const processBooking = async () => {
    if (!user || !room || !checkIn || !checkOut) return;
    setIsSubmitting(true);
    setIsProcessingPayment(true);
    setPaymentStep('CONNECTING');
    await new Promise(r => setTimeout(r, 800));
    setPaymentStep('AUTHORIZING');
    await new Promise(r => setTimeout(r, 1100));
    setPaymentStep('SUCCESS');
    await new Promise(r => setTimeout(r, 600));
    setIsProcessingPayment(false);

    try {
      const newBooking = await createBooking({
        propertyId: room.propertyId || 'prop_grand_royal',
        roomId: room.id,
        roomTypeName: room.name,
        userId: user.id,
        guestName: guestDetails.name,
        guestEmail: user.email,
        guestPhone: guestDetails.phone || khaltiMobile,
        checkIn,
        checkOut,
        nights,
        adults: 2,
        children: 0,
        channel: 'DIRECT',
        totalPrice: totalCost,
        paymentMethod: 'KHALTI',
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        notes: `Settled via Khalti Digital Wallet (${khaltiMobile})`
      });
      setConfirmedBooking(newBooking);
      showToast('success', 'Reservation confirmed & settled via Khalti.');
    } catch (e) {
      showToast('error', 'Booking failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 animate-fade-in relative">
      {isProcessingPayment && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-[36px] max-w-md w-full p-8 text-center shadow-2xl border border-purple-100 flex flex-col items-center relative overflow-hidden">
             {/* Khalti Top Brand Accent */}
             <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#5c2d91] via-purple-600 to-indigo-600"></div>

             <div className="mb-5 mt-2">
                <KhaltiLogo className="w-20 h-20 !rounded-3xl shadow-xl shadow-purple-500/20" />
             </div>

             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#5c2d91] text-[11px] font-bold uppercase tracking-wider mb-2 border border-purple-100">
               <ShieldCheck size={14} className="text-purple-600" /> Khalti Payment Gateway
             </div>

             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Authenticating Khalti</h2>
             <p className="text-xs text-slate-500 mt-1 mb-6">Securing reservation with instant NPR wallet settlement</p>

             <div className="w-full bg-purple-50/80 rounded-2xl p-4 mb-6 border border-purple-100 text-left text-xs space-y-2">
               <div className="flex justify-between">
                 <span className="text-slate-500">Khalti Account:</span>
                 <span className="font-mono font-bold text-purple-950">{khaltiMobile}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-500">Merchant:</span>
                 <span className="font-semibold text-slate-800">Mero Stays Nepal Ltd.</span>
               </div>
               <div className="flex justify-between pt-1 border-t border-purple-200/60">
                 <span className="font-bold text-slate-700">Total Settlement:</span>
                 <span className="font-black text-purple-900 text-sm">NPR {totalCost.toLocaleString()}</span>
               </div>
             </div>

             {/* Status indicator */}
             <div className="w-full space-y-3 mb-6">
               <div className="flex items-center justify-between text-[11px] font-semibold text-purple-900">
                 <span>
                   {paymentStep === 'CONNECTING' && 'Connecting to Khalti API servers...'}
                   {paymentStep === 'AUTHORIZING' && 'Authorizing wallet token & balance...'}
                   {paymentStep === 'SUCCESS' && 'Payment verified & approved!'}
                 </span>
                 {paymentStep !== 'SUCCESS' ? (
                   <Loader2 size={14} className="animate-spin text-purple-600 inline" />
                 ) : (
                   <CheckCircle size={15} className="text-emerald-500 inline" />
                 )}
               </div>
               <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-[#5c2d91] to-purple-500 rounded-full transition-all duration-500" 
                   style={{
                     width: paymentStep === 'CONNECTING' ? '35%' : paymentStep === 'AUTHORIZING' ? '75%' : '100%'
                   }}
                 />
               </div>
             </div>

             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <Lock size={12} /> 256-Bit SSL • Nepal Rastra Bank Regulated
             </div>
           </div>
        </div>
      )}

      {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-10 border border-white flex flex-col gap-6 ring-1 ring-black/5">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl border border-purple-100"><ShieldCheck size={28} /></div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 font-serif">Confirm Stay</h3>
                        <p className="text-[11px] text-purple-700 font-medium">Khalti Instant Checkout</p>
                      </div>
                  </div>
                  <div className="space-y-4 bg-gray-50 p-6 rounded-3xl text-sm border border-gray-100">
                      <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Suite</span><span className="font-bold text-slate-900">{room.name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Guest</span><span className="font-bold text-slate-900">{guestDetails.name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Gateway</span><span className="font-bold text-purple-900">Khalti Digital Wallet</span></div>
                      <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total</span><span className="font-black text-emerald-600">NPR {totalCost.toLocaleString()}</span></div>
                  </div>
                  <div className="flex gap-3 mt-2">
                      <Button variant="secondary" onClick={() => setShowConfirmModal(false)} className="flex-1 rounded-2xl h-14 font-bold">Cancel</Button>
                      <Button onClick={() => { setShowConfirmModal(false); processBooking(); }} className="flex-1 rounded-2xl h-14 font-bold bg-[#5c2d91] hover:bg-[#481e78] text-white shadow-xl shadow-purple-600/20">Pay via Khalti</Button>
                  </div>
              </div>
          </div>
      )}

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-12">
            <div className="bg-white rounded-[48px] shadow-sm overflow-hidden border border-gray-100">
                <div className="h-64 relative overflow-hidden group">
                    <ImageWithSkeleton src={room.imageUrl} alt={room.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-10">
                        <div>
                            <h2 className="text-4xl font-bold text-white font-serif tracking-tight">{room.name}</h2>
                            <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] mt-3 leading-none">Luxury Experience</p>
                        </div>
                    </div>
                </div>
                <div className="p-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-colors mb-10 text-[10px] font-black uppercase tracking-[0.2em]"><ArrowLeft size={16} /> Return to Inventory</button>
                    <div className="grid grid-cols-2 gap-8 mb-12 bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 shadow-inner">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white rounded-2xl text-emerald-600 shadow-sm border border-emerald-50"><Calendar size={24} /></div>
                            <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Period</p><p className="font-bold text-slate-900">{checkIn} — {checkOut}</p></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white rounded-2xl text-emerald-600 shadow-sm border border-emerald-50"><Users size={24} /></div>
                            <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Stay</p><p className="font-bold text-slate-900">{nights} Nights</p></div>
                        </div>
                    </div>

                    {/* Exclusive Khalti Payment Gateway Card */}
                    <div className="mb-12">
                      <div className="flex items-center justify-between mb-4 ml-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">
                            Active Payment Gateway
                          </h3>
                          <span className="bg-purple-100 text-[#5c2d91] font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-purple-200">
                            Khalti Exclusive
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck size={13} className="text-[#5c2d91]" /> Instant NPR Settle
                        </span>
                      </div>

                      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#5c2d91] via-[#481e78] to-[#2c0b55] p-7 text-white shadow-xl shadow-purple-950/20 border border-purple-400/30">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-400/20">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-white text-[#5c2d91] flex items-center justify-center font-black text-xl shadow-md shrink-0">
                              Kh
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-lg text-white">Khalti Digital Wallet</h4>
                                <span className="text-[9px] bg-amber-400 text-purple-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  Default Gateway
                                </span>
                              </div>
                              <p className="text-xs text-purple-200 mt-0.5">
                                Official & exclusive payment provider for Mero Stays reservations
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">Processing Fee</span>
                            <span className="text-sm font-black text-emerald-300">NPR 0 (Free)</span>
                          </div>
                        </div>

                        {/* Interactive Khalti details / quick demo */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-200 mb-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-1"><Smartphone size={12} /> Khalti Mobile Number</span>
                              <span className="text-purple-300 text-[9px] font-normal">Nepal (+977)</span>
                            </label>
                            <input
                              type="text"
                              value={khaltiMobile}
                              onChange={e => setKhaltiMobile(e.target.value)}
                              placeholder="98XXXXXXXX"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-400/30 text-white font-mono text-sm placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-200 mb-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-1"><Lock size={12} /> Khalti MPIN (Demo)</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setKhaltiMobile('9801234567');
                                  setKhaltiPin('1234');
                                  showToast('info', 'Demo Khalti credentials loaded.');
                                }}
                                className="text-[9px] text-amber-300 hover:text-amber-200 underline font-semibold"
                              >
                                Fill Demo
                              </button>
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              value={khaltiPin}
                              onChange={e => setKhaltiPin(e.target.value)}
                              placeholder="••••"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-400/30 text-white font-mono text-sm placeholder-purple-400/50 tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-purple-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-purple-200">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={15} className="text-amber-400 shrink-0" />
                            <span>Regulated by Nepal Rastra Bank • Instant 1-touch token authorization</span>
                          </div>
                          <span className="text-[10px] bg-purple-900/80 border border-purple-400/30 px-2.5 py-0.5 rounded text-purple-200 font-medium">
                            Khalti Wallet & Mobile Banking
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-10 border-t border-gray-100">
                        <div className="flex justify-between items-center px-4">
                            <span className="font-black text-slate-900 text-xl font-serif">Total Settlement</span>
                            <div className="text-right">
                                <span className="font-black text-4xl text-emerald-600">NPR {totalCost.toLocaleString()}</span>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Inclusive of all duties</p>
                            </div>
                        </div>
                        <Button onClick={() => setShowConfirmModal(true)} disabled={isSubmitting} className="w-full h-20 rounded-[28px] text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 active:scale-95">{isSubmitting ? <Loader2 className="animate-spin" size={32} /> : 'Complete Reservation'}</Button>
                    </div>
                </div>
            </div>
        </div>

        <div className="w-full lg:w-[380px] space-y-8">
            <div className="bg-white rounded-[48px] p-10 shadow-sm border border-gray-100 flex flex-col ring-1 ring-black/5">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2 text-emerald-600"><ShieldCheck size={20} /><h3 className="font-black uppercase tracking-[0.2em] text-[10px]">Registry</h3></div>
                    <button onClick={() => setShowDetailsEdit(!showDetailsEdit)} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">{showDetailsEdit ? 'Done' : 'Update'}</button>
                </div>
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[40px] bg-emerald-50 border-4 border-white shadow-2xl flex items-center justify-center text-emerald-600 text-4xl font-black overflow-hidden relative">
                            {guestDetails.avatarUrl ? <img src={guestDetails.avatarUrl} alt="Guest" className="w-full h-full object-cover" /> : <span>{guestDetails.name.charAt(0)}</span>}
                            {showDetailsEdit && <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={32} className="text-white" /></div>}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    <div className="text-center"><p className="font-black text-slate-900 text-2xl font-serif tracking-tight">{guestDetails.name}</p><p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{user?.email}</p></div>
                </div>
                {showDetailsEdit ? (
                    <div className="space-y-6 animate-fade-in-up">
                        <div><label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Identity Name</label><div className="relative"><UserIcon className="absolute left-4 top-3.5 text-gray-300" size={16} /><input type="text" className="w-full pl-12 pr-4 py-3.5 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10" value={guestDetails.name} onChange={e => setGuestDetails({...guestDetails, name: e.target.value})} /></div></div>
                        <div><label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mobile Access</label><div className="relative"><Phone className="absolute left-4 top-3.5 text-gray-300" size={16} /><input type="tel" className="w-full pl-12 pr-4 py-3.5 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10" value={guestDetails.phone} onChange={e => setGuestDetails({...guestDetails, phone: e.target.value})} /></div></div>
                    </div>
                ) : (
                    <div className="space-y-4 bg-gray-50 p-6 rounded-[28px] border border-gray-100">
                        <div className="flex items-center justify-between"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mobile</span><span className="text-xs font-bold text-slate-900">{guestDetails.phone || 'Registry Pending'}</span></div>
                        <div className="flex items-center justify-between"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Registry ID</span><span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 uppercase">Authenticated</span></div>
                    </div>
                )}
            </div>
            <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl flex items-center gap-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner"><FileText size={28} /></div>
                <div><p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Rate Lock</p><p className="text-xs font-medium leading-relaxed">Your luxury rate is currently synchronized and locked for the next 15:00 minutes.</p></div>
            </div>
        </div>
      </div>
    </div>
  );
};