import { FiPlus } from "react-icons/fi"
import { AiOutlineCar } from "react-icons/ai"

interface DashboardActionCardProps {
  type: "fleet" | "add-car"
  onClick: () => void
  fleetCount?: number
}

const DashboardActionCard = ({ type, onClick, fleetCount }: DashboardActionCardProps) => {
  if (type === "fleet") {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 cursor-pointer hover:border-[#FA8F45] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">TOTAL FLEET</h3>
          <div className="flex gap-0">
            <AiOutlineCar size={24} className='text-blue-300' />
            <AiOutlineCar size={24} className='text-blue-500' />
            <AiOutlineCar size={24} className='text-blue-300' />
          </div>
        </div>
        <p className="text-3xl font-bold text-black mb-6">{fleetCount || 0}</p>
        <button onClick={onClick} className="w-full py-2.5 px-4 border border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer" >
          Manage cars
        </button>
      </div>
    )
  }

  return (
    <div onClick={onClick} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 transition-colors" >
      <div className='flex items-center justify-between mb-4'>
        <h3 className="text-sm font-medium text-gray-600 mb-4">ADD NEW CAR</h3>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full hover:bg-blue-50 mb-4">
          <FiPlus size={40} className="text-blue-500" />
        </div>
        <p className="text-sm text-gray-500 text-center">Expand your fleet by adding more cars</p>
      </div>
    </div>
  )
}

export default DashboardActionCard
