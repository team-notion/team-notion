import React from 'react';
import Rita from "../../../assets/rita.svg";

const Review = () => {
  return (
    <section className="bg-[#B9C2DB] py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" mb-8">
            <h2 className="text-3xl md:text-5xl font-medium text-[#0D183A]">Customer reviews</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
            <div className="">
              <img src={Rita} alt="Customer" className="w-72 h-full rounded-lg object-cover" />
            </div>

            <div className="space-y-4">
              <div className="">
                <div className=" space-x-2 mb-4">
                  <h4 className="font-medium text-black text-4xl mb-2">Cassandra Rita</h4>
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-black text-base font-medium leading-relaxed">
                  "I had an amazing experience renting from notionrides. The process was smooth, the car was in
                  excellent condition, and the customer service was outstanding. I highly recommend them to anyone
                  looking for quality car rentals at great prices!"
                </p>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}

export default Review