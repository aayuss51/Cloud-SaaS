import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { TenantProvider, useTenant } from './context/TenantContext';
import { ThemeProvider } from './context/ThemeContext';
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
import { GuestLayout } from './components/GuestLayout';
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

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <TenantProvider>
          <Router>
            <Routes>
              {/* Public & Guest Experience Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <GuestLayout>
                    <Home />
                  </GuestLayout>
                }
              />
              <Route
                path="/book"
                element={
                  <ProtectedRoute>
                    <GuestLayout>
                      <BookingSummary />
                    </GuestLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receipt/:bookingId"
                element={
                  <ProtectedRoute>
                    <GuestLayout>
                      <BookingSummary />
                    </GuestLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <GuestLayout>
                      <MyBookings />
                    </GuestLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <GuestLayout>
                      <Profile />
                    </GuestLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review/:bookingId"
                element={
                  <ProtectedRoute>
                    <GuestLayout>
                      <ReviewPage />
                    </GuestLayout>
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
  </ThemeProvider>
  );
};

export default App;
