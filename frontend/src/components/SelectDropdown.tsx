import React, { FC } from "react";
import { Controller } from "react-hook-form";
import Select, { components, StylesConfig } from "react-select";
import CreatableSelect from 'react-select/creatable';

const customStyles: StylesConfig = {
  control: (base: Record<string, unknown>, state: any) => ({
    ...base,
    "*": {
      boxShadow: "none !important",
    },
    fontSize: "12px",
    height: "44px",
    borderRadius: "10px",
    width: "auto",
    boxShadow: "none",
    appearance: "none",
    paddingRight: "12px",
    paddingLeft: "12px",
  }),
  input: (base: any) => ({
    ...base,
    fontSize: "14px",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#212529",
  }),
  valueContainer: (provided) => ({
    ...provided,
    overflow: "visible",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    position: "absolute",
    left: (state.hasValue || state.selectProps.inputValue) && 0,
    top: state.hasValue || state.selectProps.inputValue ? -15 : "20%",
    background: (state.hasValue || state.selectProps.inputValue) && "white",
    transition: "top 0.1s, font-size 0.1s",
    fontSize: state.hasValue || state.selectProps.inputValue ? "10px" : "14px",
    padding: state.hasValue || state.selectProps.inputValue ? "0px 4px" : "0px",
    lineHeight: (state.hasValue || state.selectProps.inputValue) && "16px",
    color: state.hasValue || state.selectProps.inputValue ? "#006C33" : "#4D5154",
  }),
  option: (styles, { isDisabled, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#006C33" : styles.backgroundColor,
    color: isSelected ? "#fff" : "default",
    cursor: isDisabled ? "not-allowed" : "default",
  }),
};

type SingleValue = {
  value: string | number;
  label: string;
};

type OptionModel = SingleValue[];

const { ValueContainer, Placeholder } = components;

const CustomValueContainer: FC<any> = ({ children, ...props }) => {
  return (
    <ValueContainer {...props}>
      <Placeholder {...props} isFocused={props.isFocused}>
        {props.selectProps.placeholder}
      </Placeholder>
      {React.Children.map(children, (child) =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

interface CustomSelectProps {
  options: OptionModel;
  handleChange?: (newValue: any, newAction: any) => void;
  defaultValue?: any;
  isDisabled?: boolean;
  placeholder?: string;
  containerClass?: string;
  className?: string;
  name: string;
  control: any;
  errors?: any;
  isMulti?: boolean;
  extraLabel?: string;
  allowCreate?: boolean;
  label?: any;
}

const SelectDropdown: FC<CustomSelectProps> = ({
  options,
  isDisabled,
  placeholder,
  containerClass,
  className,
  name,
  control,
  errors,
  defaultValue,
  handleChange,
  isMulti = false,
  extraLabel,
  allowCreate = false,
  label,
}) => {
  return (
    <div className={`flex flex-col justify-start ${containerClass}`}>
      {label && (
        <label className="text-[#4D5154] text-[14px] mb-2">
          {label}
        </label>
      )}
      {extraLabel && (
        <h1 className="text-[#4D5154] text-[14px] lg:leading-[16px] tracking-[0.03px] font-[600] mb-2">
          {extraLabel}
        </h1>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={isMulti ? defaultValue : options?.find((option) => option.value === defaultValue)}
        render={({ field }) => {
          const { onChange, value } = field;
          const SelectComponent = allowCreate ? CreatableSelect : Select;
          return (
            <SelectComponent
              placeholder={placeholder}
              classNamePrefix="react-select"
              className={`react-select-container ${className}`}
              options={options}
              onChange={(newValue: any) => {
                onChange(!isMulti ? newValue?.value : newValue?.label);
                if (handleChange) {
                  handleChange(newValue, name);
                }
              }}
              isDisabled={isDisabled}
              value={isMulti ? value : options?.find((c) => c.value === value) || (value ? { value: value, label: value } : null)}
              isClearable
              styles={customStyles}
              components={{
                ...components,
                IndicatorSeparator: () => null,
                ValueContainer: CustomValueContainer,
              }}
              isMulti={isMulti}
            />
          );
        }}
      />
      {errors && (
        <div className="text-left ml-3">
          {errors[name]?.message}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;