import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Phone, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import api, { VITE_BASE_URL } from '../utils/api';
import Card, { CardContent } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const [workerRes, reviewsRes] = await Promise.all([
          api.get(`/workers/${id}`),
          api.get(`/reviews/${id}`)
        ]);
        setWorker(workerRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerData();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await api.post(`/reviews/${id}`, { rating, comment });
      // Refresh reviews
      const { data } = await api.get(`/reviews/${id}`);
      setReviews(data);
      setComment('');
      setRating(5);
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!worker) {
    return <div className="text-center py-20 text-xl text-gray-600">Worker profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-1 shadow-lg border-2 border-white">
              <img 
                src={worker.profileImage !== 'default.jpg' ? (worker.profileImage.startsWith('/') ? `${VITE_BASE_URL}${worker.profileImage}` : worker.profileImage) : 'https://via.placeholder.com/150'} 
                alt={worker.user.name} 
                className="w-full h-full rounded-full object-cover bg-gray-100"
              />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{worker.user.name}</h1>
                {worker.isVerified && <ShieldCheck className="text-secondary w-6 h-6" title="Verified Worker" />}
              </div>
              <p className="text-primary font-medium text-lg">{worker.category}</p>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto pb-2">
              <a href={`tel:${worker.user.phone}`} className="w-full">
                <Button className="w-full flex items-center justify-center gap-2 text-sm shadow-sm">
                  <Phone size={16} /> Call Now
                </Button>
              </a>
              <a href={`https://wa.me/91${worker.user.phone}`} target="_blank" rel="noreferrer" className="w-full">
                <Button className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 outline-none text-white text-sm shadow-sm">
                  <MessageSquare size={16} /> WhatsApp
                </Button>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-gray-100 pt-6">
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium text-sm">Location</span>
              <span className="text-gray-900 font-semibold flex items-center gap-1 mt-1">
                <MapPin size={16} className="text-primary" /> {worker.location.area}, {worker.location.city}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium text-sm">Experience</span>
              <span className="text-gray-900 font-semibold flex items-center gap-1 mt-1">
                <Clock size={16} className="text-primary" /> {worker.experience} Years
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium text-sm">Rating</span>
              <span className="text-gray-900 font-semibold flex items-center gap-1 mt-1">
                <Star size={16} className="text-yellow-400 fill-current" /> {worker.averageRating || 'New'} ({worker.totalReviews} Reviews)
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium text-sm">Status</span>
              <span className="text-gray-900 font-semibold flex items-center gap-1 mt-1">
                {worker.isAvailable ? (
                  <><div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div> Available</>
                ) : (
                  <><div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div> Busy</>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      {worker.description && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed">{worker.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      <h2 className="text-2xl font-bold text-gray-900 pt-4">Customer Reviews</h2>
      
      {userInfo && userInfo.role === 'customer' && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Write a Review</h3>
            {reviewError && <p className="text-red-500 text-sm mb-3">{reviewError}</p>}
            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Rating:</label>
                <select 
                  className="input-field py-2 pr-8 w-24"
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                </select>
              </div>
              <textarea 
                className="input-field min-h-[100px]" 
                placeholder="Share your experience..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <Button type="submit">Submit Review</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <Card key={review._id}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900">{review.customer?.name}</span>
                  <span className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                    ))}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkerProfile;
