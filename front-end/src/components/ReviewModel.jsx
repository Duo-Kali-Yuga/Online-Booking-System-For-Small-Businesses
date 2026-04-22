import { useState } from 'react';
import api from '../api/axios';

const ReviewModal = ({ isOpen, onClose, appointment, onReviewSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/reviews', {
        providerId: appointment.provider._id,
        appointmentId: appointment._id,
        rating,
        comment
      });
      onReviewSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold mb-2">How was your visit?</h3>
        <p className="text-slate-500 mb-6">Reviewing {appointment.provider?.businessName}</p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num} type="button"
                onClick={() => setRating(num)}
                className={`text-3xl transition ${rating >= num ? 'text-yellow-400' : 'text-slate-200'}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500 h-32"
            placeholder="Write your experience here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex gap-3">
            <button 
              type="button" onClick={onClose}
              className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" disabled={submitting}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-blue-300"
            >
              {submitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;