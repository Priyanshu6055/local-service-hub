import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, Star, MapPin, Zap } from 'lucide-react';
import api, { VITE_BASE_URL } from '../utils/api';
import Card, { CardContent } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const Search = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Filters state
  const [category, setCategory] = useState(queryParams.get('category') || '');
  const [city, setCity] = useState(queryParams.get('city') || '');
  const [name, setName] = useState(queryParams.get('name') || '');
  const [isUrgent, setIsUrgent] = useState(queryParams.get('isUrgent') === 'true');

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (city) params.append('city', city);
      if (name) params.append('name', name);
      if (isUrgent) params.append('isUrgent', 'true');
      
      const { data } = await api.get(`/workers?${params.toString()}`);
      setWorkers(data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchWorkers();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <div className="w-full md:w-1/4">
        <Card className="sticky top-20 border-border">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Filters</h2>
            <form onSubmit={handleFilter} className="space-y-4">
              <Input 
                label="Worker Name" 
                placeholder="John Doe..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input 
                label="Category" 
                placeholder="Plumber, Electrician..." 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <Input 
                label="City / Area" 
                placeholder="Bhopal, MP Nagar..." 
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              
              <label className="flex items-center cursor-pointer p-3 bg-red-50 rounded-xl border border-red-100">
                <input 
                  type="checkbox" 
                  className="rounded text-red-500 focus:ring-red-500 mr-3 w-5 h-5 cursor-pointer" 
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                <div className="flex items-center text-red-700 font-medium text-sm">
                  <Zap className="w-4 h-4 mr-1" />
                  Urgent (Available Now)
                </div>
              </label>

              <Button type="submit" className="w-full mt-2">Apply Filters</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="w-full md:w-3/4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {workers.length} {workers.length === 1 ? 'Worker' : 'Workers'} Found
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : workers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-medium text-gray-600">No workers found matching your criteria.</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or location.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((worker) => (
              <Card key={worker._id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {worker.profileImage && worker.profileImage !== 'default.jpg' ? (
                        <img 
                          src={worker.profileImage.startsWith('/') ? `${VITE_BASE_URL}${worker.profileImage}` : worker.profileImage} 
                          alt={worker.user.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            if (!e.target.dataset.tried) {
                              e.target.dataset.tried = "true";
                              e.target.src = `https://ui-avatars.com/api/?name=${worker.user.name}&background=random`;
                            }
                          }}
                        />
                      ) : (
                        <User className="text-gray-400 w-8 h-8" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Link to={`/worker/${worker._id}`} className="font-bold text-lg text-gray-900 hover:text-primary transition-colors">
                          {worker.user.name}
                        </Link>
                        {worker.isVerified && (
                          <span className="bg-secondary/20 text-secondary-dark text-xs px-2 py-1 rounded-full font-medium">
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <p className="text-primary font-medium text-sm">{worker.category}</p>
                      
                      <div className="flex items-center mt-2 text-sm text-gray-600 gap-4">
                        <span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" /> {worker.averageRating || 'New'}</span>
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {worker.location.area}, {worker.location.city}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      {worker.isAvailable ? (
                        <span className="text-green-600 text-xs font-medium flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div> Available Now</span>
                      ) : (
                        <span className="text-gray-500 text-xs font-medium flex items-center"><div className="w-2 h-2 rounded-full bg-gray-400 mr-1.5"></div> Currently Busy</span>
                      )}
                    </div>
                    <Link to={`/worker/${worker._id}`} className="text-sm font-medium text-primary hover:text-primary-dark">
                      View Profile &rarr;
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
