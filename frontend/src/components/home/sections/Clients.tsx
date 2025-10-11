import React from 'react'
import Ips from "../../../assets/ips.svg";
import Ipsm from "../../../assets/ipsm.svg";
import Ipsu from "../../../assets/ipsu.svg";

const Clients = () => {

    const clientLogos = [Ips, Ipsm, Ipsu, Ips, Ipsm];

  return (
     <section className="bg-[#F3F4F6] py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <p className="text-center text-blackk text-2xl font-semibold mb-8">Trusted by multiple rental companies</p>
          <div className="flex justify-center items-center space-x-12 flex-wrap gap-8">
            {clientLogos.map((logo, index) => (
              <div  className="w-34 h-22 rounded flex items-center justify-center">
                <img key={index} src={logo} alt={`Client ${index + 1}`} className="" />
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Clients