'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

interface AccessTokenData {
  accessToken: string;
  user: User;
  usage: {
    headerName: string;
    headerValue: string;
    example: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [accessTokenData, setAccessTokenData] = useState<AccessTokenData | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email
        });
      } else {
        router.push('/login');
      }
    } catch (_error) {
      console.error('Auth check failed:', _error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchAccessToken = async () => {
    try {
      const response = await fetch('/api/auth/token');
      if (response.ok) {
        const data = await response.json();
        setAccessTokenData(data.data);
        setShowToken(true);
      } else {
        setMessage('Failed to generate access token');
      }
    } catch (error) {
      console.error('Failed to fetch access token:', error);
      setMessage('Failed to generate access token');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage('Copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsEditing(false);
        setMessage('Profile updated successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to update profile');
      }
    } catch (_error) {
      setMessage('Network error. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your account information</p>
        </div>

        {message && (
          <div 
            className={`mb-6 px-4 py-3 rounded border ${
              message.includes('successfully') 
                ? 'bg-green-100 border-green-400 text-green-700' 
                : 'bg-red-100 border-red-400 text-red-700'
            }`}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <div className="space-y-4">
          {/* User Role Badge */}
          <div className="text-center">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user.role === 'ADMIN' ? 'Administrator' : 'User'}
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-black border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{user.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Edit Profile
              </Button>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200 space-y-3">
            {/* API Access Token Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">API Access Token</h3>
              <p className="text-sm text-gray-600 mb-3">
                Generate an access token to use with API requests. This token can be used instead of API keys.
              </p>
              
              {!showToken ? (
                <Button
                  onClick={fetchAccessToken}
                  variant="outline"
                  className="w-full text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                >
                  Generate Access Token
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Token
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={accessTokenData?.accessToken || ''}
                        readOnly
                        className="flex-1 p-2 border border-gray-300 rounded-l text-sm font-mono bg-white text-gray-900"
                      />
                      <button
                        onClick={() => copyToClipboard(accessTokenData?.accessToken || '')}
                        className="px-4 py-2 bg-blue-600 border border-l-0 border-blue-600 rounded-r text-sm text-white font-medium hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Example
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={accessTokenData?.usage.example || ''}
                        readOnly
                        className="flex-1 p-2 border border-gray-300 rounded-l text-sm font-mono bg-white text-gray-900"
                      />
                      <button
                        onClick={() => copyToClipboard(accessTokenData?.usage.example || '')}
                        className="px-4 py-2 bg-blue-600 border border-l-0 border-blue-600 rounded-r text-sm text-white font-medium hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p><strong>Header:</strong> {accessTokenData?.usage.headerName}: {accessTokenData?.usage.headerValue}</p>
                    <p><strong>Note:</strong> This token expires in 7 days. Keep it secure!</p>
                  </div>

                  <Button
                    onClick={() => {
                      setShowToken(false);
                      setAccessTokenData(null);
                    }}
                    variant="outline"
                    className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Hide Token
                  </Button>
                </div>
              )}
            </div>

            {user.role === 'ADMIN' && (
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                className="w-full text-black border-gray-300 hover:bg-gray-50"
              >
                Admin Dashboard
              </Button>
            )}
            
            <Button
              onClick={() => router.push('/products')}
              variant="outline"
              className="w-full text-black border-gray-300 hover:bg-gray-50"
            >
              Browse Products
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
