import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, SlidersHorizontal, Star } from "lucide-react"
import { FilterModal } from "./FilterModal"

interface Vehicle {
  id: string
  name: string
  year: number
  image: string
  mileage: string
  rating: number
  price: number
  category: string
}

const vehicles: Vehicle[] = [
  // SUVs
  {
    id: "1",
    name: "Corolla Cross",
    year: 2026,
    image: "/cross.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "SUV",
  },
  {
    id: "2",
    name: "Infiniti QX50",
    year: 0,
    image: "/venz.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "SUV",
  },
  {
    id: "3",
    name: "BMW X1 xDrive28i",
    year: 0,
    image: "/bmx.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "SUV",
  },
  {
    id: "4",
    name: "Infiniti QX50",
    year: 0,
    image: "/venz.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "SUV",
  },
    {
    id: "5",
    name: "BMW X1 xDrive28i",
    year: 0,
    image: "/bmx.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "SUV",
  },
    {
    id: "6",
    name: "Corolla Cross",
    year: 2026,
    image: "/cross.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "SUV",
  },


  // Pick up trucks
  {
    id: "4",
    name: "Chevy Colorado",
    year: 2025,
    image: "/chevy.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Pick up trucks",
  },
  {
    id: "5",
    name: "Silverado",
    year: 2025,
    image: "/rado.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Pick up trucks",
  },
  {
    id: "6",
    name: "Ford F-150",
    year: 2025,
    image: "/ford.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Pick up trucks",
  },
  {
    id: "5",
    name: "Silverado",
    year: 2025,
    image: "/rado.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Pick up trucks",
  },
    {
    id: "4",
    name: "Chevy Colorado",
    year: 2025,
    image: "/chevy.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Pick up trucks",
  },

  // Sedans
  {
    id: "7",
    name: "Honda Accord",
    year: 2025,
    image: "/honda.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sedans",
  },
  {
    id: "8",
    name: "5 580 4MATIC",
    year: 2026,
    image: "/matic.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sedans",
  },
  {
    id: "9",
    name: "3 Series Sedan",
    year: 0,
    image: "/series.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sedans",
  },
  {
    id: "7",
    name: "Honda Accord",
    year: 2025,
    image: "/honda.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sedans",
  },
    {
    id: "8",
    name: "5 580 4MATIC",
    year: 2026,
    image: "/matic.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sedans",
  },

  // Sports cars
  {
    id: "10",
    name: "Mazda MX-5 Miata",
    year: 2025,
    image: "/mazda.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sports cars",
  },
  {
    id: "11",
    name: "718 Cayman",
    year: 0,
    image: "/cay.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sports cars",
  },
  {
    id: "12",
    name: "Nissan 370Z",
    year: 2010,
    image: "/nissan.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sports cars",
  },
    {
    id: "10",
    name: "Mazda MX-5 Miata",
    year: 2025,
    image: "/mazda.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sports cars",
  },
   {
    id: "11",
    name: "718 Cayman",
    year: 0,
    image: "/cay.svg",
    mileage: "20,000 miles",
    rating: 3.5,
    price: 49000,
    category: "Sports cars",
  },
]

const categories = ["SUV", "Pick up trucks", "Sedans", "Sports cars"]

interface FilterState {
  carTypes: string[]
  models: string[]
  priceRanges: string[]
  months: string[]
}

