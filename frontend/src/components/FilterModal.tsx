"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: {
    carTypes: string[]
    models: string[]
    priceRanges: string[]
    months: string[]
  }) => void
}

type FilterSection = "Car type" | "Model" | "Price range" | "Availability"

export function FilterModal({ open, onOpenChange, onApplyFilters }: FilterModalProps) {
  const [activeSection, setActiveSection] = useState<FilterSection>("Car type")
  const [selectedCarTypes, setSelectedCarTypes] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])

  const carTypes = ["SUV", "Pick up", "Sports car", "Sedan"]
  const models = ["Nissan", "Honda", "Elantra", "Corolla", "Infiniti", "Chevy", "BMw", "Mazda", "Cayman", "4MATIC"]
  const priceRanges = [
    "₦ 10,000 - ₦ 20,000/day",
    "₦ 20,000 - ₦ 40,000/day",
    "₦ 40,000 - ₦ 80,000/day",
    "₦ 80,000 - ₦ 120,000/day",
  ]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const toggleSelection = (item: string, section: FilterSection) => {
    switch (section) {
      case "Car type":
        setSelectedCarTypes((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
        break
      case "Model":
        setSelectedModels((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
        break
      case "Price range":
        setSelectedPriceRanges((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
        break
      case "Availability":
        setSelectedMonths((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
        break
    }
  }

  const isSelected = (item: string, section: FilterSection) => {
    switch (section) {
      case "Car type":
        return selectedCarTypes.includes(item)
      case "Model":
        return selectedModels.includes(item)
      case "Price range":
        return selectedPriceRanges.includes(item)
      case "Availability":
        return selectedMonths.includes(item)
      default:
        return false
    }
  }

  const renderContent = () => {
    let items: string[] = []
    switch (activeSection) {
      case "Car type":
        items = carTypes
        break
      case "Model":
        items = models
        break
      case "Price range":
        items = priceRanges
        break
      case "Availability":
        items = months
        break
    }

    return (
      <div className="flex-1 p-2 lg:p-6">
        <h3 className="text-xl font-semibold text-[#0D183A] mb-6">{activeSection}</h3>
        <div className="flex flex-wrap gap-3 max-h-[45dvh] overflow-y-auto">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => toggleSelection(item, activeSection)}
              className={`px-3 lg:px-6 py-1 lg:py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                isSelected(item, activeSection)
                  ? "bg-[#4A5FD9] text-white"
                  : "bg-white text-[#0D183A] border border-[#0D183A] hover:border-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const handleResults = () => {
    onApplyFilters({
      carTypes: selectedCarTypes,
      models: selectedModels,
      priceRanges: selectedPriceRanges,
      months: selectedMonths,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-[97%] lg:max-w-2xl max-h-[90dvh] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        <div className="flex items-center justify-between p-3 md:p-6 border-b">
          <DialogTitle className="text-xl font-medium text-[#0D183A]">Find whats best for you</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-[#FE130A] border border-[#FE130A] bg-white rounded-2xl p-1 font-bold cursor-pointer hover:text-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="flex min-h-[400px]">
          {/* Sidebar */}
          <div className="w-40 lg:w-48 bg-[#E8E4F3] p-2 md:p-4 space-y-1">
            {(["Car type", "Model", "Price range", "Availability"] as FilterSection[]).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors relative cursor-pointer ${
                  activeSection === section ? "bg-white text-[#0D183A]" : "text-[#0D183A]"
                }`}
              >
                {activeSection === section && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F97316] rounded-l-md" />
                )}
                {section}
              </button>
            ))}
          </div>

          {renderContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-3 border-t">
          <Button
            onClick={handleResults}
            className="bg-[#F97316] hover:bg-orange-600 text-white px-10 py-5 lg:py-6 rounded-md font-medium cursor-pointer"
          >
            Results
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
