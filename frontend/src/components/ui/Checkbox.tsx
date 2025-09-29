import React from "react";

interface CustomCheckboxProps {
  checked?: boolean;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  className = "",
  onChange,
  label = "",
  name,
  size = "md",
}) => {
  const checkboxSizeClass =
    size === "xs"
      ? "w-3 h-3"
      : size === "sm"
      ? "w-4 h-4"
      : size === "md"
      ? "w-3 h-3"
      : size === "lg"
      ? "w-4 h-4"
      : "w-4 h-4";

  return (
    <label className="flex items-center gap-x-2 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className={`
          rounded border-gray-300 text-primary-blue 
          focus:ring-primary-blue focus:ring-offset-0
          transition-all cursor-pointer checked:border-transparent
          group-hover:border-primary-blue
          ${checkboxSizeClass} 
          ${className}
        `}
      />
      {label && (
        <span className="text-sm text-gray-700 select-none">{label}</span>
      )}
    </label>
  );
};

export default CustomCheckbox;
