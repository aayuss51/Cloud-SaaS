import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { hasAnyRole } from '../services/permissions';
import { AccessDenied } from './RoleGuard';

interface SubRouteGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  moduleName: string;
  onOpenMatrix?: () => void;
}

export const SubRouteGuard: React.FC<SubRouteGuardProps> = ({
  children,
  allowedRoles,
  moduleName,
  onOpenMatrix,
}) => {
  const { user } = useAuth();
  const currentRole = user?.role;

  const hasAccess = hasAnyRole(currentRole, allowedRoles);

  if (!hasAccess) {
    return (
      <AccessDenied
        requiredRoles={allowedRoles}
        moduleName={moduleName}
        onOpenMatrix={onOpenMatrix}
      />
    );
  }

  return <>{children}</>;
};
