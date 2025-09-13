'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup } from '@/components/ui/RadioGroup';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    newsletter: false,
    contactMethod: 'email',
    priority: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const subjectOptions = [
    { value: '', label: 'Select a subject...' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'playwright', label: 'Playwright Testing Question' },
    { value: 'other', label: 'Other' }
  ];

  const contactMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'post', label: 'Postal Mail' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage(result.message);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          newsletter: false,
          contactMethod: 'email',
          priority: 'medium'
        });
      } else {
        setSubmitMessage(result.message || 'Failed to send message');
      }
    } catch (_error) {
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethod: value
    }));
  };

  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      priority: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Contact Us</h1>
            <p className="mt-2 text-blue-100">
              Get in touch with our team. This form includes various input types for comprehensive testing.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="name"
                name="name"
                type="text"
                required
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              
              <Input
                id="email"
                name="email"
                type="email"
                required
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
            </div>

            <Select
              id="subject"
              name="subject"
              required
              label="Subject"
              value={formData.subject}
              onChange={handleChange}
              options={subjectOptions}
            />

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe your inquiry in detail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RadioGroup
                name="contactMethod"
                label="Preferred Contact Method"
                options={contactMethodOptions}
                value={formData.contactMethod}
                onChange={handleRadioChange}
              />

              <RadioGroup
                name="priority"
                label="Priority Level"
                options={priorityOptions}
                value={formData.priority}
                onChange={handlePriorityChange}
              />
            </div>

            <div className="border-t pt-6">
              <Checkbox
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                label="Subscribe to our newsletter for testing tips and updates"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    newsletter: false,
                    contactMethod: 'email',
                    priority: 'medium'
                  });
                  setSubmitMessage('');
                }}
              >
                Clear Form
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>

            {submitMessage && (
              <div className={`text-center p-4 rounded-md ${
                submitMessage.includes('Thank you') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}
          </form>

          {/* Testing Info */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Testing Elements Included:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
              <span>• Text inputs</span>
              <span>• Email validation</span>
              <span>• Dropdown select</span>
              <span>• Textarea</span>
              <span>• Radio buttons</span>
              <span>• Checkboxes</span>
              <span>• Form validation</span>
              <span>• API integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
