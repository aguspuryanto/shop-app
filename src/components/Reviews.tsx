import { useState } from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ReviewsProps {
  productId: string;
  reviews: Review[];
  onAddReview: (rating: number, comment: string) => void;
}

export default function Reviews({ productId, reviews, onAddReview }: ReviewsProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview(rating, comment);
    setComment('');
    setRating(5);
    setIsAddingReview(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Reviews ({reviews.length})
        </h2>
        {user && !isAddingReview && (
          <button
            onClick={() => setIsAddingReview(true)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Write a review
          </button>
        )}
      </div>

      {isAddingReview && user && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
                >
                  <Star
                    className="h-6 w-6"
                    fill={rating >= star ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Write your review here..."
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setIsAddingReview(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {review.userName}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 text-yellow-400"
                        fill={review.rating >= star ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
