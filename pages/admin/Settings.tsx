import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  DollarSign,
  Clock,
  Globe,
  Save,
  CheckCircle2,
  Key,
  ShieldAlert,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export const Settings: React.FC = () => {
  const { currentProperty, updateProperty } = useTenant();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('0.13');
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [coverUrl, setCoverUrl] = useState('');

  const [savedFeedback, setSavedFeedback] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentProperty) {
      setName(currentProperty.name);
      setTagline(currentProperty.tagline || '');
      setEmail(currentProperty.email);
      setPhone(currentProperty.phone);
      setAddress(currentProperty.address);
      setCity(currentProperty.city);
      setCountry(currentProperty.country);
      setCurrency(currentProperty.currency);
      setTaxRate(currentProperty.taxRate.toString());
      setCheckInTime(currentProperty.checkInTime);
      setCheckOutTime(currentProperty.checkOutTime);
      setCoverUrl(currentProperty.coverUrl || '');
    }
  }, [currentProperty]);

  if (!currentProperty) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProperty(currentProperty.id, {
        name,
        tagline,
        email,
        phone,
        address,
        city,
        country,
        currency,
        currencySymbol: currency === 'USD' ? '$' : 'NPR',
        taxRate: parseFloat(taxRate) || 0.13,
        checkInTime,
        checkOutTime,
        coverUrl,
      });
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
            Property & Tenant Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure custom hotel branding, tax rates, operational check-in hours, and webhook integrations.
          </p>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          {currentProperty.tier} Tier
        </span>
      </div>

      {savedFeedback && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 size={16} />
          <span>Tenant settings saved and deployed successfully!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 text-xs">
        {/* Basic Hotel Profile */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Hotel Branding & Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-400 mb-1">Hotel / Resort Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Hero Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-400 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Configuration */}
        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Currency & Government Tax
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-400 mb-1">Operating Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="NPR">NPR (रू)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">VAT / Tax Rate (e.g. 0.13 = 13%)</label>
              <input
                type="number"
                step="0.01"
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Front Desk Check-in Policies */}
        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Standard Check-In / Check-Out Hours
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-400 mb-1">Standard Check-In Time</label>
              <input
                type="text"
                value={checkInTime}
                onChange={e => setCheckInTime(e.target.value)}
                placeholder="14:00"
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Standard Check-Out Time</label>
              <input
                type="text"
                value={checkOutTime}
                onChange={e => setCheckOutTime(e.target.value)}
                placeholder="11:00"
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* API & Webhooks (SaaS Feature) */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                SaaS Webhooks & REST API
              </h3>
              <p className="text-slate-400 text-[11px]">Integrate hotel event streams with Zapier, Slack, or ERP systems</p>
            </div>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono">
              v1.4 Live
            </span>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key size={18} className="text-amber-400 shrink-0" />
              <div>
                <p className="font-mono text-white text-xs">pk_live_hotel_{currentProperty.id}_982734</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Read/Write API key for POS & Channel sync</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert('API Key regenerated and sent to tenant administrator.')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
            >
              Roll Key
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Tenant Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
