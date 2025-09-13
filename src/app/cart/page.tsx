'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingCartIcon, 
  TrashIcon, 
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save20') {
      setPromoApplied(true);
    }
  };

  const subtotal = getCartTotal();
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const handleCheckout = () => {
    // Navigate to checkout page instead of clearing cart
    window.location.href = '/checkout';
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingCartIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some impossible products to get started!</p>
            <Link href="/products">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/products" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
              </div>
              
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingCartIcon className="h-8 w-8 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Category: {item.product.category}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ${item.product.price.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={item.quantity <= 1 ? "text-gray-400 border-gray-300" : "text-gray-800 border-gray-400 hover:bg-gray-50"}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center text-gray-800 border-gray-400"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-800 border-gray-400 hover:bg-gray-50"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        Subtotal: ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                  />
                  <Button
                    variant="primary"
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode}
                  >
                    {promoApplied ? <CheckIcon className="h-4 w-4" /> : 'Apply'}
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-sm text-green-600 mt-1">
                    Promo code applied! 20% discount
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Try: SAVE20 for 20% off
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (20%)</span>
                    <span>-${discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              {/* Additional Info */}
              <div className="mt-6 text-xs text-gray-600 space-y-1">
                <p>• Free shipping on orders over $100</p>
                <p>• Secure payment processing</p>
                <p>• 30-day return policy</p>
              </div>

              {/* Testing Info */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-xs font-semibold text-blue-800 mb-2">
                  Testing Elements:
                </h4>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>• Quantity controls</p>
                  <p>• Remove items</p>
                  <p>• Promo code application</p>
                  <p>• Price calculations</p>
                  <p>• Checkout process</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
