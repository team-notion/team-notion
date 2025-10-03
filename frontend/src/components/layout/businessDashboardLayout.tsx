import { useEffect, useState } from "react"
import { Outlet } from "react-router"
import Sidebar from "../Sidebar"
import Header from "../Header"

const SIDEBAR_WIDTH = 256
const MOBILE_BREAKPOINT = 1024


const BusinessDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      setSidebarOpen(!(window.innerWidth < MOBILE_BREAKPOINT))
    }

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Calculate main content styles based on screen size
  const mainContentStyles = isMobile
    ? { width: "100%", marginLeft: "0" }
    : {
        width: `calc(100% - ${sidebarOpen ? SIDEBAR_WIDTH : 0}px)`,
        marginLeft: sidebarOpen ? `${SIDEBAR_WIDTH}px` : "0",
      }
  
  return (
    <div className="flex h-screen bg-[#F9FAFB] font-[Geist]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-200 ease-in-out ${isMobile ? 'w-full ml-0' : ''}`} style={!isMobile ? mainContentStyles : undefined}>
        <Header sidebarOpen={sidebarOpen} />
        <main className={`overflow-x-hidden trick overflow-y-auto bg-[#F9FAFB] pt-16 `}>
          <div className=" mx-auto px-3 lg:px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default BusinessDashboardLayout