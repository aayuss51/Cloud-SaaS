import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, updateUserRole } from '../../services/mockDb';
import { User, UserRole } from '../../types';
import { Loader2, Shield, User as UserIcon, ChevronLeft, ChevronDown, CheckCircle2, Grid, Plus, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RoleBadge, RoleGuard } from '../../components/RoleGuard';
import { RolePermissionsMatrixModal } from '../../components/RolePermissionsMatrixModal';

export const Users: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, can, isSuperAdmin, isHotelAdmin } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      showToast('error', 'Failed to load users.');
    }
    setIsLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setProcessingId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      showToast('success', `User role successfully updated to ${newRole}.`);
    } catch (error) {
      showToast('error', 'Failed to update user role.');
    } finally {
      setProcessingId(null);
    }
  };

  const canEditRoles = isSuperAdmin || isHotelAdmin || can('pms:users:change_role');

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-slate-400 font-medium text-xs">Loading SaaS directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Staff & Access Governance
            </h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              RBAC Directory
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage hotel team roles, department designations, and platform security privileges.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMatrixOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold border border-slate-700 transition-all"
          >
            <Grid size={14} />
            <span>Permissions Matrix</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Email / Phone</th>
                <th className="px-6 py-4">Department & Designation</th>
                <th className="px-6 py-4">Platform Access Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-xs overflow-hidden border border-slate-700">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon size={16} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-white text-xs">{u.name}</p>
                          {currentUser?.id === u.id && (
                            <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 rounded font-bold">You</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">{u.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-slate-300 text-xs">{u.email}</p>
                    <p className="text-[10px] text-slate-500">{u.phone || 'No phone'}</p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-slate-300 font-medium">{u.designation || 'Staff Member'}</p>
                    <p className="text-[10px] text-slate-500">{u.department || 'Operations'}</p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <RoleBadge role={u.role} size="sm" />
                      {canEditRoles && currentUser?.id !== u.id ? (
                        <select
                          disabled={processingId === u.id}
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="bg-slate-850 border border-slate-700 text-white text-[11px] rounded-lg px-2 py-1 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="SUPER_ADMIN">Platform SuperAdmin</option>
                          <option value="ADMIN">Enterprise Admin</option>
                          <option value="HOTEL_ADMIN">General Manager (Admin)</option>
                          <option value="FRONT_DESK">Front Desk Agent</option>
                          <option value="HOUSEKEEPING">Housekeeping Lead</option>
                          <option value="GUEST">Guest</option>
                        </select>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RolePermissionsMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />
    </div>
  );
};
