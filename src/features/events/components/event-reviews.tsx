'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { EventReview } from '@/features/events/event.types';
import { Button } from '@/components/ui/button';

interface EventReviewsProps {
  reviews?: EventReview[];
  rating?: number;
  count?: number;
}

export function EventReviews({ reviews, rating = 0, count = 0 }: EventReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl p-8 border border-[var(--border-primary)] text-center">
        <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-icons-outlined text-2xl text-[var(--text-tertiary)]">rate_review</span>
        </div>
        <p className="text-[var(--text-secondary)] mb-4">No reviews yet. Be the first to share your experience!</p>
        <Button variant="outline">Write a Review</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       {/* Summary Header */}
       <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
         <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Rating Score */}
            <div className="flex flex-col items-center md:items-start">
              <div className="text-5xl font-bold text-[var(--text-primary)] mb-2">{rating.toFixed(1)}</div>
              <div className="flex text-amber-500 mb-1">
                {[1,2,3,4,5].map(star => (
                  <span key={star} className="material-icons-outlined text-xl">
                    {star <= Math.round(rating) ? 'star' : star - 0.5 <= rating ? 'star_half' : 'star_border'}
                  </span>
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{count} verified reviews</p>
            </div>
            
            {/* Rating Breakdown */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map(stars => {
                const percentage = reviews ? Math.round((reviews.filter(r => r.rating === stars).length / reviews.length) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs font-medium w-8">{stars} ★</span>
                    <div className="flex-1 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)] w-8">{percentage}%</span>
                  </div>
                );
              })}
            </div>
         </div>
       </div>

       {/* Review List */}
       <div className="space-y-4">
         {reviews.slice(0, 5).map((review) => {
           const userName = review.userName || review.user || 'Anonymous';
           const reviewDate = review.createdAt || review.date;
           
           return (
             <div key={review.id} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-5">
                <div className="flex items-start justify-between mb-3">
                   <div className="flex items-center gap-3">
                      {/* User Avatar */}
                      {review.userAvatar || review.avatar ? (
                        <Image 
                          src={review.userAvatar || review.avatar || ''} 
                          alt={userName}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold">
                           {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-sm block text-[var(--text-primary)]">{userName}</span>
                        <span className="text-xs text-[var(--text-tertiary)]">
                          {reviewDate ? new Date(reviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                   </div>
                   
                   {/* Rating Stars */}
                   <div className="flex text-amber-500">
                      {[1,2,3,4,5].map(star => (
                         <span key={star} className="material-icons-outlined text-sm">
                            {star <= review.rating ? 'star' : 'star_border'}
                         </span>
                      ))}
                   </div>
                </div>
                
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{review.comment}</p>
                
                {/* Helpful Actions */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border-primary)]">
                  <button className="text-xs text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] flex items-center gap-1 transition-colors">
                    <span className="material-icons-outlined text-sm">thumb_up</span>
                    Helpful (0)
                  </button>
                  <button className="text-xs text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-colors">
                    Report
                  </button>
                </div>
             </div>
           );
         })}
       </div>
       
       {/* Load More */}
       {reviews.length > 5 && (
         <div className="text-center pt-4">
           <Button variant="outline">Load More Reviews</Button>
         </div>
       )}
    </div>
  );
}