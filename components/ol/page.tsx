// src/app/am/oxytane-product/page.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Gauge, DollarSign, Award, ArrowLeft, ChevronRight } from 'lucide-react'; // Added ChevronRight icon
import Link from 'next/link';

// Assuming these components exist in the project structure
import Footer from '@/components/footer/page';
import Navbar from '@/components/Navbar/page';
import { Separator } from '@/components/ui/separator';

// Reusable Content Section with animation
const AnimatedContentSection = ({ children, delay = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, delay }}
    className="mb-16 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg"
  >
    {children}
  </motion.section>
);

const OxytaneProductPage = () => {
  return (
    <>
      <div className="text-zinc-900 dark:text-white pt-16 pb-24">
        
        {/* Back to Home Page button (Kept empty as it was in the original code, but kept the container) */}
        <div className="container mx-auto px-4 max-w-7xl">
        
        </div>

        {/* Hero-like Title Section */}
        <div className="text-center mb-16 px-4">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-700 dark:from-green-400 dark:to-teal-500">
                    OXYTANE 
                </span>

       <a></a>          Fuel Treatment Product
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-zinc-600 dark:text-zinc-400"
            >
                The self-funding solution for carbon emission reduction and fuel efficiency.
            </motion.p>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Product Image and Description Section */}
          <AnimatedContentSection>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              
              {/* Image Column */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
                className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl lg:col-span-1"
              >
                <Image
                  src="/images/oxytane (1).png" // Placeholder image for the can, based on page 7 of the PDF
                  alt="Oxytane 1 Litre Can"
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-contain"
                />
              </motion.div>

              {/* Details Column */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
                  Revolutionizing Engine Performance and Efficiency
                </h2>
                <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  OXYTANE is a patented fuel treatment designed to work with all fuels consumed in any vehicle or engine. It not only delivers significant cost savings but also dramatically reduces toxic and greenhouse gas emissions.
                </p>
                
                <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">Key Product Highlights</h3>
                <ul className="list-none space-y-4 text-zinc-700 dark:text-zinc-300 mb-8">
                  <li className="flex items-start gap-3">
                    <Zap className="text-green-600 dark:text-green-400 flex-shrink-0" size={24} />
                    <div>
                     <span className="font-bold">Emissions Compliant:</span> Converts any fuel to 2040 emissions compliant standards.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Gauge className="text-green-600 dark:text-green-400 flex-shrink-0" size={24} />
                    <div>
                      <span className="font-bold">Fuel Economy:</span> Increases fuel economy by a minimum of 25% plus. Engine cleaning action restores performance beyond original specifications.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <DollarSign className="text-green-600 dark:text-green-400 flex-shrink-0" size={24} />
                    <div>
                      <span className="font-bold">Net Savings:</span> Priced at 10% of fuel costs, it delivers a minimum 15% net saving, making it a self-funding solution.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="text-green-600 dark:text-green-400 flex-shrink-0" size={24} />
                    <div>
                      <span className="font-bold">Global Standards:</span> Conforms to EU EN590 and International ASTM Standards.
                    </div>
                  </li>
                </ul>

                {/* Read More Button */}
                <Link href="/oxytane-proposal" passHref>
                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-colors duration-200 mt-6"
                    >
                        Read Full Technical Specifications
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </motion.a>
                </Link>
              </div>
            </div>
          </AnimatedContentSection>
        </div>
      </div>
    </>
  );
};

export default OxytaneProductPage;