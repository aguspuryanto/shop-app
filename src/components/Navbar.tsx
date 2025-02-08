import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const { getCartItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-indigo-600">ShopVibe</span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Cart Icon */}
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
              <ShoppingCart className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
            
            {user && (
              <>
                <Link to="/wishlist" className="text-gray-600 hover:text-gray-900">
                  <Heart className="h-6 w-6" />
                </Link>
                <Link to="/account" className="text-gray-600 hover:text-gray-900">
                  <User className="h-6 w-6" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
