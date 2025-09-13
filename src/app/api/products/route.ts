import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all available products with optional filtering
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Successfully retrieved products
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
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const inStock = searchParams.get('inStock') === 'true';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const priceMin = parseFloat(searchParams.get('priceMin') || '0');
    const priceMax = parseFloat(searchParams.get('priceMax') || '999999');

    // Build Prisma where clause for filtering
    let whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category && category !== 'All') {
      whereClause.category = category;
    }
    
    if (inStock) {
      whereClause.inStock = true;
    }

    if (minRating > 0) {
      whereClause.rating = { gte: minRating };
    }

    if (priceMin > 0 || priceMax < 999999) {
      whereClause.price = {};
      if (priceMin > 0) {
        whereClause.price.gte = priceMin;
      }
      if (priceMax < 999999) {
        whereClause.price.lte = priceMax;
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}
