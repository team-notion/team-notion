import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { FiEdit } from "react-icons/fi";

interface VehicleCardProps {
  title: string
  price: number
  images: any[]
  licensePlate: string
  duration: string
  availability: string
  status: "Available" | "Rented" | "Maintenance"
  onEdit?: () => void
  onDelete?: () => void
}

const VehicleCard = ({ title, price, images, licensePlate, duration, availability, status, onEdit, onDelete }: VehicleCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const statusStyles = {
    Available: "bg-green-100 text-green-800",
    Rented: "bg-blue-100 text-blue-800",
    Maintenance: "bg-yellow-100 text-yellow-800",
  }

  return (
    <Card className="w-full max-w-sm pt-0 hover:shadow-md hover:scale-[1.02] transition-transform duration-200 ease-in-out">
      <div className="relative overflow-hidden rounded-t-md">
        <div className="relative aspect-auto bg-gray-200 overflow-hidden">
          <img src={images[currentImageIndex] || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" loading="lazy" />
        </div>

        <div className="absolute top-4 right-4">
          <span className={`${statusStyles[status]} px-6 py-2 rounded-full text-sm font-normal`}>{status}</span>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full transition-colors ${ index === currentImageIndex ? "bg-blue-600" : "bg-gray-400" }`} aria-label={`View image ${index + 1}`} />
          ))}
        </div>
      </div>
      <CardHeader className="px-3 xl:px-4">
        <div className="flex flex-col lxl:flex-row items-start justify-between">
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
          <div className="text-right">
            <span className="text-lg font-medium text-blue-600">${price}</span>
            <span className="text-blue-600 text-sm">per day</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 xl:px-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">License Plate</span>
          <span className="text-sm font-medium">{licensePlate}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm">Duration for guest reservation</span>
          <span className="text-sm font-medium">{duration}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm">Availability date</span>
          <span className="text-sm font-medium">{availability}</span>
        </div>
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