import type { ButtonProps } from '../../types';


export const Button = ({
  variant = "default",
  onClick,
  children,
  className = "",
}: ButtonProps) => {
  const baseClasses =
    "px-6 py-2.5 rounded-[1000px] font-sora font-semibold text-[14px] flex items-center gap-2.5 h-11 transition-colors";
  const variantClasses = {
    default: "bg-[#00a38a] text-white hover:bg-[#008a73]",
    outline: "border border-[#b0b0b0] text-[#282828] hover:border-[#00a38a]",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};