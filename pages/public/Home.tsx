import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRooms, getProperties, getFacilities, getReviews } from '../../services/mockDb';
import { RoomType, Property, Facility, Review } from '../../types';
import { RoomDetailsModal } from '../../components/RoomDetailsModal';
import { ImageWithSkeleton } from '../../components/ImageWithSkeleton';
import { useToast } from '../../context/ToastContext';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coffee,
  Waves,
  Wifi,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BedDouble,
  Utensils,
  Flower2,
  Car,
  Compass,
  Building2,
  CreditCard,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

const DESTINATIONS = [
  {
    name: 'Pokhara Lakeside',
    subtitle: 'Lakeside Serenity & Annapurna Mountain Views',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    hotelsCount: 2,
    propertyId: 'prop_grand_royal'
  },
  {
    name: 'Kathmandu Heritage',
    subtitle: 'Ancient Newari Courtyards & Cultural Splendor',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop',
    hotelsCount: 1,
    propertyId: 'prop_grand_royal'
  },
  {
    name: 'Nagarkot Ridge',
    subtitle: 'Breathtaking Himalayan Sunrise & Pine Forests',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    hotelsCount: 1,
    propertyId: 'prop_himalayan_horizon'
  },
  {
    name: 'Sarangkot Heights',
    subtitle: 'Paragliding & Panoramic Valley Vistas',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    hotelsCount: 1,
    propertyId: 'prop_annapurna_resort'
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search parameters
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('ALL');
  const [checkIn, setCheckIn] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState<number>(2);

  // Filter state
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [priceSort, setPriceSort] = useState<'default' | 'low-high' | 'high-low'>('default');

  // Room modal
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [props, rList, fList, revList] = await Promise.all([
          getProperties(),
          getRooms(),
          getFacilities(),
          getReviews()
        ]);
        setProperties(props);
        setRooms(rList);
        setFacilities(fList);
        setReviews(revList);
      } catch (e) {
        showToast('error', 'Failed to load hotel catalog.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (selectedPropertyId !== 'ALL' && room.propertyId !== selectedPropertyId) {
        return false;
      }
      if (activeCategoryFilter !== 'ALL') {
        const nameLower = room.name.toLowerCase();
        if (activeCategoryFilter === 'SUITE' && !nameLower.includes('suite')) return false;
        if (activeCategoryFilter === 'DELUXE' && !nameLower.includes('deluxe')) return false;
        if (activeCategoryFilter === 'VILLA' && !nameLower.includes('villa')) return false;
      }
      return true;
    }).sort((a, b) => {
      if (priceSort === 'low-high') return a.pricePerNight - b.pricePerNight;
      if (priceSort === 'high-low') return b.pricePerNight - a.pricePerNight;
      return 0;
    });
  }, [rooms, selectedPropertyId, activeCategoryFilter, priceSort]);

  const handleBook = (room: RoomType) => {
    navigate(`/book?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guestCount}`);
  };

  const getPropertyName = (propId: string) => {
    const p = properties.find(x => x.id === propId);
    return p ? p.name : 'Mero Boutique Stays';
  };

  const getPropertyCity = (propId: string) => {
    const p = properties.find(x => x.id === propId);
    return p ? p.city : 'Nepal';
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Traveler Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image with Warm Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2560&auto=format&fit=crop"
            alt="Nepal Luxury Resort & Lakeside"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-900/30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-12 pb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-semibold shadow-lg">
            <Sparkles size={14} className="text-amber-300" />
            <span>Curated Boutique Resorts & Hotels Across Nepal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
            Discover Nepal in Timeless Comfort.
          </h1>

          <p className="max-w-2xl mx-auto text-stone-200 text-sm sm:text-base leading-relaxed drop-shadow font-medium">
            From tranquil lakeside villas in <strong>Pokhara</strong> to historical courtyards in <strong>Kathmandu</strong> and sunrise mountain lodges in <strong>Nagarkot</strong>. Reserve directly with zero booking fees and instant confirmation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-white/90 font-medium">
            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <CheckCircle2 size={13} className="text-emerald-400" /> Best Rate Guarantee
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <CheckCircle2 size={13} className="text-emerald-400" /> Instant eSewa, Khalti & Cards
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <CheckCircle2 size={13} className="text-emerald-400" /> Free Cancellation Options
            </span>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div id="booking-search" className="absolute -bottom-10 left-0 right-0 z-20 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Destination Selector */}
            <div className="space-y-1 sm:border-r border-stone-100 pr-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <MapPin size={13} className="text-emerald-700" />
                <span>Destination / Hotel</span>
              </label>
              <select
                value={selectedPropertyId}
                onChange={e => setSelectedPropertyId(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Destinations in Nepal</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Check-In */}
            <div className="space-y-1 sm:border-r border-stone-100 pr-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Calendar size={13} className="text-emerald-700" />
                <span>Check-In Date</span>
              </label>
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-stone-800 focus:outline-none"
              />
            </div>

            {/* Check-Out */}
            <div className="space-y-1 sm:border-r border-stone-100 pr-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Calendar size={13} className="text-emerald-700" />
                <span>Check-Out Date</span>
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-stone-800 focus:outline-none"
              />
            </div>

            {/* Search Trigger */}
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1 pr-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Users size={13} className="text-emerald-700" />
                  <span>Guests</span>
                </label>
                <select
                  value={guestCount}
                  onChange={e => setGuestCount(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4+ Guests</option>
                </select>
              </div>

              <a
                href="#suites"
                className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-700/25 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Search size={14} />
                <span>Find Suites</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Nepal Destinations */}
      <section id="destinations" className="pt-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black tracking-widest text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Explore Nepal
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 mt-2">
              Featured Destinations & Retreats
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Select a destination to view our handpicked collection of boutique hotels and mountain lodges.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedPropertyId(dest.propertyId);
                const el = document.getElementById('suites');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {dest.hotelsCount} Verified Stays
                </span>
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {dest.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                  <span>Explore Rooms</span>
                  <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available Suites & Rooms Catalog */}
      <section id="suites" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 border-b border-stone-200 pb-6">
          <div>
            <span className="text-xs font-black tracking-widest text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Luxury Accommodations
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 mt-2">
              Suites, Villas & Deluxe Rooms
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Showing {filteredRooms.length} available accommodations across Nepal.
            </p>
          </div>

          {/* Filter Pills & Sorters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
              <button
                onClick={() => setActiveCategoryFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeCategoryFilter === 'ALL'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Rooms
              </button>
              <button
                onClick={() => setActiveCategoryFilter('SUITE')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeCategoryFilter === 'SUITE'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Suites
              </button>
              <button
                onClick={() => setActiveCategoryFilter('DELUXE')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeCategoryFilter === 'DELUXE'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Deluxe
              </button>
              <button
                onClick={() => setActiveCategoryFilter('VILLA')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeCategoryFilter === 'VILLA'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Villas
              </button>
            </div>

            {/* Sorter */}
            <select
              value={priceSort}
              onChange={e => setPriceSort(e.target.value as any)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-700 focus:outline-none"
            >
              <option value="default">Featured First</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Room Grid */}
        {isLoading ? (
          <div className="h-72 flex items-center justify-center text-stone-400 text-sm font-medium">
            Loading suites and resorts...
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
            <BedDouble size={40} className="mx-auto text-stone-300" />
            <h3 className="font-serif font-bold text-lg text-stone-800">No accommodations match your filter</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your destination selection or category filter to discover available rooms.
            </p>
            <button
              onClick={() => {
                setSelectedPropertyId('ALL');
                setActiveCategoryFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map(room => (
              <div
                key={room.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Room Image */}
                <div className="relative h-60 overflow-hidden">
                  <ImageWithSkeleton
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Property Tag */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 border border-stone-200 flex items-center gap-1 shadow-sm">
                    <MapPin size={11} className="text-emerald-700" />
                    <span>{getPropertyCity(room.propertyId)} • {getPropertyName(room.propertyId)}</span>
                  </div>

                  {/* Stock Tag */}
                  <div className="absolute bottom-4 left-4 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white">
                    {room.totalStock} units available
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-black text-xl text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {room.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star size={13} fill="currentColor" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
                      {room.description}
                    </p>

                    {/* Room Feature Highlights */}
                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-stone-600">
                      <span className="flex items-center gap-1 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-lg">
                        <Users size={12} className="text-emerald-700" /> {room.capacity} Guests
                      </span>
                      <span className="flex items-center gap-1 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-lg">
                        <Wifi size={12} className="text-emerald-700" /> Free High-Speed Wi-Fi
                      </span>
                      <span className="flex items-center gap-1 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-lg">
                        <Coffee size={12} className="text-emerald-700" /> Breakfast Included
                      </span>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase font-semibold">Starting from</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif font-black text-2xl text-stone-900">
                          रू {room.pricePerNight.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-400">/ night</span>
                      </div>
                      <p className="text-[10px] text-emerald-700 font-medium">Includes IRD VAT & Service Charge</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setIsModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors"
                        title="View Full Suite Gallery & Amenities"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleBook(room)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1"
                      >
                        <span>Reserve</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resort Dining & Experiences */}
      <section id="experiences" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-2xl">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              The Mero Stays Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight">
              Hospitality Rooted in Nepali Warmth
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Every stay is crafted with unforgettable moments — savor organic farm-to-table Nepali thalis, unwind in mountain herbal steam baths, or glide peacefully across Phewa Lake at sunset.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 relative z-10">
            <div className="bg-stone-800/80 backdrop-blur-md p-5 rounded-2xl border border-stone-700 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold">
                <Utensils size={20} />
              </div>
              <h3 className="font-serif font-bold text-base text-white">Fine Himalayan Dining</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Organic ingredients sourced directly from local valley farmers and lakeside fishermen.
              </p>
            </div>

            <div className="bg-stone-800/80 backdrop-blur-md p-5 rounded-2xl border border-stone-700 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-300 flex items-center justify-center font-bold">
                <Flower2 size={20} />
              </div>
              <h3 className="font-serif font-bold text-base text-white">Ayurvedic Spa & Wellness</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Traditional herbal therapies, hot stone massages, and yoga pavilions overlooking the peaks.
              </p>
            </div>

            <div className="bg-stone-800/80 backdrop-blur-md p-5 rounded-2xl border border-stone-700 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-400/10 text-teal-300 flex items-center justify-center font-bold">
                <Car size={20} />
              </div>
              <h3 className="font-serif font-bold text-base text-white">Chauffeur & Transfers</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Private airport pickup from Kathmandu TIA and Pokhara International Airport.
              </p>
            </div>

            <div className="bg-stone-800/80 backdrop-blur-md p-5 rounded-2xl border border-stone-700 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-300 flex items-center justify-center font-bold">
                <Compass size={20} />
              </div>
              <h3 className="font-serif font-bold text-base text-white">Guided Expeditions</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Sarangkot sunrise excursions, heritage walks in Patan, and boating arrangements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews & Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-black tracking-widest text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Guest Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
            Stories from Travelers in Nepal
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Over 14,000 satisfied guests have booked direct through Mero Stays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-stone-600 italic leading-relaxed">
              "Waking up to the reflection of Machapuchare on Phewa Lake from our Presidential Suite at Grand Royal was sublime. Booking directly saved us money and got us complimentary airport transfers!"
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                AN
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Aashish Neupane</p>
                <p className="text-[10px] text-stone-400">Stayed in Pokhara Lakeside</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-stone-600 italic leading-relaxed">
              "The eSewa instant payment option was so smooth. The front desk staff in Nagarkot had our room ready early with hot Himalayan tea. Exceptional hospitality."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                SK
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Sunita Karmacharya</p>
                <p className="text-[10px] text-stone-400">Stayed in Nagarkot Ridge</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-stone-600 italic leading-relaxed">
              "As an international traveler from Zurich, I appreciated being able to view room rates in USD and pay with Visa, but also have local Nepalese currency bills for dining. 10/10 service!"
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                MB
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Markus Brunner</p>
                <p className="text-[10px] text-stone-400">Stayed in Annapurna Eco-Resort</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-black tracking-widest text-stone-500 uppercase bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
            Traveler Assistance
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
            Frequently Asked Questions for Guests
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What payment methods are supported for booking?',
              a: 'You can pay instantly using eSewa, Khalti, major international credit/debit cards (Visa, Mastercard), or choose "Cash on Arrival" at the hotel front desk.'
            },
            {
              q: 'What are standard check-in and check-out timings?',
              a: 'Standard check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in or late check-out can be requested directly through your reservation confirmation.'
            },
            {
              q: 'Can I cancel or modify my reservation?',
              a: 'Yes, reservations can be modified or cancelled free of charge up to 48 hours prior to arrival directly from your "My Bookings" portal.'
            },
            {
              q: 'Do you arrange airport transfers in Kathmandu and Pokhara?',
              a: 'Yes! Complimentary or arranged private chauffeurs are available upon request. Simply notify the hotel through your booking details.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-stone-900 font-bold text-xs sm:text-sm hover:text-emerald-700 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp size={16} className="text-emerald-700 shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-stone-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Hotelier / Staff Transition Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-800 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              For Hotel Owners & Staff
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
              Are you running a hotel or resort in Nepal?
            </h3>
            <p className="text-xs text-stone-300 max-w-xl">
              Experience the <strong>Mero-Booking Cloud PMS</strong>: 14-day tape chart, 2-way OTA channel synchronization (Booking.com, Airbnb), housekeeping dispatch, and IRD 13% VAT invoicing.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 shrink-0 group"
          >
            <Building2 size={16} />
            <span>Launch Staff PMS Console</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Room Details Modal */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          isOpen={isModalOpen}
          facilities={facilities}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRoom(null);
          }}
          onBook={(room: RoomType) => {
            setIsModalOpen(false);
            handleBook(room);
          }}
        />
      )}
    </div>
  );
};
