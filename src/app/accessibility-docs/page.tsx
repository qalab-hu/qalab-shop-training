import React from 'react';

export default function AccessibilityDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ARIA Accessibility Guide</h1>
          <p className="text-lg text-gray-600">
            Complete guide to ARIA attributes and accessibility patterns used in this application
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <nav className="mb-8" aria-label="Page contents">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-blue-600">
              <li><a href="#semantic-html" className="hover:text-blue-800">1. Semantic HTML Structure</a></li>
              <li><a href="#aria-attributes" className="hover:text-blue-800">2. ARIA Attributes Used</a></li>
              <li><a href="#form-accessibility" className="hover:text-blue-800">3. Form Accessibility</a></li>
              <li><a href="#interactive-elements" className="hover:text-blue-800">4. Interactive Elements</a></li>
              <li><a href="#testing-selectors" className="hover:text-blue-800">5. Testing Selectors</a></li>
            </ul>
          </nav>

          <article>
            <section id="semantic-html" className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Semantic HTML Structure</h2>
              <p className="text-gray-700 mb-4">
                The application uses proper semantic HTML elements to provide meaningful structure:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li><code className="bg-gray-100 px-2 py-1 rounded">{'<header role="banner">'}</code> - Main site header</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">{'<nav role="navigation">'}</code> - Navigation areas</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">{'<main role="main">'}</code> - Main content area</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">{'<aside>'}</code> - Sidebar content like filters</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">{'<article>'}</code> - Individual product cards</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">{'<section>'}</code> - Thematic groupings of content</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">{'<footer role="contentinfo">'}</code> - Site footer</li>
              </ul>
            </section>

            <section id="aria-attributes" className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. ARIA Attributes Used</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Labeling and Description</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-label</code> - Accessible names for elements</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-labelledby</code> - References to labeling elements</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-describedby</code> - Additional descriptive text</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">State and Properties</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-expanded</code> - Indicates if collapsible content is open</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-controls</code> - References controlled elements</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-invalid</code> - Indicates form validation state</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-required</code> - Indicates required form fields</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-hidden</code> - Hides decorative elements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Live Regions</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-live="polite"</code> - Announces changes when user is idle</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">aria-atomic="true"</code> - Announces entire region content</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">role="alert"</code> - Immediate announcements for errors</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">role="status"</code> - Status messages and updates</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="form-accessibility" className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Form Accessibility</h2>
              <p className="text-gray-700 mb-4">
                All form components include comprehensive accessibility features:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Input Fields</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Proper label association with <code>htmlFor</code> and <code>id</code></li>
                    <li>Error messages linked with <code>aria-describedby</code></li>
                    <li>Validation state indicated with <code>aria-invalid</code></li>
                    <li>Required fields marked with <code>aria-required</code></li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Radio Groups</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Wrapped in <code>{'<fieldset>'}</code> with <code>{'<legend>'}</code></li>
                    <li>Group labeled with <code>role="radiogroup"</code></li>
                    <li>Error handling with <code>aria-describedby</code></li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Checkboxes</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Clear label association</li>
                    <li>Error messages properly linked</li>
                    <li>State changes announced to screen readers</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="interactive-elements" className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Interactive Elements</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Buttons and Links</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Descriptive <code>aria-label</code> attributes for context</li>
                    <li>Focus management with <code>focus-visible</code> styles</li>
                    <li>Clear indication of button purpose and state</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Collapsible Content</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li><code>aria-expanded</code> indicates current state</li>
                    <li><code>aria-controls</code> links trigger to content</li>
                    <li>Keyboard navigation support</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Product Lists</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li><code>role="list"</code> and <code>role="listitem"</code> for structure</li>
                    <li>Product information properly labeled</li>
                    <li>Rating information accessible to screen readers</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="testing-selectors" className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Testing Selectors</h2>
              <p className="text-gray-700 mb-4">
                Here are the key selectors you can use for automated accessibility testing:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Role-based Selectors</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono">
                    <div className="space-y-1">
                      <div>page.getByRole('banner') <span className="text-gray-400">// Header</span></div>
                      <div>page.getByRole('navigation') <span className="text-gray-400">// Nav menus</span></div>
                      <div>page.getByRole('main') <span className="text-gray-400">// Main content</span></div>
                      <div>page.getByRole('button', {'{name: /submit/i}'}) <span className="text-gray-400">// Buttons</span></div>
                      <div>page.getByRole('textbox', {'{name: /email/i}'}) <span className="text-gray-400">// Input fields</span></div>
                      <div>page.getByRole('combobox') <span className="text-gray-400">// Select dropdowns</span></div>
                      <div>page.getByRole('checkbox') <span className="text-gray-400">// Checkboxes</span></div>
                      <div>page.getByRole('radiogroup') <span className="text-gray-400">// Radio groups</span></div>
                      <div>page.getByRole('alert') <span className="text-gray-400">// Error messages</span></div>
                      <div>page.getByRole('status') <span className="text-gray-400">// Status updates</span></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Label-based Selectors</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono">
                    <div className="space-y-1">
                      <div>page.getByLabelText('Full Name') <span className="text-gray-400">// Form fields by label</span></div>
                      <div>page.getByLabelText('Subscribe to notifications') <span className="text-gray-400">// Checkboxes</span></div>
                      <div>page.getByRole('button', {'{name: /toggle filters/i}'}) <span className="text-gray-400">// Buttons by accessible name</span></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">State Testing</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono">
                    <div className="space-y-1">
                      <div>await expect(button).toHaveAttribute('aria-expanded', 'true')</div>
                      <div>await expect(input).toHaveAttribute('aria-invalid', 'false')</div>
                      <div>await expect(field).toHaveAttribute('aria-required', 'true')</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Live Region Testing</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono">
                    <div className="space-y-1">
                      <div>const liveRegion = page.getByRole('status')</div>
                      <div>await expect(liveRegion).toContainText('Form submitted')</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Testing Tips</h3>
              <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                <li>Use role-based selectors instead of CSS selectors when possible</li>
                <li>Test keyboard navigation and focus management</li>
                <li>Verify ARIA state changes during interactions</li>
                <li>Check that error messages are properly announced</li>
                <li>Test with screen reader simulation tools</li>
                <li>Validate that live regions update correctly</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
