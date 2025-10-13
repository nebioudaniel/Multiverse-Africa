'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, MapPin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className=" border-t border-gray-200 pt-34 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 text-center lg:text-left">
        
        {/* About Us */}
        <div>
          {/* Logo */}
          <div className="flex justify-center lg:justify-start mb-4">
            <Image
              src="/h.png"
              alt="Multiverse Africa Logo"
              width={130}
              height={80}
              priority
            />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto lg:mx-0">
           Established in 2000, Multiverse has evolved into a leading Ethiopian enterprise group shaping the nation’s growth. From industry and real estate to trade finance, electronics, and global commerce, we integrate local strength with international reach. For more than two decades, our subsidiaries have partnered with governments, businesses, and institutions to create jobs, deliver impactful projects, and drive sustainable progress across Ethiopia and beyond.

          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors duration-150">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors duration-150">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center justify-center lg:justify-start gap-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>Addis Ababa, Ethiopia</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-2">
              <Phone className="h-4 w-4 text-indigo-600" />
              <span>+251911221567</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-2">
              <Mail className="h-4 w-4 text-indigo-600" />
              <span>contact@multiverseafrica.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider & Bottom */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>All Rights Reserved © MultiverseAfrica</p>
      </div>
    </footer>
  );
};

export default Footer;
