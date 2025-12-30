import React from 'react';
import { PhoneCall,  ArrowDown } from 'lucide-react'; // Import ArrowDown
import Image from 'next/image'; // Import Next.js Image component

const App = () => {
  return (
    <section className="relative overflow-hidden bg-white text-black dark:bg-gray-900 dark:text-white pt-16 lg:pt-20 pb-16">
      <div className="container mx-auto max-w-9xl flex flex-col lg:flex-row items-center justify-between gap-12 px-6 sm:px-9">
        {/* Left Section: Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          {/* Refined Nodus Agent Template element */}
          <div className="mb-6 flex items-center justify-center lg:justify-start">
            <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 py-1.5 pl-4 pr-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 hover:border-gray-300 dark:hover:border-gray-600">
            </div>
          </div>

          {/* Main title with gradient effect */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-800 dark:text-white">
          Trade{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              Without Borders
            </span>
            , <br />
            Building the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
            Growth Without Limits.
            </span>
          </h1>

          {/* Description paragraph */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mb-8 leading-relaxed lg:mx-0 mx-auto">
            Established in 2000, Multiverse has evolved into a leading Ethiopian enterprise group
            shaping the nation’s growth. From industry and real estate to trade finance, electronics,
            and global commerce, we integrate local strength with international reach.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="/contact">
              <button
                className="inline-flex items-center justify-center rounded-full text-sm sm:text-base font-medium h-10 px-5 bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <PhoneCall className="mr-2 h-4 w-4" />
                Contact Us
              </button>
            </a>
            <a href="#main-content">
  <button
    className="inline-flex items-center justify-center rounded-full text-sm sm:text-base font-medium h-10 px-5 bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:shadow-md transition-all duration-300 shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
  >
    Read more
    <ArrowDown className="ml-2 h-4 w-4" />
  </button>
</a>
          </div>
          
          {/* Trust indicator */}
        </div>

        {/* Right Section: Three Images - Hidden on Mobile */}
        <div className="hidden lg:grid lg:w-1/2 grid-cols-2 grid-rows-2 gap-6 relative p-4">
          {/* Main image - slightly larger or more prominent */}
          <div className="col-span-2 row-span-1 relative h-72">
            <Image // FIX: Replaced <img> with <Image>
              src="/images/h1.png"
              alt="Modern office building"
              fill // Use fill to make it cover the parent div
              className="rounded-xl shadow-md object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw" // Add sizes prop
              priority // Mark the first image as priority for LCP
            />
          </div>
          {/* Smaller supporting images */}
          <div className="relative h-72">
            <Image // FIX: Replaced <img> with <Image>
              src="/images/h2.png"
              alt="Team collaboration"
              fill // Use fill to make it cover the parent div
              className="rounded-xl shadow-md object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw" // Add sizes prop
            />
          </div>
          <div className="relative h-72">
            <Image // FIX: Replaced <img> with <Image>
              src="/images/h3.png"
              alt="City skyline at sunset"
              fill // Use fill to make it cover the parent div
              className="rounded-xl shadow-md object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw" // Add sizes prop
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
