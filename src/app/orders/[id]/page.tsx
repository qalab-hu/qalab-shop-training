'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

interface OrderDetails {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  customerInfo: {
    name?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  shipping?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      price: number;
      category?: string;
      image?: string;
    };
  }>;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-orange-100 text-orange-800',
    icon: ClockIcon,
    description: 'Your order has been received and is waiting to be processed.'
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon,
    description: 'We are assembling and packaging your order.'
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-800',
    icon: TruckIcon,
    description: 'Your package is on its way to you.'
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
    description: 'Your package has been successfully delivered.'
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon,
    description: 'Your order has been cancelled.'
  }
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id as string);
    }
  }, [params.id]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'X-API-Key': 'qalab-api-key-2024'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setOrder(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    // Böngésző dialog ablak megjelenítése - Playwright dialog kezeléshez
    const confirmed = window.confirm(
      `Are you sure you want to cancel order #${order.id}?\n\nThis action cannot be undone. Your payment will be refunded within 3-5 business days.`
    );

    if (confirmed) {
      try {
        // API hívás a rendelés lemondásához
        const response = await fetch(`/api/orders/${order.id}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'qalab-api-key-2024'
          },
        });

        const result = await response.json();

        if (result.success) {
          // Frissítjük a rendelés állapotát
          setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
          alert('Order cancelled successfully! You will receive a confirmation email shortly.');
        } else {
          alert('Failed to cancel order: ' + (result.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Failed to cancel order:', error);
        alert('Failed to cancel order. Please try again or contact customer service.');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-4">The specified order does not exist or is not available.</p>
          <Link href="/orders">
            <Button>Back to orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || {
    label: order.status,
    color: 'bg-gray-100 text-gray-800',
    icon: DocumentDuplicateIcon,
    description: 'Order status information not available.'
  };
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600">Placed: {formatDate(order.createdAt)}</p>
            </div>
            <Button
              variant="primary"
              onClick={handlePrint}
              className="mt-4 sm:mt-0"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${statusInfo.color.replace('text-', 'bg-').replace('-800', '-100')} mr-4`}>
              <StatusIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{statusInfo.label}</h2>
              <p className="text-gray-600">{statusInfo.description}</p>
            </div>
          </div>
          
                    {/* Status Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <StatusIcon className="h-6 w-6 text-gray-400" />
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                <p className="text-sm text-gray-600 mt-1">{statusInfo.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ordered Products</h3>
              <div className="space-y-4">
                {order.items && Array.isArray(order.items) ? (
                  order.items.map((item, index) => (
                    <div key={`item-${index}-${item.id}`} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.category || 'Unknown Category'}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {(item.price * item.quantity).toLocaleString()} Ft
                        </p>
                        <p className="text-sm text-gray-600">
                          {(item.product?.price || item.price || 0).toLocaleString()} Ft / pc
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items found for this order</p>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <div className="text-gray-600 space-y-1">
                    {order.shipping ? (
                      <>
                        <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                        <p>{order.shipping.address}</p>
                        <p>{order.shipping.postalCode} {order.shipping.city}</p>
                        <p>{order.shipping.country}</p>
                      </>
                    ) : (
                      <p className="text-gray-500">Shipping information not available</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                  <div className="text-gray-600 space-y-1">
                    {order.shipping ? (
                      <>
                        <p>{order.shipping.email}</p>
                        <p>{order.shipping.phone}</p>
                      </>
                    ) : (
                      <p className="text-gray-500">Contact information not available</p>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2 mt-4">Order Date</h4>
                  <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment method:</span>
                  <span className="font-medium text-gray-600">Credit Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Successful
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-600">{(order.totalAmount * 0.7874).toLocaleString()} Ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (27%):</span>
                  <span className="text-gray-600">{(order.totalAmount * 0.2126).toLocaleString()} Ft</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-gray-800">{order.totalAmount.toLocaleString()} Ft</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                {order.status === 'shipped' && (
                  <Button className="w-full" variant="primary">
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Track Package
                  </Button>
                )}
                
                {order.status === 'delivered' && (
                  <Button className="w-full" variant="primary">
                    Reorder
                  </Button>
                )}
                
                <Button variant="outline" className="w-full text-gray-800 border-gray-400 hover:bg-gray-50">
                  Customer Service
                </Button>
                
                {['confirmed', 'processing'].includes(order.status) && (
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    onClick={handleCancelOrder}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
