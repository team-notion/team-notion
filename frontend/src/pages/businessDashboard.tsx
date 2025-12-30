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
  customer: any
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
  rentalValue: number
  balanceDue: number
  reservation_code: string
  has_paid_deposit: boolean
  plate_number: string
  deposit_amount: number
  status: "Pending" | "Confirmed" | "In Progress" | 'Cancelled'
}

const ITEMS_PER_PAGE = 20;

const BusinessDashboard = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rentedCars, setRentedCars] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [availableCars, setAvailableCars] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });


  useEffect(() => {
    if (bookings && bookings.length > 0) {
      const revenue = bookings.reduce((total, booking) => {
        if (booking.has_paid_deposit) {
          return total + Number(booking.payment || 0);
        }
        return total;
      }, 0);
    
      setTotalRevenue(revenue);
    }
  }, [bookings]);


  const fetchCars = async () => {
    setLoading(true);

    try {
      const userId = user?.id || localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);

      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_ALL_CARS_BY_OWNER_ID}${userId}`);

      if (resp.status === 200) {
        const cars = resp?.data?.results;

        if (cars && Array.isArray(cars)) {
          const totalCount = resp?.data?.count;
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Count cars that are currently rented (today falls within reserved_ranges)
          const rentedCount = cars.filter((car: any) => {
            if (!car.reserved_ranges || car.reserved_ranges.length === 0) {
              return false;
            }

            // Check if today falls within any reservation range
            return car.reserved_ranges.some((range: any) => {
              const fromDate = new Date(range.from);
              const toDate = new Date(range.to);
              fromDate.setHours(0, 0, 0, 0);
              toDate.setHours(0, 0, 0, 0);

              return today >= fromDate && today <= toDate;
            });
          }).length;

          // Count available cars (no current reservations)
          const availableCount = cars.filter((car: any) => {
            if (!car.reserved_ranges || car.reserved_ranges.length === 0) {
              return true; // No reservations means available
            }

            // Check if today does NOT fall within any reservation range
            return !car.reserved_ranges.some((range: any) => {
              const fromDate = new Date(range.from);
              const toDate = new Date(range.to);
              fromDate.setHours(0, 0, 0, 0);
              toDate.setHours(0, 0, 0, 0);

              return today >= fromDate && today <= toDate;
            });
          }).length;

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


  useEffect(() => {    
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
              const rentalValue = Number(booking.deposit_amount) + Number(booking.balance_due);
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
                  email: booking.customer_email,
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
                rentalValue: rentalValue ? rentalValue : 0,
                balanceDue: booking.balance_due
                  ? booking.balance_due
                  : 0,
                status: booking.has_paid_deposit ? 'Confirmed' : 'Pending',
                deposit_amount: booking?.deposit_amount || 0,
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
            {/* <span className="text-xs text-[#667085]">{row.original.customer.phone}</span> */}
          </div>
        ),
      },
      {
        accessorKey: "vehicle",
        header: "VEHICLE",
        cell: ({ row }) => (

          <div className="flex flex-col">
            <span className="font-medium text-[#344054]">{row.original.vehicle.name}</span>
            <span className="text-xs text-[#667085]">{row.original.plate_number}</span>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "DATE",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm text-[#344054] font-medium">{row.original.date.days}{' '}{row.original.date.days === 1 ? 'day' : 'days'}</span>
            <span className="text-[#344054] text-xs">
              {row.original.date.start} - {row.original.date.end}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "payment",
        header: "DEPOSIT",
        cell: ({ row }) => {
          const payment = Number(row.original?.payment);
          return (
            <span className="font-medium text-[#344054]">₦ {payment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          )
        },
      },
      {
        accessorKey: "rentalValue",
        header: "RENTAL VALUE",
        cell: ({ row }) => {
          const rentalValue = Number(row.original?.rentalValue);
          return (
            <span className="font-medium text-[#344054]">₦ {rentalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          )
        },
      },
      {
        accessorKey: "balanceDue",
        header: "BALANCE DUE",
        cell: ({ row }) => {
          const balanceDue = Number(row.original?.balanceDue);
          return (
            <span className="font-medium text-[#344054]">₦ {balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          )
        },
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
          const status = row.original.status
          const statusColors = {
            Pending: "bg-[#EFF8FF] text-[#175CD3]",
            Confirmed: "bg-[#ECFDF3] text-[#027A48]",
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

  const totalPages = Math.ceil(totalBookings / ITEMS_PER_PAGE);
  
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
                  value: `₦${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
                  value: `₦{rentedCars}`,
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
                  value: `₦{availableCars}`,
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
          <BusinessDashboardActionCard type="add-car" onClick={() => { setIsAddCarModalOpen(true); }} />
      </div>

      <TransactionTable title='Recent Bookings' showButton={true} buttonText="View all booking" columns={columns} data={bookings} pageCount={totalPages} pageSize={ITEMS_PER_PAGE} pageIndex={pagination.pageIndex} isLoading={bookingsLoading} onPaginationChange={setPagination} totalItems={totalBookings} emptyStateTitle="No bookings yet" emptyStateDescription="You don't have any bookings yet. When customers make reservations, they'll appear here." onButtonClick={() => navigate('/reservation-management')} />

      <AddCarModal isOpen={isAddCarModalOpen} onClose={() => setIsAddCarModalOpen(false)} onConfirm={() => { handleAddCarConfirm; fetchCars(); }} />
    </div>
  )
}

export default BusinessDashboard