// Authentication and validation utilities for API endpoints
import { NextRequest } from 'next/server';
import { getCurrentUser } from './auth-utils';

export interface AuthValidationResult {
  success: boolean;
  user?: any;
  error?: {
    code: string;
    message: string;
    statusCode: number;
  };
}

/**
 * Validates JWT token authentication from cookie or Authorization header
 */
export async function validateJWTAuth(request: NextRequest): Promise<AuthValidationResult> {
  try {
    // Try to get user from cookie first (web app)
    const user = await getCurrentUser(request);
    
    if (user) {
      return { 
        success: true,
        user 
      };
    }

    // If no cookie, try Authorization header (API clients)
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Import verifyToken and prisma to validate token directly
      const { verifyToken } = await import('./auth-utils');
      const { prisma } = await import('./prisma');
      
      const payload = verifyToken(token);
      if (!payload) {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token.',
            statusCode: 401
          }
        };
      }

      // Get user from database
      const userFromToken = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      });

      if (userFromToken) {
        return { 
          success: true,
          user: userFromToken 
        };
      }
    }

    return {
      success: false,
      error: {
        code: 'MISSING_AUTH',
        message: 'Authentication required. Please login or provide Authorization header with Bearer token.',
        statusCode: 401
      }
    };
  } catch (error) {
    console.error('JWT validation error:', error);
    return {
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication error occurred.',
        statusCode: 401
      }
    };
  }
}

// Legacy API Key validation (for backward compatibility)
const VALID_API_KEYS = [
  'qalab-api-key-2024',
  'student-demo-key',
  'test-api-key-123'
];

/**
 * Validates API-Key header authentication (legacy support)
 */
export function validateApiKey(request: Request): AuthValidationResult {
  const apiKey = request.headers.get('X-API-Key');
  
  if (!apiKey) {
    return {
      success: false,
      error: {
        code: 'MISSING_API_KEY',
        message: 'API-Key header is required. Please include X-API-Key header with a valid API key.',
        statusCode: 401
      }
    };
  }

  if (!VALID_API_KEYS.includes(apiKey)) {
    return {
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key provided. Please check your X-API-Key header value.',
        statusCode: 401
      }
    };
  }

  return { success: true };
}

/**
 * Validates Content-Type header for POST/PUT/PATCH requests
 */
export function validateContentType(request: Request): AuthValidationResult {
  const method = request.method;
  
  // Only validate Content-Type for requests that should have a body
  if (!['POST', 'PUT', 'PATCH'].includes(method)) {
    return { success: true };
  }

  const contentType = request.headers.get('Content-Type');
  
  if (!contentType) {
    return {
      success: false,
      error: {
        code: 'MISSING_CONTENT_TYPE',
        message: 'Content-Type header is required for this request. Please set Content-Type to application/json.',
        statusCode: 400
      }
    };
  }

  if (!contentType.includes('application/json')) {
    return {
      success: false,
      error: {
        code: 'INVALID_CONTENT_TYPE',
        message: 'Invalid Content-Type. This endpoint only accepts application/json.',
        statusCode: 415
      }
    };
  }

  return { success: true };
}

/**
 * Comprehensive validation for API requests
 * Supports both JWT tokens (preferred) and API keys (legacy)
 */
export async function validateRequest(request: NextRequest): Promise<AuthValidationResult> {
  // Try JWT authentication first
  const jwtValidation = await validateJWTAuth(request);
  if (jwtValidation.success) {
    return jwtValidation;
  }

  // Fall back to legacy API key authentication
  const apiKeyValidation = validateApiKey(request);
  if (apiKeyValidation.success) {
    // For API key requests, also validate Content-Type if needed
    const contentTypeValidation = validateContentType(request);
    if (!contentTypeValidation.success) {
      return contentTypeValidation;
    }
    return apiKeyValidation;
  }

  // Return JWT error (more descriptive)
  return jwtValidation;
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(error: AuthValidationResult['error']) {
  if (!error) {
    throw new Error('Error object is required');
  }

  return new Response(JSON.stringify({
    success: false,
    error: {
      code: error.code,
      message: error.message
    },
    timestamp: new Date().toISOString()
  }), { 
    status: error.statusCode,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
