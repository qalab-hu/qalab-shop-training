'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { ChevronDownIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AccessibilityDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    notifications: false,
    contactMethod: 'email',
    feedback: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const countryOptions = [
    { value: '', label: 'Select a country' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'de', label: 'Germany' },
    { value: 'hu', label: 'Hungary' }
  ];

  const contactOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'mail', label: 'Regular Mail' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowResults(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      country: '',
      notifications: false,
      contactMethod: 'email',
      feedback: ''
    });
    setErrors({});
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ARIA Accessibility Demo</h1>
          <p className="text-lg text-gray-600">
            This page demonstrates various ARIA attributes and accessibility patterns for automated testing.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <section aria-labelledby="form-heading">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 id="form-heading" className="text-xl font-semibold text-gray-900 mb-6">
                Interactive Form with ARIA
              </h2>

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-6">
                  <Input
                    label="Full Name *"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    placeholder="Enter your full name"
                    required
                    aria-required="true"
                  />

                  <Input
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    placeholder="you@example.com"
                    required
                    aria-required="true"
                  />

                  <Select
                    label="Country *"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    options={countryOptions}
                    error={errors.country}
                    required
                    aria-required="true"
                  />

                  <Checkbox
                    label="Subscribe to email notifications"
                    checked={formData.notifications}
                    onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                  />

                  <RadioGroup
                    name="contact-method"
                    label="Preferred Contact Method"
                    options={contactOptions}
                    value={formData.contactMethod}
                    onChange={(value) => setFormData({ ...formData, contactMethod: value })}
                  />

                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-800 mb-2">
                      Additional Feedback
                    </label>
                    <textarea
                      id="feedback"
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      className="w-full h-24 px-3 py-2 border border-gray-400 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us what you think..."
                      aria-describedby="feedback-hint"
                    />
                    <p id="feedback-hint" className="text-xs text-gray-500 mt-1">
                      Optional: Share any thoughts or suggestions
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      Submit Form
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Reset
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* Results and Interactive Elements */}
          <section aria-labelledby="results-heading">
            <div className="space-y-6">
              {/* Results Panel */}
              {showResults && (
                <div className="bg-white rounded-lg shadow-sm p-6" role="region" aria-labelledby="results-title">
                  <div className="flex items-center mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" aria-hidden="true" />
                    <h3 id="results-title" className="text-lg font-semibold text-gray-900">
                      Form Submitted Successfully
                    </h3>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h4 className="font-medium text-green-800 mb-2">Submitted Data:</h4>
                    <dl className="text-sm text-green-700 space-y-1">
                      <div>
                        <dt className="inline font-medium">Name: </dt>
                        <dd className="inline">{formData.name}</dd>
                      </div>
                      <div>
                        <dt className="inline font-medium">Email: </dt>
                        <dd className="inline">{formData.email}</dd>
                      </div>
                      <div>
                        <dt className="inline font-medium">Country: </dt>
                        <dd className="inline">{countryOptions.find(c => c.value === formData.country)?.label}</dd>
                      </div>
                      <div>
                        <dt className="inline font-medium">Notifications: </dt>
                        <dd className="inline">{formData.notifications ? 'Yes' : 'No'}</dd>
                      </div>
                      <div>
                        <dt className="inline font-medium">Contact Method: </dt>
                        <dd className="inline">{contactOptions.find(c => c.value === formData.contactMethod)?.label}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {/* Interactive Elements Demo */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Elements</h3>
                
                {/* Expandable Section */}
                <div className="mb-6">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-expanded={isExpanded}
                    aria-controls="expandable-content"
                    id="expandable-trigger"
                  >
                    <span className="font-medium text-gray-900">
                      Expandable Content Section
                    </span>
                    <ChevronDownIcon 
                      className={`h-5 w-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  
                  {isExpanded && (
                    <div 
                      id="expandable-content" 
                      className="mt-3 p-4 border border-gray-200 rounded-md"
                      aria-labelledby="expandable-trigger"
                    >
                      <p className="text-gray-700 mb-3">
                        This is an expandable content section that demonstrates proper ARIA attributes 
                        for disclosure patterns. It uses aria-expanded and aria-controls to indicate 
                        the relationship between the trigger and content.
                      </p>
                      <p className="text-gray-700">
                        Screen readers and automated testing tools can use these attributes to understand 
                        the current state and relationships between elements.
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Messages */}
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md" role="status">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-blue-700">
                      This is an informational status message that is announced to screen readers.
                    </p>
                  </div>

                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md" role="alert">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" aria-hidden="true" />
                    <p className="ml-3 text-sm text-yellow-700">
                      This is a warning message using role="alert" for immediate attention.
                    </p>
                  </div>
                </div>
              </div>

              {/* ARIA Live Region Demo */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Region Demo</h3>
                <p className="text-gray-600 mb-4">
                  Changes in the form above are announced in real-time below:
                </p>
                <div 
                  className="p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[60px]"
                  aria-live="polite"
                  aria-atomic="false"
                  id="live-region"
                >
                  <p className="text-sm text-gray-700">
                    {Object.keys(errors).length > 0 
                      ? `Form has ${Object.keys(errors).length} validation error(s)`
                      : showResults 
                        ? 'Form submitted successfully!' 
                        : 'Fill out the form to see live updates here'
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
