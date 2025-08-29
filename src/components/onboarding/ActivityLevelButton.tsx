import React from "react";

interface ActivityLevelButtonProps {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export const ActivityLevelButton = ({
  label,
  isSelected,
  onClick,
}: ActivityLevelButtonProps) => (
  <button
    onClick={onClick}
    className={`flex-1 p-4 rounded-[12px] border text-center font-manrope text-[16px] transition-colors ${
      isSelected
        ? "bg-[#e6f9f6] border-[#00a38a] text-[#282828]"
        : "border-[#b0b0b0] text-[#282828] hover:border-[#00a38a]"
    }`}
  >
    {label}
  </button>
);