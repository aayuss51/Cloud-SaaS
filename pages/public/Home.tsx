import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRooms, getReviews, getProperties, getFacilities } from '../../services/mockDb';
import { RoomType, Review, Property, Facility } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { RoomDetailsModal } from '../../components/RoomDetailsModal';
import { ImageWithSkeleton } from '../../components/ImageWithSkeleton';
import {
  Building2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Calendar,
  CreditCard,
  TrendingUp,
  Layers,
  Globe,
  RefreshCw,
  Sliders,
  Receipt,
  Users,
  Star,
  Zap,
  ChevronRight,
  HelpCircle,
  Check,
  Laptop,
  Smartphone,
  BedDouble,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart3,
  CalendarDays,
  Clock,
  ExternalLink,
  Flame
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentProperty, properties, switchProperty } = useTenant();

  // Rooms and demo state
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // Demo module showcase tab
  const [activeModuleTab, setActiveModuleTab] = useState<'tapechart' | 'channels' | 'folio' | 'housekeeping'>('tapechart');

  // Pricing cycle
  const [isAnnualBilling, setIsAnnualBilling] = useState(true);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Direct Booking Demo filters
  const [selectedPropId, setSelectedPropId] = useState<string>('prop_grand_royal');
  const [selectedRoomForModal, setSelectedRoomForModal] = useState<RoomType | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [demoCheckIn, setDemoCheckIn] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [demoCheckOut, setDemoCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    loadData();
  }, [selectedPropId]);

  const loadData = async () => {
    setIsLoadingRooms(true);
    try {
      const [r, rv, p, f] = await Promise.all([
        getRooms(selectedPropId),
        getReviews(selectedPropId),
        getProperties(),
        getFacilities()
      ]);
      setRooms(r);
      setReviews(rv);
      setAllProperties(p);
      setFacilities(f);
    } catch (e) {
      showToast('error', 'Failed to load demo property data.');
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const handleBookDemoRoom = (room: RoomType) => {
    // Navigate to booking engine
    navigate(`/book?roomId=${room.id}&checkIn=${demoCheckIn}&checkOut=${demoCheckOut}`);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const activeDemoProperty = allProperties.find(p => p.id === selectedPropId) || properties[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-800/40 py-2.5 px-4 text-center text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Nepal V2.6 Release
          </span>
          <span className="text-slate-300">
            Automated IRD 13% VAT & Service Charge invoicing + Instant <strong>eSewa & Khalti</strong> gateway settlements are now live.
          </span>
          <button
            onClick={() => navigate('/admin')}
            className="text-emerald-400 font-bold hover:text-emerald-300 underline inline-flex items-center gap-1 ml-1"
          >
            Launch PMS Demo <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <span className="text-base">🇳🇵</span>
            <span className="text-xs font-semibold text-slate-200">
              Nepal's #1 Cloud Hotel PMS & OTA Channel Manager SaaS
            </span>
            <span className="bg-emerald-500 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
              NEW
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Supercharge Your Hotel in Nepal.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Zero Overbookings. Maximum Direct Revenue.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            From lakeside luxury resorts in <strong>Pokhara</strong> to boutique retreats in <strong>Thamel</strong>, 
            tea houses in <strong>Mustang</strong>, and sunrise lodges in <strong>Nagarkot</strong> — unify your 
            visual 14-day tape chart, 2-way OTA synchronization (Booking.com, Agoda, Airbnb), and native 
            Nepali digital settlements (<strong>eSewa, Khalti, Fonepay</strong>).
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 hover:shadow-emerald-400/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group"
            >
              <Building2 size={18} className="text-slate-950" />
              <span>Launch Live PMS Console</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#booking-demo"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <BedDouble size={18} className="text-emerald-400" />
              <span>Explore Direct Booking Engine</span>
            </a>
          </div>

          {/* Feature Micro-Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>5-Minute Hotel Setup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>IRD VAT (13%) & PAN Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Native eSewa & Khalti QR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>99.98% Cloud Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Hotels & Channel Ecosystem Ribbon */}
      <section className="border-y border-slate-800/80 bg-slate-900/50 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
            Trusted by Hotels Across Nepal & Integrated With Global Channels
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-slate-400 text-xs font-semibold grayscale opacity-70 hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1.5 text-white font-bold text-sm">
              🏨 Grand Royal Pokhara
            </span>
            <span className="flex items-center gap-1.5 text-white font-bold text-sm">
              🏔️ Annapurna Lakeside Eco
            </span>
            <span className="flex items-center gap-1.5 text-white font-bold text-sm">
              🌄 Himalayan Horizon Nagarkot
            </span>
            <span className="text-emerald-400 font-black tracking-tight text-sm">
              🌿 eSewa Digital
            </span>
            <span className="text-purple-400 font-black tracking-tight text-sm">
              🟣 Khalti Wallet
            </span>
            <span className="text-sky-400 font-black tracking-tight text-sm">
              Booking.com
            </span>
            <span className="text-rose-400 font-black tracking-tight text-sm">
              Airbnb
            </span>
            <span className="text-amber-400 font-black tracking-tight text-sm">
              Expedia
            </span>
          </div>
        </div>
      </section>

      {/* Interactive SaaS Product Modules Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            All-in-One Hotel OS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything Your Front Desk, GM & Housekeeping Need
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Replace clunky spreadsheets, handwritten logbooks, and scattered WhatsApp reservations with one unified cloud operating system.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveModuleTab('tapechart')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeModuleTab === 'tapechart'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <CalendarDays size={15} />
            <span>14-Day Visual Tape Chart</span>
          </button>
          <button
            onClick={() => setActiveModuleTab('channels')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeModuleTab === 'channels'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Globe size={15} />
            <span>2-Way OTA Channel Manager</span>
          </button>
          <button
            onClick={() => setActiveModuleTab('folio')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeModuleTab === 'folio'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Receipt size={15} />
            <span>Front Desk Folio & IRD Billing</span>
          </button>
          <button
            onClick={() => setActiveModuleTab('housekeeping')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeModuleTab === 'housekeeping'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Layers size={15} />
            <span>Housekeeping Dispatch Kanban</span>
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description Column */}
            <div className="lg:col-span-5 space-y-6">
              {activeModuleTab === 'tapechart' && (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black">
                    <CalendarDays size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      Interactive Visual Tape Chart & Room Rack
                    </h3>
                    <p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-wider">
                      Real-Time Room Inventory Grid
                    </p>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Instantly visualize all room units across a sliding 14-day calendar window. 
                    Color-coded reservation blocks give duty managers and front desk staff total clarity on who is checking in, checked in, or departing.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Click any empty cell to create a fast walk-in booking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Click any reservation to open the guest folio and check-in</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Live room cleaning status dots (Clean, Inspected, Dirty)</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/admin/tape-chart')}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs inline-flex items-center gap-2 border border-slate-700"
                  >
                    Open Live Tape Chart <ExternalLink size={13} />
                  </button>
                </>
              )}

              {activeModuleTab === 'channels' && (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-black">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      2-Way OTA Channel Synchronization
                    </h3>
                    <p className="text-xs text-sky-400 font-bold mt-1 uppercase tracking-wider">
                      Zero Double Bookings Guaranteed
                    </p>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Peak tourist season in Nepal (October–December & March–May) brings high volumes across 
                    Booking.com, Agoda, and Airbnb. Mero-Booking automatically syncs room availability in real time, 
                    shutting down closed dates instantly.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Dynamic markup sliders (+10% to +15%) to offset OTA commission fees</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Automated rate parity audit across all connected portals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Manual one-click "Sync All Channels Now" fail-safe trigger</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/admin/channels')}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs inline-flex items-center gap-2 border border-slate-700"
                  >
                    Open Channel Manager <ExternalLink size={13} />
                  </button>
                </>
              )}

              {activeModuleTab === 'folio' && (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      Itemized Guest Folio & IRD Tax Invoicing
                    </h3>
                    <p className="text-xs text-amber-400 font-bold mt-1 uppercase tracking-wider">
                      13% VAT & Service Charge Ready
                    </p>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Track dining charges from your hotel restaurant, spa treatments, airport chauffeurs, 
                    and minibar consumption on one unified room bill. Complete checkout in seconds with 
                    cash, credit card, eSewa, or Khalti.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Nepal IRD VAT & PAN invoice generation with QR code</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Post departmental charges (Dining, Spa, Laundry) directly to room numbers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Multi-currency support: NPR (रू) and USD ($) statements</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/admin/bookings')}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs inline-flex items-center gap-2 border border-slate-700"
                  >
                    View Reservation Folios <ExternalLink size={13} />
                  </button>
                </>
              )}

              {activeModuleTab === 'housekeeping' && (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-black">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      Housekeeping Dispatch Kanban Board
                    </h3>
                    <p className="text-xs text-rose-400 font-bold mt-1 uppercase tracking-wider">
                      Turnover Operations Simplified
                    </p>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Eliminate front desk miscommunication with cleaning teams. Housekeeping staff can 
                    move rooms between Dirty, In-Progress, Clean, and Inspected statuses right on their mobile devices.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Turnover prioritization for early check-in VIP arrivals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Assign specific floor staff and cleaning attendants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>Out-of-Order maintenance tags for plumbing or repairs</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate('/admin/housekeeping')}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs inline-flex items-center gap-2 border border-slate-700"
                  >
                    Open Housekeeping Board <ExternalLink size={13} />
                  </button>
                </>
              )}
            </div>

            {/* Right Interactive Mockup Screen */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="ml-2 font-mono text-[11px] text-slate-400">
                    pms.mero-booking.com/admin/{activeModuleTab === 'tapechart' ? 'tape-chart' : activeModuleTab}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  LIVE DEMO PREVIEW
                </span>
              </div>

              {activeModuleTab === 'tapechart' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-6 gap-2 text-[10px] text-slate-500 border-b border-slate-800 pb-2">
                    <span className="col-span-2">Unit / Suite</span>
                    <span>Today</span>
                    <span>Tomorrow</span>
                    <span>Day 3</span>
                    <span>Day 4</span>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 gap-2 items-center bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="col-span-2">
                        <p className="font-bold text-white text-xs">101 • Presidential PH</p>
                        <p className="text-[10px] text-emerald-400 font-sans">✓ Clean & Ready</p>
                      </div>
                      <div className="col-span-3 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 p-1.5 rounded text-[10px] truncate">
                        Marcus Sterling (Checked In)
                      </div>
                      <div className="bg-slate-800/60 p-1.5 rounded text-center text-slate-500 text-[10px]">
                        Available
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-2 items-center bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="col-span-2">
                        <p className="font-bold text-white text-xs">204 • Himalayan Deluxe</p>
                        <p className="text-[10px] text-amber-400 font-sans">⏳ Cleaning In-Progress</p>
                      </div>
                      <div className="col-span-2 bg-sky-600/30 border border-sky-500/40 text-sky-300 p-1.5 rounded text-[10px] truncate">
                        Sagar Adhikari (Direct)
                      </div>
                      <div className="col-span-2 bg-purple-600/30 border border-purple-500/40 text-purple-300 p-1.5 rounded text-[10px] truncate">
                        Elena Rostova (Booking.com)
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-2 items-center bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="col-span-2">
                        <p className="font-bold text-white text-xs">302 • Lakeside Villa</p>
                        <p className="text-[10px] text-emerald-400 font-sans">✓ Inspected</p>
                      </div>
                      <div className="bg-slate-800/60 p-1.5 rounded text-center text-slate-500 text-[10px]">
                        Available
                      </div>
                      <div className="col-span-3 bg-rose-600/30 border border-rose-500/40 text-rose-300 p-1.5 rounded text-[10px] truncate">
                        Clara Dubois (Airbnb)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModuleTab === 'channels' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                        B.
                      </div>
                      <div>
                        <p className="font-bold text-white">Booking.com Global</p>
                        <p className="text-[10px] text-slate-400">Rate Parity: Active • +12% Markup</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      ● Synced (1m ago)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                        Air
                      </div>
                      <div>
                        <p className="font-bold text-white">Airbnb Worldwide</p>
                        <p className="text-[10px] text-slate-400">Rate Parity: Active • +15% Markup</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      ● Synced (3m ago)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        DIR
                      </div>
                      <div>
                        <p className="font-bold text-white">Direct Hotel Engine (0% Comm)</p>
                        <p className="text-[10px] text-slate-400">eSewa & Khalti Instant Payments</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      ● Direct Engine
                    </span>
                  </div>
                </div>
              )}

              {activeModuleTab === 'folio' && (
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div>
                      <p className="font-bold text-white">Folio #BK-88219 • Room 101</p>
                      <p className="text-[10px] text-slate-400">Guest: Marcus Sterling (VIP Gold)</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      Checked In
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Room Rent (3 Nights @ $180)</span>
                      <span className="font-mono">$540.00</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Lakeside Restaurant Dining</span>
                      <span className="font-mono">$48.50</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Ayurvedic Herbal Spa</span>
                      <span className="font-mono">$65.00</span>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800 text-[10px]">
                      <span>Nepal IRD VAT (13%)</span>
                      <span className="font-mono">$84.95</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-black text-xs pt-1 border-t border-slate-800">
                      <span>Total Folio Due:</span>
                      <span className="font-mono font-bold">$738.45 (NPR 99,690)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModuleTab === 'housekeeping' && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-xl space-y-2">
                    <p className="font-bold text-rose-300 text-[10px] uppercase tracking-wider">Dirty (2)</p>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px]">
                      <p className="font-bold text-white">Room 204</p>
                      <p className="text-[9px] text-slate-400">Deluxe King</p>
                      <span className="text-[9px] text-rose-400 font-bold">● High Priority</span>
                    </div>
                  </div>
                  <div className="bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl space-y-2">
                    <p className="font-bold text-amber-300 text-[10px] uppercase tracking-wider">In-Progress (1)</p>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px]">
                      <p className="font-bold text-white">Room 102</p>
                      <p className="text-[9px] text-slate-400">Staff: Sunita K.</p>
                      <span className="text-[9px] text-amber-400 font-bold">● Vacuuming</span>
                    </div>
                  </div>
                  <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl space-y-2">
                    <p className="font-bold text-emerald-300 text-[10px] uppercase tracking-wider">Inspected (4)</p>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px]">
                      <p className="font-bold text-white">Room 101</p>
                      <p className="text-[9px] text-emerald-400">Ready for Front Desk</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Built Specifically for Nepal Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold uppercase tracking-wider">
            Tailored For Nepal's Realities
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Why Nepali Hoteliers Are Switching to Mero-Booking
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Foreign hotel software doesn't understand Nepali VAT laws, local QR wallets, or internet drops during mountain weather. We built this from the ground up for Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Native eSewa, Khalti & Fonepay</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accept domestic traveler deposits and restaurant billings directly into your hotel bank account with instant QR verification and no chargeback delays.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Receipt size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Nepal IRD 13% VAT & PAN Invoicing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              One-click fiscal tax invoice printing with 13% VAT, 10% Service Charge, and IRD-compliant fiscal bill numbering. Audit-ready reports anytime.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Globe size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Peak Tourist Season Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never experience walk-in embarrassment or double-booked rooms during Dashain, Tihar, New Year, or peak trekking seasons in Pokhara and Kathmandu.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Property Chain Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Own a hotel in Pokhara, a resort in Nagarkot, and a safari lodge in Chitwan? Manage all properties under one SaaS login with consolidated MRR.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Smartphone size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Zero Expensive Hardware</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No expensive on-premise servers or license renewals. Runs smoothly in Google Chrome on any laptop, tablet, iPad, or Android phone.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">0% Commission Direct Booking Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stop bleeding 15%–18% commissions to overseas OTAs. Our modern direct booking engine turns website visitors into direct paying guests.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Booking Engine Test Drive Section */}
      <section id="booking-demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              <BedDouble size={14} />
              <span>Direct Booking Engine Demo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Test Drive the Guest Booking Experience
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              See how your guests will book suites directly from your website with real-time room availability, photo galleries, and instant checkout.
            </p>
          </div>

          {/* Hotel Property Selector */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <span className="text-xs font-semibold text-slate-400">Select Demo Property:</span>
            <select
              value={selectedPropId}
              onChange={e => setSelectedPropId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-emerald-500"
            >
              {allProperties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Room Suites Grid for Selected Property */}
        {isLoadingRooms ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-xs font-medium">
            Loading suites...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <div
                key={room.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group shadow-lg"
              >
                <div className="relative h-52 overflow-hidden">
                  <ImageWithSkeleton
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-emerald-400 border border-emerald-500/30">
                    {activeDemoProperty?.currencySymbol || 'NPR रू'} {room.pricePerNight.toLocaleString()}
                    <span className="text-slate-400 font-normal text-[9px]"> / night</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-white border border-slate-800">
                    {room.totalStock} Units Available
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">{room.name}</h3>
                      <span className="text-[10px] font-mono text-slate-500">{room.code}</span>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedRoomForModal(room);
                        setIsRoomModalOpen(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                    >
                      View Suite Specs
                    </button>
                    <button
                      onClick={() => handleBookDemoRoom(room)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20"
                    >
                      Book Stay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SaaS Pricing Matrix Tailored for Nepal */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            Clear, Transparent Investment
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Plans Sized for Nepali Lodges & Luxury Chains
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            No hidden setup charges. No commission cuts. Cancel or upgrade anytime with local invoicing in Nepali Rupees.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-semibold ${!isAnnualBilling ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnualBilling(!isAnnualBilling)}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 relative border border-slate-700 transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${
                  isAnnualBilling ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${isAnnualBilling ? 'text-white' : 'text-slate-400'}`}>
                Annual
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Starter */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">Starter Lodge</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ideal for guesthouses, homestays, and boutique lodges up to 20 rooms.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {isAnnualBilling ? 'NPR रू 4,990' : 'NPR रू 5,990'}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isAnnualBilling ? 'Billed annually (NPR रू 59,880/yr)' : 'Billed monthly'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Up to 20 Room Units</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>14-Day Visual Tape Chart</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Direct Guest Booking Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Housekeeping Board</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>eSewa & Khalti QR Billing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Up to 8 Staff User Logins</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/billing')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700"
            >
              Get Started with Starter
            </button>
          </div>

          {/* Plan 2: Growth (Highlighted) */}
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Flame size={12} /> Most Popular in Nepal
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">Growth Resort</h3>
                <p className="text-xs text-slate-400 mt-1">
                  For mid-size hotels and lakeside resorts needing 2-way OTA synchronization.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {isAnnualBilling ? 'NPR रू 14,990' : 'NPR रू 17,990'}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isAnnualBilling ? 'Billed annually (NPR रू 179,880/yr)' : 'Billed monthly'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Check size={16} className="shrink-0" />
                  <span>Everything in Starter, plus:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Up to 50 Room Units</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>2-Way OTA Sync (Booking.com, Airbnb, Agoda, Expedia)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Itemized Guest Folio POS (Dining & Spa)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Nepal IRD 13% VAT & Service Charge Invoices</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Up to 25 Staff User Logins</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/billing')}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25"
            >
              Choose Growth Plan
            </button>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise Chain</h3>
                <p className="text-xs text-slate-400 mt-1">
                  For multi-property hospitality groups and heritage chain portfolios.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {isAnnualBilling ? 'NPR रू 34,990' : 'NPR रू 39,990'}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isAnnualBilling ? 'Billed annually (NPR रू 419,880/yr)' : 'Billed monthly'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-teal-400">
                  <Check size={16} className="shrink-0" />
                  <span>Everything in Growth, plus:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Up to 200 Room Units across all properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Central Reservation System (CRS) Multi-Tenant Hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Consolidated Executive Portfolio Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Dedicated On-Site Training in KTM/PKR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Unlimited Staff Accounts & Custom Domain</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/billing')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700"
            >
              Contact for Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* Voice of Nepali Hoteliers (Testimonials) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            Hotelier Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Hear From Hoteliers Running on Mero-Booking
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-slate-300 italic leading-relaxed">
              "During New Year in Pokhara, overbooking used to be our biggest headache. Mero-Booking's 2-way OTA sync solved it permanently. The eSewa integration makes domestic deposits instant."
            </p>
            <div>
              <p className="font-bold text-white">Bijay Shrestha</p>
              <p className="text-[10px] text-slate-500">Managing Director • Grand Royal Palace, Pokhara</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-slate-300 italic leading-relaxed">
              "Our front desk staff learned the Tape Chart in 20 minutes. Printing IRD-compliant 13% VAT receipts with room-posted dining charges takes under 15 seconds."
            </p>
            <div>
              <p className="font-bold text-white">Prashant Gurung</p>
              <p className="text-[10px] text-slate-500">General Manager • Thamel Heritage Boutique, Kathmandu</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-slate-300 italic leading-relaxed">
              "Managing both USD rates for foreign trekkers and NPR rates for local tourists has never been simpler. The housekeeping board keeps our turn-down teams organized."
            </p>
            <div>
              <p className="font-bold text-white">Dawa Sherpa</p>
              <p className="text-[10px] text-slate-500">Owner • Namche Panorama Mountain Lodge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-4 mb-12">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Everything you need to know about setting up and running Mero-Booking for your hotel in Nepal.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does Mero-Booking prevent double bookings during peak tourist season?',
              a: 'Whenever a guest books directly or through an external OTA like Booking.com, Airbnb, or Agoda, Mero-Booking instantly updates your central inventory and broadcasts the updated availability to all other connected channels in real time.'
            },
            {
              q: 'Can we accept domestic guest payments via eSewa, Khalti, and Fonepay QR?',
              a: 'Yes! Mero-Booking has native support for Nepali digital payment ecosystems. Your front desk can generate dynamic Fonepay QR codes, and online guests can settle directly via eSewa, Khalti, or cards.'
            },
            {
              q: 'Is the billing compliant with Nepal’s Inland Revenue Department (IRD)?',
              a: 'Yes. The system automatically computes Nepal’s 13% Value Added Tax (VAT) and optional 10% Hotel Service Charge, outputting official fiscal receipts with sequential numbering and PAN breakdown.'
            },
            {
              q: 'Can I manage multiple properties in Pokhara, Kathmandu, and Chitwan under one login?',
              a: 'Absolutely. Mero-Booking is a true multi-tenant SaaS platform. You can toggle between your properties with a single click, or view consolidated reports as a Super Admin.'
            },
            {
              q: 'Do we need to buy expensive servers or hire IT technicians?',
              a: 'No. Mero-Booking is 100% cloud-hosted with automatic backups. Any staff member with a computer, laptop, or mobile phone with a browser can use it immediately.'
            },
            {
              q: 'Can our front desk staff learn this quickly?',
              a: 'The visual Tape Chart is specifically modeled after the traditional front desk room rack that Nepali hoteliers are familiar with. Most staff master the system in less than 30 minutes.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-white font-bold text-xs sm:text-sm hover:text-emerald-400 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp size={16} className="text-emerald-400 shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* High-Impact Bottom Call to Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider">
              Get Started Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Upgrade Your Hotel in Nepal?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Join leading properties across Kathmandu, Pokhara, Chitwan, and mountain lodges running on Mero-Booking Cloud PMS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Building2 size={18} />
              <span>Launch Live PMS Console</span>
            </button>

            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-sm transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Room Details Modal for Direct Booking demo */}
      {selectedRoomForModal && (
        <RoomDetailsModal
          room={selectedRoomForModal}
          isOpen={isRoomModalOpen}
          facilities={facilities}
          onClose={() => {
            setIsRoomModalOpen(false);
            setSelectedRoomForModal(null);
          }}
          onBook={(room: RoomType) => {
            setIsRoomModalOpen(false);
            handleBookDemoRoom(room);
          }}
        />
      )}
    </div>
  );
};
