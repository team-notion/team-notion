import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { ChevronLeft, ChevronRight, ImageOff, Pencil, Trash2 } from "lucide-react";
import { FiEdit } from "react-icons/fi";

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

interface VehicleCardProps {
  data: Car;
  onEdit?: () => void;
  onDelete?: () => void;
}

const VehicleCard = ({ data, onEdit, onDelete }: VehicleCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const images = data.photos
  .map((photo) => {
    const url = photo.image_url || photo.photo;
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      return url;
    }
    return null;
  })
  .filter((url): url is string => url !== null);

  const status = data.is_available ? "Available" : "Reserved";

  const statusStyles = {
    Available: "bg-green-100 text-green-800",
    Reserved: "bg-blue-100 text-blue-800",
    Maintenance: "bg-yellow-100 text-yellow-800",
  }

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

  const getCurrentImage = () => {
    if (images.length === 0) return null;
    return images[currentImageIndex];
  };

  const handleImageError = (index: number) => {
    const newErrors = new Set(imageErrors);
    newErrors.add(currentImageIndex);
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
    <Card className="w-full rounded-2xl hover:shadow-md overflow-hidden hover:scale-[1.02] transition-transform duration-200 h-[34.375rem] py-0 ease-in-out">
      <div className="relative overflow-hidden bg-gray-200 h-[12.5rem] flex-shrink-0">
        <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
          {currentImage ? (
            <img src={currentImage} alt={data?.car_type} className="w-full h-full object-cover" loading="lazy" onError={() => handleImageError(currentImageIndex)} crossOrigin="anonymous" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100">
              <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No images available</p>
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4">
          <span className={`${statusStyles[status as keyof typeof statusStyles]} px-6 py-2 rounded-full text-sm font-normal`}>{status}</span>
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
      <CardHeader className="px-3 xl:px-4">
        <div className="flex flex-col lxl:flex-row items-start justify-between">
          <CardTitle className="text-xl font-medium">{data.car_type} {data.model ? `- ${data.model}` : ""} {data.year_of_manufacture}</CardTitle>
          <div className="text-right">
            <span className="text-lg font-medium text-blue-600">₦{data.daily_rental_price}</span>
            <span className="text-blue-600 text-sm">per day</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 xl:px-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">License Plate</span>
          <span className="text-sm font-medium">{data.license}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm">Duration for guest reservation</span>
          <span className="text-sm font-medium">{formatDuration(data.duration_non_paid_in_hours)}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm">Availability date</span>
          <span className="text-sm font-medium">{formatAvailableDates(data.available_dates)}</span>
        </div>

        {data.location && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">Location</span>
            <span className="text-sm font-medium">{data.location}</span>
          </div>
        )}

        {data.features && data.features.length > 0 && (
          <div className="text-sm mt-2">
            <span className="text-sm">Features</span>
            <div className="flex flex-wrap gap-1">
              {data.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  {feature}
                </span>
              ))}
              {data.features.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  +{data.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 lg:gap-4 pt-0">
        <Button onClick={onEdit} className="bg-orange-500 hover:bg-orange-600 text-white h-12 w-[6.5rem] text-lg rounded-2xl cursor-pointer">
          <FiEdit className="h-6 w-6" />
          Edit
        </Button>
        <Button onClick={onDelete} variant="outline" className="h-12 w-12 border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl p-0 bg-transparent cursor-pointer" >
          <Trash2 className="h-6 w-6" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default VehicleCard