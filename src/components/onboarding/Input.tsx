import type { InputProps } from '../../types';


export const Input = ({
  placeholder,
  value,
  onChange,
  className = "",
  readOnly = false,
  type = "text",
}: InputProps) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full p-4 border border-[#b0b0b0] rounded-[12px] font-manrope text-[16px] focus:border-[#00a38a] focus:outline-none ${className}`}
  />
);