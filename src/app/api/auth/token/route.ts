import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, signToken } from '@/lib/auth-utils';

/**
 * Generate or retrieve API access token for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Generate a new access token for API usage
    const accessToken = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return NextResponse.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        usage: {
          headerName: 'Authorization',
          headerValue: `Bearer ${accessToken}`,
          example: `curl -H "Authorization: Bearer ${accessToken}" http://localhost:3000/api/products`
        }
      }
    });
  } catch (error) {
    console.error('Error generating access token:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
