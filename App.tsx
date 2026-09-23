import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { TenantProvider, useTenant } from './context/TenantContext';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { Home } from './pages/public/Home';
import { BookingSummary } from './pages/public/BookingSummary';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { TapeChart } from './pages/admin/TapeChart';
import { Bookings } from './pages/admin/Bookings';
import { Rooms } from './pages/admin/Rooms';
import { Channels } from './pages/admin/Channels';
import { Housekeeping } from './pages/admin/Housekeeping';
import { Billing } from './pages/admin/Billing';
import { Tenants } from './pages/admin/Tenants';
import { Facilities } from './pages/admin/Facilities';
import { Reviews } from './pages/admin/Reviews';
import { Users } from './pages/admin/Users';
import { Tasks } from './pages/admin/Tasks';
import { Settings } from './pages/admin/Settings';
import { MyBookings } from './pages/guest/MyBookings';
import { Profile } from './pages/guest/Profile';
import { ReviewPage } from './pages/guest/ReviewPage';
import { UserRole } from './types';
import { Crown, User as UserIcon, Building2, Sparkles } from 'lucide-react';
import { Button } from './components/Button';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: UserRole }> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-bold">
            PMS
          </div>
          <p className="text-xs font-bold uppercase text-emerald-400 tracking-widest">
            Loading SaaS Cloud...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const staffRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK', 'HOUSEKEEPING'];

  if (requiredRole === 'ADMIN') {
    if (staffRoles.includes(user.role)) {
      return <>{children}</>;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  if (requiredRole === 'SUPER_ADMIN') {
    if (user.role === 'SUPER_ADMIN') {
      return <>{children}</>;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const LayoutWithChat: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentProperty } = useTenant();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-40 shadow-xl backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 transform group-hover:scale-105 transition-transform duration-300">
                <span className="font-sans font-black text-sm tracking-tighter">HMS</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-white font-sans">
                    Mero-Booking
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                    🇳🇵 Nepal SaaS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 -mt-0.5">Cloud Hotel PMS & Channel Manager</p>
              </div>
            </Link>

            {/* Quick SaaS Nav Links */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300 ml-4">
              <Link to="/admin/tape-chart" className="px-3 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition-colors">
                Tape Chart
              </Link>
              <Link to="/admin/channels" className="px-3 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition-colors">
                OTA Channels
              </Link>
              <Link to="/admin/housekeeping" className="px-3 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition-colors">
                Housekeeping
              </Link>
              <Link to="/admin/billing" className="px-3 py-1.5 rounded-lg hover:text-emerald-400 hover:bg-slate-900 transition-colors">
                Pricing (NPR)
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PublicNav />
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-10 print:hidden text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-white font-black text-sm">Mero-Booking Cloud HMS</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Nepal Edition
              </span>
            </div>
            <p className="text-slate-500 text-xs">
              Next-generation multi-tenant hotel operating system, visual tape chart, and eSewa / Khalti IRD invoicing.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/admin" className="hover:text-emerald-400 transition-colors font-bold text-white">
              Launch Live PMS Console →
            </Link>
            <span>•</span>
            <p className="text-slate-500">
              Made with ❤️ in Kathmandu & Pokhara, Nepal &copy; 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PublicNav = () => {
  const { user, logout } = useAuth();
  const staffRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK', 'HOUSEKEEPING'];

  if (user) {
    const isStaff = staffRoles.includes(user.role);

    return (
      <div className="flex items-center gap-3">
        <Link
          to="/admin"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Building2 size={14} />
          <span>Launch PMS Console</span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 overflow-hidden border border-slate-700">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={16} />
            )}
          </div>
          <span className="hidden md:block">{user.name}</span>
        </Link>
        <Link
          to="/my-bookings"
          className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors"
        >
          My Stays
        </Link>
        <button
          onClick={logout}
          className="text-xs font-medium text-slate-500 hover:text-rose-400 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Link
        to="/admin"
        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all"
      >
        <Building2 size={14} />
        <span>Live PMS Demo</span>
      </Link>
      <Link
        to="/login"
        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all"
      >
        Staff / Guest Login
      </Link>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <TenantProvider>
          <Router>
            <Routes>
              {/* Public Guest Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <LayoutWithChat>
                    <Home />
                  </LayoutWithChat>
                }
              />
              <Route
                path="/book"
                element={
                  <ProtectedRoute>
                    <LayoutWithChat>
                      <BookingSummary />
                    </LayoutWithChat>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receipt/:bookingId"
                element={
                  <ProtectedRoute>
                    <LayoutWithChat>
                      <BookingSummary />
                    </LayoutWithChat>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <LayoutWithChat>
                      <MyBookings />
                    </LayoutWithChat>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <LayoutWithChat>
                      <Profile />
                    </LayoutWithChat>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review/:bookingId"
                element={
                  <ProtectedRoute>
                    <LayoutWithChat>
                      <ReviewPage />
                    </LayoutWithChat>
                  </ProtectedRoute>
                }
              />

              {/* Multi-Tenant SaaS PMS Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="tape-chart" element={<TapeChart />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="channels" element={<Channels />} />
                <Route path="housekeeping" element={<Housekeeping />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="facilities" element={<Facilities />} />
                <Route path="billing" element={<Billing />} />
                <Route path="tenants" element={<Tenants />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </TenantProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
