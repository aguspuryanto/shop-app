import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, User, House } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show bottom nav on login/signup pages
  if (['/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-40">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            location.pathname === '/' ? 'text-indigo-600' : 'text-gray-500'
          }`}
        >
          <House className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link 
          to="/search" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            location.pathname === '/search' ? 'text-indigo-600' : 'text-gray-500'
          }`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>

        {user && (
          <Link 
            to="/wishlist" 
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              location.pathname === '/wishlist' ? 'text-indigo-600' : 'text-gray-500'
            }`}
          >
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Wishlist</span>
          </Link>
        )}

        <Link 
          to={user ? '/account' : '/login'} 
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            location.pathname === '/account' ? 'text-indigo-600' : 'text-gray-500'
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">{user ? 'Account' : 'Login'}</span>
        </Link>
      </div>
    </nav>
  );
}
