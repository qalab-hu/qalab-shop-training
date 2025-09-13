import React from 'react';
import { cn } from '@/lib/utils';

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  className
}) => {
  const errorId = `${name}-error`;
  
  return (
    <fieldset className={cn('space-y-2', className)} aria-invalid={error ? 'true' : 'false'}>
      {label && (
        <legend className="text-sm font-medium leading-none text-gray-800">
          {label}
        </legend>
      )}
      <div className="space-y-2" role="radiogroup" aria-describedby={error ? errorId : undefined}>
        {options.map((option) => {
          const radioId = `${name}-${option.value}`;
          return (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                id={radioId}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                className={cn(
                  'h-4 w-4 border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2',
                  error && 'border-red-500'
                )}
              />
              <label 
                htmlFor={radioId}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800"
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-red-500" role="alert" id={errorId}>
          {error}
        </p>
      )}
    </fieldset>
  );
};

export { RadioGroup };
