import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router"
import { DashboardLogo } from "../assets"
import { FiCalendar, FiHome, FiSettings } from "react-icons/fi"
import { HiOutlineLogout } from "react-icons/hi";
import { AiOutlineCar } from "react-icons/ai"
import { TfiBarChartAlt } from "react-icons/tfi";
import { GoPeople } from "react-icons/go";
import { Menu, X } from 'lucide-react';

const menuItems = [
  { name: "Dashboard", icon: FiHome, path: "/business-dashboard" },
  { name: "Car Inventory", icon: AiOutlineCar, path: "/car-inventory" },
  { name: "Reservation Management", icon: FiCalendar, path: "/reservation-management" },
  { name: "Analytics Dashboard", icon: TfiBarChartAlt, path: "/analytics" },
  { name: "Customers", icon: GoPeople, path: "/customers" },
]


interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-opacity-50 lg:hidden z-40" onClick={() => setIsOpen(false)} />
      )}

      <button className={`fixed p-2 cursor-pointer rounded-md shadow-xs top-4 left-4 z-50 lg:hidden`} onClick={() => setIsOpen(!isOpen)}>
        <Menu className='size-5 text-neutral-700' />
      </button>

      <div
        className={`fixed transform inset-y-0 left-0 overflow-y-auto rounded-br-4xl trick ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${!isMobile ? "lg:translate-x-0" : ""} transition-transform bg-white duration-200 shadown-r-md ease-in-out z-50 divide-neutral-400 border-r-2 border-r-[#EAECF0] ${isOpen ? 'w-[16.25rem]' : 'w-0 lg:w-[16.25rem]'}`}
      >
        <div className={`flex flex-col h-full`}>
          <div className="flex items-center justify-between h-16 px-2">
            <img src={DashboardLogo} alt="Notion Rides" className="size-20 lg:size-24 ml-2" />

            <button className={`p-2 cursor-pointer rounded-md shadow-xs top-4 lg:hidden`} onClick={() => setIsOpen(!isOpen)}>
              <X className='size-5 text-neutral-700' />
            </button>
          </div>



          <nav className="flex flex-col gap-2 items-start flex-1 my-5 px-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 text-gray-600 text-sm font-medium hover:bg-[#175CD317] transition duration-200 ease-in-out cursor-pointer w-full rounded-md outline-none ${
                    isActive ? "bg-[#175CD317] text-[#1D2939] rounded-md border border-[#175CD317]" : ""
                }`}
              >
                  <Icon className="size-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-1 py-4 space-y-3">
            <Link to="/settings" className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-neutral-200 transition-colors" >
              <FiSettings className="size-5 shrink-0" />
              <span>Settings</span>
            </Link>
            <button className="flex items-center justify-start px-3 py-3 w-full rounded-md font-medium text-sm gap-3 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 ease-in-out cursor-pointer outline-none">
              <HiOutlineLogout className="h-5 w-5 mr-3" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar