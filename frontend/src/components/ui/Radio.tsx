import React from "react";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomRadioProps {
  options: RadioOption[];
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  orientation?: "horizontal" | "vertical";
  required?: boolean;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  options,
  name,
  value,
  onChange,
  label,
  disabled = false,
  size = "md",
  className = "",
  orientation = "vertical",
  required = false,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const labelSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={className}>
      {label && (
        <legend className="block text-sm font-medium text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
      )}

      <div
        className={`flex ${
          orientation === "horizontal"
            ? "flex-row space-x-6"
            : "flex-col space-y-3"
        }`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center cursor-pointer
              ${
                option.disabled || disabled
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled || option.disabled}
              required={required}
              className={`
                text-blue-600 border-gray-300 focus:ring-blue-500
                ${sizeClasses[size]}
              `}
            />
            <span className={`ml-3 ${labelSizeClasses[size]} text-gray-700`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CustomRadio;
