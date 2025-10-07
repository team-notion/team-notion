import { useState } from "react";
import Logo from "../assets/footerLogo.svg";
import AMG from "../assets/amg.svg";
import Ips from "../assets/ips.svg";
import Ipsm from "../assets/ipsm.svg";
import Ipsu from "../assets/ipsu.svg";
import BMW from "../assets/bmw.svg";
import Porse from "../assets/porse.svg";
import Rita from "../assets/rita.svg";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { CarouselSpacing } from "@/components/CarouselSpacing";
import { Link } from "react-router";

const LandingPage = () => {
  const [open, setOpen] = useState(false);

  const stats = [
    { value: "200+", label: "Vehicles" },
    { value: "50", label: "Locations in Nigeria" },
    { value: "90%", label: "Customer repeat" },
  ];

  const clientLogos = [Ips, Ipsm, Ipsu, Ips, Ipsm];
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
    <div className="bg-white">
      {/* Header */}
      <header className="shadow-md sticky top-0 bg-[#F5F5F5] z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6 md:px-2">
          <img src={Logo} alt="logo" className="h-6" />

          <nav className="hidden md:flex space-x-8">
            {["Home", "Catalog", "Reservations", "About us", "Business Account"].map((item, idx) => (
              <a key={idx} href="#" className="hover:text-[#F97316] transition text-base">
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex space-x-3">
            <button className="px-4 py-2 border border-[#F97316] rounded-md cursor-pointer">
              Log in
            </button>
            <Link to="/business-signup" className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-orange-600 transition cursor-pointer">
              Sign up
            </Link>
          </div>

          <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
            ☰
          </button>
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
              <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-md">Sign up</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center overflow-hidden bg-[#F5F5F5]">
        {/* Text */}
        <div className="z-10 w-full md:w-1/2 px-6 md:px-16 ">
          <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 leading-tight">
            Quality rentals <br /> at affordable <br /> prices.
          </h1>
          <p className="text-[#0D183A] text-base font-medium mt-4 max-w-lg">
            Select from a wide range of quality vehicles and effortlessly book your ticket to a lovely driving
            experience.
          </p>
          <p className="text-gray-700 font-medium pt-4">Reliability. Safety. Comfort.</p>

          <div className="flex items-center space-x-2 pt-4">
            <input
              type="text"
              placeholder="Enter car brand of your choice"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md"
            />
            <button className="px-6 py-3 bg-[#F97316] text-white rounded-md hover:bg-orange-600 cursor-pointer">
              Search
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2">
          <img src={AMG} alt="Mercedes AMG" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Trusted Clients */}
      <section className="bg-white py-12">
        <div className="max-w-xxl mx-auto px-4">
          <p className="text-xl md:text-2xl font-bold mb-8 text-center">
            Trusted by multiple rental companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {clientLogos.map((logo, index) => (
              <img key={index} src={logo} alt={`Client ${index + 1}`} className="h-10 md:h-14" />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative bg-[#D3D7EE] flex flex-col md:flex-row items-center overflow-hidden">
        <div className="w-full md:w-1/2 px-6 md:px-16 py-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0D183A] mb-6">About Us</h2>
          <p className="text-lg text-black font-medium max-w-md mb-8">
            Since 2010, we've revolutionized the car rental industry by providing exceptional vehicles at affordable
            prices. Our commitment to satisfaction and quality has made us a trusted partner worldwide.
          </p>
          <button className="bg-[#F97316] text-white px-6 py-3 rounded-md hover:bg-orange-600 transition cursor-pointer">
            Book a Car
          </button>
        </div>
        <div className="hidden md:block w-1/2">
          <img src={BMW} alt="BMW Car" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-5xl font-bold text-[#0D183A] mb-2">{stat.value}</p>
              <p className="text-[#0D183A] text-base font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Picks */}
      <section className="py-16 text-center mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-[#0D183A] mb-12">Recommended picks</h2>
        <CarouselSpacing />
      </section>

      {/* Top Pick */}
      <section className="relative flex flex-col md:flex-row items-center overflow-hidden bg-gradient-to-r from-[#001EB4] to-[#FAFAFA]">
        <div className="w-full md:w-1/2 px-6 md:px-16 py-16 text-white md:text-[#0D183A]">
          <h2 className="text-3xl font-bold mb-6">Top pick this month</h2>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">Porsche 719 <br /> Cayman</h1>
          <p className="text-base font-semibold mb-8">2 manual 100L</p>
          <button className="bg-[#F97316] text-white px-6 py-3 rounded-md hover:bg-orange-600 transition cursor-pointer">
            Rent now
          </button>
        </div>
        <div className="hidden md:block w-1/2">
          <img src={Porse} alt="Porsche" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-[linear-gradient(to_right,#001EB4,_20% #FFF9F9_20%)] mb-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10 md:gap-20">
          <img src={Rita} alt="Customer" className="w-48 md:w-64 rounded-lg object-cover" />
          <div>
            <h4 className="text-black text-2xl md:text-4xl font-semibold mb-2">Cassandra Rita</h4>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <IoStarSharp key={i} className="text-[#F97316]" />
              ))}
            </div>
            <p className="text-black text-base max-w-xl">
              Notionrides made renting a car super easy. The app is simple, transparent, and lets you even rent out
              your own car for extra cash. Definitely recommend!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12 bg-[#D3D7EE]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-start md:items-end justify-end gap-10">
          {footerLinks.map((group, idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              <h1 className="text-black font-medium text-lg">{group.title}</h1>
              {group.links.map((link, i) => (
                <a key={i} className="text-black font-medium text-sm" href="/">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 mt-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <img src={Logo} alt="Notionrides" className="h-6 mx-auto md:mx-0" />
            <p className="text-[#0D183A] font-bold mt-3">
              © 2025 Notionrides. All rights reserved.
            </p>
          </div>
          <div className="flex gap-5 text-[#0D183A] mt-4 md:mt-0 cursor-pointer">
            <FaInstagram size={24} />
            <FaFacebook size={24} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;