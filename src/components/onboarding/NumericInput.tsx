import React from "react";

interface NumericInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  allowDecimal?: boolean;
}

export const NumericInput = ({
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step = 1,
  allowDecimal = true,
}: NumericInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string for clearing
    if (inputValue === "") {
      onChange(e);
      return;
    }

    // Create regex pattern based on decimal allowance
    const decimalPattern = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;
    
    // Only allow numeric input (with optional decimal)
    if (decimalPattern.test(inputValue)) {
      // Check min/max constraints if provided
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        if ((min !== undefined && numValue < min) || 
            (max !== undefined && numValue > max)) {
          return; // Don't update if outside bounds
        }
      }
      onChange(e);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) return;
    
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) && e.ctrlKey) return;
    
    // Allow: home, end, left, right
    if ([35, 36, 37, 39].includes(e.keyCode)) return;
    
    // Allow decimal point only if decimals are allowed and not already present
    if (allowDecimal && e.key === '.' && !value.includes('.')) return;
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      min={min}
      max={max}
      step={step}
      className={`w-full p-4 border border-[#b0b0b0] rounded-[12px] font-manrope text-[16px] focus:border-[#00a38a] focus:outline-none ${className}`}
    />
  );
};