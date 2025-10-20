import { BMW_1, BMW_2, BMW_3, Honda_Civic_1, Honda_Civic_2, Honda_Civic_3, Tesla_1, Tesla_2, Tesla_3, Toyota_Corolla_1, Toyota_Corolla_2, Toyota_Corolla_3 } from "@/assets";
import ActionModal from "@/components/ActionModal";
import AddCarModal from "@/components/AddCarModal";
import CarInventoryCard from "@/components/carInventoryCard";
import { apiEndpoints } from "@/components/lib/apiEndpoints";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import CONFIG from "@/components/utils/config";
import { LOCAL_STORAGE_KEYS } from "@/components/utils/localStorageKeys";
import VehicleCard from "@/components/VehicleCard";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, LayoutGrid, List, Plus, SearchIcon } from 'lucide-react';
import { useEffect, useState } from "react";

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

const ITEMS_PER_PAGE = 20;

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

const CarInventory = () => {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Car[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"make" | "model" | "year">("make");


  const getCurrentUserId = () => {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);
    return userData;
  };

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        const userId = getCurrentUserId();

        if (!userId) {
          throw new Error("User ID not found");
        }

        const resp = await fetch(`${CONFIG.BASE_URL}${apiEndpoints.GET_ALL_CARS_BY_OWNER_ID}${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!resp.ok) {
          throw new Error("Failed to fetch cars");
        }
        
        const data = await resp.json();

        if (data && Array.isArray(data.results)) {
          setVehicles(data.results);
          setFilteredVehicles(data.results);
        } else {
          throw new Error('Unexpected response format');
        }

        console.log("Fetched cars:", data);
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


  useEffect(() => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = vehicles.filter((car) =>
        car.car_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.license.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "make") return a.car_type.localeCompare(b.car_type);
      if (sortBy === "model") return (a.model || "").localeCompare(b.model || "");
      if (sortBy === "year") return b.year_of_manufacture - a.year_of_manufacture;
      return 0;
    });

    setFilteredVehicles(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortBy, vehicles]);


  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);


  const handleAddCarConfirm = () => {
    setIsAddCarModalOpen(false);
  }

  const handleEdit = (id: number) => {

  };

  const handleDelete = (id: number) => {
    setSelectedCarId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setSelectedCarId(null);
  }

  return (
    <div className="space-y-6 px-0 lg:px-4">
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
        <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-black leading-9">
              Car Inventory
            </h1>
            <p className="text-sm text-[#667085] mt-1">
              Easily manage your fleet add, edit, or track cars all in one place.
            </p>
        </div>
        <button type="button" onClick={() => { setIsAddCarModalOpen(true); console.log("Add Car Clicked"); }} className="w-[9.5rem] text-sm flex items-center px-4 py-3 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-normal rounded-xl transition-colors duration-200 cursor-pointer" >
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
          <InputGroupInput placeholder="Search cars by make, model or plate number" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='outline-0 focus-visible:outline-0 focus-within:ring-0 focus:ring-0 focus:outline-0' />
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
              <DropdownMenuContent align="end" className="[--radius:0.95rem] bg-white shadow-md p-1 rounded-sm z-10">
                <DropdownMenuItem onClick={() => setSortBy("make")} className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Make</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("model")} className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Model</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("year")} className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} data={vehicle} onEdit={() => handleEdit(vehicle.id)} onDelete={() => handleDelete(vehicle.id)} />
        ))}
      </div> */}

      {/* Loading State */}
      {loading ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        /* No Results State */
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg">
          <SearchIcon className="size-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No cars found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Vehicles Grid/List */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {paginatedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                data={vehicle}
                onEdit={() => handleEdit(vehicle.id)}
                onDelete={() => handleDelete(vehicle.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    const isNearCurrent = Math.abs(pageNum - currentPage) <= 1;
                    const isFirstOrLast = pageNum === 1 || pageNum === totalPages;

                    if (isNearCurrent || isFirstOrLast) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={isActive}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (pageNum === 2 || pageNum === totalPages - 1) {
                      return <PaginationEllipsis key={pageNum} />;
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
          </div>
        </>
      )}

      <AddCarModal isOpen={isAddCarModalOpen} onClose={() => setIsAddCarModalOpen(false)} onConfirm={handleAddCarConfirm} />

      <ActionModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Are you sure you want to delete this car?" onConfirm={handleDeleteConfirm} confirmText="Delete" cancelText="Cancel" confirmVariant="danger" />
    </div>
  );
};

export default CarInventory;