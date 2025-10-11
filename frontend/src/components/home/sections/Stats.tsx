import React from 'react'

const Stats = () => {
    const stats = [
    { value: "200+", label: "Customer served" },
    { value: "50", label: "Locations in Nigeria" },
    { value: "90%", label: "Customer repeat" },
  ];
  
  return (
     <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
             {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-5xl font-bold text-[#0D183A] mb-2">{stat.value}</p>
              <p className="text-[#0D183A] text-base font-bold">{stat.label}</p>
            </div>
          ))}
          </div>
        </div>
      </section>
  )
}

export default Stats