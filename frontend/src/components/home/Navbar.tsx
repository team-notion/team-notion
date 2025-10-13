import React from 'react'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import NavLogo from "../../assets/logo.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

  return (
    <div className="bg-[#F5F5F5] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src={NavLogo} className="h-10" alt="Notion rides" />
          </div>
  
          <nav className="hidden md:flex space-x-8">
            {["Home", "Catalog", "Reservations", "About us", "Business Account"].map((item, idx) => (
              <a key={idx} href="#" className="hover:text-[#F97316] transition text-base">
                {item}
              </a>
            ))}
          </nav>
  
          <div className="hidden md:flex space-x-4">
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
            Business Account
          </a>
          <button className=" px-6 py-2 bg-[#F97316] text-white rounded-md cursor-pointer hover:bg-orange-600 transition w-full"
            onClick={() => navigate("/business-signup")}>
            Sign Up
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar