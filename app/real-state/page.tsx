// src/app/am/real-estate-details/page.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/footer/page';
import Navbar from '@/components/Navbar/page';
import { Truck, Home, Factory, MapPin, Building, Package, Award, Users, ShoppingBag, School, Tv, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

const RealEstateDetails = () => {
  return (
    <>
      <Navbar />
      <div className="text-zinc-900 dark:text-white pt-16 pb-24">
        
        {/* Back to Home Page button */}
        <div className="container mx-auto px-4 max-w-7xl">
          <Link href="/" passHref>
            <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold mb-8 transition-colors duration-200 hover:text-blue-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </div>
          </Link>
        </div>

        {/* Hero Section - Focused on Real Estate */}
        <div className="relative min-h-[60vh] flex items-center justify-center text-center p-8 md:p-16 mb-16 rounded-none md:rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-teal-100 dark:from-zinc-950 dark:to-zinc-800">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-700 dark:from-green-400 dark:to-teal-400">
           Addis Ababa <span className='text-black'>Real Estate Development</span>
              </span>
            </h1>
            <p className="text-lg md:text-xl font-light text-zinc-700 dark:text-zinc-300">
              Transforming urban landscapes with innovative, mixed-use residential and commercial projects.
            </p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Real Estate Development Section (The Main Content) */}
          <AnimatedContentSection>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-8 text-zinc-900 dark:text-white">
              Transforming Addis Ababa: Our <span className='text-blue-600'>Real Estate Vision</span>
            </h2>
            <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 text-center max-w-3xl mx-auto">
              Multiverse is undertaking a transformational 187,000 m² mixed-use development in central Addis Ababa. This ambitious project aims to integrate modern living with commercial vitality, featuring villas, high-rise residences, and essential amenities.
            </p>

            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl mb-12">
              <Image
                src="/images/rel.jpg" // Main real estate overview image
                alt="Overview of Addis Ababa mixed-use development"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>

            {/* Project Details */}
            <div className="space-y-12">
              {/* Phase 1 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-zinc-50 dark:bg-zinc-800 p-6 rounded-xl shadow-md"
              >
                <div className="order-2 lg:order-1">
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <Building size={24} /> First Phase: Flagship Residences
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    The initial phase will feature 75 to 85 G+2 building units, totaling 672 four-bedroom apartment units. This flagship phase is designed to set the standard and drive marketing for subsequent phases.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                    <li><MapPin className="inline-block mr-2 text-blue-500" size={18}/>Prime location near the airport, incorporating soundproof and vibration-resistant materials.</li>
                    <li><Users className="inline-block mr-2 text-blue-500" size={18}/>Dedicated green areas and ample parking.</li>
                    <li><ShoppingBag className="inline-block mr-2 text-blue-500" size={18}/>4,000 m² of integrated shopping and community amenities.</li>
                    <li>Architectural design resembling villa or townhouses.</li>
                  </ul>
                </div>
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg order-1 lg:order-2">
                  <Image
                    src="/images/rel2.png" // Image for Phase 1
                    alt="Rendering of the first phase residential buildings"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Phase 2 */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-zinc-50 dark:bg-zinc-800 p-6 rounded-xl shadow-md"
              >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/rel3.png" // Image for Phase 2
                    alt="Rendering of the second phase apartment units"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <Home size={24} /> Second Phase: Community-Centric Living
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    The second phase consists of 90 G+3 building units, strategically located in the center of the land's decline. These three apartment units will foster a vibrant community environment.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                    <li>Each unit includes 4,000 m² of land for schools, mini-marts, and clinics.</li>
                    <li>Designed to be a central hub for residents, providing essential services.</li>
                  </ul>
                </div>
              </motion.div>

              {/* Phase 3 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-zinc-50 dark:bg-zinc-800 p-6 rounded-xl shadow-md"
              >
                <div className="order-2 lg:order-1">
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <Users size={24} /> Third Phase: Modern Urban Lifestyle
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    The final phase will comprise 105 building units, specifically designed for singles, newly married couples, and modern working families. A total of 3150 apartment units will be constructed.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                    <li>Includes entertainment facilities such as kids' bars and movie theaters.</li>
                    <li>A beautiful green park will be constructed alongside a nearby stream to enhance aesthetic appeal.</li>
                  </ul>
                </div>
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg order-1 lg:order-2">
                  <Image
                    src="/images/rel6.png" // Image for Phase 3
                    alt="Rendering of the third phase with entertainment facilities"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </AnimatedContentSection>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default RealEstateDetails;