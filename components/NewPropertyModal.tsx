import React, { useState } from 'react';
import { X, Building2, Sparkles, MapPin, Globe, DollarSign } from 'lucide-react';
import { useTenant } from '../context/TenantContext';
import { SaaSTier } from '../types';

interface NewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPropertyModal: React.FC<NewPropertyModalProps> = ({ isOpen, onClose }) => {
  const { createProperty } = useTenant();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Nepal');
  const [tier, setTier] = useState<SaaSTier>('GROWTH');
  const [currency, setCurrency] = useState('USD');
  const [tagline, setTagline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;

    setIsSubmitting(true);
    try {
      await createProperty({
        name,
        city,
        country,
        tier,
        currency,
        currencySymbol: currency === 'USD' ? '$' : 'NPR',
        tagline: tagline || 'Exclusive boutique accommodation & hospitality services',
        email: email || `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: phone || '+977 1 4000000',
        coverUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop',
      });
      onClose();
    } catch (err) {
      console.error('Failed to create property', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Onboard New Property</h2>
              <p className="text-xs text-slate-400">Launch a new hotel or resort in your SaaS portfolio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Property / Hotel Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Mount View Heritage Resort"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                City / Location *
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g., Pokhara"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="USD">USD ($)</option>
                <option value="NPR">NPR (रू)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                SaaS Subscription Tier
              </label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value as SaaSTier)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="STARTER">Starter ($49/mo - Up to 20 rooms)</option>
                <option value="GROWTH">Growth ($149/mo - Up to 50 rooms)</option>
                <option value="ENTERPRISE">Enterprise ($349/mo - Up to 200 rooms)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="e.g., Luxury mountain retreat overlooking the Himalayas"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="reservations@hotel.com"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+977 1 4XXXXXX"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Provisioning...</span>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Provision & Launch Hotel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
