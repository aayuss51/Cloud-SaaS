
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Loader2, 
  ShieldCheck, 
  Camera,
  LogOut,
  ChevronLeft,
  Briefcase,
  BadgeCheck,
  Building2,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatarUrl: user?.avatarUrl || '',
    department: user?.department || '',
    designation: user?.designation || '',
    employeeId: user?.employeeId || '',
    bio: user?.bio || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || '',
        department: user.department || '',
        designation: user.designation || '',
        employeeId: user.employeeId || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('error', 'Image size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile(formData);
      showToast('success', 'Registry details updated successfully.');
    } catch (error) {
      showToast('error', 'Update failed. Check image size or connection.');
    } finally {
      setIsUpdating(false);
    }
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <div className={`max-w-5xl mx-auto px-6 py-12 animate-fade-in ${isAdmin ? 'pb-24' : ''}`}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-emerald-600 transition-all shadow-sm group"
          >
            <ChevronLeft size={20} className="group-active:scale-90 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">
              {isAdmin ? 'Administrative Intelligence' : 'Guest Registry'}
            </h1>
            <p className="text-gray-400 text-sm font-medium mt-1">
              {isAdmin ? 'Manage your corporate identity and system credentials.' : 'View and update your residency profile.'}
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <div className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm">
             <BadgeCheck size={18} />
             <span className="text-[10px] font-black uppercase tracking-widest">{user?.role?.replace('_', ' ')} Verified</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card Sidebar */}
        <div className="lg:col-span-1">
           <div className="bg-white/60 backdrop-blur-xl rounded-[40px] shadow-sm border border-white p-10 ring-1 ring-black/5 flex flex-col items-center sticky top-24">
              <div className="relative group mb-8">
                <div className="w-36 h-36 rounded-[48px] bg-emerald-50 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center text-emerald-600 text-5xl font-black relative">
                   {formData.avatarUrl ? (
                     <img src={formData.avatarUrl} alt="User" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   ) : (
                     <span>{formData.name.charAt(0)}</span>
                   )}
                   <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity"
                  >
                    <Camera size={32} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Update Photo</span>
                  </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>

              <div className="text-center w-full mb-8">
                 <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-tight truncate px-2">{formData.name}</h2>
                 <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mt-2">{user?.role?.replace('_', ' ')}</p>
                 {isAdmin && formData.designation && (
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{formData.designation}</p>
                 )}
              </div>

              <div className="w-full space-y-3 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between px-2">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">System Status</span>
                   <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </div>
                {isAdmin && formData.employeeId && (
                   <div className="flex items-center justify-between px-2">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Employee ID</span>
                      <span className="text-[10px] font-bold text-slate-900 font-mono">#{formData.employeeId}</span>
                   </div>
                )}
              </div>

              <button 
                type="button" 
                onClick={() => {logout(); navigate('/');}} 
                className="mt-10 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
              >
                <LogOut size={16} /> Sign Out Session
              </button>
           </div>
        </div>

        {/* Details Form Area */}
        <div className="lg:col-span-2">
           <div className="bg-white/40 backdrop-blur-3xl rounded-[48px] shadow-sm border border-white p-12 ring-1 ring-black/5">
              <form onSubmit={handleSubmit} className="space-y-12">
                 {/* Basic Identity */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                       <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Identity Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="group">
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Legal Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input 
                              type="text" 
                              className="w-full pl-12 pr-4 py-4 bg-white/60 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                              value={formData.name} 
                              onChange={e=>setFormData({...formData, name: e.target.value})} 
                              required 
                            />
                          </div>
                       </div>
                       <div className="group">
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Email Access Point</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input 
                              type="email" 
                              className="w-full pl-12 pr-4 py-4 bg-white/60 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                              value={formData.email} 
                              onChange={e=>setFormData({...formData, email: e.target.value})} 
                              required 
                            />
                          </div>
                       </div>
                       <div className="group md:col-span-2">
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Secure Contact Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input 
                              type="tel" 
                              className="w-full pl-12 pr-4 py-4 bg-white/60 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                              value={formData.phone} 
                              onChange={e=>setFormData({...formData, phone: e.target.value})} 
                              placeholder="+977 9XXXXXXXXX"
                            />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Admin Specific Fields */}
                 {isAdmin && (
                   <div className="space-y-6 animate-fade-in-up">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                         <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Organizational Registry</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="group">
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Department</label>
                            <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                className="w-full pl-12 pr-4 py-4 bg-white/60 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                                value={formData.department} 
                                onChange={e=>setFormData({...formData, department: e.target.value})} 
                                placeholder="e.g., Hospitality Operations"
                              />
                            </div>
                         </div>
                         <div className="group">
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Professional Designation</label>
                            <div className="relative">
                              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                className="w-full pl-12 pr-4 py-4 bg-white/60 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                                value={formData.designation} 
                                onChange={e=>setFormData({...formData, designation: e.target.value})} 
                                placeholder="e.g., Senior Floor Manager"
                              />
                            </div>
                         </div>
                         <div className="group md:col-span-2">
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Employee ID Card Number</label>
                            <div className="relative">
                              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                className="w-full pl-12 pr-4 py-4 bg-white/60 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                                value={formData.employeeId} 
                                onChange={e=>setFormData({...formData, employeeId: e.target.value})} 
                                placeholder="Ex: MB-2025-X01"
                              />
                            </div>
                         </div>
                      </div>
                   </div>
                 )}

                 {/* Professional Bio / Description */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                       <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Personal Statement</h3>
                    </div>
                    <div className="group">
                       <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">About Me</label>
                       <textarea 
                          rows={4}
                          className="w-full p-8 bg-white/60 border border-gray-100 rounded-[32px] font-medium text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none resize-none" 
                          value={formData.bio} 
                          onChange={e=>setFormData({...formData, bio: e.target.value})} 
                          placeholder={isAdmin ? "Briefly describe your role and expertise in the hospitality sector..." : "Tell us a bit about yourself or your preferences for your stay..."}
                       />
                    </div>
                 </div>
                 
                 <div className="pt-10 flex gap-4">
                    <Button type="submit" disabled={isUpdating} variant="liquid" className="flex-1 h-16 rounded-[28px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-500/20 active:scale-95">
                      {isUpdating ? <Loader2 className="animate-spin" /> : 'Synchronize Official Registry'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="flex-1 h-16 rounded-[28px] font-black uppercase tracking-widest text-[11px] border-gray-100">
                      Discard Changes
                    </Button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};
