import { useState } from "react";
import Logo from "../assets/logo.png";
import AMG from "../assets/amg.svg";
import Ips from "../assets/ips.svg";
import Ipsm from "../assets/ipsm.svg";
import Ipsu from "../assets/ipsu.svg";
import BMW from "../assets/bmw.svg";
import Porse from "../assets/porse.svg";
import Rita from "../assets/rita.svg";
import { CarouselSpacing } from "@/components/CarouselSpacing";


const LandingPage = () => {
  const [open, setOpen] = useState(false);

  const stats = [
    { value: "200+", label: "Vehicles" },
    { value: "50", label: "Locations in Nigeria" },
    { value: "90%", label: "Customer repeat" },
  ];

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="shadow-md sticky top-0 bg-white z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center space-x-2 font-bold">
            <img src={Logo} alt="logo" className="h-6" />
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-[#F97316] transition text-base">
              Home
            </a>
            <a href="#" className="hover:text-[#F97316] transition text-base">
              Catalog
            </a>
            <a href="#" className="hover:text-[#F97316] transition text-base">
              Reservations
            </a>
            <a href="#" className="hover:text-[#F97316] transition text-base">
              About us
            </a>
            <a href="#" className="hover:text-[#F97316] transition text-base">
              Open a business account
            </a>
          </nav>

          <div className="hidden md:flex space-x-3">
            <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
              Log in
            </button>
            <button className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-orange-600 transition">
              Sign up
            </button>
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            ☰
          </button>
        </div>

        {open && (
          <div className="md:hidden px-6 pb-4 space-y-4">
            <a href="#" className="block">
              Home
            </a>
            <a href="#" className="block">
              Catalog
            </a>
            <a href="#" className="block">
              Reservations
            </a>
            <a href="#" className="block">
              About us
            </a>
            <a href="#" className="block">
              Open a business account
            </a>
            <div className="flex space-x-2">
              <button className="w-full border px-4 py-2 rounded-md">
                Log in
              </button>
              <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-md">
                Sign up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center shadow-lg rounded-2xl bg-[#DFE2E7] overflow-hidden">
          <div className="w-full md:w-1/2 px-8 py-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D183A] mb-6 leading-snug">
              Quality rentals at affordable prices.
            </h2>
            <p className="text-lg text-[#0D183A] leading-relaxed mb-8">
              Select from a wide range of quality vehicles and effortlessly book
              your ticket to a lovely driving experience.
            </p>
          </div>
          <div className="w-full md:w-1/2 relative">
            <img src={AMG} alt="Car" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Trusted Clients */}
      <section className="py-16 bg-white">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-8">
            Trusted by multiple rental companies
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-12">
            <img src={Ips} alt="" />
            <img src={Ips} alt="" />
            <img src={Ipsm} alt="" />
            <img src={Ipsm} alt="" />
            <img src={Ipsu} alt="" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 relative">
        <div className="container mx-auto flex flex-col md:flex-row items-center shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-[#FBFCFF] to-[#001EB4]">
          <div className="w-full md:w-1/2 px-8 py-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-snug">
              About Us
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Since 2010, we've revolutionized the car rental industry by
              providing exceptional quality vehicles at affordable prices. Our
              commitment to customer satisfaction and continuous improvement has
              made us a trusted partner worldwide.
            </p>
            <button className="bg-[#F97316] text-white px-6 py-3 rounded-md hover:bg-orange-600 transition">
              Book a Car
            </button>
          </div>
          <div className=" md:w-1/2 absolute right-0">
            <img src={BMW} alt="BMW" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl font-bold text-[#0D183A] mb-2">
                {stat.value}
              </div>
              <div className="text-[#0D183A] text-base font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Picks */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-[#0D183A] mb-12 text-center">
            Recommended picks
          </h2>
          <div className="flex flex-row items-center justify-center gap-3">
            <CarouselSpacing />
          </div>
        </div>
      </section>

      {/* Top Pick */}
      <section className="py-16 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between shadow-lg rounded-2xl bg-white overflow-hidden">
          <div className="w-full md:w-1/2 px-8 py-10">
            <h2 className="text-3xl font-bold mb-6">Top pick this month</h2>
            <h1 className="text-4xl md:text-5xl text-[#0D183A] font-bold mb-3 leading-15">
              Porsche 719 <br /> Cayman
            </h1>
            <p className="text-gray-600 text-base font-semibold mb-10">
              2 manual 100L
            </p>
            <button className="bg-[#F97316] text-white px-6 py-3 rounded-md hover:bg-orange-600 transition">
              Rent now
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <img src={Porse} alt="BMW" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 ">
        <div className="container mx-auto px-4 ">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Customer Reviews
          </h2>
          <div className="container flex flex-col md:flex-row items-center gap-20 bg-[#FFF9F9] px-20">
            <img src={Rita} alt="" />
            <div>
              <h4 className="text-black text-4xl font-normal mb-2">Cassandra Rita</h4>
              <p className="text-black text-base font-medium">Notionrides made renting a car super easy. The app is simple to use, has a wide range of cars, and shows clear prices with no surprises. I love that you can also rent out your own car to earn extra money. Definitely recommend!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001EB4] text-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div>
            <img src={Logo} alt="" />
            <p> © 2025 Notionrides. All rights reserved</p>
          </div>
          <div>Quick Links</div>
          <div>Legal</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;