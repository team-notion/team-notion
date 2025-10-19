import { useEffect, useState } from "react";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from "react-phone-input-2";

interface PhoneNumberInputProps {
  value: string;
  onValueChange: (value: string, countryCode?: string) => void;
  hasError?: boolean;
}

const PhoneNumberInput = ({ value, onValueChange, hasError, }: PhoneNumberInputProps) => {
  const [internalvalue, setInternalValue] = useState<string>(value);
  const [countryCode, setCountryCode] = useState<string>("");

  const handleChange = (value: string, country: any) => {
    setInternalValue(value);
    setCountryCode(country.countryCode.toUpperCase());
    
    if (value && !value.startsWith("+")) {
      onValueChange(`+${value}`, country.countryCode.toUpperCase());
    } else {
      onValueChange(value || "", country.countryCode.toUpperCase());
    }
  };

  useEffect(() => {
    if (internalvalue && !internalvalue.startsWith("+")) {
      onValueChange(`+${internalvalue}`, countryCode);
    }
    else {
      onValueChange(internalvalue || "", countryCode);
    }
  }, [internalvalue]);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className={`h-[40px] w-full rounded-md ${ hasError ? "border border-red-500" : "border-gray-300" }`} >
      <PhoneInput country="ng" placeholder='Enter phone number' onChange={handleChange} value={internalvalue} enableSearch={true} countryCodeEditable={false} inputStyle={{ background: "#E9ECF2", color: "#5C5C5C", width: "100%", height: "40px", border: hasError ? "1px solid #EF4444" : "1px solid #D1D5DC", borderRadius: "6px", fontSize: "14px", }} />
    </div>
  );
};

export default PhoneNumberInput