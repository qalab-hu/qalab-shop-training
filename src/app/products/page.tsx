'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ShoppingBagIcon, StarIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Product } from '@/types';
import { categories } from '@/lib/data';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState('0');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const categoryOptions = [{ value: 'All', label: 'All Categories' }, ...categories.slice(1).map(cat => ({ value: cat, label: cat }))];
  
  const ratingOptions = [
    { value: '0', label: 'All Ratings' },
    { value: '3', label: '3+ Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '4.5', label: '4.5+ Stars' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating: Low to High' },
    { value: 'rating-desc', label: 'Rating: High to Low' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, inStockOnly, minRating, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (inStockOnly) params.append('inStock', 'true');
      if (minRating !== '0') params.append('minRating', minRating);
      if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString());
      if (priceRange[1] < 2000) params.append('priceMax', priceRange[1].toString());

      const response = await fetch(`/api/products?${params.toString()}`, {
        headers: {
          'X-API-Key': 'qalab-api-key-2024'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return a.rating - b.rating;
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600">
            Discover our impossible collection of futuristic products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64" aria-label="Product filters">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                  aria-controls="product-filters"
                  aria-label="Toggle filters"
                >
                  <FunnelIcon className="h-4 w-4" />
                </Button>
              </div>

              <div id="product-filters" className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <h2 className="text-lg font-semibold text-gray-800 hidden lg:block">Filters</h2>
                
                <Select
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={categoryOptions}
                />

                <RadioGroup
                  name="rating"
                  label="Minimum Rating"
                  options={ratingOptions}
                  value={minRating}
                  onChange={setMinRating}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Minimum: ${priceRange[0]}</label>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const minVal = Number(e.target.value);
                          setPriceRange([minVal, Math.max(minVal, priceRange[1])]);
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Maximum: ${priceRange[1]}</label>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const maxVal = Number(e.target.value);
                          setPriceRange([Math.min(priceRange[0], maxVal), maxVal]);
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <Checkbox
                  id="inStock"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  label="In Stock Only"
                />

                <Button
                  variant="outline"
                  className="w-full text-gray-800 border-gray-400 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedCategory('All');
                    setInStockOnly(false);
                    setMinRating('0');
                    setPriceRange([0, 2000]);
                    setSearchTerm('');
                    setSortBy('name');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1" aria-label="Product listings">
            {/* Search and Sort */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      label="Search"
                      className="pl-10"
                      aria-label="Search products"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 bottom-3 h-4 w-4 text-gray-600 pointer-events-none" aria-hidden="true" />
                  </div>
                </div>
                <Select
                  label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={sortOptions}
                  className="sm:w-48"
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <p className="text-sm text-gray-600" aria-live="polite" aria-atomic="true">
                {loading ? 'Loading...' : `${filteredAndSortedProducts.length} products found`}
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading products">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse" aria-hidden="true">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <ShoppingBagIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Products">
                {filteredAndSortedProducts.map((product) => (
                  <article key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow" role="listitem">
                    <div className="h-48 bg-gray-200 overflow-hidden" aria-hidden="true">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <ShoppingBagIcon className="h-16 w-16 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded" aria-label={`Category: ${product.category}`}>
                          {product.category}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          product.inStock 
                            ? 'text-green-600 bg-green-50' 
                            : 'text-red-600 bg-red-50'
                        }`} aria-label={`Stock status: ${product.inStock ? 'In Stock' : 'Out of Stock'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center mb-3" aria-label={`Rating: ${product.rating} out of 5 stars, ${product.reviewCount} reviews`}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            aria-hidden="true"
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2" aria-hidden="true">
                          ({product.rating}) · {product.reviewCount} reviews
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-blue-600" aria-label={`Price: $${product.price.toLocaleString()}`}>
                          ${product.price.toLocaleString()}
                        </p>
                        <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                          <Button size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
