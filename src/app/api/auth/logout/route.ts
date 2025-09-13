import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Clear the auth cookie
    await clearAuthCookie();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
