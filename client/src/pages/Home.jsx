import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Zap, Wrench, Zap as ZapIcon, Droplets } from 'lucide-react';
import Button from '../components/Button';
import Card, { CardContent } from '../components/Card';

const categories = [
  { name: 'Plumber', icon: <Droplets className="w-8 h-8 text-blue-500 mb-2" />, color: 'bg-blue-50 hover:bg-blue-100' },
  { name: 'Electrician', icon: <ZapIcon className="w-8 h-8 text-yellow-500 mb-2" />, color: 'bg-yellow-50 hover:bg-yellow-100' },
  { name: 'Carpenter', icon: <Wrench className="w-8 h-8 text-orange-500 mb-2" />, color: 'bg-orange-50 hover:bg-orange-100' },
  { name: 'Painter', icon: <div className="w-8 h-8 text-primary mb-2">🎨</div>, color: 'bg-purple-50 hover:bg-purple-100' },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [urgent, setUrgent] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('category', searchTerm);
    if (location) params.append('city', location);
    if (urgent) params.append('isUrgent', 'true');
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 px-4 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          Find Trusted <span className="text-primary">Local Workers</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect immediately with plumbers, electricians, carpenters and more in your city.
        </p>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto bg-white p-3 md:p-4 rounded-2xl md:rounded-full shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 flex items-center px-4 w-full">
            <Search className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="What service do you need?" 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-gray-200"></div>
          <div className="flex-1 flex items-center px-4 w-full border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
            <MapPin className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="City or Area" 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <Button onClick={handleSearch} className="w-full md:w-auto rounded-xl md:rounded-full py-3 md:py-4 px-8 shadow-primary/30">
            Search
          </Button>
        </div>

        {/* Urgent Mode Toggle */}
        <div className="mt-8 flex justify-center items-center gap-3">
          <label className="flex items-center cursor-pointer bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200 hover:border-red-200 transition-colors">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={urgent} onChange={() => setUrgent(!urgent)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${urgent ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${urgent ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 flex items-center gap-1.5 font-medium text-gray-700">
              <Zap className={`w-4 h-4 ${urgent ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              Need service within 1 hour
            </div>
          </label>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex justify-between items-end">
          Browse by Category
          <span className="text-sm text-primary font-medium cursor-pointer hover:underline">View All</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <Card key={idx} onClick={() => { setSearchTerm(cat.name); handleSearch({preventDefault: () => {}}); }} className={`${cat.color} border-none`}>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                {cat.icon}
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features/Trust Section */}
      <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Why trust <span className="text-primary">Local Service Hub</span>?</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-dark mt-0.5 mr-3">✓</div>
              <p className="text-gray-600"><strong className="text-gray-800">Verified Workers:</strong> Only registered and checked professionals.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-dark mt-0.5 mr-3">✓</div>
              <p className="text-gray-600"><strong className="text-gray-800">Transparent Ratings:</strong> Real reviews from actual customers.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-dark mt-0.5 mr-3">✓</div>
              <p className="text-gray-600"><strong className="text-gray-800">Hyperlocal Matching:</strong> Find help exactly when and where you need it.</p>
            </li>
          </ul>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-sm aspect-square bg-gradient-to-tr from-primary to-secondary/80 rounded-full opacity-20 relative blur-3xl"></div>
          {/* A cool illustrative element or image would go here in production */}
        </div>
      </section>
    </div>
  );
};

export default Home;
