import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import WelcomeBanner from '../components/WelcomeBanner';
import Categories from '../components/Categories';
import { Product, WishlistItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { fetchProducts } from '../services/api';
import { adaptProduct } from '../utils/productAdapter';

export default function HomePage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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
    if (user) {
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(storedWishlist);
    }
  }, [user]);

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

  const filteredProducts = products.filter(product => 
    selectedCategory === 'All' || product.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="px-4 py-4">
        <WelcomeBanner />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-4">
        <WelcomeBanner />
        <div className="text-center text-red-600 mt-8">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <WelcomeBanner />
      <Categories 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={isWishlisted(product.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No products found in this category.
        </p>
      )}
    </div>
  );
}
