import CarInventoryCard from '@/components/carInventoryCard'
import CreateReservationModal from '@/components/CreateReservationModal'
import RescheduleReservationModal from '@/components/RescheduleReservationModal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import TransactionTable from '@/components/ui/TransactionTable'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDownIcon, Plus, RefreshCcw, SearchIcon, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TbEdit } from 'react-icons/tb'

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

const ReservationManagement = () => {
  const [isCreateReservationModalOpen, setIsCreateReservationModalOpen] = useState(false)
  const [isRescheduleReservationModalOpen, setIsRescheduleReservationModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const handleCreateReservationConfirm = () => {
    console.log("Create new reservation:");
    setIsCreateReservationModalOpen(false);
  }

  const handleRescheduleReservationConfirm = () => {
    console.log("Reschedule reservation:");
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

  const pageCount = Math.ceil(sampleBookings.length / pagination.pageSize)

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
        <CarInventoryCard data={{ title: "TOTAL RESERVATIONS", value: 20, type: "total reservations" }} />
        <CarInventoryCard data={{ title: "CONFIRMED BOOKINGS", value: 4, type: "confirmed bookings" }} />
        <CarInventoryCard data={{ title: "PENDING BOOKINGS", value: 4, type: "pending bookings" }} />
      </div>

      <div className='bg-white p-4 rounded-lg shadow-sm'>
        <InputGroup>
          <InputGroupInput placeholder="Search reservations by customer, model or plate number" className='outline-0 focus-visible:outline-0 focus-within:ring-0 focus:ring-0 focus:outline-0' />
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
                <DropdownMenuItem className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Make</DropdownMenuItem>
                <DropdownMenuItem className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Model</DropdownMenuItem>
                <DropdownMenuItem className='py-1 px-2 rounded-sm hover:bg-neutral-200 cursor-pointer'>Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>

        <div className='mt-4'>
          <TransactionTable title='Recent Bookings' showButton={false}  columns={columns} data={sampleBookings} pageCount={pageCount} pageSize={pagination.pageSize} pageIndex={pagination.pageIndex} isLoading={false} onPaginationChange={setPagination} totalItems={sampleBookings.length} />
        </div>
      </div>

      <CreateReservationModal isOpen={isCreateReservationModalOpen} onClose={() => setIsCreateReservationModalOpen(false)} onConfirm={handleCreateReservationConfirm} />
      <RescheduleReservationModal isOpen={isRescheduleReservationModalOpen} onClose={() => setIsRescheduleReservationModalOpen(false)} onConfirm={handleRescheduleReservationConfirm} />
    </div>
  )
}

export default ReservationManagement