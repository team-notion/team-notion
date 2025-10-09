import { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'

interface SelectDateProps {
  label?: string
  placeholder?: string
  value?: Date | undefined
  onChange?: (date: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

const SelectDate = ({ label, placeholder, value, onChange, minDate, maxDate, disabled = false }: SelectDateProps) => {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState<Date | undefined>(value || new Date())
  const [inputValue, setInputValue] = useState(formatDate(value));

  const handleDateChange = (newDate: Date | undefined) => {
    onChange?.(newDate)
    setInputValue(formatDate(newDate))
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor="date" className="px-1 block text-sm font-medium text-black">
          {label}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={inputValue}
          placeholder={placeholder}
          className="bg-background text-[#5C5C5C] text-sm px-4 py-5 pr-10 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none"
          disabled={disabled}
          onChange={(e) => {
            const date = new Date(e.target.value)
            setInputValue(e.target.value)
            if (isValidDate(date)) {
              handleDateChange(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id="date-picker" variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2 cursor-pointer" >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10} >
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                handleDateChange(date)
                setOpen(false)
              }}
              disabled={(date) => {
                if (minDate && date < minDate) return true
                if (maxDate && date > maxDate) return true
                return false
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
export default SelectDate