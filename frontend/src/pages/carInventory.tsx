import { BMW_1, BMW_2, BMW_3, Honda_Civic_1, Honda_Civic_2, Honda_Civic_3, Tesla_1, Tesla_2, Tesla_3, Toyota_Corolla_1, Toyota_Corolla_2, Toyota_Corolla_3 } from "@/assets";
import CarInventoryCard from "@/components/carInventoryCard";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import VehicleCard from "@/components/VehicleCard";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, Plus, SearchIcon } from 'lucide-react';

const CarInventory = () => {
  const vehicles = [
    {
      id: 1,
      title: "Toyota Corolla 2021",
      price: 50,
      images: [ Toyota_Corolla_1, Toyota_Corolla_2, Toyota_Corolla_3,],
      licensePlate: "SEG-431",
      duration: "5days",
      availability: "Mon-Fri",
      status: "Available" as const,
    },
    {
      id: 2,
      title: "Tesla Model 3 2023",
      price: 30,
      images: [Tesla_1, Tesla_2, Tesla_3],
      licensePlate: "YIL-986",
      duration: "3days",
      availability: "Mon-Sun",
      status: "Rented" as const,
    },
    {
      id: 3,
      title: "Honda Civic 2022",
      price: 25,
      images: [Honda_Civic_1, Honda_Civic_2, Honda_Civic_3],
      licensePlate: "ABC-123",
      duration: "3days",
      availability: "Mon-Sun",
      status: "Rented" as const,
    },
    {
      id: 4,
      title: "BMW 2023",
      price: 55,
      images: [BMW_1, BMW_2, BMW_3],
      licensePlate: "XYZ-789",
      duration: "7days",
      availability: "Weekends",
      status: "Available" as const,
    },
  ];

  const handleEdit = (id: number) => {
    console.log("Edit vehicle:", id)
  };

  const handleDelete = (id: number) => {
    console.log("Delete vehicle:", id)
  };

  return (
    <div className="space-y-6 px-2 lg:px-4">
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>  
        <div>
            <h1 className="text-2xl font-semibold text-black leading-9">
              Car Inventory
            </h1>
            <p className="text-neutral-600 mt-1">
              Easily manage your fleet add, edit, or track cars all in one place.
            </p>
        </div>
        <button type="submit" className="flex items-center px-4 py-3 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-normal rounded-xl transition-colors duration-200 cursor-pointer" >
          <Plus className="inline mr-2 size-5" />
          Add New Car
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CarInventoryCard data={{ title: "Total Fleet", type: "total fleet", value: 30 }} />
        <CarInventoryCard data={{ title: "Rented Cars", type: "rented cars", value: 20 }} />
        <CarInventoryCard data={{ title: "Available Cars", type: "available cars", value: 8 }} />
      </div>

      <div className='bg-white p-4 rounded-lg shadow-sm'>
        <InputGroup>
          <InputGroupInput placeholder="Search cars by make, model or plate number" className='outline-0 focus-visible:outline-0 focus-within:ring-0 focus:ring-0 focus:outline-0' />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant="ghost" className="!pr-1.5 text-xs cursor-pointer">
                  Sort by <ChevronDownIcon className="size-3" />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="[--radius:0.95rem] bg-white shadow-md p-1 rounded-sm">
                <DropdownMenuItem className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Make</DropdownMenuItem>
                <DropdownMenuItem className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Model</DropdownMenuItem>
                <DropdownMenuItem className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} title={vehicle.title} price={vehicle.price} images={vehicle.images} licensePlate={vehicle.licensePlate} duration={vehicle.duration} availability={vehicle.availability} status={vehicle.status} onEdit={() => handleEdit(vehicle.id)} onDelete={() => handleDelete(vehicle.id)} />
        ))}
      </div>
    </div>
  );
};

export default CarInventory;