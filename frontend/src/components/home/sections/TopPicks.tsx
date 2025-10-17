import React from 'react';
import { IoPersonOutline } from "react-icons/io5";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaCarRear } from "react-icons/fa6";
import Porse from "../../../assets/porse.svg";
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';

const TopPicks = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#B9C2DB80] py-8 sm:py-10 md:py-12 lg:py-10 border border-gradient-to-r from-[#FFFEFE33] to-[#001EB433] rounded-xl overflow-hidden mb-20">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#0D183A] mb-6 md:mb-8 text-left">Top pick this month</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-0 lg:gap-0">
          <div className="space-y-5 md:space-y-6 text-left z-10 order-2 md:order-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black leading-tight">2010 Nissan <br /> 370Z</h3>
            <div className="flex justify-start text-sm font-semibold gap-3 sm:gap-4">
              <div className='flex gap-1 items-center'><IoPersonOutline size={16} /> 2</div>
              <div className='flex gap-1 items-center'><FaCarRear size={16} /> Manual</div>
              <div className='flex gap-1 items-center'><BsFillFuelPumpFill size={16} /> 100L</div>
            </div>
            <button onClick={() => { navigate("/reservation") }} className="px-6 py-2 lg:py-3 bg-[#F97316] text-white text-sm sm:text-base font-bold rounded-xl hover:bg-orange-600 transition cursor-pointer">Rent now</button>
          </div>

          <div className="w-full lg:w-[40rem] flex h-80 sm:h-96 md:h-full justify-center md:justify-end order-1 md:order-2"> 
            <img src={Porse} alt="Mercedes-AMG Car" className="w-full max-w-sm md:max-w-md lg:max-w-[100rem] h-auto object-contain" /> 
          </div>
        </div>
      </div>
    </section>
  )
}

export default TopPicks