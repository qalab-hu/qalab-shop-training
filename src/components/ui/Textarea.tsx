import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-indigo-500 
          focus:border-indigo-500 sm:text-sm resize-vertical
          ${className}
        `.trim()}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
