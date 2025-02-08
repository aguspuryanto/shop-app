import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Filter only current user's items
        const userCart = parsedCart.filter((item: CartItem) => item.userId === user.id);
        setCartItems(userCart);
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (productId: string) => {
    if (!user) return;

    const newCart = [...cartItems];
    const existingItem = newCart.find(
      item => item.userId === user.id && item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newCart.push({
        userId: user.id,
        productId,
        quantity: 1
      });
    }

    setCartItems(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    if (!user) return;

    const newCart = cartItems.filter(
      item => !(item.userId === user.id && item.productId === productId)
    );
    setCartItems(newCart);
    saveCart(newCart);
  };

  const getCartItemCount = () => {
    if (!user) return 0;
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
