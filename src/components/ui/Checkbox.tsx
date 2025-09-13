import React, { useId } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            id={checkboxId}
            type="checkbox"
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            className={cn(
              'h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2',
              error && 'border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label 
              htmlFor={checkboxId}
              className="text-sm font-medium leading-none text-gray-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500" role="alert" id={errorId}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
