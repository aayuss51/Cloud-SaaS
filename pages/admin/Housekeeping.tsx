import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench,
  User,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { getHousekeeping, updateHousekeepingStatus } from '../../services/mockDb';
import { HousekeepingRoom, RoomCleaningStatus } from '../../types';
import { RoleGuard } from '../../components/RoleGuard';

export const Housekeeping: React.FC = () => {
  const { currentProperty } = useTenant();
  const { can, user } = useAuth();
  const [rooms, setRooms] = useState<HousekeepingRoom[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');

  const loadData = async () => {
    if (!currentProperty) return;
    const list = await getHousekeeping(currentProperty.id);
    setRooms(list);
  };

  useEffect(() => {
    loadData();
  }, [currentProperty]);

  const handleStatusShift = async (roomNumber: string, nextStatus: RoomCleaningStatus) => {
    if (!currentProperty) return;
    await updateHousekeepingStatus(currentProperty.id, roomNumber, nextStatus);
    await loadData();
  };

  const columns: {
    status: RoomCleaningStatus;
    title: string;
    badgeColor: string;
    border: string;
  }[] = [
    {
      status: 'DIRTY',
      title: 'Dirty (Turnover Required)',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      border: 'border-rose-500/40',
    },
    {
      status: 'IN_PROGRESS',
      title: 'Cleaning In-Progress',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      border: 'border-amber-500/40',
    },
    {
      status: 'CLEAN',
      title: 'Clean (Ready for Inspection)',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      border: 'border-blue-500/40',
    },
    {
      status: 'INSPECTED',
      title: 'Inspected (Front Desk Ready)',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      border: 'border-cyan-500/40',
    },
    {
      status: 'OUT_OF_ORDER',
      title: 'Maintenance / Out of Order',
      badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
      border: 'border-slate-700',
    },
  ];

  const filteredRooms = rooms.filter(r => {
    if (selectedFloor !== 'ALL' && r.floor.toString() !== selectedFloor) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Housekeeping Dispatch Board
            </h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Kanban Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time room sanitization & housekeeping workflow. Click actions to advance rooms from dirty to front-desk ready.
          </p>
        </div>

        {/* Floor Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Filter Floor:</span>
          <select
            value={selectedFloor}
            onChange={e => setSelectedFloor(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-xl text-xs focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
            <option value="4">Penthouse Level</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map(col => {
          const colRooms = filteredRooms.filter(r => r.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="font-bold text-xs text-white truncate">{col.title}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.badgeColor}`}
                >
                  {colRooms.length}
                </span>
              </div>

              {/* Room Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                {colRooms.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-600 text-xs">
                    No rooms
                  </div>
                ) : (
                  colRooms.map(rm => (
                    <div
                      key={rm.roomNumber}
                      className="bg-slate-850 border border-slate-800 rounded-xl p-3 text-xs text-white shadow-sm hover:border-slate-700 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-sm text-white">Room {rm.roomNumber}</span>
                            {rm.priority === 'HIGH' && (
                              <span className="bg-rose-500/20 text-rose-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-rose-500/30">
                                High Priority
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{rm.roomTypeName}</p>
                        </div>
                      </div>

                      {rm.assignedStaff && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800/80 p-1.5 rounded-lg">
                          <User size={12} className="text-blue-400 shrink-0" />
                          <span className="truncate">{rm.assignedStaff}</span>
                        </div>
                      )}

                      {rm.notes && (
                        <p className="text-[10px] text-slate-400 bg-slate-800/40 p-1.5 rounded border border-slate-800 italic">
                          "{rm.notes}"
                        </p>
                      )}

                      {/* Quick State Shift Buttons */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[10px]">
                        {col.status === 'DIRTY' && (
                          <button
                            onClick={() => handleStatusShift(rm.roomNumber, 'IN_PROGRESS')}
                            className="w-full py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-lg font-bold text-center"
                          >
                            Start Cleaning →
                          </button>
                        )}
                        {col.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleStatusShift(rm.roomNumber, 'CLEAN')}
                            className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg font-bold text-center"
                          >
                            Mark Cleaned →
                          </button>
                        )}
                        {col.status === 'CLEAN' && (
                          <RoleGuard
                            permission="pms:housekeeping:approve_inspection"
                            renderDisabled={true}
                            disabledTooltip="Supervisor / Front Desk / GM approval required"
                          >
                            <button
                              onClick={() => handleStatusShift(rm.roomNumber, 'INSPECTED')}
                              className="w-full py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg font-bold text-center"
                            >
                              Approve / Inspected ✓
                            </button>
                          </RoleGuard>
                        )}
                        {col.status === 'INSPECTED' && (
                          <div className="w-full text-center text-blue-400 font-semibold py-1">
                            Ready for Check-In ✓
                          </div>
                        )}
                        {col.status === 'OUT_OF_ORDER' && (
                          <button
                            onClick={() => handleStatusShift(rm.roomNumber, 'DIRTY')}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-center"
                          >
                            Back to Service
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
