import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


export function AvailabilitySection() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9)) // October 2025

  const bookedDates = [15, 16, 17, 22]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className=" max-w-md">
      <CollapsibleTrigger className="flex gap-40 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200 rounded-md ">
        <h3 className="text-3xl font-mediun text-black">Availability</h3>
        <ChevronDown className={`w-8 h-8 text-black transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 border-t-2 border-[#0066CC]">
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
              const isBooked = bookedDates.includes(day)

              return (
                <div
                  key={day}
                  className={`text-center py-2 text-sm ${
                    isBooked ? "bg-red-500 text-white rounded-full" : "text-gray-800"
                  }`}
                >
                  {day}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm" />
            <span className="text-sm text-gray-600">Booked</span>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}


// RENTAL TERMS

export function RentalTermsSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
      <CollapsibleTrigger className="flex gap-40 p-4 hover:bg-gray-50 cursor-pointer max-w-md border-b border-gray-200 rounded-md ">
        <h3 className="text-3xl font-mediun text-black">Rental Terms</h3>
        <ChevronDown className={`w-8 h-8 text-black transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 space-y-4 text-sm text-black leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam egestas. Praesent
            diam eros, iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent
            taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam egestas. Praesent
            diam eros, iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent
            taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam egestas. Praesent
            diam eros, iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent
            taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam egestas. Praesent
            diam eros, iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent
            taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam egestas. Praesent
            diam eros, iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent
            taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
          </p>
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
      <h2 className="text-3xl font-mediun text-black">Reviews</h2>

      {/* Rating Breakdown */}
      <div className="space-y-3">
        {ratingBreakdown.map((rating) => (
          <div key={rating.stars} className="flex items-center gap-4 max-w-xl">
            <span className="text-base font-medium text-black w-16">{rating.stars} Stars</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${rating.percentage}%` }} />
            </div>
            <span className="text-base text-black w-20">
              {rating.count} {rating.count === 1 ? "review" : "reviews"}
            </span>
          </div>
        ))}
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {reviews.map((review, index) => (
          <div key={index} className="space-y-3">
            <h4 className="font-mediun text-xl text-black">{review.name}</h4>
            <div className="flex text-orange-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < review.rating ? "⭐" : "☆"}</span>
                
              ))}
            </div>
            <p className="text-sm text-black font-medium leading-relaxed">{review.text}</p>  
          </div>
        ))}
      </div>
    </div>
  )
}




