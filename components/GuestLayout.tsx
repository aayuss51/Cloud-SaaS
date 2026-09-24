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
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { currentProperty } = useTenant();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<'NPR' | 'USD'>('NPR');

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Guest Top Notification Ribbon */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
            <span className="hidden sm:inline">Official Mero Booking Portal •</span>
            <span>Best Rate Direct Booking Guarantee with Zero Hidden Service Fees</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
              <span className="text-slate-400 hidden xs:inline">Currency:</span>
              <button
                onClick={() => setCurrency(c => c === 'NPR' ? 'USD' : 'NPR')}
                className="font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase"
              >
                {currency === 'NPR' ? 'NPR (रू)' : 'USD ($)'}
              </button>
            </div>

            {/* Quick Theme Switch in Ribbon */}
            <div className="flex items-center border-r border-slate-800 pr-3">
              <ThemeToggle variant="icon" className="!p-1 !rounded-lg !bg-slate-800 !border-slate-700 !text-slate-300 hover:!text-white" />
            </div>

            {/* Quick Switch to Hotelier / Staff PMS */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white font-bold transition-colors bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700"
              title="Switch to Staff & Hotelier Operating System"
            >
              <Building2 size={12} className="text-blue-400" />
              <span className="hidden sm:inline">Hotelier PMS Console</span>
              <span className="sm:hidden">PMS</span>
              <ExternalLink size={10} className="text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Guest Navigation Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Guest Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <Logo variant="full" size="md" />
          </Link>

          {/* Traveler Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="/#destinations" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Destinations in Nepal
            </a>
            <a href="/#suites" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Suites & Villas
            </a>
            <a href="/#experiences" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Experiences & Dining
            </a>
            <Link to="/my-bookings" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <span>My Reservations</span>
              {user && (
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              )}
            </Link>
          </nav>

          {/* Guest Authentication & Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" className="hidden sm:flex" />

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/my-bookings"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
                >
                  <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>My Trips</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 pr-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold flex items-center justify-center overflow-hidden border border-blue-200 dark:border-blue-800">
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
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
                >
                  Guest Sign In
                </Link>
                <a
                  href="/#booking-search"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
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
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            {/* Col 1: Brand */}
            <div className="lg:col-span-2 space-y-4">
              <Logo variant="full" size="lg" theme="dark" />
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Mero Booking is Nepal's premier hotel reservation platform and hospitality ecosystem. From serene lakeside resorts in Pokhara to heritage retreats in Kathmandu and panoramic Himalayan lookouts in Nagarkot.
              </p>
              <div className="flex items-center gap-3 text-slate-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-purple-400" />
                  <span>Verified Payment Partner: Khalti Digital Wallet</span>
                </span>
              </div>
            </div>

            {/* Col 2: Destinations */}
            <div className="space-y-3">
              <p className="text-white font-bold text-xs uppercase tracking-wider">Top Destinations</p>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/#destinations" className="hover:text-blue-400 transition-colors">Pokhara Lakeside</a></li>
                <li><a href="/#destinations" className="hover:text-blue-400 transition-colors">Kathmandu Valley (Thamel)</a></li>
                <li><a href="/#destinations" className="hover:text-blue-400 transition-colors">Nagarkot Himalayan Ridge</a></li>
                <li><a href="/#destinations" className="hover:text-blue-400 transition-colors">Chitwan National Park</a></li>
                <li><a href="/#destinations" className="hover:text-blue-400 transition-colors">Sarangkot Viewpoint</a></li>
              </ul>
            </div>

            {/* Col 3: Guest Support */}
            <div className="space-y-3">
              <p className="text-white font-bold text-xs uppercase tracking-wider">Guest Services</p>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/my-bookings" className="hover:text-blue-400 transition-colors">Manage Reservations</Link></li>
                <li><a href="/#experiences" className="hover:text-blue-400 transition-colors">Dining & Spa Menus</a></li>
                <li><a href="/#faq" className="hover:text-blue-400 transition-colors">Check-in & Policies</a></li>
                <li><span className="text-slate-300">Front Desk: +977-61-460000</span></li>
                <li><span className="text-slate-300">support@merobooking.com</span></li>
              </ul>
            </div>

            {/* Col 4: For Hoteliers / PMS */}
            <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-800">
              <p className="text-blue-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={13} />
                <span>Hotel Partners</span>
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Hotel owner or manager? Access your Mero Booking tape chart, reservation calendar, and front desk PMS operations.
              </p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
              >
                <span>Launch PMS Console</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              &copy; 2026 Mero Booking Platform • Designed & Built for Nepal Hospitality.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Reservation</span>
              <span>•</span>
              <Link to="/admin" className="text-slate-400 hover:text-blue-400 transition-colors font-medium">
                Admin Console
              </Link>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Theme:</span>
                <ThemeToggle variant="compact-segmented" showLabels={true} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
