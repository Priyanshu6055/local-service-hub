import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Card, { CardContent } from '../components/Card';
import api from '../utils/api';

const Register = () => {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    category: '',
    experience: '',
    city: '',
    area: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        role
      };

      if (role === 'worker') {
        payload.workerDetails = {
          category: formData.category,
          experience: Number(formData.experience),
          city: formData.city,
          area: formData.area
        };
      }

      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(role === 'worker' ? '/dashboard' : '/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
            <p className="text-gray-500 mt-2">Join Local Service Hub today</p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${role === 'customer' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setRole('customer')}
            >
              I need services
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${role === 'worker' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setRole('worker')}
            >
              I am a worker
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
            <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="10-digit number" />
            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Min 6 characters" />
            
            {role === 'worker' && (
              <div className="animate-fade-in space-y-4 pt-4 border-t border-gray-100 mt-4">
                <h3 className="font-semibold text-gray-800">Worker Profile Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Category (e.g. Plumber)" name="category" value={formData.category} onChange={handleChange} required />
                  <Input label="Years of Experience" name="experience" type="number" min="0" value={formData.experience} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                  <Input label="Local Area" name="area" value={formData.area} onChange={handleChange} required />
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full !mt-8" isLoading={loading}>
              Register as {role === 'worker' ? 'Worker' : 'Customer'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
