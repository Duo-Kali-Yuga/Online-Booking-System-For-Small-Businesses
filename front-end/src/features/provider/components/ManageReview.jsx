import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import dayjs from 'dayjs';
import { FiMessageSquare, FiCheckCircle } from 'react-icons/fi';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({}); // Stores text for each review ID
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await api.get('/reviews/me/my-reviews');
        setReviews(res.data.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReviews();
  }, []);

  const handleResponse = async (reviewId) => {
    try {
      const res = await api.patch(`/reviews/${reviewId}/respond`, { 
        response: replyText[reviewId] 
      });
      
      // Update local state to show the response immediately
      setReviews(reviews.map(r => r._id === reviewId ? res.data.data : r));
      alert("Response saved!");
    } catch (err) {
      alert("Error saving response");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading feedback...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Manage Feedback</h1>
        <p className="text-slate-500">View and respond to client reviews</p>
      </header>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-bold text-lg text-slate-800">{review.client?.name}</span>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  {dayjs(review.createdAt).format('MMM D, YYYY')}
                </p>
              </div>
              <div className="flex text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-yellow-400" : "text-slate-200"}>★</span>
                ))}
              </div>
            </div>

            <p className="text-slate-600 bg-slate-50 p-4 rounded-2xl italic mb-6">
              "{review.comment}"
            </p>

            {/* Response Section */}
            {review.response ? (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-2">
                  <FiCheckCircle /> Your Response
                </div>
                <p className="text-slate-700 text-sm">{review.response}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  className="w-full p-4 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  placeholder="Type your response to the client..."
                  value={replyText[review._id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [review._id]: e.target.value })}
                />
                <button
                  onClick={() => handleResponse(review._id)}
                  disabled={!replyText[review._id]}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition disabled:opacity-50"
                >
                  <FiMessageSquare /> Send Response
                </button>
              </div>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No reviews to manage yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;