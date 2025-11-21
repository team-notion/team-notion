// import { Card, CardContent } from "./ui/card"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "../components/ui/carousel"
// import { FaCarRear } from "react-icons/fa6";
// import { Link } from "react-router";

// const cars = [
//     {
//       id: 1,
//       name: "Porsche 719 Cayman",
//       price: "49,000",
//       image: "/venz.svg",
//       icon: FaCarRear ,
//       transmission: "Automatic",
//       rating: 4.5,
//       tank: "100L",
//     },
//     {
//       id: 2,
//       name: "BMW X1 xDrive28i",
//       price: "75,000",
//       image: "/bmx.svg",
//       transmission: "Automatic",
//       rating: 4.8,
//       tank: "100L",
//     },
//     {
//       id: 3,
//       name: "Mini Cooper",
//       price: "68,000",
//       image: "/mini.svg",
//       transmission: "Manual",
//       rating: 4.7,
//       tank: "100L",
//     },
//      {
//       id: 4,
//       name: "Range Rover SUV",
//       price: "75,000",
//       image: "/range.svg",
//       transmission: "Automatic",
//       rating: 4.8,
//       tank: "100L",
//     },
//      {
//       id: 5,
//       name: "2026 Audi RS e-tron® GT",
//       price: "68,000",
//       image: "/audi.svg",
//       transmission: "Manual",
//       rating: 4.7,
//       tank: "100L",
//     },
//      {
//       id: 6,
//       name: "BMW X1 xDrive28i",
//       price: "75,000",
//       image: "/bmx.svg",
//       transmission: "Automatic",
//       rating: 4.8,
//       tank: "100L",
//     },
//   ];

// export function CarouselSpacing() {
//   return (
//     <Carousel className="w-full max-w-7xl ">
//       <CarouselContent className="lg:-ml-1">
//         {cars.map((car) => (
//           <CarouselItem key={car.id} className="pl-1 md:basis-1/2 lg:basis-2/7">
//             <div className="p-1">
//               <Card className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
//                 <CardContent className=" flex flex-col justify-between h-full">

//                   <img
//                     src={car.image}
//                     alt="Car"
//                     className="rounded-md mb-4 w-full h-48 object-cover"
//                   />
//                   <h3 className="text-xl text-[#0D183A] font-bold mb-3">
//                     {car.name}
//                   </h3>
//                   <div className="mb-3">
//                   <p className="text-sm text-black mt-1 font-semibold">
//                     Mileage: 20,000 miles
//                   </p>
//                   </div>
//                   <p className="text-[#0D183A] text-base font-semibold">
//                     {car.rating} 
//                   </p>
//                   <div className="flex items-center justify-between mt-4">
//                     <h2 className="text-xl text-black font-bold">
//                       {car.price}/day
//                     </h2>
//                     <Link to="/reservation" className="bg-[#F97316] text-white px-6 py-2.5  rounded-xl cursor-pointer hover:bg-orange-600">
//                       Rent now
//                     </Link>
//                   </div>

//                 </CardContent>
//               </Card>
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious />
//       <CarouselNext />
//     </Carousel>
//   )
// }






















