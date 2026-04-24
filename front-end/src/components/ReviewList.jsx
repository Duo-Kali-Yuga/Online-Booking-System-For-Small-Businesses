import { useEffect, useState } from 'react';
import api from '../api/axios';
import dayjs from 'dayjs';

const ReviewList = ({ providerId, provider }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${providerId}`);
        setReviews(res.data.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      } finally {
        setLoading(false);
      }
    };
    if (providerId) fetchReviews();
  }, [providerId]);

  if (loading || !provider) return <div className="text-slate-400 text-sm">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="text-slate-400 text-sm italic">No reviews yet. Be the first!</div>;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        Reviews ({reviews.length})
      </h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-bold text-slate-800 block">{review.client?.name}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  {dayjs(review.createdAt).format('MMMM D, YYYY')}
                </span>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-yellow-400" : "text-slate-200"}>★</span>
                ))}
              </div>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              "{review.comment}"
            </p>

            {/* NEW: Provider Response Section */}
            {review.response && (
              <div className="mt-4 ml-4 p-3 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                  Response from {provider.businessName}
                </p>
                <p className="text-slate-700 text-sm italic">
                  {review.response}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;