import { useEffect, useMemo, useState } from 'react';
import BusinessDashboardCards from '../components/BusinessDashboardCards';
import BusinessDashboardActionCard from '../components/BusinessDashboardActionCard';
import { TbEdit } from "react-icons/tb";
import { ColumnDef } from '@tanstack/react-table';
import TransactionTable from './../components/ui/TransactionTable';
import AddCarModal from '../components/AddCarModal';
import { useNavigate } from 'react-router';
import { useAuth } from '@/components/lib/authContext';
import { apiEndpoints } from '@/components/lib/apiEndpoints';
import { getData } from '@/components/lib/apiMethods';
import CONFIG from '@/components/utils/config';
import { LOCAL_STORAGE_KEYS } from '@/components/utils/localStorageKeys';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <Skeleton className="h-4 w-24 mb-4" />
    <Skeleton className="h-8 w-32 mb-2" />
    <Skeleton className="h-4 w-40" />
  </div>
);

// Action Card Skeleton Component
const ActionCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <Skeleton className="h-12 w-12 rounded-full mb-4" />
    <Skeleton className="h-6 w-32 mb-2" />
    <Skeleton className="h-4 w-24" />
  </div>
);

interface Booking {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  vehicle: {
    name: string
    code: string
  }
  date: {
    start: string
    end: string
    days: number
  }
  payment: number
  status: "Reserved" | "Paid" | "In Progress"
}

const sampleBookings: Booking[] = [
  {
    id: "RES-001",
    customer: {
      name: "Esther Howard",
      email: "EstherHoward@email.com",
      phone: "+1 (555) 987-6543",
    },
    vehicle: {
      name: "2023 BMW X5",
      code: "LUX-001",
    },
    date: {
      start: "6/18/2025",
      end: "6/24/2025",
      days: 7,
    },
    payment: 840,
    status: "Reserved",
  },
  {
    id: "RES-001",
    customer: {
      name: "Jane Cooper",
      email: "JaneCooper@email.com",
      phone: "+1 (555) 123-4567",
    },
    vehicle: {
      name: "2023 Toyota Camry",
      code: "ABC-123",
    },
    date: {
      start: "4/15/2025",
      end: "4/20/2025",
      days: 5,
    },
    payment: 325,
    status: "Paid",
  },
  {
    id: "RES-001",
    customer: {
      name: "Ronald Richards",
      email: "RonaldRichards@email.com",
      phone: "+1 (555) 456-7890",
    },
    vehicle: {
      name: "2022 Honda Civic",
      code: "XYZ-789",
    },
    date: {
      start: "9/10/2025",
      end: "9/14/2025",
      days: 4,
    },
    payment: 220,
    status: "In Progress",
  },
]

const BusinessDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rentedCars, setRentedCars] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [availableCars, setAvailableCars] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);

      try {
        const userId = user?.id || localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_ALL_CARS_BY_OWNER_ID}${userId}`);

        if (resp.status === 200) {
          const cars = resp?.data?.results;
  
          if (cars && Array.isArray(cars)) {
            const totalCount = resp?.data?.count;
            const rentedCount = cars.filter((car: any) => !car.is_available).length;
            const availableCount = cars.filter((car: any) => car.is_available).length;
  
            setTotalCars(totalCount);
            setRentedCars(rentedCount);
            setAvailableCars(availableCount);
          }
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
      }
      finally {
        setLoading(false);
      }
    }


    
    fetchCars();
  }, [user])
  

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
          
          const transformedBookings: Booking[] = await Promise.all(
            bookingsData.map(async (booking: any) => {

              let carDetails;

              try {
                const carResp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_CAR_DETAILS}${booking.car}`);

                carDetails = carResp?.data;
              }
              catch (err) {
                console.error('Failed to fetch car details:', err);
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

              // return {
              //   id: booking.reservation_code || `RES-${booking.id}`,
              //   customer: {
              //     name: customerDetails?.first_name && customerDetails?.last_name 
              //       ? `${customerDetails.first_name} ${customerDetails.last_name}`
              //       : customerDetails?.username || 'N/A',
              //     email: customerDetails?.email || 'N/A',
              //     phone: customerDetails?.phone_no 
              //       ? `${customerDetails.country_code || ''} ${customerDetails.phone_no}`
              //       : 'N/A',
              //   },
              //   vehicle: {
              //     name: carDetails?.car_type 
              //       ? `${carDetails.year_of_manufacture || ''} ${carDetails.car_type}`.trim()
              //       : 'N/A',
              //     code: carDetails?.license || 'N/A',
              //   },
              //   date: {
              //     start: formatDate(booking.reserved_from),
              //     end: formatDate(booking.reserved_to),
              //     days: rentalDays,
              //   },
              //   payment: carDetails?.daily_rental_price 
              //     ? carDetails.daily_rental_price * rentalDays
              //     : 0,
              //   status: booking.has_paid_deposit ? 'Paid' : 'Reserved',
              // };


              return {
                id: booking.reservation_code || `RES-${booking.id}`,
                customer: {
                  name: `Customer ${booking.customer}`, // Placeholder - fetch from user endpoint
                  email: 'customer@email.com', // Placeholder
                  phone: 'N/A', // Placeholder
                },
                vehicle: {
                  name: carDetails?.car_type 
                    ? `${carDetails.year_of_manufacture || ''} ${carDetails.car_type}`.trim()
                    : 'N/A',
                  code: carDetails?.license || 'N/A',
                },
                date: {
                  start: formatDate(booking.reserved_from),
                  end: formatDate(booking.reserved_to),
                  days: rentalDays,
                },
                payment: carDetails?.daily_rental_price 
                  ? carDetails.daily_rental_price * rentalDays
                  : 0,
                status: booking.has_paid_deposit ? 'Paid' : 'Reserved',
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



  const handleAddCarConfirm = () => {
    setIsAddCarModalOpen(false);
  }

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "id",
        header: "BOOKING ID",
        cell: ({ row }) => <span className="font-medium text-[#344054]">{typeof row.original.id === 'string' ? row.original.id : `RES-${String(row.original.id).padStart(3, '0')}`}</span>,
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
            <span className="font-medium text-[#344054]">{row.original.vehicle.name}</span>
            <span className="text-xs text-[#667085]">{row.original.vehicle.code}</span>
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
        cell: ({ row }) => <span className="font-medium text-[#344054]">₦ {row.original.payment.toLocaleString()}</span>,
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
            Completed: "bg-[#F9FAFB] text-[#344054]",
            Cancelled: "bg-[#FEF3F2] text-[#B42318]",
          }
          return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>{status}</span>
        },
      },
      // {
      //   id: "action",
      //   header: "ACTION",
      //   cell: () => (
      //     <button className="text-[#667085] hover:text-[#344054] cursor-pointer">
      //       <TbEdit className="size-5" />
      //     </button>
      //   ),
      // },
    ],
    [],
  )

  const pageCount = Math.ceil(sampleBookings.length / pagination.pageSize)
  
  return (
    <div className='space-y-6 px-0 lg:px-4'>
      <div>
        <h1 className='text-2xl font-semibold text-black leading-9'>Dashboard</h1>
        <p className='text-neutral-600 mt-1'>Welcome back, {user?.username}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? 
          (
            <>
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
              <ActionCardSkeleton />
            </>
          ) 
          : (
            <>
              <BusinessDashboardCards
                data={{
                  type: "revenue",
                  title: "TODAY'S REVENUE",
                  value: "$2,400",
                  change: {
                    type: "increase",
                    value: 10,
                    period: "",
                  },
                }}
              />
              {/* Rented cars card */}
              <BusinessDashboardCards
                data={{
                  type: "rented cars",
                  title: "RENTED CARS",
                  value: `${rentedCars}`,
                  change: {
                    type: rentedCars ? 0 ? "increase" : 'decrease' : '',
                    value: totalCars > 0 ? Math.round((rentedCars / totalCars) * 100) : 0,
                    period: "this week",
                  },
                }}
              />
              {/* Available cars card */}
              <BusinessDashboardCards
                data={{
                  type: "available cars",
                  title: "AVAILABLE CARS",
                  value: `${availableCars}`,
                  change: {
                    type: "",
                    value: totalCars > 0 ? Math.round((availableCars / totalCars) * 100) : 0,
                    period: "Daily Goal",
                  },
                }}
              />
              <BusinessDashboardActionCard type="fleet" fleetCount={totalCars} onClick={() => navigate("/car-inventory")} />
            </>  
          )}
          <BusinessDashboardActionCard type="add-car" onClick={() => { setIsAddCarModalOpen(true); console.log("Add Car Clicked"); }} />
      </div>

      <TransactionTable title='Recent Bookings' showButton={true} buttonText="View all booking" columns={columns} data={bookings} pageCount={pageCount} pageSize={pagination.pageSize} pageIndex={pagination.pageIndex} isLoading={bookingsLoading} onPaginationChange={setPagination} totalItems={totalBookings} emptyStateTitle="No bookings yet" emptyStateDescription="You don't have any bookings yet. When customers make reservations, they'll appear here." onButtonClick={() => navigate('/reservation-management')} />

      <AddCarModal isOpen={isAddCarModalOpen} onClose={() => setIsAddCarModalOpen(false)} onConfirm={handleAddCarConfirm} />
    </div>
  )
}

export default BusinessDashboard