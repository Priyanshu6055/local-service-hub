import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // Initialize auth state from local storage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  }); 
  const [lang, setLang] = useState('EN');

  const toggleLang = () => {
    setLang(lang === 'EN' ? 'HI' : 'EN');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                L
              </div>
              <span className="font-bold text-xl text-primary hidden sm:block">
                Local Service Hub
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleLang}
              className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {lang === 'EN' ? 'अ/A' : 'A/अ'}
            </button>
            
            <Link to="/search" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium transition-colors">
              Find Services
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center gap-1">
                  <User size={18} /> {user.name}
                </Link>
                {user.role === 'worker' && (
                  <Link to="/dashboard" className="text-primary hover:text-primary-dark font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-outline py-1.5 px-4 text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-primary font-medium hover:text-primary-dark px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 shadow-none">
                  Join as Worker
                </Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 z-40 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
          <button 
            onClick={toggleLang}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
          >
            Language: {lang}
          </button>
          <Link
            to="/search"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Find Services
          </Link>
          
          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              {user.role === 'worker' && (
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white mt-2"
                onClick={() => setIsOpen(false)}
              >
                Join as Worker
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
