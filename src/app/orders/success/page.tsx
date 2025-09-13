'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

interface OrderData {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  shipping: {
    fullName?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
    payment?: {
      cardNumber: string;
      cardHolder: string;
    };
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
  }>;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;
      
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const result = await response.json();
        
        if (result.success) {
          setOrderData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Tracking number copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The specified order does not exist.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successfully Placed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase! Order number: <strong>{orderData.id}</strong>
          </p>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <TruckIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Shipping</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Expected delivery:</p>
              <p className="font-medium text-gray-900">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-3">Recipient:</p>
              <p className="font-medium text-gray-900">
                {orderData.customerInfo.name}
              </p>
              <p className="text-sm text-gray-600">
                {orderData.customerInfo.address}<br />
                {orderData.customerInfo.city}, {orderData.customerInfo.country}
              </p>
            </div>
          </div>

          {/* Tracking Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <ClockIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Tracking</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Tracking number:</p>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900 font-mono text-sm">
                  QA{orderData.id.slice(-8).toUpperCase()}
                </p>
                <button
                  onClick={() => copyToClipboard(`QA${orderData.id.slice(-8).toUpperCase()}`)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Copy tracking number"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-600 mt-3">Status:</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {orderData.status}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="h-6 w-6 bg-blue-600 rounded mr-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Payment</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Payment method:</p>
              <p className="font-medium text-gray-900">Credit Card</p>
              <p className="text-gray-600 mt-3">Amount:</p>
              <p className="font-medium text-gray-900">${orderData.totalAmount}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                Successful
              </span>
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900">Confirmation email sent</h3>
              <p className="mt-1 text-blue-800">
                Order confirmation has been sent to <strong>{orderData.customerInfo.email}</strong>. 
                Please check your spam folder if you don&apos;t find the email.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/orders" className="flex-1">
            <Button variant="primary" className="w-full">
              My Orders
            </Button>
          </Link>
          <Button 
            variant="primary" 
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Link href="/products" className="flex-1">
            <Button variant="primary" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔔 Notifications</h4>
              <p className="text-sm text-gray-600">
                We&apos;ll send email notifications for all important steps: packaging, shipping, delivery.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📱 Tracking</h4>
              <p className="text-sm text-gray-600">
                You can check your package status anytime with the tracking number on the carrier&apos;s website.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🎁 Delivery</h4>
              <p className="text-sm text-gray-600">
                ID required for pickup. If not home, we&apos;ll attempt redelivery or delivery to pickup point.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">↩️ Returns</h4>
              <p className="text-sm text-gray-600">
                14-day return policy. Items must be in original condition and packaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
