import { useState } from "react";
import AMG from "../../../assets/amg.svg"
import { FilterModal } from '@/components/FilterModal';

const Hero = () => {
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  return (
     <section className="relative bg-[#F3F4F6] overflow-hidden py-0 md:py-30">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold text-[#0D183A] leading-tight">Quality rentals <br /> at affordable <br /> prices.</h1>
              <p className="text-base font-medium text-[#0D183A]">
                Select from a wide range of quality vehicles and effortlessly book your ticket to a lovely driving
                experience
              </p>    
              <p className="text-sm text-gray-500">Reliability. Safety. Comfort.</p>
             
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 "> 
            <img src={AMG} alt="Mercedes-AMG Car" className="w-full h-full object-cover object-left" /> 
            </div>
          </div>
        </div>
        
        <div className="relative z-20 flex items-center justify-center space-x-2 py-10 pt-4 bg-white/70 backdrop-blur-sm p-2 rounded-lg shadow-md w-full">
          <input
            type="text"
            placeholder="Enter car brand of your choice"
            className="flex-1 px-4 py-5 border border-[#687BB1] rounded-md focus:outline-none max-w-6xl"
            onClick={() => setFilterModalOpen(true)}
          />
          <button
            className="absolute right-1/4 top-12 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            <svg width="38" height="43" viewBox="0 0 38 43" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="37.5" y="1" width="41" height="37" rx="17.5" transform="rotate(90 37.5 1)" stroke="#4B61A1" stroke-opacity="0.93"/>
              <path d="M23 12.5L23 24.5M23 24.5C21.3431 24.5 20 25.8431 20 27.5C20 29.1569 21.3431 30.5 23 30.5C24.6569 30.5 26 29.1569 26 27.5C26 25.8431 24.6569 24.5 23 24.5ZM15 18.5L15 30.5M15 18.5C13.3431 18.5 12 17.1569 12 15.5C12 13.8431 13.3431 12.5 15 12.5C16.6569 12.5 18 13.8431 18 15.5C18 17.1569 16.6569 18.5 15 18.5Z" stroke="#4B61A1" stroke-opacity="0.93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

          </button>
          <button className="px-8 py-5 bg-[#F97316] text-base text-white rounded-xl cursor-pointer hover:bg-orange-600">Search</button>
        </div>

        <FilterModal open={filterModalOpen} onOpenChange={setFilterModalOpen} />
      </section>
  )
}

export default Hero