// Shared order storage for the application
// In a real application, this would be replaced with a proper database

interface Order {
  id: string;
  orderDate?: string;
  [key: string]: unknown;
}

const orders: Order[] = [];
let orderCounter = 1000;

// Add some test data for development
const testOrder: Order = {
  id: 'ORD-1001',
  status: 'confirmed',
  orderDate: new Date().toISOString(),
  estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  trackingNumber: 'TRK123ABC456',
  createdAt: new Date().toISOString(),
  customerInfo: {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  },
  shipping: {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+36 30 123 4567',
    address: '1234 Test Street',
    city: 'Budapest',
    postalCode: '1234',
    country: 'Hungary'
  },
  payment: {
    cardNumber: '**** **** **** 1234',
    cardHolder: 'Test User'
  },
  totals: {
    subtotal: 85,
    shipping: 10,
    tax: 23,
    total: 118
  },
  items: [
    {
      id: '1',
      quantity: 2,
      product: {
        id: '1',
        name: 'Test Product 1',
        price: 25,
        category: 'Electronics'
      }
    },
    {
      id: '2',
      quantity: 1,
      product: {
        id: '2',
        name: 'Test Product 2',
        price: 50,
        category: 'Accessories'
      }
    }
  ]
};

orders.push(testOrder);

export function addOrder(orderData: Record<string, unknown>): Order {
  const orderId = `ORD-${orderCounter++}`;
  
  // Ensure items array exists 
  const items = (orderData.items as any[]) || [];
  
  // Ensure shipping object exists
  const customerInfo = (orderData.customerInfo as any) || {};
  const shippingAddress = (orderData.shippingAddress as any) || {};
  
  const shipping = (orderData.shipping as any) || {
    firstName: customerInfo.firstName || shippingAddress.firstName || 'Unknown',
    lastName: customerInfo.lastName || shippingAddress.lastName || 'Customer',
    email: customerInfo.email || shippingAddress.email || 'unknown@example.com',
    phone: customerInfo.phone || shippingAddress.phone || 'N/A',
    address: shippingAddress.street || shippingAddress.address || 'Unknown address',
    city: shippingAddress.city || 'Unknown',
    postalCode: shippingAddress.postalCode || 'N/A',
    country: shippingAddress.country || 'Unknown'
  };

  // Ensure payment object exists
  const payment = (orderData.payment as any) || {
    cardNumber: '**** **** **** ****',
    cardHolder: 'Unknown'
  };

  // Ensure totals object exists with all required fields
  const totals = (orderData.totals as any) || { total: 0 };
  const fullTotals = {
    subtotal: totals.subtotal || (totals.total ? Math.round(totals.total * 0.85) : 0),
    shipping: totals.shipping || (totals.total > 0 ? 10 : 0),
    tax: totals.tax || (totals.total ? Math.round(totals.total * 0.23) : 0),
    total: totals.total || 0
  };
  
  // Create order without duplicate properties
  const baseOrder = {
    id: orderId,
    status: 'confirmed',
    orderDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    items: items,
    shipping: shipping,
    payment: payment,
    totals: fullTotals
  };
  
  const order: Order = {
    ...orderData,
    ...baseOrder
  };
  
  orders.push(order);
  return order;
}

export function getOrder(orderId: string): Order | undefined {
  return orders.find(order => order.id === orderId);
}

export function getAllOrders(): Order[] {
  return orders.sort((a, b) => {
    const aDate = a.orderDate ? new Date(a.orderDate as string).getTime() : 0;
    const bDate = b.orderDate ? new Date(b.orderDate as string).getTime() : 0;
    return bDate - aDate;
  });
}

export function cancelOrder(orderId: string): Order | null {
  const order = getOrder(orderId);
  
  if (!order) {
    return null;
  }
  
  // Check if order can be cancelled (only pending or confirmed orders)
  if (order.status === 'cancelled' || order.status === 'shipped' || order.status === 'delivered') {
    throw new Error(`Order with status '${order.status}' cannot be cancelled`);
  }
  
  // Update order status to cancelled
  order.status = 'cancelled';
  order.cancelledAt = new Date().toISOString();
  
  return order;
}
