'use client';
import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CleanMobilityHomeCard = () => {
  // Define a dummy link for navigation (replace '/clean-mobility-details' with your actual page route)
  const detailPageLink = '/CleanMobility';

  return (
    // Changed section background to clean white/dark gray for a non-card look
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Responsive Content Container: Removed all card styles (shadows, borders, rounded-2xl, bg-white) */}
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
            
            {/* Image Section (Visible on all sizes, fills half on large screens) */}
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] lg:order-2"> {/* Optional: moved image to the right on desktop */}
              <Image
                src="/images/djmain.png" // Replace with a relevant image path
                alt="Electric and CNG vehicles in Addis Ababa"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
              />
              {/* Image Overlay: Changed overlay color to blue */}
              <div className="absolute inset-0 "></div>
            </div>

            {/* Content Section */}
            <div className="p-0 lg:p-0 pt-8 lg:pt-0 flex flex-col justify-center lg:order-1"> {/* Optional: content on the left on desktop */}
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                Pioneering Initiatives
              </span>
              
              {/* Title: Ensured blue text for 'Mobility' for visual focus */}
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Clean <span className="text-blue-700 dark:text-blue-400">Mobility</span> & Transport
              </h2>

              {/* Shortened Content for Home Page */}
              <p className="text-base text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                Multiverse is driving Ethiopia’s shift toward sustainable urban transport through CNG and electric vehicle (EV) solutions. In partnership with <u className='text-green-500'>DEIG</u>, the company is launching the Addis Ababa and Sheger City Pilot Project, introducing 5,000 CNG and EV minibuses and mid-buses in the first year.
              </p>
              
              {/* Call to Action Button: Changed color scheme to blue */}
             <Link
                href={detailPageLink}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white 
                           bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                           transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              >
                Read More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Optional: Quote section remains clean */}
        <blockquote className="text-center mt-12 text-lg italic text-gray-700 dark:text-gray-400">
            &quot;Driving Change. Building Infrastructure. Powering a Cleaner Future.&quot;
        </blockquote>
      </div>
    </section>
  );
};

export default CleanMobilityHomeCard;