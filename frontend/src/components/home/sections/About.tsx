import React from 'react';
import BMW from "../../../assets/bmw.svg";

const About = () => {
  return (
    <section className="bg-[#B9C2DB]/50 relative overflow-hidden py-12 md:py-52 rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
          
          <div className="space-y-5 md:space-y-6 text-center lg:text-left relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0D183A]">About us</h2>
            <p className="text-sm sm:text-base text-black leading-relaxed px-2 md:px-0">
              We are a leading car rental company dedicated to providing quality vehicles at affordable prices. 
              Our mission is to make car rentals accessible and convenient for everyone. With a wide selection of 
              vehicles and excellent customer service, we ensure your driving experience is smooth and enjoyable.
            </p>
            <div className="flex justify-center lg:justify-start">
              <button className="px-6 py-4 sm:py-5 bg-[#F97316] text-white rounded-xl hover:bg-orange-600 transition cursor-pointer text-sm sm:text-base">
                Book a car
              </button>
            </div>
          </div>

          <div className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 w-full lg:w-1/2 mt-8 lg:mt-0">
            <img
              src={BMW}
              alt="BMW Car"
              className="w-full h-60 sm:h-80 md:h-full object-cover object-center lg:object-left rounded-md lg:rounded-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;