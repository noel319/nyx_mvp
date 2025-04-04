import React from 'react';

// Button variants based on the design in the image
const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false
}) => {
  // Base styles for all buttons
  const baseStyles = 'py-2 px-4 rounded border font-medium transition-all duration-200 flex items-center justify-center';
  
  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-transparent border-[#00E8FF] text-[#00E8FF] hover:bg-[#00E8FF]/10',
    secondary: 'bg-[#00E8FF] border-[#00E8FF] text-black hover:bg-[#00E8FF]/90',
    dark: 'bg-[#1A1E26] border-[#1A1E26] text-white hover:bg-[#1A1E26]/80',
    outline: 'bg-transparent border-[#8A8D93] text-white hover:border-[#00E8FF] hover:text-[#00E8FF]',
  };
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;