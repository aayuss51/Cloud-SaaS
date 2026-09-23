import React, { useState, useEffect } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Review, Booking } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  existingReview?: Review;
  onSave: (rating: number, comment: string) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, booking, existingReview, onSave }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Update state when existingReview changes (e.g. switching between bookings)
  useEffect(() => {
    if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
    } else {
        setRating(5);
        setComment('');
    }
  }, [existingReview, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    await onSave(rating, comment);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{existingReview ? 'Edit Your Review' : 'Rate Your Stay'}</h3>
            <p className="text-xs text-gray-500">Booking #{booking.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
          {/* Star Rating */}
          <div className="flex flex-col items-center mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2">How was your experience?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none p-1"
                >
                  <Star 
                    size={32} 
                    className={`${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} transition-colors`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-amber-600 font-medium mt-2">
              {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][(hoverRating || rating) - 1]}
            </p>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Share your thoughts</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like? What could be improved?"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] resize-y"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (existingReview ? 'Update Review' : 'Submit Review')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};