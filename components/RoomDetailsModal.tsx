
import React, { useState } from 'react';
import { RoomType, Facility } from '../types';
import { X, Users, Check, Star, Info, ArrowRight, Edit3, Save, Globe, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import { useAuth } from '../context/AuthContext';

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomType;
  facilities: Facility[];
  onBook: (room: RoomType) => void;
  onUpdateRoom?: (updatedRoom: RoomType) => Promise<void>;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  room, 
  facilities, 
  onBook,
  onUpdateRoom 
}) => {
  const { user } = useAuth();
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(room.imageUrl);
  const [isUpdating, setIsUpdating] = useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (!isOpen) return null;

  const handleUpdateImage = async () => {
    if (!onUpdateRoom || !newImageUrl.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdateRoom({ ...room, imageUrl: newImageUrl });
      setIsEditingImage(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up border border-white">
        {/* Modal Header / Image Area */}
        <div className="relative h-80 shrink-0 bg-gray-100 group">
           <ImageWithSkeleton src={newImageUrl} alt={room.name} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
           
           <button 
             onClick={onClose} 
             className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/40 rounded-2xl transition-all backdrop-blur-md text-white border border-white/30 z-20"
           >
             <X size={20} />
           </button>

           {/* Admin Image Edit UI */}
           {isAdmin && onUpdateRoom && (
             <div className="absolute top-6 left-6 z-20">
               {!isEditingImage ? (
                 <button 
                   onClick={() => setIsEditingImage(true)}
                   className="p-3 bg-blue-600/90 hover:bg-blue-500 text-white rounded-2xl shadow-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                 >
                   <Edit3 size={16} /> Update Visuals
                 </button>
               ) : (
                 <div className="flex flex-col gap-2 w-72 animate-fade-in">
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={14} />
                      <input 
                        type="text" 
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Image URL..."
                        className="w-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:bg-white/30"
                      />
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={handleUpdateImage}
                        disabled={isUpdating}
                        className="flex-1 bg-white text-blue-700 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-1"
                       >
                         {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Save</>}
                       </button>
                       <button 
                        onClick={() => { setIsEditingImage(false); setNewImageUrl(room.imageUrl); }}
                        disabled={isUpdating}
                        className="px-4 bg-black/40 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md"
                       >
                         Cancel
                       </button>
                    </div>
                 </div>
               )}
             </div>
           )}
           
           <div className="absolute bottom-8 left-8 text-white">
             <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] opacity-60 mb-2">
                <span>Ref: #{room.id}</span>
                <span className="w-1 h-1 bg-white rounded-full"></span>
                <span className="text-blue-400">Luxury Suite</span>
             </div>
             <h2 className="text-4xl font-serif font-bold leading-tight">{room.name}</h2>
           </div>

           <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-xl px-6 py-3 rounded-[24px] border border-white shadow-2xl ring-1 ring-black/5">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Starting From</span>
                <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-black text-slate-900">NPR {room.pricePerNight.toLocaleString()}</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">/ night</span>
                </div>
             </div>
           </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-white">
          <div className="space-y-10">
            {/* Highlights Grid */}
            <div className="grid grid-cols-3 gap-6">
               <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center">
                  <Users size={20} className="text-blue-600 mb-2" />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Max Guests</span>
                  <span className="text-sm font-bold text-slate-900">{room.capacity} Persons</span>
               </div>
               <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center">
                  <Star size={20} className="text-amber-400 fill-amber-400 mb-2" />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Experience</span>
                  <span className="text-sm font-bold text-slate-900">Elite Tier</span>
               </div>
               <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center">
                  <Info size={20} className="text-indigo-600 mb-2" />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Policy</span>
                  <span className="text-sm font-bold text-slate-900">Flexible</span>
               </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h3 className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px] ml-1">The Experience</h3>
              <p className="text-gray-500 leading-relaxed text-base font-medium whitespace-pre-line">
                {room.description}
              </p>
            </div>

            {/* Facilities Section */}
            <div>
              <h3 className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px] mb-6 ml-1">Signature Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {room.facilityIds.map(fid => {
                  const f = facilities.find(fac => fac.id === fid);
                  return f ? (
                    <div key={fid} className="flex items-center gap-3 text-gray-700 bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-sm transition-all group">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Check size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{f.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex gap-4 shrink-0">
          <Button variant="secondary" onClick={onClose} className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] border-gray-200">
            Return to List
          </Button>
          <Button onClick={() => onBook(room)} variant="liquid" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-600/20">
            Secure This Suite <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
