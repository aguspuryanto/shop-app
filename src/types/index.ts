export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: 'Software' | 'Ebook' | 'Courses' | 'Source Code' | 'Video';
}

export interface WishlistItem {
  userId: string;
  productId: string;
}

export interface CartItem {
  userId: string;
  productId: string;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
