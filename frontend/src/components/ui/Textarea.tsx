import React from "react";

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  helperText,
  required = false,
  className = "",
  name,
  id,
  rows = 3,
}) => {
  const textareaId =
    id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
          px-3 py-2 border
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        `}
        style={{ "--primary-color": "#1992D4" } as React.CSSProperties}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Textarea;
