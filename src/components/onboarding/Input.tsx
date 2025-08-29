import React from "react";

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input = ({
  placeholder,
  value,
  onChange,
  className = "",
}: InputProps) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full p-4 border border-[#b0b0b0] rounded-[12px] font-manrope text-[16px] focus:border-[#00a38a] focus:outline-none ${className}`}
  />
);