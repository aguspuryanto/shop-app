import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SearchFilter, { SortOption } from '../components/SearchFilter';
import { useAuth } from '../contexts/AuthContext';
import { WishlistItem, Product, Review } from '../types';
import { fetchProducts } from '../services/api';
import { adaptProduct } from '../utils/productAdapter';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>(
    JSON.parse(localStorage.getItem('wishlist') || '[]')
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    setReviews(storedReviews);
  }, []);

  const getAverageRating = (productId: string): number => {
    const productReviews = reviews.filter(review => review.productId === productId);
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / productReviews.length;
  };

  const sortProducts = (products: Product[]): Product[] => {
    switch (sortOption) {
      case 'cheaper':
        return [...products].sort((a, b) => a.price - b.price);
      case 'popular':
        return [...products].sort((a, b) => {
          const ratingA = getAverageRating(a.id);
          const ratingB = getAverageRating(b.id);
          return ratingB - ratingA;
        });
      default:
        return products;
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = sortProducts(filteredProducts);

  const handleToggleWishlist = (productId: string) => {
    if (!user) return;

    const newWishlist = [...wishlist];
    const existingIndex = newWishlist.findIndex(
      item => item.userId === user.id && item.productId === productId
    );

    if (existingIndex >= 0) {
      newWishlist.splice(existingIndex, 1);
    } else {
      newWishlist.push({ userId: user.id, productId });
    }

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some(item => item.userId === user?.id && item.productId === productId);
  };

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center max-w-md mx-auto mb-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <SearchFilter
          selectedSort={sortOption}
          onSortChange={setSortOption}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {sortedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={isWishlisted(product.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No products found matching your search.
        </p>
      )}
    </div>
  );
}
