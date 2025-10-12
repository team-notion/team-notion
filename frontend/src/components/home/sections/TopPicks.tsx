import React from 'react';
import { IoPersonOutline } from "react-icons/io5";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaCarRear } from "react-icons/fa6";
import Porse from "../../../assets/porse.svg";
import { Link } from 'react-router';

const TopPicks = () => {
  return (
    <section className="bg-[#B9C2DB] py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0D183A] mb-3 md:mb-18">Top pick this month</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-5xl font-bold text-black leading-tight">Porsche 718 <br /> Cayman</h3>
              <div className="flex items-center space-x-4 mb-10">
                <span className="text-sm font-bold text-black flex items-center gap-1"><IoPersonOutline /> 2</span>
                <span className="text-sm font-bold text-black flex items-center gap-1"><FaCarRear /> Manual</span>
                <span className="text-sm font-bold text-black flex items-center gap-1"><BsFillFuelPumpFill /> 100lv</span>
              </div>
              <Link to="/reservation" className="px-6 py-3 bg-[#F97316] text-white text-base font-bold rounded-xl hover:bg-orange-60 cursor-pointer">Rent now</Link>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 "> 
            <img src={Porse} alt="Mercedes-AMG Car" className="w-full h-full object-cover object-left" /> 
            </div>
          </div>
        </div>
    </section>
  )
}

export default TopPicks