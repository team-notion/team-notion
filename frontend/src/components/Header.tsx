// @ts-ignore
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { DashboardLogo } from "../assets"
// import CONFIG from "./utils/config"
// import { errorHandler } from "./utils/errorHandler"
// import { LOCAL_STORAGE_KEYS } from "./utils/localStorageKeys"
// import { apiEndpoints } from "./lib/apiEndpoints"
// import { getData, isTokenExpired } from "./lib/apiMethods"
// import { decodeJWT } from "./utils/decoder"
// import { useNavigate } from "react-router"
import { IoIosNotificationsOutline } from "react-icons/io";

interface HeaderProps {
  sidebarOpen: boolean
}

interface User {
  id: number,
  name: string,
  email: string,
  profileImage?: string | null,
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  // @ts-ignore
  const [user, setUser] = useState<User>()
//   const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
//   const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])


//   const getInitials = useMemo(() => {
//     if (user?.name) {
//       return `${user?.name[0]}`.toUpperCase();
//     }
//     else {
//       return 'A';  
//     }
//   }, [user?.name])
  
  return (
    <header className={`bg-white border-b border-b-[#EAECF0] h-16 fixed top-0 right-0 left-0 z-20 transition-all duration-200 ease-in-out pl-20 lg:pl-0 ${isMobile ? "pl-20" : sidebarOpen ? 'lg:pl-64' : 'lg:pl-32'}`}>
      <div className="flex items-center justify-between h-full px-4 gap-2">
        {!sidebarOpen && (
            <img src={DashboardLogo} alt="Notion Rides" className="size-20 lg:size-24 transition-all duration-200 ease-in-out hidden lg:flex" />
        )}

        {/* Right section */}
        <div className="flex items-center gap-4 ml-auto pr-6 divide-x divide-neutral-200">
          <button className="relative p-2 text-gray-600 hover:text-gray-500 hover:cursor-pointer">
            <IoIosNotificationsOutline className="size-6" />
            <span className="absolute top-1.5 right-2.5 h-1.5 w-1.5 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-3">
            <img src={user?.profileImage || 'User'} alt={user?.name || 'user'} className="w-8 h-8 rounded-full border border-[#EAECF0] relative" />
            <span className="hidden sm:block text-sm text-[#344054] leading-5 font-normal">{user?.name || 'User'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

