'use client';

import { useEffect, useState } from 'react';

interface ApiSpec {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
  };
  paths: Record<string, Record<string, unknown>>;
  components?: Record<string, unknown>;
}

interface PathParam {
  name: string;
  value: string;
}

interface ResponseData {
  status: number | string;
  statusText: string;
  data: unknown;
  headers: Record<string, string>;
}

export default function ApiDocsPage() {
  const [apiSpec, setApiSpec] = useState<ApiSpec | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [requestBody, setRequestBody] = useState<string>('');
  const [pathParams, setPathParams] = useState<PathParam[]>([]);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Példa adatok
  const exampleBodies = {
    'POST /api/products': {
      name: "Laptop",
      price: 999.99,
      description: "High-performance laptop",
      category: "Electronics"
    },
    'POST /api/orders': {
      customerInfo: {
        firstName: "János",
        lastName: "Kovács",
        email: "janos.kovacs@example.com",
        phone: "+36301234567"
      },
      shippingAddress: {
        street: "Váci út 1",
        city: "Budapest",
        postalCode: "1052",
        country: "Hungary"
      },
      items: [
        {
          productId: "PROD-001",
          name: "Laptop",
          price: 999.99,
          quantity: 1,
          category: "Electronics"
        },
        {
          productId: "PROD-002", 
          name: "Wireless Mouse",
          price: 29.99,
          quantity: 2,
          category: "Accessories"
        }
      ],
      totals: {
        subtotal: 1059.97,
        tax: 270.00,
        total: 1329.97
      }
    },
    'POST /api/orders/{id}/cancel': {
      reason: "Customer request",
      cancelledBy: "admin"
    }
  };

  const exampleResponses = {
    'GET /api/products': {
      200: {
        success: true,
        data: [
          {
            id: "PROD-001",
            name: "Laptop",
            price: 999.99,
            description: "High-performance laptop",
            category: "Electronics"
          },
          {
            id: "PROD-002", 
            name: "Mouse",
            price: 29.99,
            description: "Wireless mouse",
            category: "Electronics"
          }
        ]
      },
      401: {
        success: false,
        error: {
          code: "MISSING_API_KEY",
          message: "API-Key header is required. Please include X-API-Key header with a valid API key."
        },
        timestamp: "2024-01-01T12:00:00.000Z"
      },
      415: {
        success: false,
        error: {
          code: "INVALID_CONTENT_TYPE",
          message: "Invalid Content-Type. This endpoint only accepts application/json."
        },
        timestamp: "2024-01-01T12:00:00.000Z"
      },
      500: {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch products"
      }
    },
    'POST /api/products': {
      201: {
        success: true,
        data: {
          id: "PROD-003",
          name: "Laptop",
          price: 999.99,
          description: "High-performance laptop",
          category: "Electronics"
        }
      },
      400: {
        success: false,
        error: "Validation error",
        message: "Missing required fields",
        details: ["name is required", "price must be a positive number"]
      },
      500: {
        success: false,
        error: "Internal server error",
        message: "Failed to create product"
      }
    },
    'GET /api/products/{id}': {
      200: {
        success: true,
        data: {
          id: "1",
          name: "Laptop",
          price: 999.99,
          description: "High-performance laptop",
          category: "Electronics",
          inStock: true,
          stock: 15
        }
      },
      404: {
        success: false,
        error: "Not found",
        message: "Product with ID '1' not found"
      },
      500: {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch product"
      }
    },
    'GET /api/orders': {
      200: {
        success: true,
        data: [
          {
            id: "ORD-1001",
            customerInfo: {
              firstName: "János",
              lastName: "Kovács",
              email: "janos.kovacs@example.com"
            },
            status: "pending",
            total: 1269.99,
            createdAt: "2025-01-10T10:30:00Z"
          }
        ]
      },
      500: {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch orders"
      }
    },
    'POST /api/orders': {
      201: {
        success: true,
        data: {
          id: "ORD-1002",
          status: "confirmed",
          total: 1329.97,
          createdAt: "2025-01-10T10:35:00Z",
          items: [
            {
              productId: "PROD-001",
              name: "Laptop",
              price: 999.99,
              quantity: 1,
              category: "Electronics"
            },
            {
              productId: "PROD-002",
              name: "Wireless Mouse", 
              price: 29.99,
              quantity: 2,
              category: "Accessories"
            }
          ]
        }
      },
      400: {
        success: false,
        error: "Validation error",
        message: "Invalid order data",
        details: ["customerInfo.email is required", "items cannot be empty"]
      },
      500: {
        success: false,
        error: "Internal server error",
        message: "Failed to create order"
      }
    },
    'GET /api/orders/{id}': {
      200: {
        success: true,
        data: {
          id: "ORD-1001",
          customerInfo: {
            firstName: "János",
            lastName: "Kovács",
            email: "janos.kovacs@example.com",
            phone: "+36301234567"
          },
          shippingAddress: {
            street: "Váci út 1",
            city: "Budapest",
            postalCode: "1052",
            country: "Hungary"
          },
          items: [
            {
              productId: "PROD-001",
              name: "Laptop",
              price: 999.99,
              quantity: 1,
              category: "Electronics"
            },
            {
              productId: "PROD-002",
              name: "Wireless Mouse",
              price: 29.99,
              quantity: 2,
              category: "Accessories"
            }
          ],
          status: "confirmed",
          totals: {
            subtotal: 1059.97,
            tax: 270.00,
            total: 1329.97
          },
          createdAt: "2025-01-10T10:30:00Z"
        }
      },
      404: {
        success: false,
        error: "Not found",
        message: "Order with ID 'ORD-1001' not found"
      },
      500: {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch order"
      }
    },
    'POST /api/orders/{id}/cancel': {
      200: {
        success: true,
        message: "Order cancelled successfully",
        data: {
          id: "ORD-1001",
          status: "cancelled",
          cancelledAt: "2025-01-10T11:00:00Z",
          reason: "Customer request"
        }
      },
      404: {
        success: false,
        error: "Not found",
        message: "Order with ID 'ORD-1001' not found"
      },
      409: {
        success: false,
        error: "Conflict",
        message: "Order cannot be cancelled",
        details: "Order is already shipped"
      },
      500: {
        success: false,
        error: "Internal server error",
        message: "Failed to cancel order"
      }
    }
  };

  useEffect(() => {
    fetch('/api/swagger')
      .then(res => res.json())
      .then(data => {
        setApiSpec(data);
      })
      .catch(err => console.error('Failed to load API spec:', err));
  }, []);

  const extractPathParams = (path: string): string[] => {
    const matches = path.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const buildActualPath = (path: string, params: PathParam[]): string => {
    let actualPath = path;
    params.forEach(param => {
      actualPath = actualPath.replace(`{${param.name}}`, param.value);
    });
    return actualPath;
  };

  // Generate curl command
  const generateCurlCommand = (): string => {
    if (!selectedPath || !selectedMethod) return '';
    
    const actualPath = buildActualPath(selectedPath, pathParams);
    const baseUrl = 'http://localhost:3000'; // Default port
    const method = selectedMethod.toUpperCase();
    
    let curl = `curl -X ${method} "${baseUrl}${actualPath}"`;
    
    // Add headers
    curl += ' \\\n  -H "Content-Type: application/json"';
    curl += ' \\\n  -H "X-API-Key: qalab-api-key-2024"';
    
    // Add body for non-GET requests
    if (method !== 'GET' && requestBody.trim()) {
      try {
        // Validate and format JSON
        const parsedBody = JSON.parse(requestBody);
        curl += ` \\\n  -d '${JSON.stringify(parsedBody)}'`;
      } catch (e) {
        curl += ` \\\n  -d '${requestBody}'`;
      }
    }
    
    return curl;
  };

  const selectEndpoint = (path: string, method: string) => {
    setSelectedPath(path);
    setSelectedMethod(method);
    setResponse(null);
    
    // Path paraméterek beállítása
    const pathParamNames = extractPathParams(path);
    const newPathParams = pathParamNames.map(name => ({
      name,
      value: name === 'id' ? (
        path.includes('/products/') ? '1' : 'ORD-1001'
      ) : ''
    }));
    setPathParams(newPathParams);

    // Példa body beállítása
    const exampleKey = `${method.toUpperCase()} ${path}` as keyof typeof exampleBodies;
    const exampleBody = exampleBodies[exampleKey];
    if (exampleBody) {
      setRequestBody(JSON.stringify(exampleBody, null, 2));
    } else {
      setRequestBody('');
    }

    // Scroll to tester
    setTimeout(() => {
      const testerElement = document.getElementById('api-tester');
      if (testerElement) {
        testerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleTryApi = async () => {
    if (!selectedPath || !selectedMethod) return;

    setLoading(true);
    try {
      const actualPath = buildActualPath(selectedPath, pathParams);
      
      const options: RequestInit = {
        method: selectedMethod.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'qalab-api-key-2024', // Default API key for demo
        },
      };

      if (selectedMethod.toLowerCase() !== 'get' && requestBody.trim()) {
        try {
          JSON.parse(requestBody); // Validáljuk a JSON-t
          options.body = requestBody;
        } catch (e) {
          throw new Error('Invalid JSON format in request body');
        }
      }

      const res = await fetch(actualPath, options);
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data,
        headers: Object.fromEntries(res.headers.entries())
      });
    } catch (err) {
      setResponse({
        status: 'Error',
        statusText: 'Request failed',
        data: err instanceof Error ? err.message : 'Unknown error',
        headers: {}
      });
    } finally {
      setLoading(false);
    }
  };

  if (!apiSpec) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold">{apiSpec.info.title}</h1>
            <p className="text-blue-100 mt-2">{apiSpec.info.description}</p>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="bg-blue-500 px-3 py-1 rounded">
                Version: {apiSpec.info.version}
              </span>
              <span className="bg-blue-500 px-3 py-1 rounded">
                OpenAPI: {apiSpec.openapi}
              </span>
            </div>
            
            {/* Authentication Info */}
            <div className="mt-6 bg-blue-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">🔐 Authentication Required</h3>
              <p className="text-blue-100 mb-3">All API endpoints require authentication via X-API-Key header.</p>
              <div className="bg-blue-800 rounded p-3">
                <p className="font-mono text-sm text-blue-200 mb-2">Valid API Keys:</p>
                <ul className="text-sm text-blue-100 space-y-1">
                  <li>• <code className="bg-blue-900 px-2 py-1 rounded">qalab-api-key-2024</code></li>
                  <li>• <code className="bg-blue-900 px-2 py-1 rounded">student-demo-key</code></li>
                  <li>• <code className="bg-blue-900 px-2 py-1 rounded">test-api-key-123</code></li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Explorer */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - API Documentation */}
              <div className="lg:max-h-screen lg:overflow-y-auto lg:pr-4">
                <h2 className="text-2xl font-semibold mb-6 sticky top-0 bg-gray-50 py-4 z-10 text-gray-900">📚 API Végpontok</h2>
                
                {Object.entries(apiSpec.paths).map(([path, methods]) => (
                  <div key={path} className="mb-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                      <h3 className="font-mono text-lg font-semibold text-gray-800">{path}</h3>
                    </div>
                    
                    {Object.entries(methods as Record<string, any>).map(([method, details]: [string, any]) => (
                      <div key={method} className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                          <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide ${
                            method === 'get' ? 'bg-blue-500 text-white' :
                            method === 'post' ? 'bg-green-500 text-white' :
                            method === 'put' ? 'bg-yellow-500 text-white' :
                            method === 'delete' ? 'bg-red-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {method}
                          </span>
                          <h4 className="text-xl font-semibold text-gray-800">{details.summary}</h4>
                        </div>
                        
                        {details.description && (
                          <p className="text-gray-600 mb-4 leading-relaxed">{details.description}</p>
                        )}

                        {/* Required Headers */}
                        <div className="mb-6">
                          <h5 className="font-semibold text-gray-700 mb-3">🔗 Szükséges Header-ök:</h5>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm text-gray-600 font-medium">Content-Type:</span>
                                <code className="bg-amber-100 px-2 py-1 rounded text-sm text-amber-800">application/json</code>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm text-gray-600 font-medium">X-API-Key:</span>
                                <code className="bg-green-100 px-2 py-1 rounded text-sm text-green-800">qalab-api-key-2024</code>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-amber-200">
                              <p className="text-xs text-amber-700">
                                ⚡ Az X-API-Key header minden API kéréshez kötelező
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Példa válaszok megjelenítése státuszkódonként */}
                        <div className="mb-6">
                          <h5 className="font-semibold text-gray-700 mb-3">� Példa válaszok:</h5>
                          {Object.entries(exampleResponses[`${method.toUpperCase()} ${path}` as keyof typeof exampleResponses] || {}).map(([statusCode, responseData]) => (
                            <div key={statusCode} className="mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                  parseInt(statusCode) < 300 ? 'bg-green-500 text-white' :
                                  parseInt(statusCode) < 400 ? 'bg-yellow-500 text-white' :
                                  parseInt(statusCode) < 500 ? 'bg-orange-500 text-white' :
                                  'bg-red-500 text-white'
                                }`}>
                                  {statusCode}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {parseInt(statusCode) < 300 ? 'Sikeres' :
                                   parseInt(statusCode) < 400 ? 'Átirányítás' :
                                   parseInt(statusCode) < 500 ? 'Kliens hiba' :
                                   'Szerver hiba'}
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 border ml-4">
                                <pre className="text-xs text-gray-700 overflow-auto">
                                  {JSON.stringify(responseData, null, 2)}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Példa request body ha van */}
                        {method.toLowerCase() !== 'get' && exampleBodies[`${method.toUpperCase()} ${path}` as keyof typeof exampleBodies] && (
                          <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2">📤 Példa kérés:</h5>
                            <div className="bg-blue-50 rounded-lg p-4 border">
                              <pre className="text-sm text-blue-800 overflow-auto">
                                {JSON.stringify(
                                  exampleBodies[`${method.toUpperCase()} ${path}` as keyof typeof exampleBodies], 
                                  null, 
                                  2
                                )}
                              </pre>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => selectEndpoint(path, method)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                          🚀 Végpont kipróbálása
                          <span className="text-xs opacity-75">(jobb oldal)</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Right side - API Tester */}
              <div className="sticky top-6" id="api-tester">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">🔧 API Tesztelő</h2>
                
                {selectedPath && selectedMethod ? (
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                    <div className="mb-6">
                      <h3 className="font-semibold mb-4 text-lg text-gray-900">📡 Kérés beállítása</h3>
                      <div className="flex items-center gap-3 mb-4 p-4 bg-white rounded-lg border shadow-sm">
                        <span className={`px-3 py-2 rounded-lg text-sm font-bold uppercase ${
                          selectedMethod === 'get' ? 'bg-blue-500 text-white' :
                          selectedMethod === 'post' ? 'bg-green-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {selectedMethod}
                        </span>
                        <div className="flex-1">
                          <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-800 block">
                            {buildActualPath(selectedPath, pathParams)}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Path paraméterek */}
                    {pathParams.length > 0 && (
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          🔗 URL paraméterek
                        </label>
                        {pathParams.map((param, index) => (
                          <div key={param.name} className="mb-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {param.name}
                            </label>
                            <input
                              type="text"
                              value={param.value}
                              onChange={(e) => {
                                const newParams = [...pathParams];
                                newParams[index].value = e.target.value;
                                setPathParams(newParams);
                              }}
                              placeholder={`Adja meg a ${param.name} értékét`}
                              className="w-full p-3 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:outline-none bg-white text-gray-800"
                              style={{ color: '#374151', backgroundColor: '#ffffff' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedMethod.toLowerCase() !== 'get' && (
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          📝 Request Body (JSON)
                        </label>
                        <textarea
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          placeholder="Adja meg a JSON request body-t..."
                          className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:outline-none bg-white text-gray-800"
                          style={{ color: '#374151', backgroundColor: '#ffffff' }}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          💡 Tipp: A példa adatok automatikusan betöltődnek a végpont kiválasztásakor
                        </p>
                      </div>
                    )}

                    {/* Headers Information */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">🔗 Request Headers</h4>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-mono text-gray-600">Content-Type:</span>
                            <span className="text-sm font-mono text-blue-700 font-semibold">application/json</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-mono text-gray-600">X-API-Key:</span>
                            <span className="text-sm font-mono text-green-700 font-semibold">qalab-api-key-2024</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-xs text-blue-600">
                            💡 A X-API-Key header minden kéréshez szükséges az API eléréséhez
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* cURL Command */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">🖥️ cURL Parancs</h4>
                      <div className="bg-gray-900 rounded-lg p-4 border">
                        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap overflow-auto">
                          {generateCurlCommand()}
                        </pre>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generateCurlCommand());
                            // Optional: show success message
                          }}
                          className="mt-3 text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                        >
                          📋 Másolás
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Ezzel a cURL paranccsal közvetlenül tesztelheted az API-t a terminálban
                      </p>
                    </div>

                    <button
                      onClick={handleTryApi}
                      disabled={loading || (pathParams.some(p => !p.value.trim()))}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg"
                    >
                      {loading ? '⏳ Küldés...' : '🚀 Kérés elküldése'}
                    </button>

                    {response && (
                      <div className="mt-8">
                        <h4 className="font-semibold mb-4 text-lg">📨 Válasz</h4>
                        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
                          <div className="flex items-center gap-3 p-4 bg-gray-50 border-b">
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              typeof response.status === 'number' && response.status < 400
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}>
                              {response.status} {response.statusText}
                            </span>
                            {response.headers && (
                              <span className="text-xs text-gray-500">
                                Content-Type: {response.headers['content-type'] || 'application/json'}
                              </span>
                            )}
                          </div>
                          <div className="p-4">
                            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-80 text-gray-800 font-mono">
                              {JSON.stringify(response.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-blue-700 font-medium text-lg">
                      Válasszon egy végpontot a bal oldalról a teszteléshez
                    </p>
                    <p className="text-blue-600 text-sm mt-2">
                      Kattintson a &quot;🚀 Végpont kipróbálása&quot; gombra
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