const Vehicles = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    carTypes: [],
    models: [],
    priceRanges: [],
    months: [],
  })

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filters.carTypes.length > 0) {
      const categoryMap: Record<string, string> = {
        SUV: "SUV",
        "Pick up": "Pick up trucks",
        "Sports car": "Sports cars",
        Sedan: "Sedans",
      }
      const matchesCategory = filters.carTypes.some((type) => categoryMap[type] === vehicle.category)
      if (!matchesCategory) return false
    }

    if (filters.priceRanges.length > 0) {
      const matchesPrice = filters.priceRanges.some((range) => {
        if (range === "₦ 10,000 - ₦ 20,000/day") {
          return vehicle.price >= 10000 && vehicle.price <= 20000
        } else if (range === "₦ 20,000 - ₦ 40,000/day") {
          return vehicle.price >= 20000 && vehicle.price <= 40000
        } else if (range === "₦ 40,000 - ₦ 80,000/day") {
          return vehicle.price >= 40000 && vehicle.price <= 80000
        } else if (range === "₦ 80,000 - ₦ 120,000/day") {
          return vehicle.price >= 80000 && vehicle.price <= 120000
        }
        return false
      })
      if (!matchesPrice) return false
    }

    return true
  })

  const getVehiclesByCategory = (category: string) => {
    return filteredVehicles.filter((v) => v.category === category)
  }

  const hasActiveFilters =
    filters.carTypes.length > 0 ||
    filters.models.length > 0 ||
    filters.priceRanges.length > 0 ||
    filters.months.length > 0

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="mx-auto max-w-7xl">
        {/* Filter Section */}
        <div className="mb-8 flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-lg text-lg font-medium border-[#1B357E] bg-white px-1 py-6 text-[#1B357E] cursor-pointer"
            onClick={() => setIsFilterOpen(true)}
          >
            <svg width="20" height="25" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.1429 1L15.1429 16.3333M15.1429 16.3333C13.0126 16.3333 11.2857 18.0496 11.2857 20.1667C11.2857 22.2838 13.0126 24 15.1429 24C17.2731 24 19 22.2838 19 20.1667C19 18.0496 17.2731 16.3333 15.1429 16.3333ZM4.85714 8.66667L4.85714 24M4.85714 8.66667C2.7269 8.66667 1 6.95042 1 4.83333C1 2.71624 2.7269 0.999999 4.85714 0.999999C6.98738 0.999999 8.71429 2.71624 8.71429 4.83333C8.71429 6.95042 6.98738 8.66667 4.85714 8.66667Z" stroke="#1B357E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Filter
          </Button>

          {filters.carTypes.map((type) => (
            <Badge
              key={type}
              className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100"
            >
              {type}
            </Badge>
          ))}

          {filters.priceRanges.map((range) => (
            <Badge
              key={range}
              className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100"
            >
              {range}
            </Badge>
          ))}
        </div>

        {/* Vehicle Categories */}
        {hasActiveFilters ? (
          // Filtered View - Show all filtered vehicles in a grid
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          // Default View - Show categories with carousels
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryVehicles = getVehiclesByCategory(category)
              if (categoryVehicles.length === 0) return null

              return <CategorySection key={category} title={category} vehicles={categoryVehicles} />
            })}
          </div>
        )}
      </div>
      <FilterModal open={isFilterOpen} onOpenChange={setIsFilterOpen} onApplyFilters={setFilters} />
    </div>
  )
}

function CategorySection({ title, vehicles }: { title: string; vehicles: Vehicle[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.9 // scroll by 90% of visible width
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl lg:text-5xl font-medium text-[#0D183A]">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="h-10 w-10 rounded-lg border-gray-300 bg-white hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-10 w-10 rounded-lg border-gray-300 bg-white hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
      </div>

        <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
      >
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="min-w-[300px] sm:min-w-[350px]">
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    </div>
  )
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[4/3]">
        <img
          src={vehicle.image || "/placeholder.svg"}
          alt={`${vehicle.year} ${vehicle.name}`}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="p-5">
        <h3 className="mb-1 text-lg font-bold text-[#0D183A]">
          {vehicle.year > 0 ? `${vehicle.year} ` : ""}
          {vehicle.name}
        </h3>
        <p className="mb-3 text-sm text-gray-600">Mileage: {vehicle.mileage}</p>

        <div className="mb-4 flex items-center gap-1">
          <span className="text-sm font-semibold text-gray-900">{vehicle.rating}</span>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(vehicle.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : i < vehicle.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">₦ {vehicle.price.toLocaleString()}</span>
            <span className="text-sm text-gray-600">/day</span>
          </div>
          <Button className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600 cursor-pointer">
            Rent Now
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default Vehicles