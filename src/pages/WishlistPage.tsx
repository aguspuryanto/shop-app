import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { WishlistItem } from '../types';

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(storedWishlist);
  }, [user, navigate]);

  const wishlistedProducts = products.filter(product =>
    wishlist.some(item => item.userId === user?.id && item.productId === product.id)
  );

  const handleToggleWishlist = (productId: string) => {
    if (!user) return;

    const newWishlist = wishlist.filter(
      item => !(item.userId === user.id && item.productId === productId)
    );

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      
      {wishlistedProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={true}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
