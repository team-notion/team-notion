import React, { useEffect, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

export interface DropdownOption {
  id?: string;
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  onSelect: (name: string, value: string, id?: string) => void;
  placeholder?: string;
  label?: string;
  size?: "xs" | "sm" | "md" | "lg";
  name: string;
  disabled?: boolean;
  defaultOption?: string;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  onSelect,
  placeholder = "Select an option",
  label,
  size = "md",
  name,
  disabled = false,
  defaultOption = "",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );

  useEffect(() => {
    if (defaultOption && options.length > 0) {
      const defaultOpt = options.find((opt) => opt.value === defaultOption);
      if (defaultOpt) {
        setSelectedOption(defaultOpt);
      }
    }
  }, [defaultOption, options]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(name, option.value, option.id);
  };

  const sizeClasses = {
    xs: "h-8 text-xs px-3",
    sm: "h-10 text-sm px-4",
    md: "h-12 text-base px-4",
    lg: "h-14 text-lg px-5",
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        onClick={toggleDropdown}
        className={`
          flex items-center justify-between w-full border border-gray-300 rounded-lg
          bg-white transition-all duration-200 cursor-pointer
          hover:border-primary-blue focus:border-primary-blue  focus:ring-primary-blue
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
          ${sizeClasses[size]}
        `}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && (
            <span className="text-primary-blue">{selectedOption.icon}</span>
          )}
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        {isOpen ? (
          <HiChevronUp className="text-gray-400" size={18} />
        ) : (
          <HiChevronDown className="text-gray-400" size={18} />
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg
                ${
                  selectedOption?.value === option.value
                    ? "bg-blue-50 text-primary-blue"
                    : "text-gray-700"
                }
              `}
            >
              {option.icon && (
                <span className="text-primary-blue">{option.icon}</span>
              )}
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
