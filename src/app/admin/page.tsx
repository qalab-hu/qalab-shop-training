'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  inStock: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    inStock: true,
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    checkAuth();
    loadProducts();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.user?.role !== 'ADMIN') {
          router.push('/login');
          return;
        }
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const result = await response.json();
        // Handle the {success: true, data: products} format
        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          setProducts([]);
        }
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        return result.imageUrl;
      } else {
        setMessage(result.error || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      setMessage('Error uploading image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      // Upload image if a new file is selected
      let imageUrl = productForm.image;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          return; // Stop if image upload failed
        }
      }

      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const requestData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock) || 0,
        image: imageUrl || null // Convert empty string to null
      };

      console.log('Sending request:', { method, url, data: requestData });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const responseData = await response.json();
      console.log('Response:', { status: response.status, data: responseData });

      if (response.ok) {
        setMessage(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          inStock: true,
          image: ''
        });
        setImageFile(null);
        setImagePreview(null);
        loadProducts();
      } else {
        setMessage(responseData.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      inStock: product.inStock,
      image: product.image || ''
    });
    setImageFile(null);
    setImagePreview(product.image || null);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Product deleted successfully!');
        loadProducts();
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to delete product');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/products')}
                variant="outline"
                className="text-sm text-black border-gray-300 hover:bg-gray-50"
              >
                View Store
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div 
            className={`mb-6 px-4 py-3 rounded border ${
              message.includes('successfully') || message.includes('Success')
                ? 'bg-green-100 border-green-400 text-green-700' 
                : 'bg-red-100 border-red-400 text-red-700'
            }`}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === 'products' ? 'page' : undefined}
            >
              Products ({products.length})
            </button>
          </nav>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Product Management</h2>
              <Button
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    stock: '',
                    inStock: true,
                    image: ''
                  });
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Add New Product
              </Button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name
                        </label>
                        <Input
                          id="product-name"
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          className="w-full"
                          placeholder="Enter product name"
                        />
                      </div>

                      <div>
                        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <Textarea
                          id="product-description"
                          required
                          value={productForm.description}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProductForm({...productForm, description: e.target.value})}
                          className="w-full"
                          placeholder="Enter product description"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
                          Price ($)
                        </label>
                        <Input
                          id="product-price"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          className="w-full"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Quantity
                        </label>
                        <Input
                          id="product-stock"
                          type="number"
                          min="0"
                          required
                          value={productForm.stock}
                          onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                          className="w-full"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <Input
                          id="product-category"
                          type="text"
                          required
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          className="w-full"
                          placeholder="e.g., Electronics, Books, Clothing"
                        />
                      </div>

                      <div>
                        <label htmlFor="product-image" className="block text-sm font-medium text-gray-700 mb-1">
                          Product Image
                        </label>
                        
                        {/* Current image preview */}
                        {imagePreview && (
                          <div className="mb-3">
                            <img 
                              src={imagePreview} 
                              alt="Product preview" 
                              className="w-32 h-32 object-cover rounded-md border border-gray-300"
                            />
                          </div>
                        )}
                        
                        {/* File input */}
                        <input
                          id="product-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, WebP up to 5MB
                        </p>
                        
                        {/* URL input as fallback */}
                        <div className="mt-3">
                          <label htmlFor="product-image-url" className="block text-xs text-gray-600 mb-1">
                            Or enter image URL:
                          </label>
                          <Input
                            id="product-image-url"
                            type="url"
                            value={productForm.image}
                            onChange={(e) => {
                              setProductForm({...productForm, image: e.target.value});
                              if (e.target.value) {
                                setImagePreview(e.target.value);
                                setImageFile(null);
                              }
                            }}
                            className="w-full"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Checkbox
                          id="product-in-stock"
                          checked={productForm.inStock}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductForm({...productForm, inStock: e.target.checked})}
                        />
                        <label htmlFor="product-in-stock" className="ml-2 text-sm text-gray-700">
                          In Stock
                        </label>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="text-black border-gray-300 hover:bg-gray-50"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                            // Reset image upload states
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                          {editingProduct ? 'Update Product' : 'Create Product'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {Array.isArray(products) && products.map((product) => (
                  <li key={product.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {product.name}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.inStock 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-900 mt-1">{product.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          ${product.price.toFixed(2)} • {product.category}
                        </p>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <Button
                          onClick={() => handleEditProduct(product)}
                          variant="outline"
                          size="sm"
                          className="text-black border-gray-300 hover:bg-gray-50"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {(!Array.isArray(products) || products.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {isLoading ? 'Loading products...' : 'No products found. Create your first product!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
