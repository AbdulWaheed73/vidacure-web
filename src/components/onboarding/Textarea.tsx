import type { TextareaProps } from '../../types';


export const Textarea = ({
  placeholder,
  value,
  onChange,
  className = "",
}: TextareaProps) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full p-4 border border-[#b0b0b0] rounded-[12px] font-manrope text-[16px] h-[54px] resize-none focus:border-[#00a38a] focus:outline-none ${className}`}
  />
);