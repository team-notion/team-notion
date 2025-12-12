import ActionModal from '@/components/ActionModal'
import CarInventoryCard from '@/components/carInventoryCard'
import CreateReservationModal from '@/components/CreateReservationModal'
import { apiEndpoints } from '@/components/lib/apiEndpoints'
import { deleteData, getData, postData } from '@/components/lib/apiMethods'
import { useAuth } from '@/components/lib/authContext'
import RescheduleReservationModal from '@/components/RescheduleReservationModal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import Loader from '@/components/ui/Loader/Loader'
import { Skeleton } from '@/components/ui/skeleton'
import TransactionTable from '@/components/ui/TransactionTable'
import CONFIG from '@/components/utils/config'
import { LOCAL_STORAGE_KEYS } from '@/components/utils/localStorageKeys'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDownIcon, CreditCard, Plus, RefreshCcw, SearchIcon, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import { useNavigate, useSearchParams } from "react-router";
import { toast } from 'sonner';

const DashboardCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <Skeleton className="h-4 w-24 mb-4" />
    <Skeleton className="h-8 w-32 mb-2" />
    <Skeleton className="h-4 w-40" />
  </div>
);

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
  balanceDue: number
  reservation_code: string
  has_paid_deposit: boolean
  plate_number: string
  deposit_amount: number
  status: "Pending" | "Confirmed" | "In Progress" | 'Cancelled'
  car_id: number
  customer_id: string
  reserved_from: string
  reserved_to: string
  pickup_location: string
}

const ITEMS_PER_PAGE = 10;

const ReservationManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalBookings, setTotalBookings] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cancelReservationModalOpen, setCancelReservationModalOpen] = useState(false);
  const [selectedReservationCode, setSelectedReservationCode] = useState('');
  const [selectedCarCode, setSelectedCarCode] = useState('');
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<any>(null);
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

        const params = new URLSearchParams({
          page: pageNumber.toString(),
          page_size: pagination.pageSize.toString(),
        });
        


        if (searchTerm) {
          params.append('search', searchTerm);
        }


        if (confirmedBookingFilter === 'has_paid_deposit') {
          params.append('has_paid_deposit', 'true');
        } else if (confirmedBookingFilter === 'no_deposit') {
          params.append('has_paid_deposit', 'false');
        }

        if (sortBy) {
          params.append('ordering', sortBy);
        }

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.MY_RESERVATIONS}?${params.toString()}`, {
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
                car_id: booking.car,
                customer_id: booking.customer,
                reserved_from: booking.reserved_from,
                reserved_to: booking.reserved_to,
                pickup_location: booking.pickup_location || '',
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
  }, [user, pagination.pageIndex, pagination.pageSize, searchTerm, sortBy, confirmedBookingFilter]);


  const handleEditReservation = (booking: Booking) => {
    setSelectedBookingForEdit({
      reservation_code: booking.reservation_code,
      customer_name: booking.customer.name,
      customer_email: booking.customer.email,
      vehicle_name: booking.vehicle,
      plate_number: booking.plate_number,
      pickup_location: booking.pickup_location,
      reserved_from: booking.reserved_from,
      reserved_to: booking.reserved_to,
      car_id: booking.car_id,
      customer_id: booking.customer_id,
    });

    setIsRescheduleReservationModalOpen(true);
  }

  
  // pagination
  const pageCount = Math.ceil(totalBookings / ITEMS_PER_PAGE)
  const paginatedBookings = bookings;

  const handleCreateReservationConfirm = () => {
    setIsCreateReservationModalOpen(false);
  }
  
  const handleRescheduleReservationConfirm = () => {
    setIsRescheduleReservationModalOpen(false);
  }


  const handleCompletePayment = async (reservationCode: string, depositAmount: number) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

    try {
      setBookingsLoading(true);

      const booking = bookings.find(b => b.reservation_code === reservationCode);

      if (!reservationCode) {
        toast.error('Reservation not found');
        return;
      }

      const initPaymentData = {
        reservation_code: reservationCode,
        amount: Number(depositAmount),
      }

      setIsSubmitting(true);

      const paymentInitResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.INITIALIZE_PAYMENTS}`, initPaymentData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const paymentInitResp = paymentInitResponse.data;

      if (paymentInitResponse.status === 200 || paymentInitResponse.status === 201) {
        const paymentId = paymentInitResp.payment_id;

        const completePaymentResponse = await getData(`${CONFIG.BASE_URL}${apiEndpoints.COMPLETE_PAYMENTS.replace(':id', paymentId)}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const { authorization_url, payment_id } = completePaymentResponse.data;

        sessionStorage.setItem('pending_payment_id', paymentId);
        sessionStorage.setItem('reservation_code', reservationCode);

        window.location.href = authorization_url;
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
          } else {
            toast.error(errData[key]);
          }
        });
      } else {
        toast.error("Failed to create reservation. Please try again.");
      }
    }
    finally {
      setBookingsLoading(false);
    }
  };


  const handleCancel = (reservationCode: string) => {
    setSelectedReservationCode(reservationCode);
    setCancelReservationModalOpen(true);
  };



  const handleCancelConfirm = async (reservation_code: string) => {
    setIsDeleting(true);

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

    try {

      if (!reservation_code) {
        toast.error('Reservation not found');
        return;
      }

      const cancelReservationData = {
        reservation_code: reservation_code,
      }


      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.CANCEL_RESERVATION}`, cancelReservationData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const resp = response.data;

      if (response.status === 200 || response.status === 201) {
        toast.success(resp?.detail || resp?.message);
        setCancelReservationModalOpen(false);
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
      setIsDeleting(true);
      setCancelReservationModalOpen(false);
    }
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
      {
        id: "action",
        header: "ACTION",
        cell: ({ row }) => {
          const booking = row.original;
          const isPending = !booking.has_paid_deposit;

          const reservationStartDate = new Date(booking.reserved_from);
          const reservationEndDate = new Date(booking.reserved_to);
          const today = new Date();

          reservationStartDate.setHours(0, 0, 0, 0);
          reservationEndDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          const isActive = today >= reservationStartDate && today <= reservationEndDate;
    
          const canDelete = !isActive;

          return (
            <div className="flex items-center justify-center mx-auto gap-3">
              {isPending ? (
                <button type='button' onClick={() => { handleCompletePayment(booking.reservation_code, booking.deposit_amount); }} className="flex items-center gap-1.5 text-green-600 text-xs px-2 py-1.5 hover:bg-green-50 rounded-md transition-colors cursor-pointer">
                  <CreditCard className="size-4" />
                  <span className='flex text-nowrap flex-nowrap'>Pay deposit</span>
                </button>
              ) : (
                <>  
                  {/* <button type='button' onClick={() => { setIsRescheduleReservationModalOpen(true) }} className="text-[#9333EA] hover:text-[#61239AFF] cursor-pointer">
                    <RefreshCcw className="size-5" />
                  </button> */}
                  <button type='button' onClick={() => handleCancelConfirm(booking.reservation_code)} className="text-[#FE130A] hover:text-[#BC0D07FF] cursor-pointer">
                      <Trash2 className="size-5" />
                  </button>
                  {/* {canDelete && (
                    <>
                      <button type='button' onClick={() => handleEditReservation(booking)} className="text-[#667085] hover:text-[#344054] cursor-pointer">
                        <TbEdit className="size-5" />
                      </button>
                    </>
                  )} */}
                </>
              )}
            </div>
          )
        },
      },
    ],
    [],
  )


  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-300 rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
            <Loader type="tailSpin" color="#175CD3" height={50} width={50} />
            <p className="text-gray-700 font-medium">Processing payment...</p>
          </div>
        </div>
      )}

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
          {bookingsLoading ? (
            <>
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </>
          )
          : (
            <>
              <CarInventoryCard data={{ title: "REVENUE", value: "$2,400", type: "revenue" }} />
              <CarInventoryCard data={{ title: "TOTAL RESERVATIONS", value: `${totalBookings}`, type: "total reservations" }} />
              <CarInventoryCard data={{ title: "CONFIRMED BOOKINGS", value: `${confirmedBookings}`, type: "confirmed bookings" }} />
              <CarInventoryCard data={{ title: "PENDING BOOKINGS", value: `${pendingBookings}`, type: "pending bookings" }} />
            </>
          )}
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

        <ActionModal isOpen={cancelReservationModalOpen} onClose={() => setCancelReservationModalOpen(false)} title="Do you want to cancel this reservation?" onConfirm={() => handleCancelConfirm(selectedReservationCode)} confirmText="Confirm" cancelText="Cancel" confirmVariant="danger" />
      </div>
    </>
  )
}

export default ReservationManagement