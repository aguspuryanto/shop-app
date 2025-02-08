import { Product } from '../types';
import { FakeStoreProduct } from '../services/api';

// Convert FakeStore product format to our app's format
export const adaptProduct = (fakeStoreProduct: FakeStoreProduct): Product => ({
  id: fakeStoreProduct.id.toString(),
  name: fakeStoreProduct.title,
  price: fakeStoreProduct.price,
  images: [fakeStoreProduct.image, fakeStoreProduct.image, fakeStoreProduct.image], // API only provides one image
  description: fakeStoreProduct.description,
  category: fakeStoreProduct.category,
});

// Map FakeStore categories to our app's categories
