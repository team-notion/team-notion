import { useMemo, useState } from 'react';
import BusinessDashboardCards from '../components/BusinessDashboardCards';
import BusinessDashboardActionCard from '../components/BusinessDashboardActionCard';
import { TbEdit } from "react-icons/tb";
import { ColumnDef } from '@tanstack/react-table';
import TransactionTable from './../components/ui/TransactionTable';
import AddCarModal from '../components/AddCarModal';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const handleAddCarConfirm = () => {
    console.log("Add new car:");
    setIsAddCarModalOpen(false);
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
          <button className="text-[#667085] hover:text-[#344054] cursor-pointer">
            <TbEdit className="size-5" />
          </button>
        ),
      },
    ],
    [],
  )

  const pageCount = Math.ceil(sampleBookings.length / pagination.pageSize)
  
  return (
    <div className='space-y-6 px-2 lg:px-4'>
      <div>
        <h1 className='text-2xl font-semibold text-black leading-9'>Dashboard</h1>
        <p className='text-neutral-600 mt-1'>Welcome back, Favour</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            value: "20",
            change: {
              type: "increase",
              value: 8,
              period: "this week",
            },
          }}
        />
        {/* Available cars card */}
        <BusinessDashboardCards
          data={{
            type: "available cars",
            title: "AVAILABLE CARS",
            value: "8",
            change: {
              type: "",
              value: 60,
              period: "Daily Goal",
            },
          }}
        />
        <BusinessDashboardActionCard type="fleet" fleetCount={30} onClick={() => navigate("/car-inventory")} />
        <BusinessDashboardActionCard type="add-car" onClick={() => { setIsAddCarModalOpen(true); console.log("Add Car Clicked"); }} />
      </div>

      <TransactionTable columns={columns} data={sampleBookings} pageCount={pageCount} pageSize={pagination.pageSize} pageIndex={pagination.pageIndex} isLoading={false} onPaginationChange={setPagination} totalItems={sampleBookings.length} />

      <AddCarModal isOpen={isAddCarModalOpen} onClose={() => setIsAddCarModalOpen(false)} onConfirm={handleAddCarConfirm} />
    </div>
  )
}

export default BusinessDashboard