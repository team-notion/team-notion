import React from 'react';
import { FaInstagram, FaFacebook } from "react-icons/fa";
// Assuming this path is correct:
import Logo from "../../assets/footerLogo.svg";

const Footer = () => {
  const footerLinks = [
    {
      title: "Quick Link",
      links: ["Contact", "About", "Car Rent", "Sponsors"],
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy"],
    },
  ];

  return (
    <footer className="text-gray-800 py-6 bg-[#B9C2DB80] shadow-lg">

      <div className="container mx-auto px-2 lg:px-4 max-w-7xl">
        <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-2 gap-12 pb-10 mb-8">
          
          <div className="md:col-span-1 flex flex-col items-start justify-start">
            <img
              src={Logo}
              alt="Notionrides"
              className="h-14 sm:h-16 mb-3"
            />
            <div className="flex justify-center items-center">
              <p className="text-gray-500 text-xs sm:text-sm">
                © {new Date().getFullYear()} Notionrides. All rights reserved.
              </p>
            </div>
          </div>


          <div className="flex flex-1 gap-12 sm:gap-16 md:gap-20 md:col-span-2 lg:col-span-1 justify-start lg:justify-center">
            {footerLinks.map((group, idx) => (
              <div key={idx} className="flex flex-col space-y-3">
                <h1 className="text-gray-900 font-medium text-base tracking-normal">{group.title}</h1>
                <ul className="space-y-1">
                  {group.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-gray-600 font-normal text-sm hover:text-[#F97316] transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        <div className="gap-4 text-gray-500 md:col-span-1 flex items-start md:items-end justify-start">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram size={22} className="hover:text-[#F97316] transition-colors duration-200" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebook size={22} className="hover:text-[#F97316] transition-colors duration-200" />
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;