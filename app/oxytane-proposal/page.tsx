// src/app/am/oxytane-proposal/page.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import Footer from '@/components/footer/page';
import Navbar from '@/components/Navbar/page';
import { Handshake, ArrowLeft, Globe, Factory, X } from 'lucide-react';
import Link from 'next/link';

// ----------------------------------------------------
// FIX: Define the props interface for type safety
// ----------------------------------------------------
interface AnimatedContentSectionProps {
  children: React.ReactNode;
  delay?: number;
}

// Reusable Content Section with animation
const AnimatedContentSection = ({ children, delay = 0 }: AnimatedContentSectionProps) => (
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

// --- Placeholder for Image Paths (REPLACE WITH YOUR ACTUAL IMAGE PATHS) ---
const PRODUCT_IMAGE_1 = "/images/oxytane-bottle-small.png"; 
const PRODUCT_IMAGE_2 = "/images/oxytane-industrial-barrel.png";
// Ensure you have these images in your public/images directory

const OxytaneProposalPage = () => {
  // State for image dialog (re-added from a previous step)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDialogImage, setCurrentDialogImage] = useState('');

  const openDialog = (imageSrc: string) => {
    setCurrentDialogImage(imageSrc);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentDialogImage('');
  };

  return (
    <>
      <Navbar />
      <div className={`text-zinc-900 dark:text-white pt-16 pb-24 ${isDialogOpen ? 'overflow-hidden' : ''}`}>
        
        {/* Back to Home Page button - Next.js Link fix applied here */}
        <div className="container mx-auto px-4 max-w-7xl">
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold mb-8 transition-colors duration-200 hover:text-blue-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
          </Link>
        </div>

        {/* Hero Section: Proposal to the Ethiopian Government */}
        <div className="relative min-h-[50vh] flex items-center justify-center text-center p-8 md:p-16 mb-16 rounded-none md:rounded-3xl overflow-hidden bg-gradient-to-br from-teal-100 to-green-200 dark:from-zinc-950 dark:to-zinc-800">
          <Image
            src="/images/decarbonization.png" // Placeholder for the graphic on page 3
            alt="Ethiopia Decarbonization Revolution"
            fill
            sizes="100vw"
            className="object-cover opacity-20 dark:opacity-10"
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-800 to-teal-800 dark:from-green-400 dark:to-teal-400">
                A Proposal for Ethiopia: 
              </span>
              <span className='text-zinc-900 dark:text-white'>Decarbonization Revolution</span>
            </h1>
            <p className="text-lg md:text-xl font-light text-zinc-700 dark:text-zinc-300">
          Implementation of Oxytane to align with sustainable energy policies and achieve 2040 emissions standards ahead of schedule.
            </p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Section 1: Environmental Leadership and Carbon Credits */}
         <AnimatedContentSection delay={0.2}>
  <h2 className="text-3xl font-bold tracking-tight text-center mb-12 text-zinc-900 dark:text-white">
  </h2>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
    
    {/* Product Info & Images Column */}
    <div className="lg:col-span-1 space-y-6">
      <h3 className="text-xl font-bold text-center text-zinc-800 dark:text-zinc-200">The Product: Oxytane</h3>
      <div className="flex flex-col items-center gap-6">
          <div 
              className="relative w-48 h-64 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
              onClick={() => openDialog(PRODUCT_IMAGE_1)} 
          >
              <Image
                  src={PRODUCT_IMAGE_1}
                  alt="Oxytane Consumer Bottle"
                  layout="fill"
                  objectFit="contain"
                  className="p-2"
              />
          </div>
          <div 
              className="relative w-64 h-64 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
              onClick={() => openDialog(PRODUCT_IMAGE_2)} 
          >
              <Image
                  src={PRODUCT_IMAGE_2}
                  alt="Oxytane Industrial Barrel"
                  layout="fill"
                  objectFit="contain"
                  className="p-2"
              />
          </div>
      </div>
      <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
          Oxytane is delivered in various scales, from consumer bottles to industrial drums, ready for integration into fuel supply chains.
      </p>
    </div>

    {/* Partnership Details Column */}
    <div className="lg:col-span-2 space-y-6">
      <h3 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-400">Multiverse Africa PLC: The Ethiopian Gateway</h3>
      <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
        Oxytane is partnering with <span className='text-blue-600 text-1xl'>Multiverse Africa PLC</span> to manage the in-country logistics, distribution, and strategic government engagement necessary for a seamless national rollout in Ethiopia. This collaboration ensures local expertise guides global best practices.
      </p>
      <ul className="list-none space-y-3 text-zinc-700 dark:text-zinc-300">
        <li className="flex items-start gap-2">
          <Globe className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" size={20} />
          <span className="font-semibold">Local Integration:</span> Multiverse Africa PLC provides the logistical network to ensure Oxytane reaches all distribution points efficiently across the Ethiopian landscape.
        </li>
        <li className="flex items-start gap-2">
          <Handshake className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" size={20} />
          <span className="font-semibold">Strategic Deployment:</span> Phased introduction starting with government and commercial fleets to immediately maximize national economic and environmental benefits.
        </li>
        <li className="flex items-start gap-2">
          <Factory className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" size={20} />
          <span className="font-semibold">Future Local Production:</span> Commitment to explore and establish local blending or manufacturing facilities, further stimulating Ethiopian industry and job creation.
        </li>
      </ul>
    </div>
  </div>
</AnimatedContentSection>

        </div>
      </div>
      
      <Footer />

      {/* Image Dialog (Modal) - Re-added missing component */}
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={closeDialog}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-800 rounded-lg shadow-2xl p-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeDialog}
                className="absolute top-3 right-3 p-2 bg-white dark:bg-zinc-700 rounded-full text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors z-20"
                aria-label="Close image dialog"
              >
                <X size={24} />
              </button>
              <div className="relative w-full h-[70vh] md:h-[80vh]">
                <Image
                  src={currentDialogImage}
                  alt="Enlarged Product Image"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OxytaneProposalPage;