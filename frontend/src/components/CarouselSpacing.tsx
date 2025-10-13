import { Card, CardContent } from "./ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel"
import { IoPersonOutline } from "react-icons/io5";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaCarRear } from "react-icons/fa6";
import { Link } from "react-router";

const cars = [
    {
      id: 1,
      name: "Porsche 719 Cayman",
      price: "49,000",
      image: "/venz.svg",
      icon: FaCarRear ,
      transmission: "Automatic",
      rating: 4.5,
      tank: "100L",
    },
    {
      id: 2,
      name: "BMW X1 xDrive28i",
      price: "75,000",
      image: "/bmx.svg",
      transmission: "Automatic",
      rating: 4.8,
      tank: "100L",
    },
    {
      id: 3,
      name: "Mini Cooper",
      price: "68,000",
      image: "/mini.svg",
      transmission: "Manual",
      rating: 4.7,
      tank: "100L",
    },
     {
      id: 4,
      name: "Range Rover SUV",
      price: "75,000",
      image: "/range.svg",
      transmission: "Automatic",
      rating: 4.8,
      tank: "100L",
    },
     {
      id: 5,
      name: "2026 Audi RS e-tron® GT",
      price: "68,000",
      image: "/audi.svg",
      transmission: "Manual",
      rating: 4.7,
      tank: "100L",
    },
     {
      id: 6,
      name: "BMW X1 xDrive28i",
      price: "75,000",
      image: "/bmx.svg",
      transmission: "Automatic",
      rating: 4.8,
      tank: "100L",
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
                  <h3 className="text-xl text-[#0D183A] font-bold mb-3">
                    {car.name}
                  </h3>
                  <div className="mb-3">
                  <p className="text-sm text-black mt-1 flex items-center gap-2">
                    <IoPersonOutline /> 4  <FaCarRear />{car.transmission}  <BsFillFuelPumpFill /> {car.tank}
                  </p>
                  </div>
                  <p className="text-[#0D183A] text-base font-semibold">
                    {car.rating} ⭐
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <h2 className="text-xl text-black font-bold">
                      {car.price}/day
                    </h2>
                    <Link to="/reservation" className="bg-[#F97316] text-white px-6 py-5  rounded-xl cursor-pointer hover:bg-orange-600">
                      Rent now
                    </Link>
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
