import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateRequest, createErrorResponse } from '@/lib/auth';

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   post:
 *     summary: Cancel order
 *     description: Cancel an order by its ID. Only orders in pending status can be cancelled.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID to cancel
 *     responses:
 *       200:
 *         description: Order successfully cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: "Order cancelled successfully"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Order cannot be cancelled (e.g., already cancelled or shipped)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

interface OrderWithStatus {
  id: string;
  status?: string;
  [key: string]: unknown;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate authentication and headers
  const validation = await validateRequest(request);
  if (!validation.success) {
    return createErrorResponse(validation.error);
  }

  try {
    const { id: orderId } = await params;

    console.warn('Cancel order request for:', orderId);

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Keressük meg a rendelést
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
      }
    });
    
    console.warn('Found order:', order);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Ellenőrizzük, hogy lemondható-e a rendelés
    if (!['PENDING', 'PROCESSING'].includes(order.status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot cancel order with status: ${order.status}. Only pending and processing orders can be cancelled.` 
        },
        { status: 400 }
      );
    }

    // Frissítjük a rendelés állapotát
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      },
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
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
