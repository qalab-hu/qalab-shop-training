import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateRequest, createErrorResponse } from '@/lib/auth';

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of all orders
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create a new order
 *     description: Create a new order with the provided order data
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerInfo:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *               totals:
 *                 type: object
 *                 properties:
 *                   total:
 *                     type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orderId:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export async function GET(request: NextRequest) {
  // Validate authentication and headers
  const validation = await validateRequest(request);
  if (!validation.success) {
    return createErrorResponse(validation.error);
  }

  try {
    // Get the authenticated user from validation
    const user = validation.user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build query based on user role
    let whereClause = {};
    
    // If user is not admin, only show their own orders
    if (user.role !== 'ADMIN') {
      whereClause = { userId: user.id };
    }
    // Admin can see all orders (no where clause)

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Validate authentication and headers
  const validation = await validateRequest(request);
  if (!validation.success) {
    return createErrorResponse(validation.error);
  }

  try {
    const orderData = await request.json();
    
    // Get the authenticated user from validation
    const user = validation.user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Extract data from checkout format
    const totalAmount = orderData.totals?.total || orderData.totalAmount || 0;
    const customerInfo = orderData.shipping || orderData.customerInfo || {};
    const shippingInfo = orderData.shipping || {};
    const paymentInfo = orderData.payment || {};
    
    // Create order with items using Prisma transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          status: orderData.status || 'PENDING',
          totalAmount: totalAmount,
          customerInfo: {
            name: customerInfo.fullName || customerInfo.name || user.name,
            email: customerInfo.email || user.email,
            phone: customerInfo.phone || '',
            address: customerInfo.address || '',
            city: customerInfo.city || '',
            zipCode: customerInfo.zipCode || '',
            country: customerInfo.country || ''
          },
          shipping: {
            ...shippingInfo,
            payment: paymentInfo
          }
        }
      });

      // Create order items if provided
      if (orderData.items && orderData.items.length > 0) {
        await tx.orderItem.createMany({
          data: orderData.items.map((item: any) => ({
            orderId: newOrder.id,
            productId: item.product?.id || item.productId || item.id,
            quantity: item.quantity,
            price: item.product?.price || item.price
          }))
        });
      }

      // Return order with items
      return await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true
                }
              }
            }
          }
        }
      });
    });
    
    return NextResponse.json({
      success: true,
      orderId: order?.id,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process order' },
      { status: 500 }
    );
  }
}
