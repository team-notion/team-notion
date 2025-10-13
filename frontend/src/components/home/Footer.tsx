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
    <footer className="text-white py-12 bg-[#B9C2DB]/50 mt-20 rounded-t-xl">
      {/* Top Section */}
      <div className="container mx-auto px-4 flex flex-col sm:flex-row flex-wrap justify-center md:justify-end gap-8 md:gap-20 text-center sm:text-left">
        {footerLinks.map((group, idx) => (
          <div key={idx} className="flex flex-col space-y-2 min-w-[140px]">
            <h1 className="text-black font-semibold text-lg">{group.title}</h1>
            {group.links.map((link, i) => (
              <a
                key={i}
                href="/"
                className="text-black font-medium text-sm hover:text-[#F97316] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Divider */}
      {/* <div className="border-t border-[#0D183A]/20 my-10 w-11/12 mx-auto"></div> */}

      {/* Bottom Section */}
      <div className="container mx-auto px-4 mt-15 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo + Text */}
        <div className="text-center md:text-left">
          <img
            src={Logo}
            alt="Notionrides"
            className="h-24 sm:h-28 mx-auto md:mx-0 mb-3 md:mb-0"
          />
          <p className="text-[#0D183A] font-bold text-sm sm:text-base">
            © 2025 Notionrides. All rights reserved.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-end gap-6 text-[#0D183A]">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram size={24} className="hover:text-[#F97316] transition-colors" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebook size={24} className="hover:text-[#F97316] transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;