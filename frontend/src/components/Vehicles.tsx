import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, GitPullRequestDraft, SlidersHorizontal, Star, } from "lucide-react"
import { FilterModal } from "./FilterModal"
import { useNavigate } from "react-router"
import { Skeleton } from "./ui/skeleton"
import { getData } from "./lib/apiMethods"
import CONFIG from "./utils/config"
import { apiEndpoints } from "./lib/apiEndpoints"
import { toast } from "sonner"

interface CarPhoto {
  id: number;
  photo: string | null;
  image_url: string;
}

interface Car {
  id: number;
  owner: string;
  photos: CarPhoto[];
  car_type: string;
  year_of_manufacture: number;
  daily_rental_price: number;
  available_dates: string[];
  rental_terms: string;
  deposit: number;
  deposit_percentage: number;
  is_available: boolean;
  license: string;
  color: string | null;
  location: string | null;
  mileage: number | null;
  model: string | null;
  duration_non_paid_in_hours: number | null;
  features: string[] | null;
}

interface FilterState {
  carTypes: string[]
  models: string[]
  priceRanges: string[]
  months: string[]
}

interface FilterState {
  carTypes: string[]
  models: string[]
  priceRanges: string[]
  months: string[]
}


const VehicleCardSkeleton = () => (
  <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  </Card>
)


const Vehicles = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    carTypes: [],
    models: [],
    priceRanges: [],
    months: [],
  })

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_ALL_CARS}`)
        
        if (response.status === 200) {
          setVehicles(response.data.results)
        }
      } catch (err: any) {
        const errData = err?.response?.data
        
        if (errData && typeof errData === 'object') {
          Object.keys(errData).forEach((key) => {
            if (Array.isArray(errData[key]) && errData[key].length > 0) {
              errData[key].forEach((message: string) => {
                toast.error(message)
              })
            } else {
              toast.error(errData[key])
            }
          })
        } else {
          toast.error("Failed to fetch vehicles")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const filteredVehicles = vehicles.filter((vehicle) => {
    // Filter by car types (brands)
    if (filters.carTypes.length > 0) {
      if (!filters.carTypes.includes(vehicle.car_type)) return false
    }

    // Filter by models
    if (filters.models.length > 0) {
      if (!vehicle.model || !filters.models.includes(vehicle.model)) return false
    }

    // Filter by price ranges
    if (filters.priceRanges.length > 0) {
      const matchesPrice = filters.priceRanges.some((range) => {
        if (range === "₦ 10,000 - ₦ 20,000/day") {
          return vehicle.daily_rental_price >= 10000 && vehicle.daily_rental_price <= 20000
        } else if (range === "₦ 20,000 - ₦ 40,000/day") {
          return vehicle.daily_rental_price >= 20000 && vehicle.daily_rental_price <= 40000
        } else if (range === "₦ 40,000 - ₦ 80,000/day") {
          return vehicle.daily_rental_price >= 40000 && vehicle.daily_rental_price <= 80000
        } else if (range === "₦ 80,000 - ₦ 120,000/day") {
          return vehicle.daily_rental_price >= 80000 && vehicle.daily_rental_price <= 120000
        } else if (range === "₦ 120,000+/day") {
          return vehicle.daily_rental_price >= 120000
        }
        return false
      })
      if (!matchesPrice) return false
    }

    return true
  })

  // Get unique car types (brands) from the fetched vehicles
  const categories = Array.from(new Set(vehicles.map(v => v.car_type))).sort()

  const getVehiclesByCategory = (category: string) => {
    return filteredVehicles.filter((v) => v.car_type === category)
  }

  const hasActiveFilters =
    filters.carTypes.length > 0 ||
    filters.models.length > 0 ||
    filters.priceRanges.length > 0 ||
    filters.months.length > 0

  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] p-2 lg:p-6">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-12 w-32 mb-8" />
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((j) => (
                    <VehicleCardSkeleton key={j} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#F5F5F5] p-2 lg:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-lg text-lg font-medium border-[#1B357E] bg-white px-1 py-6 text-[#1B357E] cursor-pointer" onClick={() => setIsFilterOpen(true)} >
            <GitPullRequestDraft size={12} />
            Filter
          </Button>

          {filters.carTypes.map((type) => (
            <Badge key={type} className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100" >
              {type}
            </Badge>
          ))}

          {filters.models.map((model) => (
            <Badge key={model} className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100" >
              {model}
            </Badge>
          ))}

          {filters.priceRanges.map((range) => (
            <Badge key={range} className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100" >
              {range}
            </Badge>
          ))}
        </div>

        {/* Vehicle Categories */}
        {hasActiveFilters ? (
          // Filtered View - Show all filtered vehicles in a grid
          <div className="grid gap-6 grid-rows-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No vehicles match your filters</p>
              </div>
            )}
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
      <FilterModal open={isFilterOpen} onOpenChange={setIsFilterOpen} onApplyFilters={setFilters} availableCarTypes={categories} availableModels={Array.from(new Set(vehicles.map(v => v.model).filter((model): model is string => model !== null))).sort()} />
    </div>
  )
}

function CategorySection({ title, vehicles }: { title: string; vehicles: Car[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.9
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-medium text-[#0D183A]">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} className="h-10 w-10 rounded-lg border-gray-300 bg-white hover:bg-gray-50" >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")} className="h-10 w-10 rounded-lg border-gray-300 bg-white hover:bg-gray-50" >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar" >
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="min-w-[300px] sm:min-w-[350px] items-center">
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    </div>
  )
}

function VehicleCard({ vehicle }: { vehicle: Car }) {
  const navigate = useNavigate();

  const rating = 4.5;

  return (
    <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[4/3]">
        <img
          src={vehicle.photos[0]?.image_url || "/placeholder.svg"}
          alt={`${vehicle.year_of_manufacture} ${vehicle.car_type} ${vehicle.model}`}
          className="h-full w-full object-contain"
          />
        {!vehicle.is_available && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Not Available
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="mb-1 text-lg font-bold text-[#0D183A]">
          {`${vehicle.year_of_manufacture} ${vehicle.car_type} ${vehicle.model}`}
        </h3>
        <p className="mb-3 text-sm text-gray-600">Mileage: {vehicle.mileage?.toLocaleString()} km * {vehicle.location}</p>

        <div className="mb-4 flex items-center gap-1">
          <span className="text-sm font-semibold text-gray-900">{rating}</span>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">₦ {vehicle.daily_rental_price.toLocaleString()}</span>
            <span className="text-sm text-gray-600">/day</span>
          </div>
          <Button onClick={() => { navigate("/reservation") }} className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600 cursor-pointer">
            Rent Now
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default Vehicles