import { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import TransactionTable from '../components/ui/TransactionTable';
import { apiEndpoints } from '../components/lib/apiEndpoints';
import CONFIG from '../components/utils/config';
import { LOCAL_STORAGE_KEYS } from '../components/utils/localStorageKeys';
import { toast } from 'sonner';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import Loader from '@/components/ui/Loader/Loader';
import { RefreshCcw, SquarePen, Trash2 } from 'lucide-react';

interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    name: string;
    code: string;
  };
  date: {
    start: string;
    end: string;
    days: number;
  };
  payment: number;
  status: "Reserved" | "Paid" | "In Progress" | "Completed" | "Cancelled";
  reserved_from: string;
  reserved_to: string;
  car_details?: {
    car_type: string;
    model: string | null;
    license: string;
  };
  guest_details?: {
    name: string;
    email: string;
    phone: string;
  };
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });


  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

      if (!token) {
        toast.error('Please log in to view bookings');
        return;
      }

      const response = await fetch(`${CONFIG.BASE_URL}${apiEndpoints.MY_RESERVATIONS}`, {
        headers: {'Authorization': `Bearer ${token}`}
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      

      const transformedBookings: Booking[] = data.results?.map((reservation: any) => ({
        id: reservation.id?.toString() || `RES-${Math.random().toString(36).substr(2, 9)}`,
        customer: {
          name: reservation.guest_details?.name || reservation.customer?.name || 'N/A',
          email: reservation.guest_details?.email || reservation.customer?.email || 'N/A',
          phone: reservation.guest_details?.phone || reservation.customer?.phone || 'N/A',
        },
        vehicle: {
          name: reservation.car_details?.car_type || 'Unknown Vehicle',
          code: reservation.car_details?.license || 'N/A',
        },
        date: {
          start: new Date(reservation.reserved_from).toLocaleDateString(),
          end: new Date(reservation.reserved_to).toLocaleDateString(),
          days: Math.ceil((new Date(reservation.reserved_to).getTime() - new Date(reservation.reserved_from).getTime()) / (1000 * 3600 * 24)),
        },
        payment: reservation.total_price || reservation.deposit || 0,
        status: mapStatus(reservation.status),
        reserved_from: reservation.reserved_from,
        reserved_to: reservation.reserved_to,
        car_details: reservation.car_details,
        guest_details: reservation.guest_details,
      })) || [];

      setBookings(transformedBookings);
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Map API status to our status types
  const mapStatus = (status: string): Booking['status'] => {
    const statusMap: { [key: string]: Booking['status'] } = {
      'reserved': 'Reserved',
      'paid': 'Paid',
      'confirmed': 'In Progress',
      'active': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'pending': 'Reserved',
    };
    return statusMap[status?.toLowerCase()] || 'Reserved';
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "id",
        header: "BOOKING ID",
        cell: ({ row }) => <span className="font-medium text-[#344054]">{row.original.id}</span>,
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
        header: "RESERVATION TIME",
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
          const status = row.original.status;
          const statusColors = {
            Reserved: "bg-[#EFF8FF] text-[#175CD3]",
            Paid: "bg-[#ECFDF3] text-[#027A48]",
            "In Progress": "bg-[#FFFAEB] text-[#B54708]",
            Completed: "bg-[#F0F9FF] text-[#026AA2]",
            Cancelled: "bg-[#FEF3F2] text-[#B42318]",
          };
          return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "ACTIONS",
        cell: ({ row }) => (
          <div className="flex space-x-2.5">
            <button 
              onClick={() => handleViewDetails(row.original)}
              className="text-[#667085] hover:text-[#344054] cursor-pointer text-sm font-medium"
            >
              <SquarePen size={16} />
            </button>
            <button 
              onClick={() => handleViewDetails(row.original)}
              className="text-[#9333EA] hover:text-[#832fd1] cursor-pointer text-sm font-medium"
            >
              <RefreshCcw size={16} />
            </button>
            <button 
              onClick={() => handleViewDetails(row.original)}
              className="text-[#FE130A] hover:text-[#e81109] cursor-pointer text-sm font-medium"
            >
              <Trash2 size={16} />
            </button>
            {/* {row.original.status === 'Reserved' && (
              <button 
                onClick={() => handleUpdateStatus(row.original.id, 'Paid')}
                className="text-green-600 hover:text-green-800 cursor-pointer text-sm font-medium"
              >
                Mark Paid
              </button>
            )} */}
          </div>
        ),
      },
    ],
    [],
  );

  const handleViewDetails = (booking: Booking) => {
    console.log('View booking details:', booking);
    // You can implement a modal or detail page view here
    toast.info(`Viewing details for booking ${booking.id}`);
  };

  const handleUpdateStatus = (bookingId: string, newStatus: string) => {
    console.log(`Update booking ${bookingId} to ${newStatus}`);
    // Implement status update logic here
    toast.success(`Booking ${bookingId} marked as ${newStatus}`);
    
    // Update local state
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus as Booking['status'] }
        : booking
    ));
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  const pageCount = Math.ceil(bookings.length / pagination.pageSize);


  if (loading) {
    return <div className="flex justify-center items-center h-dvh">
      <Loader type="tailSpin" color="#175CD3" height={40} width={40} />
    </div>;
  }

  return (
    <div className='min-h-screen bg-[#F5F5F5]'>
      <Navbar />
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 ">
        <div>
          <h1 className='text-2xl font-semibold text-black leading-9'>Bookings</h1>
        </div>

        <TransactionTable columns={columns} data={bookings} pageCount={pageCount} pageSize={pagination.pageSize} pageIndex={pagination.pageIndex} isLoading={false} onPaginationChange={setPagination} totalItems={bookings.length} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Total Bookings</h3>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Active</h3>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'In Progress').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Pending Payment</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'Reserved').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
            <p className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'Completed').length}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Bookings