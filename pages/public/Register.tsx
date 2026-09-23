import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Lock, Mail, User as UserIcon, Loader2, ArrowRight, Camera, Upload, X, UserPlus } from 'lucide-react';

export const Register: React.FC = () => {
  const { register, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('error', 'Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    
    try {
      await register(name, email, 'GUEST');
      if (avatarUrl) {
        await updateProfile({ avatarUrl });
      }
      showToast('success', 'Account created successfully! Welcome to Mero-Booking.');
      navigate('/', { replace: true });
    } catch (e: any) {
      showToast('error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-50 overflow-hidden">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-emerald-200/20 rounded-full blur-[140px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-100/30 rounded-full blur-[120px]"></div>
       </div>

      <div className="bg-white/60 backdrop-blur-[40px] p-10 rounded-[48px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] max-w-lg w-full animate-fade-in border border-white/60 relative z-10 ring-1 ring-black/5">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] bg-emerald-600 text-white mb-6 shadow-xl shadow-emerald-500/20 border border-emerald-400/30">
               <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Join Us</h1>
          <p className="text-slate-500 font-medium text-sm">Experience the future of luxury hospitality.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-28 h-28 rounded-[36px] flex items-center justify-center overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 border-2 ${!avatarUrl ? 'bg-white/40 backdrop-blur-md border-emerald-500/20 border-dashed' : 'border-white ring-8 ring-emerald-500/5'}`}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-emerald-600/50">
                    <Camera size={32} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-2">Add Photo</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload size={24} className="text-white" />
                </div>
              </div>

              {avatarUrl && (
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setAvatarUrl(null); }}
                  className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-xl text-rose-500 hover:bg-rose-50 transition-colors border border-rose-100 ring-4 ring-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Full Identity</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-4 rounded-[22px] border border-white/80 bg-white/40 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 focus:outline-none transition-all font-bold text-sm shadow-sm"
                placeholder="Ex: Alexander Hamilton"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Email Access</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 rounded-[22px] border border-white/80 bg-white/40 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 focus:outline-none transition-all font-bold text-sm shadow-sm"
                placeholder="you@luxury-residence.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-[22px] border border-white/80 bg-white/40 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 focus:outline-none transition-all font-bold text-sm shadow-sm"
                  placeholder="••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-[22px] border border-white/80 bg-white/40 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 focus:outline-none transition-all font-bold text-sm shadow-sm"
                  placeholder="••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-rose-600 text-xs font-bold bg-rose-50/50 p-4 rounded-[20px] border border-rose-100 flex items-center gap-3 animate-shake">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            variant="liquid"
            className="w-full py-5 rounded-[22px] shadow-xl shadow-emerald-500/20 text-base font-black uppercase tracking-widest" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account <ArrowRight size={18} />
              </span>
            )}
          </Button>

          <div className="text-center mt-6 pt-6 border-t border-white/40">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-black hover:underline tracking-tight">
                Enter Portal
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};