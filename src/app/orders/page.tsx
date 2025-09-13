'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { 
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface Order {
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
    city?: string;
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
      image?: string;
    };
  }>;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-orange-100 text-orange-800',
    icon: ClockIcon
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-800',
    icon: TruckIcon
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'X-API-Key': 'qalab-api-key-2024'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track all your orders and their status here.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
              <Input
                placeholder="Search by order number or tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-400 bg-white px-3 py-2 text-sm text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option value="all">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBagIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {orders.length === 0 ? 'No orders yet' : 'No results found'}
            </h2>
            <p className="text-gray-600 mb-6">
              {orders.length === 0 
                ? 'Start shopping and you will see your orders here!'
                : 'Try different search criteria.'
              }
            </p>
            <Link href="/products">
              <Button size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || {
                label: order.status,
                color: 'bg-gray-100 text-gray-800',
                icon: DocumentDuplicateIcon
              };
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Rendelés #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Leadva: {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {order.totalAmount.toLocaleString()} Ft
                        </span>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      {/* Items */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Products</h4>
                        <div className="space-y-1">
                          {order.items && Array.isArray(order.items) && order.items.slice(0, 2).map((item, index) => (
                            <p key={`${order.id}-item-${index}-${item.id}`} className="text-sm text-gray-600">
                              {item.quantity}x {item.product.name}
                            </p>
                          ))}
                          {order.items && Array.isArray(order.items) && order.items.length > 2 && (
                            <p className="text-sm text-gray-500">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                          {(!order.items || !Array.isArray(order.items) || order.items.length === 0) && (
                            <p className="text-sm text-gray-500">
                              No items available
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Shipping */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Shipping</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {order.shipping ? (
                            <>
                              <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                              <p>{order.shipping.city}, {order.shipping.country}</p>
                            </>
                          ) : order.customerInfo ? (
                            <p>{order.customerInfo.firstName || order.customerInfo.name}</p>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Shipping information not available
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Status: {statusInfo.label}</p>
                          <p>Created: {formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="primary" size="sm" className="w-full sm:w-auto">
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </Link>
                      
                      {order.status === 'shipped' && (
                        <Button variant="outline" size="sm" className="w-full sm:w-auto text-gray-800 border-gray-400 hover:bg-gray-50">
                          <TruckIcon className="h-4 w-4 mr-2" />
                          Track Package
                        </Button>
                      )}
                      
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="w-full sm:w-auto text-gray-800 border-gray-400 hover:bg-gray-50">
                          Reorder
                        </Button>
                      )}
                      
                      {['confirmed', 'processing'].includes(order.status) && (
                        <Button variant="outline" size="sm" className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        {orders.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statisztikák</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {orders.length}
                </div>
                <div className="text-sm text-gray-600">Összes rendelés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </div>
                <div className="text-sm text-gray-600">Kézbesítve</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status)).length}
                </div>
                <div className="text-sm text-gray-600">Folyamatban</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()} Ft
                </div>
                <div className="text-sm text-gray-600">Összes költés</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
