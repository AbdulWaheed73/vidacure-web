import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  maxDate,
  minDate,
}: DatePickerProps) => {
  // Convert string value to Date object for the picker
  const selectedDate = value ? new Date(value) : null;

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Format as YYYY-MM-DD for consistent storage
      const formattedDate = date.toISOString().split('T')[0];
      onChange(formattedDate);
    } else {
      onChange("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <ReactDatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
        maxDate={maxDate || new Date()} // Default to today as max date
        minDate={minDate}
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        className="w-full p-4 border border-[#b0b0b0] rounded-[12px] font-manrope text-[16px] focus:border-[#00a38a] focus:outline-none"
        wrapperClassName="w-full"
        popperClassName="z-50"
        calendarClassName="!font-manrope !border-[#b0b0b0] !rounded-[12px] !shadow-lg"
      />
    </div>
  );
};