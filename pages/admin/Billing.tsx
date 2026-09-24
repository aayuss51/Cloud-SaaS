import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Crown,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { getInvoices, getRooms, getUsers } from '../../services/mockDb';
import { SaaSInvoice, RoomType, User } from '../../types';
import { UpgradePlanModal } from '../../components/UpgradePlanModal';

export const Billing: React.FC = () => {
  const { currentProperty } = useTenant();
  const [invoices, setInvoices] = useState<SaaSInvoice[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SaaSInvoice | null>(null);

  const loadData = async () => {
    if (!currentProperty) return;
    const [inv, rms, stf] = await Promise.all([
      getInvoices(currentProperty.id),
      getRooms(currentProperty.id),
      getUsers(),
    ]);
    setInvoices(inv);
    setRooms(rms);
    setStaff(stf.filter(u => u.role !== 'GUEST'));
  };

  useEffect(() => {
    loadData();
  }, [currentProperty]);

  if (!currentProperty) return null;

  const totalRoomUnits = rooms.reduce((sum, r) => sum + r.totalStock, 0);
  const roomUsagePercent = Math.min(100, Math.round((totalRoomUnits / currentProperty.roomLimit) * 100));
  const staffUsagePercent = Math.min(100, Math.round((staff.length / currentProperty.staffLimit) * 100));

  const handlePrintInvoice = (inv: SaaSInvoice) => {
    setSelectedInvoice(inv);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              SaaS Subscription & Billing
            </h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Cloud Tenant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your tier quotas, active room licenses, payment methods, and automated billing invoices.
          </p>
        </div>

        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
        >
          <Crown size={15} />
          <span>Change / Upgrade Plan</span>
        </button>
      </div>

      {/* Current Plan Overview & Usage Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Plan Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Plan
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold border border-blue-500/30">
                {currentProperty.subscriptionStatus}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-black text-white capitalize font-sans">
                {currentProperty.tier.toLowerCase()} Tier
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Billed {currentProperty.billingCycle.toLowerCase()} (${currentProperty.planPrice}/mo equivalent)
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                <span>2-Way OTA Channel Synchronization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                <span>Interactive 14-Day Tape Chart</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                <span>Direct Guest Booking Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                <span>Housekeeping Dispatch Kanban</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Compare All SaaS Plans
            </button>
          </div>
        </div>

        {/* Quota Usage Meters */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              SaaS Quota & Capacity Limits
            </h3>
            <p className="text-xs text-slate-400">Track current utilization against your plan tier limits</p>
          </div>

          <div className="space-y-4">
            {/* Room Capacity Meter */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-300">Active Room Units</span>
                <span className="font-mono font-bold text-white">
                  {totalRoomUnits} / {currentProperty.roomLimit} Rooms ({roomUsagePercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all ${
                    roomUsagePercent > 80 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${roomUsagePercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                {currentProperty.roomLimit - totalRoomUnits} room slots remaining on this tier.
              </p>
            </div>

            {/* Staff Seats Meter */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-300">Staff & Manager Seats</span>
                <span className="font-mono font-bold text-white">
                  {staff.length} / {currentProperty.staffLimit} Users ({staffUsagePercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-2 rounded-full transition-all"
                  style={{ width: `${staffUsagePercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Role-based access controls active for Front Desk, GM & Housekeeping.
              </p>
            </div>

            {/* Monthly API & OTA Sync Rate */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-300">Monthly Channel Sync Rate</span>
                <span className="font-mono font-bold text-white">18,420 / 50,000 calls (36%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: '36%' }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                High-speed WebSocket & REST OTA webhooks across Booking.com & Airbnb.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Subscription Invoices & Receipts
            </h3>
            <p className="text-xs text-slate-400">Past billing cycles and deductible tax invoices</p>
          </div>
          <span className="text-xs text-slate-400">Currency: USD ($)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="pb-3">Invoice Number</th>
                <th className="pb-3">Billing Period</th>
                <th className="pb-3">Plan Tier</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3.5 font-mono font-semibold text-blue-400">{inv.invoiceNumber}</td>
                  <td className="py-3.5 font-medium text-white">{inv.period}</td>
                  <td className="py-3.5 capitalize">{inv.planTier.toLowerCase()} ({inv.billingCycle.toLowerCase()})</td>
                  <td className="py-3.5 text-slate-400">{inv.date}</td>
                  <td className="py-3.5">
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-black text-white">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handlePrintInvoice(inv)}
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold text-xs"
                    >
                      <Download size={13} />
                      <span>Print PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
};
