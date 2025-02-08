import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Share2, ShoppingCart } from 'lucide-react';
import { products } from '../data/products';
import { Product, WishlistItem, Review } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ImageSlider from '../components/ImageSlider';
import Reviews from '../components/Reviews';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (!foundProduct) {
      navigate('/');
      return;
    }
    setProduct(foundProduct);

    // Load wishlist
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(storedWishlist);

    // Load reviews
    const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const productReviews = storedReviews.filter((review: Review) => review.productId === id);
    setReviews(productReviews);
  }, [id, navigate]);

  const handleAddReview = (rating: number, comment: string) => {
    if (!user || !product) return;

    const newReview: Review = {
      id: Date.now().toString(),
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const updatedReviews = [...allReviews, newReview];
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    setReviews(prev => [...prev, newReview]);
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some(item => item.userId === user?.id && item.productId === productId);
  };

  const handleToggleWishlist = (productId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!product) return;

    setIsAddingToCart(true);
    addToCart(product.id);
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 safe-area-inset-top">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-4">
            <button onClick={handleShare} className="p-2 text-gray-600">
              <Share2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="pt-16">
        {/* Image Slider */}
        <ImageSlider images={product.images} />

        {/* Product Info */}
        <div className="px-4 py-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleToggleWishlist(product.id)}
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  isWishlisted(product.id)
                    ? 'bg-red-50 text-red-500'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Heart
                  className="h-5 w-5"
                  fill={isWishlisted(product.id) ? 'currentColor' : 'none'}
                />
              </button>
              <span className="text-2xl font-bold text-indigo-600">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900">Category</h2>
            <span className="mt-2 inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Reviews Section */}
          <Reviews
            productId={product.id}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto px-4">
          <button 
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium text-base
              ${isAddingToCart ? 'animate-pulse' : 'hover:bg-indigo-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              transition-all duration-200 ease-in-out transform hover:scale-[0.98]
              shadow-md`}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
