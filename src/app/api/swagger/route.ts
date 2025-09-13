import { NextResponse } from 'next/server';

// Static OpenAPI specification
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'QALab Learning App API',
    version: '1.0.0',
    description: 'API documentation for the QALab Learning App e-commerce platform. All endpoints require authentication via X-API-Key header.',
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-url.com' 
        : 'http://localhost:3000',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API Key required for all endpoints. Use one of: qalab-api-key-2024, student-demo-key, test-api-key-123'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: 'MISSING_API_KEY'
              },
              message: {
                type: 'string',
                example: 'API-Key header is required. Please include X-API-Key header with a valid API key.'
              }
            }
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T12:00:00.000Z'
          }
        }
      },
      Product: {
        type: 'object',
        required: ['id', 'name', 'price', 'category'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique product identifier',
            example: '1'
          },
          name: {
            type: 'string',
            description: 'Product name',
            example: 'Wireless Headphones'
          },
          price: {
            type: 'number',
            description: 'Product price in EUR',
            example: 99.99
          },
          category: {
            type: 'string',
            description: 'Product category',
            example: 'Electronics'
          },
          description: {
            type: 'string',
            description: 'Product description',
            example: 'High-quality wireless headphones with noise cancellation'
          },
          image: {
            type: 'string',
            description: 'Product image URL',
            example: '/images/headphones.jpg'
          },
          stock: {
            type: 'integer',
            description: 'Available stock quantity',
            example: 50
          }
        }
      },
      Order: {
        type: 'object',
        required: ['id', 'status', 'orderDate'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique order identifier',
            example: 'ORD-1001'
          },
          status: {
            type: 'string',
            description: 'Order status',
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            example: 'confirmed'
          },
          orderDate: {
            type: 'string',
            format: 'date-time',
            description: 'Order creation date',
            example: '2024-01-15T10:30:00Z'
          },
          customerInfo: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
                example: 'John'
              },
              lastName: {
                type: 'string',
                example: 'Doe'
              },
              email: {
                type: 'string',
                format: 'email',
                example: 'john.doe@example.com'
              }
            }
          },
          items: {
            type: 'array',
            description: 'Order items',
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                  example: '1'
                },
                name: {
                  type: 'string',
                  example: 'Wireless Headphones'
                },
                quantity: {
                  type: 'integer',
                  example: 2
                },
                price: {
                  type: 'number',
                  example: 99.99
                }
              }
            }
          },
          totals: {
            type: 'object',
            properties: {
              subtotal: {
                type: 'number',
                example: 199.98
              },
              tax: {
                type: 'number',
                example: 20.00
              },
              shipping: {
                type: 'number',
                example: 5.99
              },
              total: {
                type: 'number',
                example: 225.97
              }
            }
          }
        }
      }
    }
  },
  security: [
    {
      ApiKeyAuth: []
    }
  ],
  paths: {
    '/api/products': {
      get: {
        summary: 'Get all products',
        description: 'Retrieve a list of all products with optional filtering',
        tags: ['Products'],
        parameters: [
          {
            in: 'query',
            name: 'category',
            schema: { type: 'string' },
            description: 'Filter products by category'
          },
          {
            in: 'query',
            name: 'minPrice',
            schema: { type: 'number' },
            description: 'Filter products with minimum price'
          },
          {
            in: 'query',
            name: 'maxPrice',
            schema: { type: 'number' },
            description: 'Filter products with maximum price'
          }
        ],
        responses: {
          200: {
            description: 'Successfully retrieved products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Authentication failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  missingApiKey: {
                    summary: 'Missing API Key',
                    value: {
                      success: false,
                      error: {
                        code: 'MISSING_API_KEY',
                        message: 'API-Key header is required. Please include X-API-Key header with a valid API key.'
                      },
                      timestamp: '2024-01-01T12:00:00.000Z'
                    }
                  },
                  invalidApiKey: {
                    summary: 'Invalid API Key',
                    value: {
                      success: false,
                      error: {
                        code: 'INVALID_API_KEY',
                        message: 'Invalid API key provided. Please check your X-API-Key header value.'
                      },
                      timestamp: '2024-01-01T12:00:00.000Z'
                    }
                  }
                }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        summary: 'Get product by ID',
        description: 'Retrieve a specific product by its ID',
        tags: ['Products'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'The product ID'
          }
        ],
        responses: {
          200: {
            description: 'Successfully retrieved product',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/orders': {
      get: {
        summary: 'Get all orders',
        description: 'Retrieve a list of all orders',
        tags: ['Orders'],
        responses: {
          200: {
            description: 'Successfully retrieved orders',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Order' }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create new order',
        description: 'Create a new order with the provided details',
        tags: ['Orders'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Order created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Order' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/orders/{id}': {
      get: {
        summary: 'Get order by ID',
        description: 'Retrieve a specific order by its ID',
        tags: ['Orders'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'The order ID'
          }
        ],
        responses: {
          200: {
            description: 'Successfully retrieved order',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Order' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/orders/{id}/cancel': {
      post: {
        summary: 'Cancel order',
        description: 'Cancel an order by its ID. Only orders in pending status can be cancelled.',
        tags: ['Orders'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'The order ID to cancel'
          }
        ],
        responses: {
          200: {
            description: 'Order successfully cancelled',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Order' },
                    message: { type: 'string', example: 'Order cancelled successfully' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          400: {
            description: 'Order cannot be cancelled (e.g., already cancelled or shipped)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  }
};

export async function GET() {
  try {
    return NextResponse.json(swaggerSpec);
  } catch (error) {
    console.error('Error generating Swagger spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}
