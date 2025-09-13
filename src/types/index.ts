export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletter: boolean;
  contactMethod: 'email' | 'phone' | 'post';
  priority: 'low' | 'medium' | 'high';
}

export interface FilterOptions {
  category: string[];
  priceRange: [number, number];
  inStock: boolean;
  minRating: number;
}
