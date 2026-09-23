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
import { ConciergeChat } from './components/ConciergeChat';
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
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95 print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 transform group-hover:scale-105 transition-transform duration-300">
              <span className="font-sans font-black text-base tracking-tighter">HMS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
                  {currentProperty?.name || 'Mero-Booking'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                  SaaS OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">{currentProperty?.tagline || 'Cloud Hotel Platform'}</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <PublicNav />
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 mt-auto print:hidden text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">Cloud Hotel Management SaaS</span>
            <span>• Multi-Tenant PMS, Tape Chart, OTA Channel Manager</span>
          </div>
          <p className="text-slate-500">
            Powered by <span className="text-emerald-400 font-semibold">Nova PMS Cloud</span> &copy; 2026
          </p>
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
        {isStaff && (
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Building2 size={13} />
            <span>PMS Console</span>
          </Link>
        )}
        <Link
          to="/profile"
          className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-emerald-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 overflow-hidden border border-emerald-200">
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
          className="text-xs font-medium text-slate-600 hover:text-emerald-600 transition-colors"
        >
          My Stays
        </Link>
        <button
          onClick={logout}
          className="text-xs font-medium text-gray-400 hover:text-rose-500 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link to="/login">
        <Button variant="outline" size="sm">
          Staff / Guest Login
        </Button>
      </Link>
      <Link to="/register">
        <Button variant="liquid" size="sm" className="px-5">
          Sign Up
        </Button>
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
            <ConciergeChat />
          </Router>
        </TenantProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
