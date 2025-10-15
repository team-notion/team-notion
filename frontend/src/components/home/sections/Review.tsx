"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
// import Rita from "../../../assets/rita.svg";


interface Review {
  id: number
  name: string
  image: string
  rating: number
  text: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Cassandra Rita",
    image: "/rita.svg",
    rating: 5,
    text: "NotionRides made renting a car super easy. The app is simple to use, has a wide range of cars, and shows clear prices with no surprises. I love that you can also rent out your own car to earn extra money. Definitely recommend!",
  },
  {
    id: 2,
    name: "John Smith",
    image: "/rita.svg",
    rating: 5,
    text: "Amazing service! The booking process was seamless and the car was in perfect condition. Customer support was very responsive when I had questions.",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    image: "/rita.svg",
    rating: 4,
    text: "Great experience overall. The app interface is intuitive and I found exactly what I needed. Pickup and drop-off were hassle-free.",
  },
]

export function Review() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1))
  }

  const currentReview = reviews[currentIndex]

  return (
    <div className="w-full bg-[#B9C2DB]/50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10 -mt-30">
          <h2 className="text-3xl md:text-5xl font-medium text-[#0D183A]">Customer Reviews</h2>
          <div className="flex gap-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="h-15 w-15 rounded-full bg-white hover:bg-white/90 text-black cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-50 w-50 font-extrabold text-black" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="h-15 w-15 rounded-full bg-white hover:bg-white/90 text-black cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="h-50 w-50 font-extrabold text-black" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
          <div className="flex-shrink-0">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <img
                src={currentReview.image || "/placeholder.svg"}
                alt={currentReview.name}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 pt-4">
            <h3 className="text-2xl lg:text-4xl font-regular text-black mb-3">{currentReview.name}</h3>
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index < currentReview.rating ? "fill-[#F97316] text-[#F97316]" : "fill-gray-300 text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-black max-w-3xl leading-relaxed text-base">{currentReview.text}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review