'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { useCart } from '@/contexts/CartContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn: propIsLoggedIn = false,
  userName: propUserName
}) => {
  const { getCartItemsCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const router = useRouter();
  const pathname = usePathname();
  const cartItemCount = getCartItemsCount();

  useEffect(() => {
    checkAuthStatus();
  }, [pathname]); // Re-check auth status when route changes

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsLoggedIn(false);
      // Trigger a custom auth change event
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600" aria-label="QALab Shop homepage">
              QALab Shop
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Products
            </Link>
            {isLoggedIn && user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Admin
              </Link>
            )}
            <Link href="/orders" className="text-gray-700 hover:text-blue-600 transition-colors">
              Orders
            </Link>
            <Link href="/docs" className="text-gray-700 hover:text-blue-600 transition-colors">
              API Docs
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                  {user.role === 'ADMIN' && (
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="text-black border-gray-300 hover:bg-gray-50">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-black border-gray-300 hover:bg-gray-50" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )}
            
            <Link href="/cart" className="relative" aria-label={`Shopping cart with ${cartItemCount} items`}>
              <ShoppingCartIcon className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors" />
              {cartItemCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  aria-label={`${cartItemCount} items in cart`}
                >
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-blue-600"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden" role="navigation" aria-label="Mobile navigation">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              {isLoggedIn && user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/orders"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/docs"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                API Docs
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="border-t pt-4 mt-4">
                {isLoggedIn && user ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2 flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                      {user.role === 'ADMIN' && (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="px-3 space-y-2">
                      <Link
                        href="/profile"
                        className="block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button variant="outline" size="sm" className="w-full text-black border-gray-300 hover:bg-gray-50">
                          Profile
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-black border-gray-300 hover:bg-gray-50" 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block px-3 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                )}
                
                <Link
                  href="/cart"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={`Shopping cart with ${cartItemCount} items`}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Cart ({cartItemCount})
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
