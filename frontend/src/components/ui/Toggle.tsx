import React from "react";

interface CustomToggleProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CustomToggle: React.FC<CustomToggleProps> = ({
  name,
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
  className = "",
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const sizeClasses = {
    sm: {
      container: "w-10 h-6",
      circle: "w-4 h-4",
      translate: "translate-x-4",
    },
    md: {
      container: "w-12 h-7",
      circle: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      container: "w-14 h-8",
      circle: "w-6 h-6",
      translate: "translate-x-6",
    },
  };

  return (
    <div className={`flex items-center ${className}`}>
      {label && (
        <span className="mr-3 text-sm font-medium text-gray-700">{label}</span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? "bg-blue-600" : "bg-gray-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${sizeClasses[size].container}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
            ${checked ? sizeClasses[size].translate : "translate-x-0"}
            ${sizeClasses[size].circle}
          `}
        />
      </button>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={() => {}} // No-op because we handle it via the button
        className="sr-only"
        disabled={disabled}
      />
    </div>
  );
};

export default CustomToggle;
