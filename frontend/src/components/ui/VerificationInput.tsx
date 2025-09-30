import { useRef, useState, useCallback } from "react"

interface VerificationInputProps {
  length?: number
  onChange: (code: string) => void
}

export function VerificationInput({ length = 4, onChange }: VerificationInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""))
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const inputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputs.current[index] = el
    },
    [],
  )

  const handleChange = (index: number, value: string) => {
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    onChange(newCode.join(""))

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={inputRef(index)}
          type="text"
          maxLength={1}
          className="w-10 md:w-12 h-10 md:h-12 text-center text-sm border border-[#98A2B3] rounded-lg focus:border-[#98A2B3] focus:ring-1 focus:ring-[#98A2B3] outline-none"
          value={code[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  )
}

