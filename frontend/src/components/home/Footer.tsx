import React from 'react';
import { FaInstagram, FaFacebook } from "react-icons/fa";
import Logo from "../../assets/footerLogo.svg";

const Footer = () => {

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
    <div>
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

export default Footer