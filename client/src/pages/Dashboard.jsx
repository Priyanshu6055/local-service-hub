import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { VITE_BASE_URL } from '../utils/api';
import Card, { CardContent, CardHeader } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form states
  const [isAvailable, setIsAvailable] = useState(true);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [profileImage, setProfileImage] = useState('default.jpg');
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.role !== 'worker') {
          navigate('/'); // Redirect non-workers
        }
        setProfile(data);
        if (data.workerProfile) {
          setIsAvailable(data.workerProfile.isAvailable);
          setDescription(data.workerProfile.description || '');
          setCategory(data.workerProfile.category || '');
          setExperience(data.workerProfile.experience || '');
          setCity(data.workerProfile.location?.city || '');
          setArea(data.workerProfile.location?.area || '');
          setProfileImage(data.workerProfile.profileImage || 'default.jpg');
          setPortfolioImages(data.workerProfile.portfolioImages || []);
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      await api.put('/workers/dashboard', {
        isAvailable,
        description,
        category,
        experience,
        city,
        area,
        profileImage,
        portfolioImages
      });
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const uploadFileHandler = async (e, type = 'profile') => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploadLoading(true);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (type === 'profile') {
        setProfileImage(data.image);
        setMessage('Profile image uploaded. Save to apply changes.');
      } else {
        setPortfolioImages([...portfolioImages, data.image]);
        setMessage('Portfolio image added. Save to apply changes.');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Worker Dashboard</h1>
      
      {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6">{message}</div>}
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6">{error}</div>}

      <div className="grid gap-6">
        {/* Availability Toggle */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Current Status</h3>
                <p className="text-sm text-gray-500">Turn off if you are not taking new jobs</p>
              </div>
              
              <label className="flex flex-col items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={isAvailable} 
                    onChange={async (e) => {
                      const newStatus = e.target.checked;
                      setIsAvailable(newStatus);
                      try {
                        await api.put('/workers/dashboard', { isAvailable: newStatus });
                        setMessage(`Status changed to ${newStatus ? 'Available' : 'Busy'}`);
                      } catch(err) {
                        setError('Failed to update status');
                        setIsAvailable(!newStatus); // Revert
                      }
                    }} 
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isAvailable ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <span className={`mt-2 text-sm font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAvailable ? 'Available' : 'Busy'}
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader title="Edit Profile Details" />
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Service Category" 
                  placeholder="e.g. Plumber, Electrician"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
                <Input 
                  label="Years of Experience" 
                  type="number"
                  placeholder="e.g. 5"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="City" 
                  placeholder="e.g. Bhopal"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <Input 
                  label="Area" 
                  placeholder="e.g. MP Nagar"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                <textarea 
                  className="input-field min-h-[120px]" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your skills to customers..."
                />
              </div>
              
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        {/* Media Management */}
        <Card>
          <CardHeader title="Media Management" subtitle="Manage your profile picture and portfolio images." />
          <CardContent className="p-6 pt-0 space-y-6">
            {/* Profile Image */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Profile Image</h4>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border">
                  <img 
                    src={profileImage && profileImage.startsWith('/') ? `${VITE_BASE_URL}${profileImage}` : (profileImage && profileImage !== 'default.jpg' ? profileImage : `https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=random`)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = "true";
                        e.target.src = `https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=random`;
                      }
                    }}
                  />
                </div>
                <div>
                  <input 
                    type="file" 
                    onChange={(e) => uploadFileHandler(e, 'profile')} 
                    className="hidden" 
                    id="profile-upload" 
                    accept="image/*"
                  />
                  <label 
                    htmlFor="profile-upload" 
                    className="cursor-pointer btn-outline px-4 py-2 text-sm inline-block"
                  >
                    {uploadLoading ? 'Uploading...' : 'Change Photo'}
                  </label>
                </div>
              </div>
            </div>

            {/* Portfolio Images */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-gray-900">Portfolio Images</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {portfolioImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg bg-gray-100 overflow-hidden border group">
                    <img 
                      src={img && img.startsWith('/') ? `${VITE_BASE_URL}${img}` : (img || 'https://placehold.co/400x400?text=Portfolio')} 
                      alt={`Portfolio ${idx}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (!e.target.dataset.tried) {
                          e.target.dataset.tried = "true";
                          e.target.src = 'https://placehold.co/400x400?text=Error+Loading';
                        }
                      }}
                    />
                    <button 
                      onClick={() => setPortfolioImages(portfolioImages.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <input 
                    type="file" 
                    onChange={(e) => uploadFileHandler(e, 'portfolio')} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <span className="text-2xl text-gray-400">+</span>
                  <span className="text-xs text-gray-400">Add</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
