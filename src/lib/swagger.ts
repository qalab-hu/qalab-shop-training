import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'QA Lab Learning App API',
    version: '1.0.0',
    description: 'API documentation for the QA Lab Learning e-commerce application',
    contact: {
      name: 'API Support',
      email: 'support@qalab.hu',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        required: ['id', 'name', 'price', 'category'],
        properties: {
          id: {
            type: 'string',
            description: 'Product ID',
          },
          name: {
            type: 'string',
            description: 'Product name',
          },
          price: {
            type: 'number',
            description: 'Product price in HUF',
          },
          category: {
            type: 'string',
            description: 'Product category',
          },
          description: {
            type: 'string',
            description: 'Product description',
          },
          image: {
            type: 'string',
            description: 'Product image URL',
          },
        },
      },
      Order: {
        type: 'object',
        required: ['id', 'status', 'orderDate', 'estimatedDelivery', 'trackingNumber'],
        properties: {
          id: {
            type: 'string',
            description: 'Order ID',
          },
          status: {
            type: 'string',
            enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            description: 'Order status',
          },
          orderDate: {
            type: 'string',
            format: 'date-time',
            description: 'Order creation date',
          },
          estimatedDelivery: {
            type: 'string',
            format: 'date-time',
            description: 'Estimated delivery date',
          },
          trackingNumber: {
            type: 'string',
            description: 'Tracking number',
          },
          totals: {
            type: 'object',
            properties: {
              subtotal: { type: 'number' },
              shipping: { type: 'number' },
              tax: { type: 'number' },
              total: { type: 'number' },
            },
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                quantity: { type: 'number' },
                product: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          shipping: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              address: { type: 'string' },
              city: { type: 'string' },
              postalCode: { type: 'string' },
              country: { type: 'string' },
            },
          },
          payment: {
            type: 'object',
            properties: {
              cardNumber: { type: 'string' },
              cardHolder: { type: 'string' },
            },
          },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the request was successful',
          },
          message: {
            type: 'string',
            description: 'Response message',
          },
          data: {
            type: 'object',
            description: 'Response data',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            description: 'Error message',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/app/api/**/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
