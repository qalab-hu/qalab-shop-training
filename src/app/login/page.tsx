'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setMessage('Login successful! Redirecting...');
        // Trigger a custom auth change event
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Small delay to ensure the auth cookie is set
        setTimeout(() => {
          // Redirect based on user role
          if (result.user?.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/products');
          }
        }, 300);
      } else {
        setMessage(result.error || result.message || 'Login failed');
      }
    } catch (_error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuickLogin = (email: string, password: string) => {
    setFormData({
      email,
      password,
      rememberMe: false
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use one of the demo accounts below
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              id="remember-me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              label="Remember me"
            />

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          {message && (
            <div className={`text-center text-sm ${
              message.includes('successful') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up here
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-3">
            Demo Accounts
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-md p-3 border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-900">Admin Account</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Full Access</span>
              </div>
              <p className="text-xs text-blue-700 mb-1">Email: <span className="font-mono">admin@qalab.hu</span></p>
              <p className="text-xs text-blue-700 mb-2">Password: <span className="font-mono">admin123</span></p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin('admin@qalab.hu', 'admin123')}
                className="w-full text-xs text-blue-700 border-blue-300 hover:bg-blue-50"
              >
                Use Admin Account
              </Button>
            </div>
            <div className="bg-white rounded-md p-3 border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-900">User Account</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Browse Products</span>
              </div>
              <p className="text-xs text-blue-700 mb-1">Email: <span className="font-mono">user@qalab.hu</span></p>
              <p className="text-xs text-blue-700 mb-2">Password: <span className="font-mono">user123</span></p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin('user@qalab.hu', 'user123')}
                className="w-full text-xs text-blue-700 border-blue-300 hover:bg-blue-50"
              >
                Use User Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
