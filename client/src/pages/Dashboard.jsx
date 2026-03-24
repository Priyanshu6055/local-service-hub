import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
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
        description
      });
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploadLoading(true);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // We would ideally save this to the worker profile's profileImage or portfolio
      // For MVP, if we had an endpoint update here:
      console.log(data);
      setMessage('Image uploaded temporarily (Needs DB save API link)');
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

        {/* Upload Portfolio */}
        <Card>
          <CardHeader title="Upload Media" subtitle="Add a profile picture or previous work images." />
          <CardContent className="p-6 pt-0">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <input 
                type="file" 
                onChange={uploadFileHandler} 
                className="hidden" 
                id="file-upload" 
                accept="image/*"
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer btn-outline inline-block"
              >
                {uploadLoading ? 'Uploading...' : 'Choose Image'}
              </label>
              <p className="mt-2 text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
