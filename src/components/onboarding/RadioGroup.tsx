import type { RadioGroupProps, RadioItemProps } from '../../types';

export const RadioGroup = ({ children }: RadioGroupProps) => (
  <div className="flex gap-16">{children}</div>
);

export const RadioItem = ({
  value,
  id,
  checked,
  onChange,
  children,
}: RadioItemProps) => (
  <div className="flex gap-2 items-center">
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.value)}
      className="w-4 h-4 text-[#00a38a] focus:ring-[#00a38a]"
    />
    <label htmlFor={id} className="font-manrope text-[16px] text-[#282828]">
      {children}
    </label>
  </div>
);