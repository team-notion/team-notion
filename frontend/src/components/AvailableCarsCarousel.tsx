import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { ChevronLeft, ChevronRight, ImageOff, Check } from "lucide-react"
import { useEffect, useState } from "react"
import { apiEndpoints } from "./lib/apiEndpoints"
import CONFIG from "./utils/config"
import { getData } from "./lib/apiMethods"
import { useNumberFormatter } from "./utils/formatters"
import { toast } from "sonner"
import { useAuth } from "./lib/authContext"
import { LOCAL_STORAGE_KEYS } from "./utils/localStorageKeys"

interface CarPhoto {
  id: number
  photo: string | null
  image_url: string
}

interface Car {
  id: number
  owner: string
  photos: CarPhoto[]
  car_type: string
  year_of_manufacture: number
  daily_rental_price: number
  available_dates: string[]
  rental_terms: string
  deposit: number
  deposit_percentage: number
  is_available: boolean
  license: string
  color: string | null
  location: string | null
  mileage: number | null
  model: string | null
  duration_non_paid_in_hours: number | null
  features: string[] | null
}

interface AvailableCarsCarouselProps {
  pickupDate?: Date
  returnDate?: Date
  selectedCarId?: number | null
  onSelectCar: (carId: number, car: Car) => void
  currentUsername?: string
}

const VehicleCardSkeleton = () => (
  <div className="w-full rounded-2xl overflow-hidden shadow-lg h-[500px] bg-gray-200 animate-pulse">
    <div className="h-[200px] bg-gray-300" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded w-2/3" />
      <div className="h-4 bg-gray-300 rounded" />
    </div>
  </div>
)

