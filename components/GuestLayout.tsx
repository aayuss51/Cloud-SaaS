import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import {
  Building2,
  Calendar,
  Compass,
  Phone,
  Mail,
  MapPin,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  BedDouble,
  Heart
} from 'lucide-react';

export const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { currentProperty } = useTenant();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<'NPR' | 'USD'>('NPR');

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      {/* Guest Top Notification Ribbon */}
      <div className="bg-stone-900 text-stone-300 py-2 px-4 text-xs font-medium border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="hidden sm:inline">Official Guest Reservation Portal •</span>
            <span>Best Rate Direct Booking Guarantee with Zero Hidden Service Fees</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400 text-xs">
            <div className="flex items-center gap-1.5 border-r border-stone-800 pr-4">
              <span className="text-stone-400">Currency:</span>
              <button
                onClick={() => setCurrency(c => c === 'NPR' ? 'USD' : 'NPR')}
                className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase"
              >
                {currency === 'NPR' ? 'NPR (रू)' : 'USD ($)'}
              </button>
            </div>

            {/* Quick Switch to Hotelier / Staff PMS */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-stone-300 hover:text-white font-bold transition-colors bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-lg border border-stone-700"
              title="Switch to Staff & Hotelier Operating System"
            >
              <Building2 size={12} className="text-emerald-400" />
              <span>Hotelier PMS Console</span>
              <ExternalLink size={10} className="text-stone-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Guest Navigation Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Guest Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif font-black text-xl tracking-tighter">M</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-stone-900 font-serif">
                  Mero Stays
                </span>
                <span className="text-[10px] font-bold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                  Resorts & Hotels
                </span>
              </div>
              <p className="text-[11px] text-stone-400 tracking-wide font-medium">
                Nepal's Premier Boutique Stays
              </p>
            </div>
          </Link>

          {/* Traveler Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-600">
            <a href="/#destinations" className="hover:text-emerald-700 transition-colors">
              Destinations in Nepal
            </a>
            <a href="/#suites" className="hover:text-emerald-700 transition-colors">
              Suites & Villas
            </a>
            <a href="/#experiences" className="hover:text-emerald-700 transition-colors">
              Experiences & Dining
            </a>
            <Link to="/my-bookings" className="hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <span>My Reservations</span>
              {user && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </Link>
          </nav>

          {/* Guest Authentication & Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/my-bookings"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all border border-stone-200"
                >
                  <Calendar size={14} className="text-emerald-700" />
                  <span>My Trips</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-xs font-bold text-stone-700 hover:text-emerald-700 transition-colors p-1 pr-2.5 rounded-xl hover:bg-stone-100 border border-transparent hover:border-stone-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center overflow-hidden border border-emerald-200">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-all border border-stone-200"
                >
                  Guest Sign In
                </Link>
                <a
                  href="/#booking-search"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-600 text-white shadow-md shadow-emerald-700/20 transition-all"
                >
                  Book a Stay
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Guest Body Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Luxury Guest Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            {/* Col 1: Brand */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-serif font-black text-lg">
                  M
                </div>
                <div>
                  <h3 className="text-white font-serif font-black text-lg">Mero Stays</h3>
                  <p className="text-[11px] text-stone-400">Hotels & Resorts of Nepal</p>
                </div>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
                A curated collection of exceptional hospitality destinations in Nepal. From tranquil lakeside villas in Pokhara to historical courtyards in the Kathmandu Valley and mountain sunrise retreats in Nagarkot.
              </p>
              <div className="flex items-center gap-3 text-stone-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Secure Payments (eSewa, Khalti, Cards)</span>
                </span>
              </div>
            </div>

            {/* Col 2: Destinations */}
            <div className="space-y-3">
              <p className="text-white font-bold text-xs uppercase tracking-wider">Top Destinations</p>
              <ul className="space-y-2 text-stone-400">
                <li><a href="/#destinations" className="hover:text-emerald-400 transition-colors">Pokhara Lakeside</a></li>
                <li><a href="/#destinations" className="hover:text-emerald-400 transition-colors">Kathmandu Valley (Thamel)</a></li>
                <li><a href="/#destinations" className="hover:text-emerald-400 transition-colors">Nagarkot Himalayan Ridge</a></li>
                <li><a href="/#destinations" className="hover:text-emerald-400 transition-colors">Chitwan National Park</a></li>
                <li><a href="/#destinations" className="hover:text-emerald-400 transition-colors">Sarangkot Viewpoint</a></li>
              </ul>
            </div>

            {/* Col 3: Guest Support */}
            <div className="space-y-3">
              <p className="text-white font-bold text-xs uppercase tracking-wider">Guest Services</p>
              <ul className="space-y-2 text-stone-400">
                <li><Link to="/my-bookings" className="hover:text-emerald-400 transition-colors">Manage Reservations</Link></li>
                <li><a href="/#experiences" className="hover:text-emerald-400 transition-colors">Dining & Spa Menus</a></li>
                <li><a href="/#faq" className="hover:text-emerald-400 transition-colors">Check-in & Policies</a></li>
                <li><span className="text-stone-300">Front Desk: +977-61-460000</span></li>
                <li><span className="text-stone-300">concierge@merostays.com</span></li>
              </ul>
            </div>

            {/* Col 4: For Hoteliers / PMS */}
            <div className="space-y-3 bg-stone-800/60 p-4 rounded-2xl border border-stone-800">
              <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={13} />
                <span>Hotel Partners</span>
              </p>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Are you a hotel owner or staff member? Access your property's tape chart, OTA channel sync, and front desk OS.
              </p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Launch PMS Console</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>

          <div className="border-t border-stone-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <p>
              &copy; 2026 Mero Stays Hospitality Network • Designed & Built for Nepal.
            </p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Reservation</span>
              <span>•</span>
              <Link to="/admin" className="text-stone-400 hover:text-emerald-400 transition-colors font-medium">
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
