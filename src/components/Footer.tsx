import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">QALab Shop</h3>
            <p className="text-gray-600 text-sm">
              Your one-stop shop for futuristic and impossible products. 
              Perfect for testing automation tools like Playwright!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-600 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-md font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=Electronics" className="text-gray-600 hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=Accessories" className="text-gray-600 hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?category=Home & Garden" className="text-gray-600 hover:text-white transition-colors">
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link href="/products?category=Fashion" className="text-gray-600 hover:text-white transition-colors">
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-600">Help Center</span>
              </li>
              <li>
                <span className="text-gray-600">Shipping Info</span>
              </li>
              <li>
                <span className="text-gray-600">Returns</span>
              </li>
              <li>
                <span className="text-gray-600">FAQ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 QALab Shop. All rights reserved. This is a demo site for testing purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