const AvailableCarsCarousel = ({ pickupDate, returnDate, selectedCarId, onSelectCar }: AvailableCarsCarouselProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState<Car[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({})
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const formatPrice = useNumberFormatter({ decimals: 2 })

  const getCurrentUserId = () => {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID) || user?.id;
    return userData;
  };

  useEffect(() => {
    const fetchAvailableCars = async () => {
      setLoading(true)

      try {
        const userId = getCurrentUserId();
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        // Build query params for date filtering if dates are provided
        let url = `${CONFIG.BASE_URL}${apiEndpoints.GET_ALL_CARS_BY_OWNER_ID}${userId}`
        const params = new URLSearchParams()

        if (pickupDate) {
          params.append("pickup_date", pickupDate.toISOString().split("T")[0])
        }
        if (returnDate) {
          params.append("return_date", returnDate.toISOString().split("T")[0])
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const resp = await getData(url, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (resp?.data?.results) {
          let filteredCars = resp.data.results

          setVehicles(filteredCars)
        }
        else {
          throw new Error("Unexpected response format")
        }
      } catch (err: any) {
        const errData = err?.response?.data;

        if (errData && typeof errData === 'object') {
          Object.keys(errData).forEach((key) => {
            if (Array.isArray(errData[key]) && errData[key].length > 0) {
              errData[key].forEach((message: string) => {
                toast.error(message);
              });
            }
            else {
              toast.error(errData[key]);
            }
          });
        }
        setVehicles([])
      }
      finally {
        setLoading(false)
      }
    }

    fetchAvailableCars()
  }, [pickupDate, returnDate, user?.id, user?.userType])

  const handleImageError = (carId: number, index: number) => {
    const newErrors = new Set(imageErrors)
    newErrors.add(carId)
    setImageErrors(newErrors)
  }

  const goToPreviousImage = (carId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [carId]: prev[carId] === 0 ? totalImages - 1 : (prev[carId] || 1) - 1,
    }))
  }

  const goToNextImage = (carId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [carId]: prev[carId] === totalImages - 1 ? 0 : (prev[carId] || 0) + 1,
    }))
  }

  const getCarImages = (car: Car) => {
    return (car?.photos || [])
      .map((photo) => {
        const url = photo.image_url || photo.photo
        if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
          return url
        }
        return null
      })
      .filter((url): url is string => url !== null)
  }

  interface CarCardProps {
    car: Car
  }

  const CarCard = ({ car }: CarCardProps) => {
    const images = getCarImages(car)
    const currentIdx = currentImageIndex[car.id] || 0
    const currentImage = images.length > 0 ? images[currentIdx] : null
    const hasMultipleImages = images.length > 1
    const isSelected = selectedCarId === car.id

    return (
      <Card
        className={`w-full rounded-2xl overflow-hidden transition-all duration-200 h-full pt-0 pb-1 cursor-pointer gap-1 ease-in-out ${
          isSelected ? "ring-2 ring-[#FA8F45] shadow-lg scale-105" : "hover:shadow-md hover:scale-[1.02]"
        }`}
        onClick={() => onSelectCar(car.id, car)}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gray-200 h-[150px] flex-shrink-0">
          <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
            {currentImage ? (
              <img src={currentImage || "/placeholder.svg"} alt={car?.car_type} className="w-full h-full object-cover" loading="lazy" onError={() => handleImageError(car.id, currentIdx)} crossOrigin="anonymous" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">No images</p>
              </div>
            )}
          </div>

          {/* Image Navigation */}
          {hasMultipleImages && (
            <>
              <button onClick={(e) => { e.stopPropagation(); goToPreviousImage(car.id, images.length); }} className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-1.5 rounded-full transition-opacity z-20" aria-label="Previous image" >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); goToNextImage(car.id, images.length); }} className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-1.5 rounded-full transition-opacity z-20" aria-label="Next image" >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Car Details */}
        <CardHeader className="px-3 xl:px-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold">
              {car.car_type} {car.model ? `- ${car.model}` : ""} {car.year_of_manufacture}
            </CardTitle>
            {isSelected && (
              <div className="flex-shrink-0 bg-[#FA8F45] rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-3 xl:px-4 py-0 flex-1 space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="font-semibold">₦{formatPrice(car.daily_rental_price)}</span>
            <span className="text-xs ml-1">per day</span>
          </div>
            {car.mileage && (
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-sm text-gray-500">Mileage:</span>
                <span className="text-sm text-gray-500">{car.mileage} miles</span>
              </div>
            )}
            <div className="flex justify-between items-center text-gray-500">
              <span className="text-sm">Availability</span>
              <span className="text-sm font-medium">{car?.is_available === true ? 'Available' : 'Not available'}</span>
            </div>

            {car.location && (
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-sm">Location</span>
                <span className="text-sm font-medium">{car.location}</span>
              </div>
            )}

            {car.features && car.features.length > 0 && (
              <div className="text-sm mt-1 text-gray-500">
                <span className="text-sm">Features</span>
                <div className="flex flex-wrap gap-1">
                  {car.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                  {car.features.length > 2 && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      +{car.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
        </CardContent>

        <CardFooter className="px-3">{/* Additional card footer content can be added here */}</CardFooter>
      </Card>
    )
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <Carousel className="w-full">
        <CarouselContent className="lg:-ml-1 -ml-2 sm:-ml-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index} className="pl-2 sm:pl-3 basis-[91%] sm:basis-1/2 lg:basis-2/6 xl:basis-2/7">
                <div className="p-1">
                  <VehicleCardSkeleton />
                </div>
              </CarouselItem>
            ))
          ) : vehicles.length === 0 ? (
            <CarouselItem className="pl-2 sm:pl-3 basis-full">
              <div className="p-1">
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <ImageOff className="size-10 text-gray-300 mb-3" />
                  <h3 className="text-base font-semibold text-gray-700">No cars available</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {pickupDate && returnDate
                      ? "No cars available for your selected dates"
                      : "Select pickup and return dates to see available cars"}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ) : (
            vehicles.map((car) => (
              <CarouselItem key={car.id} className="pl-2 sm:pl-3 basis-[91%] sm:basis-1/2 lg:basis-[45%]">
                <div className="p-1">
                  <CarCard car={car} />
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default AvailableCarsCarousel