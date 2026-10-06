import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PersonAvatar from '@/components/common/Avatar';
import type { ReviewData } from '@/hooks/use-reviews';

interface ReviewsSectionProps {
  rating?: number;
  reviews?: number;
  reviewsData: ReviewData[];
  canReview?: boolean;
  isSignedIn?: boolean;
  hasReviewed?: boolean;
  onSubmitReview?: (rating: number, comment: string) => Promise<void>;
}

const ReviewsSection = ({
  rating = 0,
  reviews = 0,
  reviewsData,
  canReview = false,
  isSignedIn = false,
  hasReviewed = false,
  onSubmitReview,
}: ReviewsSectionProps) => {
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (newRating === 0) {
      setFormError('Choose a star rating from 1 to 5.');
      return;
    }
    if (comment.trim().length < 10) {
      setFormError('Write at least a sentence so other swimmers know what to expect.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitReview?.(newRating, comment.trim());
      setNewRating(0);
      setComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center mb-8">
        <div className="bg-yellow-50 p-3 rounded-full mr-4">
          <Star className="h-6 w-6 fill-yellow-400 stroke-yellow-400" />
        </div>
        <div>
          <span className="text-xl font-semibold mr-1">{reviews > 0 ? rating.toFixed(1) : 'New'}</span>
          <span className="text-gray-700">· {reviews} {reviews === 1 ? 'review' : 'reviews'}</span>
        </div>
      </div>

      {canReview && !hasReviewed && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3">
          <p className="font-medium">How was your swim?</p>
          <div className="flex" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} star${value > 1 ? 's' : ''}`}
                onMouseEnter={() => setHoverRating(value)}
                onClick={() => setNewRating(value)}
                className="p-0.5"
              >
                <Star
                  className={cn(
                    'h-6 w-6',
                    value <= (hoverRating || newRating) ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you enjoy? Anything other guests should know?"
            rows={3}
          />
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <Button type="submit" disabled={submitting} className="bg-pool-primary hover:bg-pool-secondary">
            {submitting ? 'Posting...' : 'Post review'}
          </Button>
        </form>
      )}

      {!isSignedIn && (
        <p className="mb-6 text-sm text-gray-500">
          <Link to="/sign-in" className="text-pool-primary hover:underline">Sign in</Link> after your visit to leave a review.
        </p>
      )}
      {isSignedIn && !canReview && (
        <p className="mb-6 text-sm text-gray-500">You can review this pool once you have booked a visit.</p>
      )}

      {reviewsData.length === 0 && (
        <p className="text-gray-500">No reviews yet. Be the first to swim here.</p>
      )}

      <div className="space-y-6">
        {reviewsData.map((review) => (
          <div
            key={review.id}
            className="pb-6 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center mb-3">
              <PersonAvatar name={review.user} src={review.avatar} className="w-12 h-12 mr-3 border border-gray-200" />
              <div>
                <p className="font-medium text-gray-800">{review.user}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
            <div className="flex mb-2" aria-label={`${review.rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4 mr-0.5',
                    i < review.rating ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'
                  )}
                />
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
