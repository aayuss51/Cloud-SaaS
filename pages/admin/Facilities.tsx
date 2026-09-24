
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFacilities, saveFacility, deleteFacility } from '../../services/mockDb';
import { Facility } from '../../types';
import { Button } from '../../components/Button';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Edit2, Wifi, Car, Coffee, Dumbbell, Waves, Utensils, Tv, Loader2, ChevronLeft } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Wifi, Car, Coffee, Dumbbell, Waves, Utensils, Tv
};

export const Facilities: React.FC = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFacility, setCurrentFacility] = useState<Partial<Facility>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadData(true);
  }, []);

  const loadData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      setFacilities(await getFacilities());
    } catch (error) {
      showToast('error', 'Failed to load facilities.');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentFacility.name && currentFacility.icon) {
      setIsSubmitting(true);
      try {
        await saveFacility(currentFacility as Facility);
        await loadData(false);
        showToast('success', `Facility "${currentFacility.name}" saved successfully.`);
        setIsEditing(false);
        setCurrentFacility({});
      } catch (error) {
        showToast('error', 'Failed to save facility.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this facility?')) {
      try {
        await deleteFacility(id);
        await loadData(false);
        showToast('success', 'Facility deleted successfully.');
      } catch (error) {
        showToast('error', 'Failed to delete facility.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Loading facilities...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-blue-600 transition-all shadow-sm group"
          >
            <ChevronLeft size={20} className="group-active:scale-90 transition-transform" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Facilities Management</h2>
        </div>
        <Button onClick={() => { setCurrentFacility({}); setIsEditing(true); }}>
          <Plus size={18} className="mr-2" /> Add Facility
        </Button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-200 animate-fade-in-up">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">{currentFacility.id ? 'Edit' : 'Add'} Facility</h3>
          <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 font-bold"
                value={currentFacility.name || ''}
                onChange={e => setCurrentFacility({ ...currentFacility, name: e.target.value })}
                placeholder="e.g., Spa & Wellness"
                required
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 font-bold"
                value={currentFacility.icon || ''}
                onChange={e => setCurrentFacility({ ...currentFacility, icon: e.target.value })}
                required
              >
                <option value="">Select Icon</option>
                {Object.keys(ICON_MAP).map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
               <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '...' : 'Save'}</Button>
               <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {facilities.map(f => {
          const IconComp = ICON_MAP[f.icon] || Wifi;
          return (
            <div key={f.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <IconComp size={22} />
                </div>
                <span className="font-medium text-gray-700">{f.name}</span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setCurrentFacility(f); setIsEditing(true); }} className="text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(f.id)} className="text-gray-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
