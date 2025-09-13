'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'HU', label: 'Hungary' },
];

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US'
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  const [billingAddressSame, setBillingAddressSame] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Validation functions
  const validateShipping = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!shippingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(shippingData.email)) newErrors.email = 'Please enter a valid email';
    if (!shippingData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingData.address.trim()) newErrors.address = 'Address is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    if (!shippingData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Dummy card validation
    if (!paymentData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentData.cardNumber.replace(/\s/g, '') !== '4111111111111111') {
      newErrors.cardNumber = 'Test card: 4111 1111 1111 1111';
    }
    
    if (!paymentData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Format: MM/YY';
    }
    
    if (!paymentData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentData.cvv !== '123') {
      newErrors.cvv = 'Test CVV: 123';
    }
    
    if (!paymentData.cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required';
    if (!acceptTerms) newErrors.terms = 'You must accept the Terms and Conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submissions
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setCurrentStep(2);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setIsProcessing(true);
    
    try {
      // Simulate API call
      const orderData = {
        items: cartItems,
        shipping: shippingData,
        payment: {
          ...paymentData,
          cardNumber: '**** **** **** 1111' // Mask card number
        },
        totals: {
          subtotal,
          shipping,
          tax,
          total
        },
        orderDate: new Date().toISOString()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        clearCart();
        router.push(`/orders/success?orderId=${result.orderId}`);
      } else {
        throw new Error(result.message || 'Payment error occurred');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ payment: 'Payment error occurred. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number input
  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setPaymentData({ ...paymentData, cardNumber: formatted });
  };

  // Format expiry date input
  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      setPaymentData({ ...paymentData, expiryDate: formatted });
    } else {
      setPaymentData({ ...paymentData, expiryDate: cleaned });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Empty Cart</h2>
          <p className="text-gray-700 mb-4">Please add items to your cart to proceed with checkout.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 1 ? <CheckCircleIcon className="h-5 w-5" /> : '1'}
              </div>
              <span className="ml-2 font-medium text-gray-800">Shipping Details</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium text-gray-800">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 ? (
              /* Shipping Form */
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        label="First Name"
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                        error={errors.firstName}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Last Name"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                        error={errors.lastName}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        type="email"
                        label="Email Address"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        error={errors.email}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        label="Phone Number"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        error={errors.phone}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Address"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      error={errors.address}
                      placeholder="Street address, apartment, suite, etc."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Input
                        label="City"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        error={errors.city}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Postal Code"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                        error={errors.postalCode}
                        required
                      />
                    </div>
                    <div>
                      <Select
                        label="Country"
                        value={shippingData.country}
                        onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                        options={countries}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              /* Payment Form */
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <CreditCardIcon className="h-6 w-6 text-gray-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                </div>

                {/* Test Card Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">Test Payment Information</span>
                  </div>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Card Number: <strong>4111 1111 1111 1111</strong></p>
                    <p>Expiry: <strong>Any future date (e.g. 12/25)</strong></p>
                    <p>CVV: <strong>123</strong></p>
                  </div>
                </div>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <Input
                      label="Cardholder Name"
                      value={paymentData.cardHolder}
                      onChange={(e) => setPaymentData({ ...paymentData, cardHolder: e.target.value })}
                      error={errors.cardHolder}
                      placeholder="As shown on card"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      label="Card Number"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      error={errors.cardNumber}
                      placeholder="4111 1111 1111 1111"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Input
                        label="Expiry Date"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        error={errors.expiryDate}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="CVV"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })}
                        error={errors.cvv}
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <Checkbox
                      label="Billing address same as shipping address"
                      checked={billingAddressSame}
                      onChange={(e) => setBillingAddressSame(e.target.checked)}
                    />
                  </div>

                  <div>
                    <Checkbox
                      label="I accept the Terms and Conditions and Privacy Policy"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      error={errors.terms}
                      required
                    />
                  </div>

                  {errors.payment && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">{errors.payment}</p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1"
                      size="lg"
                    >
                      {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                                            <p className="text-sm text-gray-600">${item.product.price}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {(item.product.price * item.quantity).toLocaleString()} Ft
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-600">{subtotal.toLocaleString()} Ft</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-600">{shipping === 0 ? 'Ingyenes' : `${shipping.toLocaleString()} Ft`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (27%):</span>
                  <span className="text-gray-600">{tax.toLocaleString()} Ft</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-gray-800">{total.toLocaleString()} Ft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
