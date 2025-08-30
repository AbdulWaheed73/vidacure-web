import type { CheckboxProps } from '../../types';


export const Checkbox = ({
  checked,
  onCheckedChange,
  id,
  children,
}: CheckboxProps) => (
  <div className="flex gap-3.5 items-center">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="w-6 h-6 text-[#00a38a] rounded focus:ring-[#00a38a]"
    />
    <label htmlFor={id} className="font-manrope text-[16px] text-[#282828]">
      {children}
    </label>
  </div>
);