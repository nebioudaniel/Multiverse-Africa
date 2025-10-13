'use client';
import React from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react'; // Import the ArrowLeft icon
import Footer from '@/components/footer/page';
import NavBar from '@/components/Navbar/page';
import Link from 'next/link';

// Dummy data for the three images in the gallery
const heroImages = [
    { 
      src: '/images/dj1.jpeg', // Replace with your actual image path (e.g., CNG refueling)
      alt: 'CNG Refueling Infrastructure', 
      className: 'lg:col-span-2 lg:row-span-2' // Make the first image larger (2x2 grid)
    },
    { 
      src: '/images/dj2.jpeg', // Replace with your actual image path (e.g., EV minibus)
      alt: 'Electric Minibus Fleet',
      className: ''
    },
    { 
      src: '/images/dj6.jpeg', // Replace with your actual image path (e.g., DEIG partnership)
      alt: 'Cylinder Manufacturing Facility',
      className: ''
    },
];


const CleanMobilityDetails = () => {
  return (
    <>
    {/* Assuming NavBar is responsive */}
    <NavBar/> 
    <div className="pt-20 pb-20 sm:pt-24 sm:pb-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- START: BACK TO HOME LINK --- */}
        <Link
          href="/" // Assuming '/' is your home page route
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 sm:mb-12 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>
        {/* --- END: BACK TO HOME LINK --- */}

        {/* Header Section */}
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Clean  <a className='text-blue-700'>Mobility</a> & Transport
          </h1>
          <p className="mt-4 text-xl text-blue-600 dark:text-blue-400">
            Driving Change. Building Infrastructure. Powering a Cleaner Future.
          </p>
        </header>

        {/* --- START: UPDATED HERO SECTION WITH 3 IMAGES --- */}
        <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center lg:text-left">
                Project Visuals
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-4 rounded-xl overflow-hidden shadow-2xl">
                {heroImages.map((img, index) => (
                    <div 
                        key={index} 
                        // Mobile: 1 image per row, height is 64 (256px). 
                        // Desktop (lg:): uses the grid span classes defined in heroImages data.
                        className={`relative h-64 ${img.className} rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-500/20`}
                    >
                        <Image
                            src={img.src} 
                            alt={img.alt}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-500 hover:scale-105"
                            // Added sizes for better Next/Image performance and responsiveness
                            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                            <p className="text-white text-sm font-medium">{img.alt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {/* --- END: UPDATED HERO SECTION WITH 3 IMAGES --- */}


        {/* Content Grid (for better readability) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Project Overview */}
            <article className="prose dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ethiopia&apos;s Sustainable Shift
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Multiverse is spearheading Ethiopia’s crucial shift toward sustainable urban transport through the adoption of Compressed Natural Gas (CNG) and Electric Vehicle (EV) solutions. This initiative is a cornerstone of the nation’s commitment to reducing carbon emissions and providing reliable public transit.
              </p>
            </article>

            {/* Pilot Project Details */}
            <article className="prose dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                The Addis Ababa and Sheger City Pilot Project
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                In partnership with DEIG (Defense Engineering Industry Group), Multiverse is launching an ambitious pilot project. The goal for the first year is to introduce 5,000 CNG and EV minibuses and mid-buses into service across Addis Ababa and Sheger City. This high-volume deployment aims to immediately demonstrate the economic and environmental viability of clean energy vehicles.
              </p>
            </article>

            {/* Infrastructure and Industrial Capacity */}
            <article className="prose dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Building Local Infrastructure
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                To guarantee the long-term success of the project, Multiverse and DEIG are heavily investing in local CNG infrastructure. This includes the establishment of cylinder manufacturing facilities and refuelling depots. This strategic local development is vital to strengthen Ethiopia’s industrial capacity, create thousands of new jobs, and ensure the entire clean mobility ecosystem can be maintained and scaled domestically.
              </p>
            </article>
          </div>
          
          {/* Sidebar/Key Facts Column (Responsive on Mobile) */}
          <aside className="lg:col-span-1">
            <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">
                Project Snapshot
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex justify-between border-b pb-2 border-blue-200 dark:border-blue-700">
                  <span className="font-semibold">Vehicles in Year 1:</span>
                  <span className="text-blue-600 dark:text-blue-400">5,000 Units</span>
                </li>
                <li className="flex justify-between border-b pb-2 border-blue-200 dark:border-blue-700">
                  <span className="font-semibold">Technology:</span>
                  <span>CNG & Electric (EV)</span>
                </li>
                <li className="flex justify-between border-b pb-2 border-blue-200 dark:border-blue-700">
                  <span className="font-semibold">Core Partner:</span>
                  <span>DEIG (Defense Engineering Industry Group)</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Local Development:</span>
                  <span>CNG Cylinder Manufacturing</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
    {/* Assuming Footer is responsive */}
    <Footer/> 
    </>
  );
};

export default CleanMobilityDetails;