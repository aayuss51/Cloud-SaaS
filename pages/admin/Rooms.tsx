import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Plus,
  Users,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Layers,
  Crown,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { getRooms, saveRoom, deleteRoom, getFacilities } from '../../services/mockDb';
import { RoomType, Facility } from '../../types';

export const Rooms: React.FC = () => {
  const { currentProperty } = useTenant();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [capacity, setCapacity] = useState('2');
  const [totalStock, setTotalStock] = useState('4');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);
  const [roomNumbersInput, setRoomNumbersInput] = useState('');

  const loadData = async () => {
    if (!currentProperty) return;
    const [rms, facs] = await Promise.all([
      getRooms(currentProperty.id),
      getFacilities(),
    ]);
    setRooms(rms);
    setFacilities(facs);
  };

  useEffect(() => {
    loadData();
  }, [currentProperty]);

  const openCreateModal = () => {
    setEditingRoom(null);
    setName('');
    setCode('DLX-K');
    setDescription('');
    setPricePerNight('250');
    setCapacity('2');
    setTotalStock('4');
    setImageUrl('https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop');
    setSelectedFacilityIds(['f1', 'f4', 'f5']);
    setRoomNumbersInput('101, 102, 103, 104');
    setIsModalOpen(true);
  };

  const openEditModal = (r: RoomType) => {
    setEditingRoom(r);
    setName(r.name);
    setCode(r.code);
    setDescription(r.description);
    setPricePerNight(r.pricePerNight.toString());
    setCapacity(r.capacity.toString());
    setTotalStock(r.totalStock.toString());
    setImageUrl(r.imageUrl);
    setSelectedFacilityIds(r.facilityIds);
    setRoomNumbersInput(r.baseRoomNumbers.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProperty) return;

    const baseRoomNumbers = roomNumbersInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const stock = parseInt(totalStock) || baseRoomNumbers.length || 1;

    const roomPayload: RoomType = {
      id: editingRoom ? editingRoom.id : `rm_${Date.now()}`,
      propertyId: currentProperty.id,
      name,
      code: code || 'STD',
      description,
      pricePerNight: parseFloat(pricePerNight) || 150,
      capacity: parseInt(capacity) || 2,
      totalStock: stock,
      facilityIds: selectedFacilityIds,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
      baseRoomNumbers: baseRoomNumbers.length > 0 ? baseRoomNumbers : ['101'],
    };

    await saveRoom(roomPayload);
    setIsModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this room type?')) {
      await deleteRoom(id);
      await loadData();
    }
  };

  const totalUnits = rooms.reduce((sum, r) => sum + r.totalStock, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Rooms & Inventory Management
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {totalUnits} / {currentProperty?.roomLimit} Quota
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure room types, pricing per night, unit numbers, and amenity specifications for {currentProperty?.name}.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <Plus size={15} />
          <span>Add Room Type</span>
        </button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div
            key={room.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            {/* Image & Price */}
            <div className="h-48 relative overflow-hidden bg-slate-800">
              <img
                src={room.imageUrl}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-emerald-400 border border-slate-700">
                ${room.pricePerNight} <span className="text-[10px] font-normal text-slate-400">/ night</span>
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="bg-slate-800/80 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded text-emerald-300">
                  {room.code}
                </span>
                <h3 className="font-bold text-base text-white mt-1">{room.name}</h3>
              </div>
            </div>

            {/* Room Info */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-xs">
              <div>
                <p className="text-slate-400 line-clamp-2">{room.description}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">Capacity</span>
                    <p className="font-bold text-white mt-0.5">{room.capacity} Guests</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Total Stock</span>
                    <p className="font-bold text-emerald-400 mt-0.5">{room.totalStock} Units</p>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Assigned Room Numbers:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {room.baseRoomNumbers.map(num => (
                      <span
                        key={num}
                        className="bg-slate-800 text-slate-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-700"
                      >
                        #{num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(room)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit Room"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Delete Room"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                {editingRoom ? 'Edit Room Type' : 'Add New Room Type'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Mountain View Penthouse"
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="DLX-K"
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Price / Night ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={pricePerNight}
                    onChange={e => setPricePerNight(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Total Units
                  </label>
                  <input
                    type="number"
                    value={totalStock}
                    onChange={e => setTotalStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Assigned Unit Room Numbers (comma separated)
                </label>
                <input
                  type="text"
                  value={roomNumbersInput}
                  onChange={e => setRoomNumbersInput(e.target.value)}
                  placeholder="101, 102, 103, 104"
                  className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                  Save Room Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
