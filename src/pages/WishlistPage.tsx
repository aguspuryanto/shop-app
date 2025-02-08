import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { WishlistItem, Product } from '../types';
import { fetchProducts } from '../services/api';
import { adaptProduct } from '../utils/productAdapter';

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadProducts = async () => {
      try {
        const fakeStoreProducts = await fetchProducts();
        const adaptedProducts = fakeStoreProducts.map(adaptProduct);
        setProducts(adaptedProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      
      {wishlistedProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
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
