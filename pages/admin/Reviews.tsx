import React, { useEffect, useState, useMemo } from 'react';
import { getReviews, getRooms } from '../../services/mockDb';
import { Review, RoomType } from '../../types';
import { Star, Search, Filter, Loader2, MessageSquare, BedDouble } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export const Reviews: React.FC = () => {
  const { currentProperty } = useTenant();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL');

  useEffect(() => {
    const loadData = async () => {
      if (!currentProperty) return;
      try {
        const [rv, rm] = await Promise.all([
          getReviews(currentProperty.id),
          getRooms(currentProperty.id),
        ]);
        setReviews(rv);
        setRooms(rm);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentProperty]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesSearch =
        r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = ratingFilter === 'ALL' || r.rating === ratingFilter;
      return matchesSearch && matchesRating;
    });
  }, [reviews, searchQuery, ratingFilter]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-slate-400 font-medium text-xs">Loading guest reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Guest Reputation & Feedback
            </h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {avgRating} ★ Rating
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real guest satisfaction scores, amenities reviews, and verified stay ratings.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Rating:</span>
          <select
            value={ratingFilter}
            onChange={e =>
              setRatingFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))
            }
            className="bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs"
          >
            <option value="ALL">All Stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map(r => (
          <div
            key={r.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-white space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">{r.userName}</p>
                <p className="text-[10px] text-slate-500 font-mono">{r.createdAt.split('T')[0]}</p>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < r.rating ? 'currentColor' : 'none'}
                    className={i < r.rating ? 'text-amber-400' : 'text-slate-700'}
                  />
                ))}
              </div>
            </div>

            <p className="text-slate-300 text-xs italic">"{r.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};
