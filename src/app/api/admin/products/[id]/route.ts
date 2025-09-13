import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-utils';
import { z } from 'zod';

const productUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().positive('Price must be positive').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  stock: z.number().int().min(0, 'Stock must be non-negative').optional(),
  inStock: z.boolean().optional(),
  image: z.string().nullable().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
});

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();
    
    console.warn('PUT request body:', body);
    
    // Validate input
    const validation = productUpdateSchema.safeParse(body);
    if (!validation.success) {
      console.warn('Validation failed:', validation.error.issues);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update inStock based on stock if stock is being updated
    if (data.stock !== undefined && data.inStock === undefined) {
      data.inStock = data.stock > 0;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data
    });

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Admin products PUT error:', error);
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Admin products DELETE error:', error);
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
