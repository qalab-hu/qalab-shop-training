import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Quantum Laptop 3000',
    description: 'A revolutionary laptop that runs on quantum computing principles. Perfect for developers who work in multiple dimensions.',
    price: 2999.99,
    image: '/images/quantum-laptop.jpg',
    category: 'Electronics',
    inStock: true,
    rating: 4.8,
    reviewCount: 127
  },
  {
    id: '2',
    name: 'Invisible Headphones',
    description: 'These headphones are so advanced, they\'re invisible! You won\'t even know you\'re wearing them. Sound quality is out of this world.',
    price: 199.99,
    image: '/images/invisible-headphones.jpg',
    category: 'Electronics',
    inStock: false,
    rating: 4.2,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Time-Travel Watch',
    description: 'Not just tells time, but lets you travel through it! Side effects may include temporal paradoxes and meeting your future self.',
    price: 9999.99,
    image: '/images/time-watch.jpg',
    category: 'Accessories',
    inStock: true,
    rating: 4.9,
    reviewCount: 42
  },
  {
    id: '4',
    name: 'Self-Watering Plant',
    description: 'This plant waters itself and gives motivational speeches. Perfect for those who can\'t keep plants alive.',
    price: 49.99,
    image: '/images/smart-plant.jpg',
    category: 'Home & Garden',
    inStock: true,
    rating: 4.5,
    reviewCount: 203
  },
  {
    id: '5',
    name: 'Floating Mouse',
    description: 'A computer mouse that floats in mid-air using anti-gravity technology. No more mouse pad needed!',
    price: 299.99,
    image: '/images/floating-mouse.jpg',
    category: 'Electronics',
    inStock: true,
    rating: 4.3,
    reviewCount: 156
  },
  {
    id: '6',
    name: 'Mind-Reading Keyboard',
    description: 'Types your thoughts before you even think them. May occasionally type your deepest secrets.',
    price: 599.99,
    image: '/images/mind-keyboard.jpg',
    category: 'Electronics',
    inStock: false,
    rating: 4.7,
    reviewCount: 78
  },
  {
    id: '7',
    name: 'Teleportation Shoes',
    description: 'Walk anywhere in the universe instantly. Shipping not included as these shoes deliver themselves.',
    price: 1299.99,
    image: '/images/teleport-shoes.jpg',
    category: 'Fashion',
    inStock: true,
    rating: 4.6,
    reviewCount: 91
  },
  {
    id: '8',
    name: 'Mood Ring Coffee Mug',
    description: 'Changes color based on your coffee\'s mood, not yours. Frequently reports coffee feeling anxious.',
    price: 24.99,
    image: '/images/mood-mug.jpg',
    category: 'Home & Garden',
    inStock: true,
    rating: 4.1,
    reviewCount: 312
  }
];

export const categories = [
  'All',
  'Software',
  'Hardware', 
  'Subscription',
  'Emergency Kit'
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getProducts(filters?: Partial<{
    category: string;
    priceRange: [number, number];
    inStock: boolean;
    minRating: number;
  }>): Promise<Product[]> {
    await delay(Math.random() * 1000 + 500); // 500-1500ms delay
    
    let filteredProducts = [...products];
    
    if (filters?.category && filters.category !== 'All') {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters?.priceRange) {
      const [min, max] = filters.priceRange;
      filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
    }
    
    if (filters?.inStock) {
      filteredProducts = filteredProducts.filter(p => p.inStock);
    }
    
    if (filters?.minRating !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.rating >= filters.minRating!);
    }
    
    return filteredProducts;
  },

  async getProduct(id: string): Promise<Product | null> {
    await delay(Math.random() * 500 + 200);
    return products.find(p => p.id === id) || null;
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: { id: string; email: string; name: string; isLoggedIn: boolean }; message?: string }> {
    await delay(1000);
    
    // Mock authentication - accept any email with password "password123"
    if (password === 'password123') {
      return {
        success: true,
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
          isLoggedIn: true
        }
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials. Try password: password123'
    };
  },

  async submitContact(data: Record<string, unknown>): Promise<{ success: boolean; message: string }> {
    await delay(1500);
    
    // Simulate random success/failure for testing
    const success = Math.random() > 0.2; // 80% success rate
    
    return {
      success,
      message: success 
        ? 'Thank you for your message! We\'ll get back to you soon.' 
        : 'Sorry, there was an error sending your message. Please try again.'
    };
  }
};
