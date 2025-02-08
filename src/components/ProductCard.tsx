import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export default function ProductCard({ product, isWishlisted, onToggleWishlist }: ProductCardProps) {
  const { user } = useAuth();

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden no-select">
        <div className="relative pb-[100%]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            {user && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleWishlist(product.id);
                }}
                className="text-gray-400 hover:text-red-500 p-2 -mr-2 -mt-2"
              >
                <Heart
                  className="h-5 w-5"
                  fill={isWishlisted ? 'currentColor' : 'none'}
                />
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <p className="mt-2 text-base font-semibold">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
