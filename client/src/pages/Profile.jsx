import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card, { CardContent } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Profile = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setName(data.name);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    
    try {
      const payload = { name };
      if (password) payload.password = password;

      const { data } = await api.put('/auth/profile', payload);
      setMessage('Profile updated successfully');
      localStorage.setItem('userInfo', JSON.stringify(data));
      // Re-trigger navbar reload if needed
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">User Profile</h1>

      {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg">{message}</div>}
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg">{error}</div>}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input 
              label="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            
            <div className="pt-4 border-t border-gray-100 mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Change Password</h3>
              <p className="text-sm text-gray-500 mb-4">Leave blank if you do not want to change your password.</p>
              <Input 
                type="password"
                label="New Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter new password"
              />
            </div>
            
            <Button type="submit" isLoading={loading}>Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
