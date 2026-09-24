import React, { useState } from 'react';
import { X, Check, Crown, Zap, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
import { useTenant } from '../context/TenantContext';
import { SaaSTier } from '../types';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({ isOpen, onClose }) => {
  const { currentProperty, upgradePlan } = useTenant();
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTier, setSuccessTier] = useState<string | null>(null);

  if (!isOpen || !currentProperty) return null;

  const tiers = [
    {
      id: 'STARTER' as SaaSTier,
      name: 'Starter',
      description: 'Ideal for independent boutique hotels, lodges & B&Bs',
      monthlyPrice: 49,
      annualPrice: 39,
      roomLimit: 20,
      staffLimit: 8,
      features: [
        'Up to 20 room units',
        'Tape Chart & Room Rack',
        'Direct Guest Booking Engine',
        'Guest Folio & Invoicing',
        'Housekeeping Status Board',
        'Email Support',
      ],
      popular: false,
    },
    {
      id: 'GROWTH' as SaaSTier,
      name: 'Growth',
      description: 'Full-featured OS for luxury resorts & expanding properties',
      monthlyPrice: 149,
      annualPrice: 119,
      roomLimit: 50,
      staffLimit: 25,
      features: [
        'Up to 50 room units',
        'Full 2-Way OTA Channel Manager (Booking.com, Airbnb, Expedia)',
        'Interactive Tape Chart & Folio POS',
        'AI Guest Concierge Agent',
        'Automated Rates & Channel Markup',
        'Multi-Staff Role Access (GM, Desk, Cleaners)',
        'Priority 24/7 SLA Support',
      ],
      popular: true,
    },
    {
      id: 'ENTERPRISE' as SaaSTier,
      name: 'Enterprise',
      description: 'For hotel chains, luxury portfolios & multi-property operators',
      monthlyPrice: 349,
      annualPrice: 279,
      roomLimit: 200,
      staffLimit: 100,
      features: [
        'Up to 200 room units per property',
        'Multi-Property Central CRS',
        'Custom REST API & Webhooks',
        'Dedicated Cloud Account Manager',
        'White-label Guest Engine & Custom Domain',
        'ERP & Financial Accounting Export',
        'Unlimited Historical Data & Custom Reports',
      ],
      popular: false,
    },
  ];

  const handleSelectTier = async (tier: SaaSTier) => {
    if (tier === currentProperty.tier) return;
    setIsProcessing(true);
    try {
      await upgradePlan(currentProperty.id, tier, billingCycle);
      setSuccessTier(tier);
      setTimeout(() => {
        setSuccessTier(null);
        onClose();
      }, 1200);
    } catch (e) {
      console.error('Upgrade failed', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-6 sm:p-8 text-center border-b border-slate-800 relative bg-gradient-to-b from-slate-850 to-slate-900">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Scale Your Hospitality Operations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            SaaS Subscription Plans for {currentProperty.name}
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Choose the plan that fits your room capacity and channel distribution needs. Upgrade or downgrade anytime with instant prorated activation.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-6 inline-flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'MONTHLY' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('ANNUAL')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'ANNUAL' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900">
          {tiers.map(t => {
            const isCurrent = currentProperty.tier === t.id;
            const price = billingCycle === 'ANNUAL' ? t.annualPrice : t.monthlyPrice;

            return (
              <div
                key={t.id}
                className={`relative rounded-xl p-5 border flex flex-col justify-between transition-all ${
                  t.popular
                    ? 'border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                    : isCurrent
                    ? 'border-slate-700 bg-slate-800/40 ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-800/20 hover:border-slate-700'
                }`}
              >
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{t.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold border border-cyan-500/30">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 h-8">{t.description}</p>

                  <div className="mt-4 pb-4 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">${price}</span>
                      <span className="text-xs text-slate-400">/ property / month</span>
                    </div>
                    {billingCycle === 'ANNUAL' && (
                      <p className="text-[11px] text-amber-300 mt-0.5">Billed annually (${price * 12}/yr)</p>
                    )}
                  </div>

                  <div className="py-4 space-y-2.5 text-xs">
                    <div className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">
                      Includes:
                    </div>
                    {t.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <Check size={14} className="text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <button
                    onClick={() => handleSelectTier(t.id)}
                    disabled={isCurrent || isProcessing}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                        : t.popular
                        ? 'bg-blue-500 hover:bg-blue-400 text-slate-950 shadow-md shadow-blue-500/20'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {isProcessing && !isCurrent ? (
                      <span>Activating Plan...</span>
                    ) : isCurrent ? (
                      <span>Active Subscription</span>
                    ) : (
                      <>
                        <Zap size={14} />
                        <span>Switch to {t.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-blue-400" />
            <span>Bank-grade 256-bit encryption</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard size={14} className="text-cyan-400" />
            <span>Instant activation, zero downtime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
