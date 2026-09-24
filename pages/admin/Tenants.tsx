import React, { useState } from 'react';
import {
  Building2,
  Plus,
  ExternalLink,
  Crown,
  MapPin,
  Users,
  BedDouble,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { NewPropertyModal } from '../../components/NewPropertyModal';
import { Property } from '../../types';

export const Tenants: React.FC = () => {
  const { properties, currentProperty, switchProperty } = useTenant();
  const [isNewPropModalOpen, setIsNewPropModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Multi-Property SaaS Hub
            </h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Portfolio Management
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centrally manage all tenant hotels, resorts, and vacation rental chains on the SaaS platform.
          </p>
        </div>

        <button
          onClick={() => setIsNewPropModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
        >
          <Plus size={15} />
          <span>Onboard New Property</span>
        </button>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(prop => {
          const isCurrent = currentProperty?.id === prop.id;

          return (
            <div
              key={prop.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between ${
                isCurrent ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Cover Image */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-800">
                <img
                  src={prop.coverUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop'}
                  alt={prop.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-700 backdrop-blur-sm">
                    {prop.tier} Plan
                  </span>
                  {isCurrent && (
                    <span className="bg-blue-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base text-white truncate">{prop.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5">
                    <MapPin size={12} className="text-blue-400" />
                    <span>{prop.city}, {prop.country}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-400 line-clamp-2">{prop.tagline}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-850 p-3 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px]">Room License</span>
                      <p className="font-bold text-white mt-0.5">Max {prop.roomLimit} Rooms</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Staff Seats</span>
                      <p className="font-bold text-white mt-0.5">Up to {prop.staffLimit} Users</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`#/book?propertyId=${prop.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <span>Booking Page</span>
                    <ExternalLink size={12} />
                  </a>

                  <button
                    onClick={() => switchProperty(prop.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-slate-800 text-blue-400 border border-slate-700'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isCurrent ? 'Active Property' : 'Switch & Manage →'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <NewPropertyModal
        isOpen={isNewPropModalOpen}
        onClose={() => setIsNewPropModalOpen(false)}
      />
    </div>
  );
};
