import React from 'react';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  name,
  error,
  required = false,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-[#8A8D93] mb-1 text-sm"
        >
          {label} {required && <span className="text-[#FF3E5B]">*</span>}
        </label>
      )}
      
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full bg-[#1A1E26] border ${error ? 'border-[#FF3E5B]' : 'border-[#2A2E36]'} 
          rounded-md px-4 py-2 text-white placeholder-[#5A5D63]
          focus:outline-none focus:ring-1 focus:ring-[#00E8FF] focus:border-[#00E8FF]
          transition-all duration-200
        `}
      />
      
      {error && (
        <p className="mt-1 text-[#FF3E5B] text-xs">{error}</p>
      )}
    </div>
  );
};

export default Input;