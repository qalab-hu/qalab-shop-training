import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-utils';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  inStock: z.boolean().optional(),
  image: z.string().nullable().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
});

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Admin products GET error:', error);
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

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    
    // Validate input
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
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
    
    // Set inStock based on stock if not provided
    if (data.inStock === undefined) {
      data.inStock = data.stock > 0;
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Admin products POST error:', error);
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
