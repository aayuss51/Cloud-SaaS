import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  DollarSign,
  TrendingUp,
  Percent,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import {
  getChannels,
  toggleChannelConnection,
  triggerChannelSync,
} from '../../services/mockDb';
import { OTAChannel } from '../../types';

export const Channels: React.FC = () => {
  const { currentProperty } = useTenant();
  const [channels, setChannels] = useState<OTAChannel[]>([]);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const loadData = async () => {
    if (!currentProperty) return;
    const list = await getChannels(currentProperty.id);
    setChannels(list);
  };

  useEffect(() => {
    loadData();
  }, [currentProperty]);

  const handleToggle = async (channelId: string) => {
    await toggleChannelConnection(channelId);
    await loadData();
  };

  const handleSyncSingle = async (channelId: string) => {
    await triggerChannelSync(channelId);
    await loadData();
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    setSyncFeedback('Transmitting rates & inventory to all connected OTAs...');
    try {
      await Promise.all(channels.filter(c => c.connected).map(c => triggerChannelSync(c.id)));
      await loadData();
      setSyncFeedback('All channel feeds synchronized successfully!');
      setTimeout(() => setSyncFeedback(null), 3000);
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              2-Way OTA Channel Manager
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Global Distribution
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time automated inventory & dynamic rate distribution across Booking.com, Airbnb, Expedia, and Agoda.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncingAll}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <RefreshCw size={14} className={isSyncingAll ? 'animate-spin' : ''} />
          <span>{isSyncingAll ? 'Synchronizing Feeds...' : 'Sync All Channels Now'}</span>
        </button>
      </div>

      {syncFeedback && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 size={16} />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Channel Performance KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
          <span className="text-slate-400 text-[11px] uppercase font-bold tracking-wider">
            Connected OTAs
          </span>
          <p className="text-2xl font-black text-white mt-1">
            {channels.filter(c => c.connected).length}
            <span className="text-xs text-slate-400 font-normal"> / {channels.length} Channels</span>
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">2-Way API Active</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
          <span className="text-slate-400 text-[11px] uppercase font-bold tracking-wider">
            Direct Share
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1">54%</p>
          <p className="text-[10px] text-slate-400 mt-1">0% Commission Bookings</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
          <span className="text-slate-400 text-[11px] uppercase font-bold tracking-wider">
            Average Markup
          </span>
          <p className="text-2xl font-black text-white mt-1">+12.5%</p>
          <p className="text-[10px] text-slate-400 mt-1">Protects net profit margins</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
          <span className="text-slate-400 text-[11px] uppercase font-bold tracking-wider">
            Rate Parity Status
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-base font-bold text-white">100% In Parity</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">No rate violation alerts</p>
        </div>
      </div>

      {/* Channel Connections List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Active Channel Integrations ({channels.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map(ch => (
            <div
              key={ch.id}
              className={`bg-slate-900 border rounded-2xl p-5 text-white transition-all flex flex-col justify-between ${
                ch.connected ? 'border-slate-800' : 'border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ch.logo}</span>
                    <div>
                      <h4 className="font-bold text-base text-white">{ch.name}</h4>
                      <p className="text-xs text-slate-400">OTA ID: {ch.code}</p>
                    </div>
                  </div>

                  {/* Toggle Connection */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ch.connected}
                      onChange={() => handleToggle(ch.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-850 p-3 rounded-xl text-xs border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">Markup to OTA</span>
                    <p className="font-bold text-white mt-0.5">+{ch.markupPercent}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Commission</span>
                    <p className="font-bold text-amber-400 mt-0.5">{ch.commissionPercent}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Active Units</span>
                    <p className="font-bold text-emerald-400 mt-0.5">{ch.activeListings} Rooms</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      ch.status === 'SYNCED'
                        ? 'bg-emerald-400'
                        : ch.status === 'SYNCING'
                        ? 'bg-amber-400 animate-spin'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-slate-400 text-[11px]">
                    {ch.connected ? `Last Synced: ${ch.lastSync}` : 'Channel Disconnected'}
                  </span>
                </div>

                {ch.connected && (
                  <button
                    onClick={() => handleSyncSingle(ch.id)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold"
                  >
                    <RefreshCw size={12} />
                    <span>Sync Now</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
