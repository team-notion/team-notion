import { useEffect, useState } from "react";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from "react-phone-input-2";

interface PhoneNumberInputProps {
  value: string;
  onValueChange: (value: string) => void;
  hasError?: boolean;
}

const PhoneNumberInput = ({ value, onValueChange, hasError, }: PhoneNumberInputProps) => {
  const [internalvalue, setInternalValue] = useState<string>(value);

  useEffect(() => {
    if (internalvalue && !internalvalue.startsWith("+")) {
      onValueChange(`+${internalvalue}`);
    }
    else {
      onValueChange(internalvalue || "");
    }
  }, [internalvalue]);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className={`h-[40px] w-full rounded-md ${ hasError ? "border border-red-500" : "border-gray-300" }`} >
      <PhoneInput country="ng" placeholder='Enter phone number' onChange={setInternalValue} value={internalvalue} enableSearch={true} countryCodeEditable={false} inputStyle={{ background: "#E9ECF2", color: "#5C5C5C", width: "100%", height: "40px", border: hasError ? "1px solid #EF4444" : "1px solid #D1D5DC", borderRadius: "6px", fontSize: "14px", }} />
    </div>
  );
};

export default PhoneNumberInput