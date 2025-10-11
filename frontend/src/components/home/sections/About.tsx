import React from 'react'
import BMW from "../../../assets/bmw.svg";

const About = () => {
  return (
     <section className="bg-[#B9C2DB] relative overflow-hidden py-10 md:py-52">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-[#0D183A]">About us</h2>
              <p className="text-black text-base leading-relaxed">
                We are a leading car rental company dedicated to providing quality vehicles at affordable prices. Our
                mission is to make car rentals accessible and convenient for everyone. With a wide selection of vehicles
                and excellent customer service, we ensure your driving experience is smooth and enjoyable.
              </p>
              <button className="px-6 py-3 bg-[#F97316] text-white rounded-md hover:bg-orange-600 cursor-pointer">Learn more</button>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 "> 
            <img src={BMW} alt="Mercedes-AMG Car" className="w-full h-full object-cover object-left" /> 
            </div>
          </div>
        </div>
      </section>
  )
}

export default About