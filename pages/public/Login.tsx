
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { UserRole } from '../../types';
import { Lock, Mail, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let detectedRole: UserRole = 'GUEST';

    // Automatic Role Identification Logic
    if (email === 'super@mero-booking.com' && password === 'admin123') {
      detectedRole = 'SUPER_ADMIN';
    } else if (email === 'admin@mero-booking.com' && password === 'admin123') {
      detectedRole = 'ADMIN';
    } else {
      // Standard Guest Validation
      if (password.length < 6) {
        showToast('error', 'Password must be at least 6 characters.');
        setIsSubmitting(false);
        return;
      }
      detectedRole = 'GUEST';
    }

    try {
      await login(email, detectedRole);
      showToast('success', `Welcome back to Mero-Booking!`);
      
      const state = location.state as { from?: { pathname: string, search?: string } } | null;
      const from = state?.from?.pathname 
        ? state.from.pathname + (state.from.search || '')
        : (detectedRole === 'ADMIN' || detectedRole === 'SUPER_ADMIN' ? '/admin' : '/');
      
      navigate(from, { replace: true });
    } catch (error) {
      showToast('error', 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-emerald-200/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[40%] -right-[10%] w-[50%] h-[70%] bg-blue-100/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[100px]"></div>
       </div>

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        <div className="bg-white/60 backdrop-blur-[40px] p-10 rounded-[48px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-white/60 relative ring-1 ring-black/5">
          
          <Link 
            to="/" 
            className="absolute top-8 left-8 p-3 rounded-2xl text-gray-400 hover:text-emerald-600 bg-white/40 hover:bg-white border border-white/60 transition-all duration-300 shadow-sm"
            title="Back to Home"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="text-center mb-10 mt-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] bg-emerald-600 text-white mb-6 shadow-xl shadow-emerald-500/20 border border-emerald-400/30">
               <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Sign In</h1>
            <p className="text-slate-500 font-medium text-sm">Unified Access Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Identity Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-4 rounded-[22px] border border-white/80 bg-white/40 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 focus:outline-none transition-all font-bold text-sm shadow-sm disabled:opacity-50"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-4 rounded-[22px] border border-white/80 bg-white/40 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 focus:outline-none transition-all font-bold text-sm shadow-sm disabled:opacity-50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              variant="liquid"
              className="w-full py-5 text-base shadow-xl rounded-[22px] font-black uppercase tracking-widest mt-4" 
              size="lg"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate'}
            </Button>

            <div className="text-center mt-6 pt-6 border-t border-white/40">
               <p className="text-sm text-slate-500 font-medium">
                 Don't have an account?{' '}
                 <Link to="/register" className="text-emerald-600 font-black hover:underline tracking-tight">
                   Register Here
                 </Link>
               </p>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center animate-fade-in [animation-delay:400ms]">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">One Identity • Many Portals</p>
        </div>
      </div>
    </div>
  );
};
