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
  Sun,
  Moon,
  Laptop,
  Palette,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useTheme } from '../../context/ThemeContext';

export const Settings: React.FC = () => {
  const { currentProperty, updateProperty } = useTenant();
  const { theme, resolvedTheme, setTheme } = useTheme();

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
    <div className="space-y-6 max-w-4xl mx-auto text-slate-900 dark:text-white transition-colors duration-200">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">
            Property & Tenant Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure custom hotel branding, visual theme, tax rates, check-in hours, and webhook integrations.
          </p>
        </div>
        <span className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          {currentProperty.tier} Tier
        </span>
      </div>

      {savedFeedback && (
        <div className="bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-500/40 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 size={16} />
          <span>Tenant settings saved and deployed successfully!</span>
        </div>
      )}

      {/* System Appearance & Theme Mode Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="text-blue-600 dark:text-blue-400" size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Interface Appearance & Theme
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select how Mero Booking is displayed across your devices and workstations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Current active:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              {resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`text-left p-4 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun size={20} />
                </div>
                {theme === 'light' && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
                    <CheckCircle2 size={12} /> Active
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Light Mode</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Crisp daytime surfaces with high typographic contrast. Perfect for bright hotel lobbies and front desks.
              </p>
            </div>

            {/* Mini Visual Preview of Light Mode */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
              <div className="w-full h-12 rounded-lg bg-white border border-slate-200 p-1.5 flex gap-1.5 shadow-xs">
                <div className="w-1/4 h-full bg-slate-100 rounded"></div>
                <div className="flex-1 space-y-1">
                  <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                  <div className="w-1/2 h-1.5 bg-blue-400 rounded"></div>
                </div>
              </div>
            </div>
          </button>

          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`text-left p-4 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Moon size={20} />
                </div>
                {theme === 'dark' && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
                    <CheckCircle2 size={12} /> Active
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dark Mode</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Deep slate and OLED tones that reduce glare during night audits, early check-ins, and low-light operations.
              </p>
            </div>

            {/* Mini Visual Preview of Dark Mode */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
              <div className="w-full h-12 rounded-lg bg-slate-950 border border-slate-800 p-1.5 flex gap-1.5">
                <div className="w-1/4 h-full bg-slate-850 rounded"></div>
                <div className="flex-1 space-y-1">
                  <div className="w-3/4 h-2 bg-slate-700 rounded"></div>
                  <div className="w-1/2 h-1.5 bg-blue-500 rounded"></div>
                </div>
              </div>
            </div>
          </button>

          {/* System Default Card */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`text-left p-4 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
              theme === 'system'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Laptop size={20} />
                </div>
                {theme === 'system' && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
                    <CheckCircle2 size={12} /> Active
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">System Sync</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Automatically matches your operating system or browser theme (light during day, dark at night).
              </p>
            </div>

            {/* Mini Visual Preview of Split Mode */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
              <div className="w-full h-12 rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden flex shadow-xs">
                <div className="w-1/2 h-full bg-white p-1.5 flex flex-col justify-center gap-1">
                  <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                  <div className="w-1/2 h-1.5 bg-blue-400 rounded"></div>
                </div>
                <div className="w-1/2 h-full bg-slate-950 p-1.5 flex flex-col justify-center gap-1 border-l border-slate-300 dark:border-slate-700">
                  <div className="w-3/4 h-2 bg-slate-800 rounded"></div>
                  <div className="w-1/2 h-1.5 bg-blue-500 rounded"></div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-900 dark:text-white space-y-6 text-xs shadow-sm transition-colors">
        {/* Basic Hotel Profile */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Hotel Branding & Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Hotel / Resort Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Hero Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Configuration */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Currency & Government Tax
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Operating Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="NPR">NPR (रू)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">VAT / Tax Rate (e.g. 0.13 = 13%)</label>
              <input
                type="number"
                step="0.01"
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Front Desk Check-in Policies */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Standard Check-In / Check-Out Hours
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Standard Check-In Time</label>
              <input
                type="text"
                value={checkInTime}
                onChange={e => setCheckInTime(e.target.value)}
                placeholder="14:00"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Standard Check-Out Time</label>
              <input
                type="text"
                value={checkOutTime}
                onChange={e => setCheckOutTime(e.target.value)}
                placeholder="11:00"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* API & Webhooks (SaaS Feature) */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                SaaS Webhooks & REST API
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Integrate hotel event streams with Zapier, Slack, or ERP systems</p>
            </div>
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-blue-600 dark:text-blue-400 font-mono">
              v1.4 Live
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key size={18} className="text-amber-500 dark:text-amber-400 shrink-0" />
              <div>
                <p className="font-mono text-slate-900 dark:text-white text-xs">pk_live_hotel_{currentProperty.id}_982734</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Read/Write API key for POS & Channel sync</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert('API Key regenerated and sent to tenant administrator.')}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs"
            >
              Roll Key
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Tenant Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
