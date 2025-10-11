import React from 'react';
import AMG from "../../../assets/amg.svg"

const Hero = () => {
  return (
     <section className="relative bg-[#F5F5F5] overflow-hidden py-0 md:py-30">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold text-[#0D183A] leading-tight">Quality rentals <br /> at affordable <br /> prices.</h1>
              <p className="text-base font-medium text-[#0D183A]">
                Select from a wide range of quality vehicles and effortlessly book your ticket to a lovely driving
                experience
              </p>
              <p className="text-sm text-gray-500">Reliability. Safety. Comfort.</p>

              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="text"
                  placeholder="Enter car brand of your choice"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="px-8 py-3 bg-[#F97316] text-white rounded-md cursor-pointer hover:bg-orange-600">Search</button>
              </div>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 "> 
            <img src={AMG} alt="Mercedes-AMG Car" className="w-full h-full object-cover object-left" /> 
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero