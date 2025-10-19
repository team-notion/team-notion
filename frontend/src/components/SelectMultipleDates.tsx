import { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'

interface SelectMultipleDatesProps {
  label?: string
  placeholder?: string
  value?: string[]
  onChange?: (date: string[]) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

function formatDateForDisplay(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
}

function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
}

const SelectMultipleDates = ({ label, placeholder, value = [], onChange, minDate, maxDate, disabled = false }: SelectMultipleDatesProps) => {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState<Date>(new Date())

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateString = formatDateForAPI(date);
    const newDates = value.includes(dateString) 
      ? value.filter(d => d !== dateString)
      : [...value, dateString];
    
    onChange?.(newDates);
  }

  const removeDate = (dateToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDates = value.filter(date => date !== dateToRemove);
    onChange?.(newDates);
  }

  const displayValue = value.map(date => formatDateForDisplay(date)).join(', ');

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
          value={displayValue}
          placeholder={placeholder}
          className="bg-background text-[#5C5C5C] text-sm px-4 py-5 pr-10 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none"
          disabled={disabled}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id="date-picker" variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2 cursor-pointer" >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select dates</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10} >
            <Calendar
              className='text-sm'
              mode="single"
              selected={value.length > 0 ? new Date(value[value.length - 1]) : undefined}
              onSelect={(dateOrDates) => {
                if (!dateOrDates) return;
                if (Array.isArray(dateOrDates)) {
                  if (dateOrDates.length > 0) {
                    handleDateSelect(dateOrDates[dateOrDates.length - 1]);
                  }
                } else {
                  handleDateSelect(dateOrDates);
                }
              }}
              month={month}
              onMonthChange={setMonth}
              disabled={(date) => {
                if (minDate && date < minDate) return true
                if (maxDate && date > maxDate) return true
                return false
              }}
              fromYear={new Date().getFullYear()}
              toYear={2100}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
export default SelectMultipleDates