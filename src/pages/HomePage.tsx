import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import WelcomeBanner from '../components/WelcomeBanner';
import Categories, { CategoryType } from '../components/Categories';
import { products } from '../data/products';
import { useAuth } from '../contexts/AuthContext';
import { WishlistItem } from '../types';

export default function HomePage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

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
