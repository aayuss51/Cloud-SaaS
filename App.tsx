import React, { useState } from 'react';
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
import { SubRouteGuard } from './components/SubRouteGuard';
import { FloatingRoleSimulator } from './components/FloatingRoleSimulator';
import { RolePermissionsMatrixModal } from './components/RolePermissionsMatrixModal';
import { UserRole } from './types';
import { isStaffRole } from './services/permissions';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'STAFF' | UserRole }> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
            PMS
          </div>
          <p className="text-xs font-bold uppercase text-blue-400 tracking-widest">
            Loading Mero Booking Cloud...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a staff role is required (for admin portal)
  if (requiredRole === 'STAFF' || requiredRole === 'ADMIN') {
    if (isStaffRole(user.role)) {
      return <>{children}</>;
    } else {
      return <Navigate to="/my-bookings" replace />;
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

const AppRoutes: React.FC = () => {
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  return (
    <>
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
            <ProtectedRoute requiredRole="STAFF">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK', 'HOUSEKEEPING']}
                moduleName="Overview & KPIs"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Dashboard />
              </SubRouteGuard>
            }
          />
          <Route
            path="tape-chart"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK']}
                moduleName="Tape Chart (Room Rack)"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <TapeChart />
              </SubRouteGuard>
            }
          />
          <Route
            path="bookings"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK']}
                moduleName="Central CRS Bookings"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Bookings />
              </SubRouteGuard>
            }
          />
          <Route
            path="rooms"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK']}
                moduleName="Rooms & Inventory"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Rooms />
              </SubRouteGuard>
            }
          />
          <Route
            path="channels"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK']}
                moduleName="OTA Channel Manager"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Channels />
              </SubRouteGuard>
            }
          />
          <Route
            path="housekeeping"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK', 'HOUSEKEEPING']}
                moduleName="Housekeeping Dispatch Board"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Housekeeping />
              </SubRouteGuard>
            }
          />
          <Route
            path="tasks"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK', 'HOUSEKEEPING']}
                moduleName="Operational Tasks"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Tasks />
              </SubRouteGuard>
            }
          />
          <Route
            path="reviews"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN', 'FRONT_DESK']}
                moduleName="Guest Reputation & Reviews"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Reviews />
              </SubRouteGuard>
            }
          />
          <Route
            path="facilities"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN']}
                moduleName="Hotel Amenities & Facilities"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Facilities />
              </SubRouteGuard>
            }
          />
          <Route
            path="billing"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN']}
                moduleName="SaaS Subscription & Invoices"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Billing />
              </SubRouteGuard>
            }
          />
          <Route
            path="tenants"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN']}
                moduleName="Multi-Property SaaS Hub"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Tenants />
              </SubRouteGuard>
            }
          />
          <Route
            path="users"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN']}
                moduleName="Staff & Access Governance"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Users />
              </SubRouteGuard>
            }
          />
          <Route
            path="settings"
            element={
              <SubRouteGuard
                allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HOTEL_ADMIN']}
                moduleName="Property Master Settings"
                onOpenMatrix={() => setIsMatrixOpen(true)}
              >
                <Settings />
              </SubRouteGuard>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Floating RBAC Simulator for seamless testing */}
      <FloatingRoleSimulator onOpenMatrix={() => setIsMatrixOpen(true)} />

      {/* Global Permissions Matrix Modal */}
      <RolePermissionsMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <TenantProvider>
            <Router>
              <AppRoutes />
            </Router>
          </TenantProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
