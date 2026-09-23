import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getRooms, getFacilities, checkAvailability, getReviews } from '../../services/mockDb';
import { RoomType, Facility, Review } from '../../types';
import { Button } from '../../components/Button';
import { ImageWithSkeleton } from '../../components/ImageWithSkeleton';
import { RoomDetailsModal } from '../../components/RoomDetailsModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Wifi, 
  Car, 
  Calendar, 
  Star, 
  Coffee, 
  Waves, 
  Loader2, 
  AlertCircle, 
  Info, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpDown, 
  Filter, 
  Layers, 
  Search,
  Dumbbell,
  Utensils,
  Tv,
  Check,
  ChevronDown,
  X,
  Settings2
} from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3540&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3540&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=3540&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=3450&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=3480&auto=format&fit=crop',
];

const ICON_MAP: Record<string, React.ElementType> = {
  Wifi, Car, Coffee, Dumbbell, Waves, Utensils, Tv
};

type SortKey = 'name' | 'price' | 'capacity' | 'totalStock' | 'none';
type SortDirection = 'asc' | 'desc';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Helper for consistent date string in local time
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dates, setDates] = useState({
    checkIn: getTodayStr(),
    checkOut: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })()
  });
  const [guestCount, setGuestCount] = useState<number>(1);
  const [dateError, setDateError] = useState<string>('');
  const [availableRoomIds, setAvailableRoomIds] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);
  const [isFacilityPanelOpen, setIsFacilityPanelOpen] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ 
    key: 'none', 
    direction: 'asc' 
  });

  const [selectedRoomDetails, setSelectedRoomDetails] = useState<RoomType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [r, f, rv] = await Promise.all([getRooms(), getFacilities(), getReviews()]);
        setRooms(r);
        setFacilities(f);
        setReviews(rv);
      } catch (error) {
        showToast('error', 'Failed to load hotel content.');
      }
    };
    init();
    const timer = setInterval(() => setCurrentHeroIndex((p) => (p + 1) % HERO_IMAGES.length), 8000);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Close popover on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsFacilityPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showToast]);

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleFacilityFilter = (id: string) => {
    setSelectedFacilityIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const validateDates = (checkInStr: string, checkOutStr: string) => {
    const start = new Date(checkInStr);
    const end = new Date(checkOutStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    if (start < today) {
      setDateError('Check-in cannot be in the past.');
      return false;
    }
    if (end <= start) {
      setDateError('Check-out must be after check-in.');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    if (!newCheckIn) return;
    
    setDates(prev => {
      const nextDates = { ...prev, checkIn: newCheckIn };
      
      // Auto-adjust checkout if it conflicts
      const start = new Date(newCheckIn);
      const end = new Date(prev.checkOut);
      if (end <= start) {
        const nextDay = new Date(start);
        nextDay.setDate(start.getDate() + 1);
        nextDates.checkOut = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
      }
      
      validateDates(nextDates.checkIn, nextDates.checkOut);
      return nextDates;
    });
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckOut = e.target.value;
    if (!newCheckOut) return;
    setDates(prev => ({ ...prev, checkOut: newCheckOut }));
    validateDates(dates.checkIn, newCheckOut);
  };

  const handleSearch = async () => {
    if (!validateDates(dates.checkIn, dates.checkOut)) {
      showToast('error', dateError || 'Please select valid dates.');
      return;
    }
    setIsSearching(true);
    try {
      const unavailable = await checkAvailability(dates.checkIn, dates.checkOut);
      const allIds = rooms.map(r => r.id);
      const available = allIds.filter(id => !unavailable.includes(id));
      setAvailableRoomIds(available);
      showToast('info', `Found ${available.length} available suites for your stay.`);
    } catch (error) {
      showToast('error', 'Search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBook = (room: RoomType) => {
    navigate(`/book?roomId=${room.id}&checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`);
  };

  const getRoomRating = (roomId: string) => {
    const roomReviews = reviews.filter(r => r.roomId === roomId);
    if (roomReviews.length === 0) return { avg: 5.0, count: 0 };
    const sum = roomReviews.reduce((acc, r) => acc + r.rating, 0);
    return { avg: parseFloat((sum / roomReviews.length).toFixed(1)), count: roomReviews.length };
  };

  const displayedRooms = useMemo(() => {
    let result = availableRoomIds ? rooms.filter(r => availableRoomIds.includes(r.id)) : rooms;
    
    // Occupancy Filter
    result = result.filter(r => r.capacity >= guestCount);

    // Facility AND logic Filter
    if (selectedFacilityIds.length > 0) {
      result = result.filter(r => 
        selectedFacilityIds.every(fid => r.facilityIds.includes(fid))
      );
    }

    if (sortConfig.key === 'none') return result;
    return [...result].sort((a, b) => {
      const modifier = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.key === 'name') return modifier * a.name.localeCompare(b.name);
      if (sortConfig.key === 'price') return modifier * (a.pricePerNight - b.pricePerNight);
      if (sortConfig.key === 'capacity') return modifier * (a.capacity - b.capacity);
      if (sortConfig.key === 'totalStock') return modifier * (a.totalStock - b.totalStock);
      return 0;
    });
  }, [rooms, availableRoomIds, sortConfig, guestCount, selectedFacilityIds]);

  const isFormInvalid = !!dateError;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="fixed top-0 left-0 w-full h-[85vh] z-0 pointer-events-none">
          {HERO_IMAGES.map((img, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}>
               <ImageWithSkeleton src={img} className={`w-full h-full object-cover transform transition-transform duration-[10000ms] ${index === currentHeroIndex ? 'scale-105' : 'scale-100'}`} alt={`Hero ${index}`} />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-slate-900/40"></div>
            </div>
          ))}
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6" style={{ transform: `translateY(${scrollY * 0.4}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}>
          <h1 className="text-5xl md:text-8xl font-bold mb-12 text-white font-serif tracking-tight drop-shadow-2xl">Refined Living</h1>
          
          {/* WHITE LIQUID GLASS SEARCH FORM */}
          <div className="bg-white/70 backdrop-blur-3xl border border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] p-8 rounded-[40px] max-w-5xl w-full flex flex-col lg:flex-row gap-6 items-end text-left ring-1 ring-black/5 animate-fade-in-up">
             <div className="flex-1 w-full group relative">
               <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-[0.25em] mb-3 ml-1 opacity-60">Check In</label>
               <div className="relative">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" size={18} />
                 <input 
                  type="date" 
                  className={`w-full pl-12 pr-4 py-4 rounded-[22px] border ${dateError.includes('Check-in') ? 'border-red-400 bg-red-50' : 'border-emerald-100 bg-white/50'} focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-bold text-slate-800`} 
                  value={dates.checkIn} 
                  min={getTodayStr()} 
                  onChange={handleCheckInChange} 
                 />
               </div>
             </div>
             
             <div className="flex-1 w-full group relative">
               <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-[0.25em] mb-3 ml-1 opacity-60">Check Out</label>
               <div className="relative">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" size={18} />
                 <input 
                  type="date" 
                  className={`w-full pl-12 pr-4 py-4 rounded-[22px] border ${dateError.includes('Check-out') ? 'border-red-400 bg-red-50' : 'border-emerald-100 bg-white/50'} focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-bold text-slate-800`} 
                  value={dates.checkOut} 
                  min={dates.checkIn} 
                  onChange={handleCheckOutChange} 
                 />
               </div>
             </div>

             <div className="w-full lg:w-40 group">
               <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-[0.25em] mb-3 ml-1 opacity-60">Occupancy</label>
               <div className="relative">
                 <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" size={18} />
                 <select 
                  className="w-full pl-12 pr-10 py-4 rounded-[22px] border border-emerald-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-bold text-slate-800 appearance-none cursor-pointer" 
                  value={guestCount} 
                  onChange={e => setGuestCount(Number(e.target.value))}
                 >
                   {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} Guests</option>)}
                 </select>
               </div>
             </div>

             <Button 
               onClick={handleSearch} 
               disabled={isSearching || isFormInvalid} 
               className={`w-full lg:w-auto h-[58px] px-10 rounded-[22px] shadow-xl ${isFormInvalid ? 'opacity-50 cursor-not-allowed grayscale' : 'shadow-emerald-500/20'} text-base font-black tracking-wider uppercase`}
             >
                {isSearching ? <Loader2 className="animate-spin" size={24}/> : (
                  <span className="flex items-center gap-2">
                    <Search size={20} /> Search
                  </span>
                )}
             </Button>

             {dateError && (
               <div className="absolute -bottom-10 left-8 flex items-center gap-2 text-red-600 font-bold text-xs animate-fade-in">
                 <AlertCircle size={14} />
                 {dateError}
               </div>
             )}
          </div>
          
          <div className="mt-8 flex items-center gap-6 text-white/60 text-xs font-bold uppercase tracking-widest animate-pulse">
            <div className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-400 rounded-full"></div> Best Rate Guarantee</div>
            <div className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-400 rounded-full"></div> Free Cancellation</div>
            <div className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-400 rounded-full"></div> Instant Confirmation</div>
          </div>
        </div>
      </div>

      <div className="relative z-20 bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8 tracking-tight">Our Curated Residences</h2>
            <div className="flex flex-wrap items-center justify-center gap-3 bg-white/60 backdrop-blur-xl p-3 rounded-[32px] border border-white shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-2 px-4 border-r border-gray-100 mr-2">
                  <Filter size={18} className="text-emerald-600"/>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort Inventory</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(['none', 'name', 'price', 'capacity', 'totalStock'] as const).map(key => (
                    <button key={key} onClick={() => handleSort(key)} className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${sortConfig.key === key ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:bg-white hover:text-emerald-600'}`}>
                      {key === 'none' ? 'Featured' : key === 'name' ? 'Room Name' : key === 'price' ? 'Pricing' : key === 'capacity' ? 'Occupancy' : 'Stock'}
                      {sortConfig.key === key && key !== 'none' && (sortConfig.direction === 'asc' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>)}
                      {sortConfig.key !== key && key !== 'none' && <ArrowUpDown size={14} className="opacity-20"/>}
                    </button>
                  ))}
                </div>

                <div className="h-8 w-px bg-gray-100 mx-2 hidden md:block"></div>

                {/* Amenity Filter Popover */}
                <div className="relative" ref={popoverRef}>
                   <button 
                    onClick={() => setIsFacilityPanelOpen(!isFacilityPanelOpen)}
                    className={`
                      flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border
                      ${selectedFacilityIds.length > 0 || isFacilityPanelOpen
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10' 
                        : 'bg-white text-emerald-600 border-gray-100 hover:bg-emerald-50'}
                    `}
                   >
                     <Settings2 size={16} />
                     Amenities
                     {selectedFacilityIds.length > 0 && (
                       <span className="ml-1 w-5 h-5 bg-white text-emerald-700 rounded-full flex items-center justify-center text-[10px] shadow-sm">
                         {selectedFacilityIds.length}
                       </span>
                     )}
                     <ChevronDown size={14} className={`transition-transform duration-300 ${isFacilityPanelOpen ? 'rotate-180' : ''}`} />
                   </button>

                   {isFacilityPanelOpen && (
                     <div className="absolute top-full right-0 mt-3 w-80 bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white ring-1 ring-black/5 z-[100] p-6 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-50">
                           <div>
                             <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Suite Needs</h4>
                             <p className="text-[10px] text-gray-400 font-bold mt-0.5">Filter by required amenities</p>
                           </div>
                           {selectedFacilityIds.length > 0 && (
                             <button 
                               onClick={() => setSelectedFacilityIds([])}
                               className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:underline"
                             >
                               Clear All
                             </button>
                           )}
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                           {facilities.map(f => {
                             const Icon = ICON_MAP[f.icon] || Wifi;
                             const isSelected = selectedFacilityIds.includes(f.id);
                             return (
                               <button 
                                key={f.id}
                                onClick={() => toggleFacilityFilter(f.id)}
                                className={`flex items-center justify-between p-3 rounded-xl transition-all ${isSelected ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-slate-600'}`}
                               >
                                 <div className="flex items-center gap-3">
                                   <Icon size={16} />
                                   <span className="text-xs font-bold">{f.name}</span>
                                 </div>
                                 {isSelected && <Check size={14} className="text-emerald-600" />}
                               </button>
                             );
                           })}
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-50 flex justify-center">
                           <button 
                            onClick={() => setIsFacilityPanelOpen(false)}
                            className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                           >
                             Apply Filters
                           </button>
                        </div>
                     </div>
                   )}
                </div>
            </div>
          </div>

          {/* Active Amenity Filter Chips */}
          {selectedFacilityIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12 animate-fade-in">
               <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mr-2 bg-emerald-100/50 px-4 py-2 rounded-full border border-emerald-200">Requirement Checklist:</span>
               {selectedFacilityIds.map(fid => {
                 const f = facilities.find(fac => fac.id === fid);
                 return f ? (
                   <button 
                    key={fid} 
                    onClick={() => toggleFacilityFilter(fid)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-slate-600 text-[11px] font-bold shadow-sm hover:border-rose-200 hover:text-rose-500 transition-all group"
                   >
                     {f.name}
                     <X size={12} className="opacity-40 group-hover:opacity-100" />
                   </button>
                 ) : null;
               })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {displayedRooms.map(room => {
              const { avg, count } = getRoomRating(room.id);
              return (
                <div key={room.id} className="bg-white rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col group border border-gray-100">
                  <div className="h-80 relative overflow-hidden">
                    <ImageWithSkeleton src={room.imageUrl} alt={room.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-xl px-5 py-3 rounded-2xl text-emerald-900 font-black shadow-2xl ring-1 ring-black/5">
                      <span className="text-xs uppercase tracking-widest opacity-60 block leading-none mb-1">From</span>
                      NPR {room.pricePerNight.toLocaleString()}
                    </div>
                    <div className="absolute bottom-6 left-6 flex gap-2">
                       <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center gap-2">
                          <Star size={12} className="text-amber-400 fill-amber-400" /> {avg} ({count})
                       </div>
                       <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-emerald-950 text-[10px] font-black uppercase tracking-widest border border-white/50 flex items-center gap-2">
                          <Layers size={12} /> {room.totalStock} Available
                       </div>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-3xl font-bold font-serif leading-tight text-slate-900">{room.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest"><Users size={16}/> {room.capacity} Max</div>
                    </div>
                    <p className="text-gray-500 mb-10 leading-relaxed font-medium line-clamp-3">{room.description}</p>
                    <div className="flex gap-4 mt-auto">
                      <Button onClick={() => { setSelectedRoomDetails(room); setIsDetailsModalOpen(true); }} variant="secondary" className="flex-1 rounded-3xl py-4 font-black uppercase tracking-wider text-xs">Examine Suite</Button>
                      <Button onClick={() => handleBook(room)} className="flex-1 rounded-3xl py-4 font-black uppercase tracking-wider text-xs shadow-xl shadow-emerald-500/20">Secure Booking</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {displayedRooms.length === 0 && (
             <div className="py-32 text-center bg-white/40 backdrop-blur-xl rounded-[64px] border border-white shadow-sm ring-1 ring-black/5 animate-fade-in mt-12">
               <div className="p-8 bg-emerald-50 text-emerald-600 rounded-[40px] inline-flex mb-8 shadow-inner"><Settings2 size={64} /></div>
               <h3 className="text-4xl font-bold text-slate-900 font-serif mb-4">Perfect Suite Still Awaiting...</h3>
               <p className="text-gray-500 max-w-lg mx-auto font-medium">No suites currently match your chosen criteria. Try adjusting your guest count or loosening your amenity requirements.</p>
               <button 
                 onClick={() => { setSelectedFacilityIds([]); setGuestCount(1); setAvailableRoomIds(null); }}
                 className="mt-12 text-emerald-600 font-black uppercase tracking-[0.2em] text-xs hover:underline flex items-center gap-2 mx-auto"
               >
                 <X size={16} /> Reset All Search Criteria
               </button>
             </div>
          )}
        </div>
      </div>
      {selectedRoomDetails && <RoomDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} room={selectedRoomDetails} facilities={facilities} onBook={handleBook} />}
    </div>
  );
};