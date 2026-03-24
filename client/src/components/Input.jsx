import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`mb-4 w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`input-field ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
        } ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
