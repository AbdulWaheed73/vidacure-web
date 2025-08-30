// Component prop types for all reusable components

import React from "react";

// Onboarding component props
export type InputProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  readOnly?: boolean;
}

export type TextareaProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export type OnboardingProgressBarProps = {
  currentStep: number;
}

export type RadioGroupProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export type RadioItemProps = {
  value: string;
  id: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export type NumericInputProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  allowDecimal?: boolean;
}

export type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
  children: React.ReactNode;
}

export type ButtonProps = {
  variant?: "default" | "outline";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export type FormFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: boolean;
  helperText?: string;
}

export type ActivityLevelButtonProps = {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
}