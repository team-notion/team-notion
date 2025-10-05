import { Card, CardContent } from "./ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"

const cars = [
    {
      id: 1,
      name: "Porsche 719 Cayman",
      price: "49,000",
      image: "/venz.svg",
      transmission: "Manual",
      rating: 4.5,
      tank: "Full",
    },
    {
      id: 2,
      name: "Range Rover SUV",
      price: "75,000",
      image: "/range.svg",
      transmission: "Automatic",
      rating: 4.8,
      tank: "Half",
    },
    {
      id: 3,
      name: "Mini Cooper",
      price: "68,000",
      image: "/mini.svg",
      transmission: "Manual",
      rating: 4.7,
      tank: "Full",
    },
     {
      id: 4,
      name: "Range Rover SUV",
      price: "75,000",
      image: "/range.svg",
      transmission: "Automatic",
      rating: 4.8,
      tank: "Half",
    },
     {
      id: 5,
      name: "Mini Cooper",
      price: "68,000",
      image: "/mini.svg",
      transmission: "Manual",
      rating: 4.7,
      tank: "Full",
    },
  ];

export function CarouselSpacing() {
  return (
    <Carousel className="w-full max-w-7xl ">
      <CarouselContent className="-ml-1">
        {cars.map((car) => (
          <CarouselItem key={car.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="block aspect-square items-center justify-center p-6 mb-10  ">

                  <img
                    src={car.image}
                    alt="Car"
                    className="rounded-md mb-4 w-full h-48 object-cover"
                  />
                  <h3 className="text-xl text-[#0D183A] font-bold">
                    {car.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Transmission: {car.transmission} | Tank: {car.tank}
                  </p>
                  <p className="text-[#0D183A] text-base font-semibold">
                    {car.rating} ⭐
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <h2 className="text-xl text-black font-bold">
                      {car.price}/day
                    </h2>
                    <button className="bg-[#F97316] text-white px-4 py-2 rounded-md hover:bg-orange-600">
                      Rent now
                    </button>
                  </div>

                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
