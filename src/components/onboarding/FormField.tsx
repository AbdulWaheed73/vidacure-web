import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: boolean;
}

export const FormField = ({
  label,
  required = false,
  children,
  className = "",
  error = false,
}: FormFieldProps) => (
  <div className={`flex flex-col gap-4 ${className}`}>
    <label className={`font-manrope font-bold text-[16px] ${
      error ? "text-red-600" : "text-[#282828]"
    }`}>
      {label} {required && <span className="text-red-500">*</span>}
      {error && <span className="text-red-500 ml-2 text-[14px] font-normal">(Required)</span>}
    </label>
    <div className={error ? "[&>*]:border-red-300 [&>*]:focus:border-red-500" : ""}>
      {children}
    </div>
  </div>
);