import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, UserRole } from '../types';
import { updateUserProfile, getUsers, INITIAL_USERS } from '../services/mockDb';
import { Permission, hasPermission, hasAnyRole, isStaffRole } from '../services/permissions';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, role: UserRole, propertyId?: string) => Promise<void>;
  switchUserRole: (role: UserRole) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  can: (permission: Permission) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isHotelAdmin: boolean;
  isFrontDesk: boolean;
  isHousekeeping: boolean;
  isGuest: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('hms_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.id && parsed.email) {
            setUser(parsed);
            setIsLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem('hms_user');
        }
      }
      // Default to Hotel Admin / General Manager demo experience for instant interactive trial
      const defaultUser = INITIAL_USERS[1]; // GM
      setUser(defaultUser);
      localStorage.setItem('hms_user', JSON.stringify(defaultUser));
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, role: UserRole) => {
    const allUsers = await getUsers();
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    let authenticatedUser: User;
    if (existing) {
      authenticatedUser = { ...existing, role };
    } else {
      authenticatedUser = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email,
        role,
        propertyId: role !== 'SUPER_ADMIN' ? 'prop_grand_royal' : undefined,
      };
      await updateUserProfile(authenticatedUser.id, authenticatedUser);
    }

    setUser(authenticatedUser);
    localStorage.setItem('hms_user', JSON.stringify(authenticatedUser));
  };

  const switchUserRole = async (role: UserRole) => {
    if (role === 'ADMIN') {
      const adminMatch: User = {
        id: 'user_admin_enterprise',
        name: 'Pooja Shrestha',
        email: 'admin@grandroyalpalace.com',
        role: 'ADMIN',
        propertyId: 'prop_grand_royal',
        department: 'Executive Operations',
        designation: 'VP of Hotel Operations',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      };
      setUser(adminMatch);
      localStorage.setItem('hms_user', JSON.stringify(adminMatch));
      return;
    }

    // Pick the preset user for fast previewing
    const match = INITIAL_USERS.find(u => u.role === role) || {
      id: `usr_${role.toLowerCase()}`,
      name: `${role.replace('_', ' ')} Demo`,
      email: `${role.toLowerCase()}@cloudinn-saas.com`,
      role,
      propertyId: role === 'SUPER_ADMIN' ? undefined : 'prop_grand_royal',
    };
    setUser(match);
    localStorage.setItem('hms_user', JSON.stringify(match));
  };

  const register = async (name: string, email: string, role: UserRole, propertyId?: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      propertyId: propertyId || (role !== 'SUPER_ADMIN' ? 'prop_grand_royal' : undefined),
    };
    await updateUserProfile(newUser.id, newUser);
    setUser(newUser);
    localStorage.setItem('hms_user', JSON.stringify(newUser));
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = await updateUserProfile(user.id, updates);
    setUser(updatedUser);
    localStorage.setItem('hms_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_user');
  };

  const can = (permission: Permission) => {
    return hasPermission(user?.role, permission);
  };

  const hasRole = (roles: UserRole | UserRole[]) => {
    const list = Array.isArray(roles) ? roles : [roles];
    return hasAnyRole(user?.role, list);
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN';
  const isHotelAdmin = user?.role === 'HOTEL_ADMIN';
  const isFrontDesk = user?.role === 'FRONT_DESK';
  const isHousekeeping = user?.role === 'HOUSEKEEPING';
  const isGuest = user?.role === 'GUEST';
  const isStaff = isStaffRole(user?.role);

  const contextValue = useMemo(
    () => ({
      user,
      login,
      register,
      switchUserRole,
      updateProfile,
      logout,
      isLoading,
      can,
      hasRole,
      isSuperAdmin,
      isAdmin,
      isHotelAdmin,
      isFrontDesk,
      isHousekeeping,
      isGuest,
      isStaff,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
