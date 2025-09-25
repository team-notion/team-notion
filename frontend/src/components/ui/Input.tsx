import React, { useState, useEffect, RefObject } from "react";

interface CustomInputProps {
  inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement>;
  disabled?: boolean;
  name: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  label?: string;
  rows?: number;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  onIconClick?: () => void;
  error?: string;
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  inputRef,
  disabled = false,
  name,
  value = "",
  onChange,
  type = "text",
  label,
  rows = 3,
  className = "",
  inputClassName = "",
  placeholder,
  size = "md",
  icon,
  onIconClick,
  error,
  required = false,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-4 text-base",
    lg: "py-4 px-5 text-lg",
  };

  const isTextarea = type === "textarea";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-4"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {isTextarea ? (
          <textarea
            ref={inputRef as RefObject<HTMLTextAreaElement>}
            id={name}
            name={name}
            rows={rows}
            value={internalValue}
            onChange={handleChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              w-full  rounded-lg bg-white transition-all duration-200
              placeholder-gray-400 focus:border-primary-blue outline-0 shadow-xs  placeholder:font-light
              ${disabled ? "opacity-50 cursor-not-allowed " : ""}
              ${sizeClasses[size]}
              ${inputClassName}
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : ""
              }
            `}
          />
        ) : (
          <div className="relative">
            <input
              ref={inputRef as RefObject<HTMLInputElement>}
              id={name}
              name={name}
              type={type}
              value={internalValue}
              onChange={handleChange}
              disabled={disabled}
              placeholder={placeholder}
              className={`
                w-full border border-gray-300 rounded-lg bg-white transition-all duration-200
                placeholder-gray-400 focus:border-primary-blue placeholder:font-light outline-0
                ${disabled ? "opacity-50 cursor-not-allowed " : ""}
                ${sizeClasses[size]}
                ${icon ? "pr-10" : ""}
                ${inputClassName}
                ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : ""
                }
              `}
            />
            {icon && (
              <div
                onClick={onIconClick}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  onIconClick ? "cursor-pointer" : "cursor-default"
                } text-gray-400 hover:text-gray-600`}
              >
                {icon}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CustomInput;