import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel"
import { Link, useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, ImageOff, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { apiEndpoints } from "./lib/apiEndpoints";
import CONFIG from "./utils/config";
import { LOCAL_STORAGE_KEYS } from "./utils/localStorageKeys";
import { Button } from "react-day-picker";
import { FiEdit } from "react-icons/fi";
import { getData } from "./lib/apiMethods";
import { useNumberFormatter } from "./utils/formatters";

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

interface CarCardProps {
  car: Car;
}

const VehicleCardSkeleton = () => (
  <div className="w-full rounded-3xl overflow-hidden shadow-lg h-[800px] bg-gray-200 animate-pulse">
    <div className="h-[300px] bg-gray-300" />
    <div className="p-6 space-y-4">
      <div className="h-8 bg-gray-300 rounded" />
      <div className="h-6 bg-gray-300 rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded" />
      </div>
    </div>
  </div>
);

const CarCard = ({ car }: CarCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const formatPrice = useNumberFormatter({ decimals: 2 });

  const formatAvailableDates = (dates: string[]) => {
    if (!dates || dates.length === 0) return "Not specified";
    if (dates.length === 2) {
      const startDate = new Date(dates[0]).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const endDate = new Date(dates[1]).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      return `${startDate} - ${endDate}`;
    }
    return `${dates.length} available dates`;
  };

  const formatDuration = (hours: number | null) => {
    if (!hours) return "Not specified";
    const days = Math.round(hours / 24);
    return `${days}${days === 1 ? "day" : "days"}`;
  };

  const images = (car?.photos || [])
    .map((photo) => {
      const url = photo.image_url || photo.photo;
      if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
        return url;
      }
      return null;
    })
    .filter((url): url is string => url !== null);

  const status = car?.is_available ? "Available" : "Reserved";

  const statusStyles = {
    Available: "bg-green-100 text-green-800",
    Reserved: "bg-blue-100 text-blue-800",
    Maintenance: "bg-yellow-100 text-yellow-800",
  }

  const getCurrentImage = () => {
    if (images.length === 0) return null;
    // ensure index is within bounds
    const idx = images.length ? currentImageIndex % images.length : 0;
    return images[idx];
  };

  const handleImageError = (index: number) => {
    const newErrors = new Set(imageErrors);
    newErrors.add(index);
    setImageErrors(newErrors);

    // Try to find next valid image
    for (let i = 0; i < images.length; i++) {
      if (!newErrors.has(i)) {
        setCurrentImageIndex(i);
        return;
      }
    }
  };

  const goToPreviousImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    if (index >= 0 && index < images.length && !imageErrors.has(index)) {
      setCurrentImageIndex(index);
    }
  };

  const currentImage = getCurrentImage();
  const hasMultipleImages = images.length > 1;

  return (
    <Card className="w-full rounded-2xl hover:shadow-md overflow-hidden hover:scale-[1.02] transition-transform duration-200 h-auto py-0 pb-3 ease-in-out">
      <div className="relative overflow-hidden bg-gray-200 h-[12.5rem] flex-shrink-0">
        <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
          {currentImage ? (
            <img src={currentImage} alt={car?.car_type} className="w-full h-full object-cover" loading="lazy" onError={() => handleImageError(currentImageIndex)} crossOrigin="anonymous" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100">
              <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No images available</p>
            </div>
          )}
        </div>

        {hasMultipleImages && (
          <>
            <button onClick={goToPreviousImage} className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full group-hover:opacity-100 transition-opacity duration-200 z-20" aria-label="Previous image" >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={goToNextImage} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full group-hover:opacity-100 transition-opacity duration-200 z-20" aria-label="Next image" >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      <CardHeader className="px-2 xl:px-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{car.car_type} {car.model ? `- ${car.model}` : ""} {car.year_of_manufacture}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 xl:px-4">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">Mileage</span>
          <span className="text-sm font-medium">{car.mileage} miles</span>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between mt-2">
          <div className="flex gap-1 items-center">
            <span className="text-sm lg:text-base font-semibold text-gray-600">₦{formatPrice(car.daily_rental_price)}</span>
            <span className="text-gray-600 text-sm font-semibold">per day</span>
          </div>
          <button onClick={() => navigate(`/reservation/${car.id}`)} className="block w-[8rem] bg-[#F97316] text-white px-6 py-2.5 rounded-xl cursor-pointer hover:bg-orange-600 text-center" >
            Rent now
          </button>
        </div>
      </CardContent>
    </Card>
  )
}




export function CarouselSpacing() {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      
      try {
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_ALL_CARS}`);

        if (resp?.data?.results) {
          setVehicles(resp?.data?.results);
        } else {
          throw new Error('Unexpected response format');
        } 

      }
      catch (err) {
        console.error("Error fetching vehicles:", err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);



  
  
  return (
    <Carousel className="w-full">
      <CarouselContent className="lg:-ml-1 -ml-2 sm:-ml-3">
        {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index} className="pl-2 sm:pl-3 basis-5/6 sm:basis-1/2 lg:basis-2/7">
                <div className="p-1">
                  <VehicleCardSkeleton />
                </div>
              </CarouselItem>
            ))
          ) : vehicles.length === 0 ?(
            <CarouselItem className="pl-2 sm:pl-3 basis-full">
              <div className="p-1">
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg">
                  <ImageOff className="size-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No cars available</h3>
                  <p className="text-gray-500 mt-1">Check back later for new listings</p>
                </div>
              </div>
            </CarouselItem>
          ) : (
            vehicles.map((car) => (
                <CarouselItem key={car.id} className="pl-2 sm:pl-3 basis-[91%] sm:basis-1/2 lg:basis-2/6 xl:basis-2/7">
                  <div className="p-1">
                    <CarCard car={car} />
                  </div>
                </CarouselItem>
              ))
          )}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  )
}