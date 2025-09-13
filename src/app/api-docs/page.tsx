'use client';

import { useEffect, useState } from 'react';

interface ApiEndpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  parameters: any[];
  responses: any;
}

const ApiDocsPage = () => {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch('/api/swagger');
        if (!response.ok) {
          throw new Error('Failed to load API documentation');
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Documentation</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get': return 'bg-green-100 text-green-800';
      case 'post': return 'bg-blue-100 text-blue-800';
      case 'put': return 'bg-orange-100 text-orange-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderEndpoints = () => {
    if (!spec?.paths) return null;

    const endpoints: ApiEndpoint[] = [];
    
    Object.entries(spec.paths).forEach(([path, pathData]: [string, any]) => {
      Object.entries(pathData).forEach(([method, methodData]: [string, any]) => {
        endpoints.push({
          path,
          method: method.toUpperCase(),
          summary: methodData.summary || '',
          description: methodData.description || '',
          parameters: methodData.parameters || [],
          responses: methodData.responses || {}
        });
      });
    });

    return endpoints.map((endpoint, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(endpoint.method)}`}>
              {endpoint.method}
            </span>
            <code className="text-lg font-mono text-gray-800">{endpoint.path}</code>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{endpoint.summary}</h3>
          <p className="text-gray-600">{endpoint.description}</p>
          
          {/* Required Headers */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Headers:</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-gray-600">Content-Type:</code>
                  <code className="text-sm font-mono bg-yellow-100 px-2 py-1 rounded text-yellow-800">application/json</code>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-gray-600">X-API-Key:</code>
                  <code className="text-sm font-mono bg-green-100 px-2 py-1 rounded text-green-800">qalab-api-key-2024</code>
                </div>
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                💡 All API endpoints require the X-API-Key header for authentication
              </p>
            </div>
          </div>
        </div>

        {endpoint.parameters && endpoint.parameters.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {endpoint.parameters.map((param: any, paramIndex: number) => (
                    <tr key={paramIndex}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{param.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{param.schema?.type || 'string'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{param.in}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {param.required ? 
                          <span className="text-red-600 font-medium">Yes</span> : 
                          <span className="text-gray-400">No</span>
                        }
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* cURL Example */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">cURL Example</h4>
          <div className="bg-gray-900 rounded-lg p-4">
            <pre className="text-green-400 text-sm font-mono overflow-x-auto">
{`curl -X ${endpoint.method} "http://localhost:3000${endpoint.path}" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qalab-api-key-2024"${endpoint.method !== 'GET' ? ' \\\n  -d \'{"key": "value"}\'' : ''}`}
            </pre>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 Replace path parameters (like {'{id}'}) with actual values and adjust the request body as needed
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Responses</h4>
          <div className="space-y-3">
            {Object.entries(endpoint.responses).map(([statusCode, response]: [string, any]) => (
              <div key={statusCode} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    statusCode.startsWith('2') ? 'bg-green-100 text-green-800' :
                    statusCode.startsWith('4') ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {statusCode}
                  </span>
                  <span className="text-gray-700">{response.description}</span>
                </div>
                {response.content && response.content['application/json'] && (
                  <div className="mt-2">
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      <code>{JSON.stringify(response.content['application/json'].schema, null, 2)}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{spec?.info?.title || 'API Documentation'}</h1>
              <p className="text-gray-600 mt-2">{spec?.info?.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-sm text-gray-500">Version: {spec?.info?.version}</span>
                <span className="text-sm text-gray-500">
                  Base URL: {spec?.servers?.[0]?.url || 'http://localhost:3000'}
                </span>
              </div>
            </div>
            <div>
              <a 
                href="/api/swagger" 
                target="_blank"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download OpenAPI JSON
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h2>
          <p className="text-gray-600">
            This documentation provides detailed information about all available API endpoints, 
            including parameters, request/response formats, and example usage.
          </p>
        </div>

        <div className="space-y-6">
          {renderEndpoints()}
        </div>

        {spec?.components?.schemas && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Schemas</h2>
            <div className="grid gap-6">
              {Object.entries(spec.components.schemas).map(([schemaName, schema]: [string, any]) => (
                <div key={schemaName} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{schemaName}</h3>
                  <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
                    <code>{JSON.stringify(schema, null, 2)}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDocsPage;
