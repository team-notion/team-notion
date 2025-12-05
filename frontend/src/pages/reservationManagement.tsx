import CarInventoryCard from '@/components/carInventoryCard'
import CreateReservationModal from '@/components/CreateReservationModal'
import { apiEndpoints } from '@/components/lib/apiEndpoints'
import { getData } from '@/components/lib/apiMethods'
import { useAuth } from '@/components/lib/authContext'
import RescheduleReservationModal from '@/components/RescheduleReservationModal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import TransactionTable from '@/components/ui/TransactionTable'
import CONFIG from '@/components/utils/config'
import { LOCAL_STORAGE_KEYS } from '@/components/utils/localStorageKeys'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDownIcon, Plus, RefreshCcw, SearchIcon, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import { useNavigate, useSearchParams } from "react-router";
import { toast } from 'sonner';

interface Booking {
  id: string
  customer: any
  vehicle: string
  date: {
    start: string
    end: string
    days: number
  }
  payment: number
  rentalValue: number
  reservation_code: string
  has_paid_deposit: boolean
  plate_number: string
  status: "Reserved" | "Paid" | "In Progress"
}

const ITEMS_PER_PAGE = 20;

const ReservationManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalBookings, setTotalBookings] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [isCreateReservationModalOpen, setIsCreateReservationModalOpen] = useState(false)
  const [isRescheduleReservationModalOpen, setIsRescheduleReservationModalOpen] = useState(false);
  const searchTerm = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sort') as 'vehicle' | "reservation_code" | "plate_number" | 'status') || "vehicle";
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const confirmedBookingFilter = searchParams.get("booking_confirmed") || "all";
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })


  const handleSearchChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    }
    else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  }


  const handleSortChange = (value: 'vehicle' | "reservation_code" | "plate_number" | 'status') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    newParams.set("page", "1"); // Reset to page 1 on sort change
    setSearchParams(newParams);
  };


  const handleAvailabilityChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newParams.delete("booking_confirmed");
    } else {
      newParams.set("booking_confirmed", value);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };


  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };


  useEffect(() => {
    const fetchBookings = async () => {
      setBookingsLoading(true);
  
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

        const pageNumber = pagination.pageIndex + 1;
  
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.MY_RESERVATIONS}?page=${pageNumber}&page_size=${pagination.pageSize}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
  
        if (resp.status === 200) {
          const bookingsData = resp?.data?.results;
          const count = resp?.data?.count || 0;

          if (bookingsData && Array.isArray(bookingsData)) {
            const confirmedCount = bookingsData.filter((bookingData: any) => bookingData.has_paid_deposit).length;
            const pendingCount = bookingsData.filter((bookingData: any) => !bookingData.has_paid_deposit).length;

            setConfirmedBookings(confirmedCount);
            setPendingBookings(pendingCount);
          }
          
          const transformedBookings: Booking[] = await Promise.all(
            bookingsData.map(async (booking: any) => {

              let carDetails;

              try {
                const carResp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_CAR_DETAILS}${booking.car}`);

                carDetails = carResp?.data;
              }
              catch (err: any) {
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
              }

              // Calculate rental days
              const startDate = new Date(booking.reserved_from);
              const endDate = new Date(booking.reserved_to);
              const rentalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

              // Format dates
              const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                  month: 'numeric', 
                  day: 'numeric', 
                  year: 'numeric' 
                });
              };

              const vehicleName = carDetails?.car_type 
                ? `${carDetails.year_of_manufacture || ''} ${carDetails.car_type}`.trim()
                : 'N/A';
    
              const plateNumber = carDetails?.license || 'N/A';
              const reservationCode = booking.reservation_code || booking.id || `RES-${booking.id}`;

              return {
                id: reservationCode,
                customer: {
                  name: `Customer ${booking.customer}`, // Placeholder - fetch from user endpoint
                  // email: 'customer@email.com', // Placeholder
                  // phone: 'N/A', // Placeholder
                },
                vehicle: vehicleName,
                plate_number: plateNumber,
                date: {
                  start: formatDate(booking.reserved_from),
                  end: formatDate(booking.reserved_to),
                  days: rentalDays,
                },
                payment: booking?.amount_paid 
                  ? booking.amount_paid
                  : 0,
                rentalValue: carDetails?.daily_rental_price 
                  ? carDetails.daily_rental_price * rentalDays
                  : 0,
                status: booking.has_paid_deposit ? 'Paid' : 'Reserved',
                has_paid_deposit: booking.has_paid_deposit,
                reservation_code: reservationCode,
              };
            })
          );

          setTotalBookings(count);
          setBookings(transformedBookings);
        }
      }
      catch (err: any) {
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

        setBookings([]);
        setTotalBookings(0);
      }
      finally {
        setBookingsLoading(false);
      }
    }

    if (user?.id) {
      fetchBookings();
    }
  }, [user, pagination.pageIndex, pagination.pageSize]);


  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = bookings.filter((booking) =>
        booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.reservation_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (confirmedBookingFilter === 'has_paid_deposit') {
      filtered = filtered.filter((booking) => booking.has_paid_deposit);
    }
    else if (confirmedBookingFilter === "no_deposit") {
      filtered = filtered.filter((booking) => !booking.has_paid_deposit);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'vehicle') return a.vehicle.localeCompare(b.vehicle);
      if (sortBy === 'reservation_code') return a.reservation_code.localeCompare(b.reservation_code);
      if (sortBy === 'plate_number') return a.plate_number.localeCompare(b.plate_number);
      if (sortBy === 'status') return b.status.localeCompare(a.status);
      return 0;
    })
    
    return filtered;
  }, [searchTerm, sortBy, bookings, confirmedBookingFilter]);
  
  // pagination
  const pageCount = Math.ceil(bookings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  const handleCreateReservationConfirm = () => {
    setIsCreateReservationModalOpen(false);
  }
  
  const handleRescheduleReservationConfirm = () => {
    setIsRescheduleReservationModalOpen(false);
  }

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "id",
        header: "BOOKING ID",
        cell: ({ row }) => <span className="font-medium text-[#344054]">{row.original.id}</span>,
      },
      {
        accessorKey: "customer",
        header: "CUSTOMER",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-[#344054]">{row.original.customer.name}</span>
            <span className="text-xs text-[#667085]">{row.original.customer.email}</span>
            <span className="text-xs text-[#667085]">{row.original.customer.phone}</span>
          </div>
        ),
      },
      {
        accessorKey: "vehicle",
        header: "VEHICLE",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-[#344054]">{row.original.vehicle}</span>
            <span className="text-xs text-[#667085]">{row.original.plate_number}</span>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "DATE",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[#344054]">
              {row.original.date.start} - {row.original.date.end}
            </span>
            <span className="text-xs text-[#667085]">{row.original.date.days} days</span>
          </div>
        ),
      },
      {
        accessorKey: "payment",
        header: "PAYMENT",
        cell: ({ row }) => <span className="font-medium text-[#344054]">${row.original.payment}</span>,
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
          const status = row.original.status
          const statusColors = {
            Reserved: "bg-[#EFF8FF] text-[#175CD3]",
            Paid: "bg-[#ECFDF3] text-[#027A48]",
            "In Progress": "bg-[#FFFAEB] text-[#B54708]",
          }
          return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>{status}</span>
        },
      },
      {
        id: "action",
        header: "ACTION",
        cell: () => (
          <div className="flex items-center gap-3">
            <button type='button' onClick={() => {console.log("Edit reservation"); alert("Edit reservation");}} className="text-[#667085] hover:text-[#344054] cursor-pointer">
              <TbEdit className="size-5" />
            </button>
            <button type='button' onClick={() => { setIsRescheduleReservationModalOpen(true) }} className="text-[#9333EA] hover:text-[#61239AFF] cursor-pointer">
              <RefreshCcw className="size-5" />
            </button>
            <button type='button' onClick={() => {console.log("Delete reservation"); alert("Delete reservation");}} className="text-[#FE130A] hover:text-[#BC0D07FF] cursor-pointer">
              <Trash2 className="size-5" />
            </button>
          </div>
        ),
      },
    ],
    [],
  )


  return (
    <div className='space-y-6 px-0 lg:px-4'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-semibold text-black leading-9'>Reservation Management</h1>
          <p className='text-sm text-[#667085] mt-1'>Track and manage all customer bookings</p>
        </div>
        <button type="button" onClick={() => { setIsCreateReservationModalOpen(true) }} className="w-[11.5rem] text-sm flex items-center px-4 py-3 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-normal rounded-xl transition-colors duration-200 cursor-pointer" >
          <Plus className="inline mr-2 size-5" />
          New Reservation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CarInventoryCard data={{ title: "REVENUE", value: "$2,400", type: "revenue" }} />
        <CarInventoryCard data={{ title: "TOTAL RESERVATIONS", value: `${totalBookings}`, type: "total reservations" }} />
        <CarInventoryCard data={{ title: "CONFIRMED BOOKINGS", value: `${confirmedBookings}`, type: "confirmed bookings" }} />
        <CarInventoryCard data={{ title: "PENDING BOOKINGS", value: `${pendingBookings}`, type: "pending bookings" }} />
      </div>

      <div className='bg-white p-4 rounded-lg shadow-sm'>
        <InputGroup>
          <InputGroupInput value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Search reservations by customer, reservation code or confirmation status" className='outline-0 focus-visible:outline-0 focus-within:ring-0 focus:ring-0 focus:outline-0' />
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
                <DropdownMenuItem onClick={() => handleSortChange('vehicle')} className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Vehicle</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('plate_number')} className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Plate Number</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('reservation_code')} className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Reservation Code</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('status')} className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>

        <div className='mt-4'>
          <TransactionTable title='Recent Bookings' showButton={false} columns={columns} data={paginatedBookings} pageCount={pageCount} pageSize={ITEMS_PER_PAGE} pageIndex={pagination.pageIndex} isLoading={bookingsLoading} onPaginationChange={setPagination} totalItems={totalBookings} />
        </div>
      </div>

      <CreateReservationModal isOpen={isCreateReservationModalOpen} onClose={() => setIsCreateReservationModalOpen(false)} onConfirm={handleCreateReservationConfirm} />
      <RescheduleReservationModal isOpen={isRescheduleReservationModalOpen} onClose={() => setIsRescheduleReservationModalOpen(false)} onConfirm={handleRescheduleReservationConfirm} />
    </div>
  )
}

export default ReservationManagement