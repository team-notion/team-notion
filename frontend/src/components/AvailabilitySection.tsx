import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown, Star } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ReservedRange {
  from: string;
  to: string;
}
interface AvailabilitySectionProps {
  reservedRanges?: ReservedRange[];
}

interface RentalTermsSectionProps {
  rentalTerms?: string;
}

export function AvailabilitySection({ reservedRanges = [] }: AvailabilitySectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const isDateReserved = (day: number): boolean => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0);

    return reservedRanges.some(range => {
      const fromDate = new Date(range.from);
      const toDate = new Date(range.to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      return checkDate >= fromDate && checkDate <= toDate;
    });
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const formatReservedRanges = () => {
    if (reservedRanges.length === 0) {
      return "No reservations - Fully available";
    }

    const formattedRanges = reservedRanges.map(range => {
      const fromDate = new Date(range.from);
      const toDate = new Date(range.to);
      
      const fromFormatted = fromDate.toLocaleDateString("en-US", {
        month: 'short',
        day: 'numeric'
      });
      
      const toFormatted = toDate.toLocaleDateString("en-US", {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return `${fromFormatted} - ${toFormatted}`;
    });

    if (formattedRanges.length <= 2) {
      return formattedRanges.join("; ");
    } else {
      return `${formattedRanges.slice(0, 2).join("; ")} and ${formattedRanges.length - 2} more`;
    }
  }

  const getReservedDaysCount = () => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      if (isDateReserved(day)) {
        count++;
      }
    }
    return count;
  }

  const reservedDaysCount = getReservedDaysCount();
  const availableDaysCount = daysInMonth - reservedDaysCount;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="max-w-md">
      <CollapsibleTrigger className="flex items-center justify-between gap-10 lg:gap-40 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200 rounded-md w-full">
        <h3 className="text-lg lg:text-xl font-medium text-black">Availability</h3>
        <ChevronDown className={`w-5 lg:w-8 h-5 lg:h-8 text-black transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 border-t-2 border-[#0066CC]">
          {/* Calendar Header */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Available Dates</h4>
            <p className="text-sm text-blue-700">{formatReservedRanges()}</p>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-semibold">{monthName}</h4>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={index} className="text-center font-semibold text-sm text-gray-600">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const isReserved = isDateReserved(day)
              const today = new Date()
              const isToday = new Date().getDate() === day && 
                new Date().getMonth() === currentMonth.getMonth() && 
                             new Date().getFullYear() === currentMonth.getFullYear()

              return (
                <div
                  key={day}
                  className={`text-center py-2 text-sm rounded-full ${
                    isReserved 
                      ? "bg-red-500 text-white cursor-not-allowed" 
                      : isToday
                      ? "bg-blue-500 text-white"
                      : "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                  }`}
                  title={isReserved ? "This date is already reserved" : "Available for booking"}
                >
                  {day}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm" />
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm" />
              <span className="text-gray-600">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-sm" />
              <span className="text-gray-600">Today</span>
            </div>
          </div>

          {/* Availability Status */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Available Days:</span>
              <span className="text-green-600 font-semibold">{availableDaysCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Reserved Days:</span>
              <span className="text-red-600 font-semibold">{reservedDaysCount}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="font-medium">Overall Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                availableDaysCount > 0
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {availableDaysCount > 0 ? "Available" : "Fully Booked"}
              </span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}


// RENTAL TERMS

export function RentalTermsSection({ rentalTerms = '' }: RentalTermsSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  const defaultTerms = `No rental terms specified by the car owner. Please contact the owner for specific rental requirements, terms, and conditions.`;

  const displayTerms = rentalTerms || defaultTerms;

  const termsParagraphs = displayTerms.split('\n').filter(paragraph => paragraph.trim() !== '');

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
      <CollapsibleTrigger className="flex items-center justify-between gap-10 lg:gap-40 p-4 hover:bg-gray-50 cursor-pointer max-w-md border-b border-gray-200 rounded-md w-full">
        <h3 className="text-lg lg:text-xl font-medium text-black">Rental Terms</h3>
        <ChevronDown className={`w-5 lg:w-8 h-5 lg:h-8 text-black transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-2 lg:p-4 space-y-6">
          <div className="space-y-4 text-sm text-gray-600">
            {termsParagraphs.length > 0 ? (
              termsParagraphs.map((paragraph, index) => (
                <p key={index} className="text-left leading-7 break-words whitespace-normal">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-justify leading-7 text-gray-500 italic break-words whitespace-normal">
                {displayTerms}
              </p>
            )}
          </div>

          {/* Additional Standard Terms */}
          {rentalTerms && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
              <p className="text-sm text-yellow-700">
                These are the specific terms set by the car owner. Please ensure you understand and agree to all conditions before making a reservation. 
                For any clarifications, contact the car owner directly.
              </p>
            </div>
          )}

          {/* Key Points Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-800">General Requirements</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Valid driver's license required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Minimum age: 21 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Security deposit applies</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-800">Usage Policies</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>No smoking in vehicle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Mileage limits may apply</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Return with same fuel level</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">Need Clarification?</h5>
            <p className="text-sm text-blue-700">
              If you have any questions about the rental terms or need additional information, 
              please contact the car owner before making your reservation.
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}


// REVIEWS SECTION

interface Review {
  name: string
  rating: number
  text: string
}

const reviews: Review[] = [
  {
    name: "Cassandra More",
    rating: 5,
    text: "Notionrides made renting a car super easy. The app is simple to use, has a wide range of cars, and shows clear prices with no surprises. I love that you can also rent out your own car to earn extra money. Definitely recommend!",
  },
  {
    name: "Cassandra More",
    rating: 3,
    text: "Notionrides made renting a car super easy. The app is simple to use, has a wide range of cars, and shows clear prices with no surprises. I love that you can also rent out your own car to earn extra money. Definitely recommend!",
  },
  {
    name: "Cassandra More",
    rating: 5,
    text: "Notionrides made renting a car super easy. The app is simple to use, has a wide range of cars, and shows clear prices with no surprises. I love that you can also rent out your own car to earn extra money. Definitely recommend!",
  },
  {
    name: "Cassandra More",
    rating: 2,
    text: "Notionrides made renting a car super easy. The app is simple to use, has a wide range of cars, and shows clear prices with no surprises. I love that you can also rent out your own car to earn extra money. Definitely recommend!",
  },
  {
    name: "Cassandra More",
    rating: 5,
    text: "Notionrides made renting a car super easy. The app is simple to use, has a wide range of cars, and shows clear prices with no surprises. I love that you can also rent out your own car to earn extra money. Definitely recommend!",
  },
  {
    name: "Cassandra More",
    rating: 1,
    text: "Notionrides made renting a car super easy. The app is simple to use, has a wide range of cars, and shows clear prices with no surprises. I love that you can also rent out your own car to earn extra money. Definitely recommend!",
  },
]

const ratingBreakdown = [
  { stars: 5, count: 2, percentage: 100 },
  { stars: 4, count: 1, percentage: 75 },
  { stars: 3, count: 1, percentage: 75 },
  { stars: 2, count: 1, percentage: 75 },
  { stars: 1, count: 1, percentage: 75 },
]

export function ReviewsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl lg:text-2xl font-medium text-black">Reviews</h2>

      {/* Rating Breakdown */}
      <div className="space-y-3">
        {ratingBreakdown.map((rating) => (
          <div key={rating.stars} className="flex items-center gap-4 max-w-xl">
            <span className="text-sm lg:text-base font-medium text-black w-16">{rating.stars} Stars</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${rating.percentage}%` }} />
            </div>
            <span className="text-sm lg:text-base text-black w-20">
              {rating.count} {rating.count === 1 ? "review" : "reviews"}
            </span>
          </div>
        ))}
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {reviews.map((review, index) => (
          <div key={index} className="space-y-3">
            <h4 className="font-medium text-lg text-black">{review.name}</h4>
                <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < review.rating
                      ? "fill-[#F97316] text-[#F97316]"
                      : "fill-gray-300 text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-black font-normal leading-relaxed">{review.text}</p>  
          </div>
        ))}
      </div>
    </div>
  )
}




