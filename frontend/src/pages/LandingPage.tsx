import { useState } from "react";
import { Link } from "react-router";
import { CarouselSpacing } from "../components/CarouselSpacing"
import { IoPersonOutline } from "react-icons/io5";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaCarRear } from "react-icons/fa6";
import NavLogo from "../assets/logo.png";
import AMG from "../assets/amg.svg";
import BMW from "../assets/bmw.svg";
import Porse from "../assets/porse.svg";
import Ips from "../assets/ips.svg";
import Ipsm from "../assets/ipsm.svg";
import Ipsu from "../assets/ipsu.svg";
import Rita from "../assets/rita.svg";
import Logo from "../assets/footerLogo.svg";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";


export default function LandingPage() {

  const [open, setOpen] = useState(false);

   const clientLogos = [Ips, Ipsm, Ipsu, Ips, Ipsm];
   

   const stats = [
    { value: "200+", label: "Customer served" },
    { value: "50", label: "Locations in Nigeria" },
    { value: "90%", label: "Customer repeat" },
  ];

   const footerLinks = [
    {
      title: "Quick Links",
      links: ["Contact", "About", "Car Rent", "Sponsors"],
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy", "Car Rent", "Sponsors"],
    },
  ];



  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#F5F5F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer">
              <img src={NavLogo} className="h-10" alt="" />
            </div>

           <nav className="hidden md:flex space-x-8">
            {["Home", "Catalog", "Reservations", "About us", "Business Account"].map((item, idx) => (
              <a key={idx} href="#" className="hover:text-[#F97316] transition text-base">
                {item}
              </a>
            ))}
          </nav>

            <div className="hidden md:flex  space-x-4">
              <button className="px-6 py-2 border-1 border-[#F97316] text-[#F97316] cursor-pointer rounded-md hover:bg-orange-50">
                Log in
              </button>
              <Link to="/business-signup" className="px-6 py-2 bg-[#F97316] text-white rounded-md cursor-pointer hover:bg-orange-600">Sign up</Link>
            </div>

             <button className="md:hidden text-3xl text-[#F97316] font-semibold" onClick={() => setOpen(!open)}>
              ☰
            </button>
          </div>
        </div>

         {open && (
          <div className="md:hidden px-6 pb-4 space-y-4">
            {["Home", "Catalog", "Reservations", "About us", "Business Account"].map((item, idx) => (
              <a key={idx} href="#" className="block">
                {item}
              </a>
            ))}
            <div className="flex space-x-2">
              <button className="w-full border px-4 py-2 rounded-md">Log in</button>
              <Link to="/business-signup" className="w-full bg-orange-500 text-white text-center px-4 py-2 rounded-md">Sign up</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
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

      {/* Trusted Clients */}
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

      {/* About Section */}
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

      {/* Stats Section */}
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

      {/* Recommended Picks */}
      <section className="bg-[#F5F5F5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#0D183A]">Recommended picks</h2>
          </div>
          <CarouselSpacing />
        </div>
      </section>

      {/* Top Pick */}
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
              <button className="px-6 py-3 bg-[#F97316] text-white text-base font-bold rounded-xl hover:bg-orange-60 cursor-pointer">Rent now</button>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 "> 
            <img src={Porse} alt="Mercedes-AMG Car" className="w-full h-full object-cover object-left" /> 
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
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

      {/* Footer */}
      <footer className="text-white py-12 bg-[#B9C2DB] mt-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-start md:items-end md:justify-end gap-10 md:gap-30">
          {footerLinks.map((group, idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              <h1 className="text-black font-medium text-lg">{group.title}</h1>
              {group.links.map((link, i) => (
                <a key={i} className="text-black font-medium text-sm hover:text-[#F97316]" href="/">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
         <div className="container mx-auto px-4 mt-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <img src={Logo} alt="Notionrides" className="h-32 mx-auto md:mx-0" />
            <p className="text-[#0D183A] font-bold mt-3">
              © 2025 Notionrides. All rights reserved.
            </p>
          </div>
          <div className="flex gap-5 text-[#0D183A] mt-4 md:mt-0">
            <FaInstagram size={24} />
            <FaFacebook size={24} />
          </div>
        </div>
      </footer>
    </div>
  )
}
