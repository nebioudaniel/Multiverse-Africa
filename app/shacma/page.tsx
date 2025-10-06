// src/app/am/shacman-trucks-details/page.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/footer/page';
import Navbar from '@/components/Navbar/page';
import { Package, Award, Globe, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// --- DATA ---
const SHACMAN_IMAGES = [
  // Gallery 1 (3 images)
  { src: "/images/sch3.png", alt: "SHACMAN Dump Truck (Construction Series)" },
  { src: "/images/sch6.png", alt: "SHACMAN Mixer Truck (Concrete Solutions)" },
  { src: "/images/sch5.png", alt: "SHACMAN Cargo Truck (Logistics Model)" },
  
  // Gallery 2 (4 images)
  { src: "/images/cargo.png", alt: "SHACMAN Cargo Transport Truck" },
  { src: "/images/dump.png", alt: "SHACMAN Mining Dump Truck" },
  { src: "/images/oil.png", alt: "SHACMAN Oil Tanker Truck (Specialized)" },
  { src: "/images/oil2.png", alt: "SHACMAN Heavy-Duty Oil Tanker" },
];

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

// --- Gallery Modal Component (Lightbox) ---
const GalleryModal = ({ images, selectedIndex, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedIndex);

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        aria-label="Close Gallery"
      >
        <X size={32} />
      </button>

      {/* Modal Content - prevents closing when clicking the image/nav buttons */}
      <motion.div
        key={currentImageIndex} // Key changes to reset animation on image change
        initial={{ scale: 0.9, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-zinc-800"
      >
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          sizes="(max-width: 1200px) 90vw, 800px"
          className="object-contain"
        />

        {/* Navigation Buttons */}
        <button 
          onClick={goToPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full bg-black/50 hover:bg-black/80 transition"
          aria-label="Previous Image"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full bg-black/50 hover:bg-black/80 transition"
          aria-label="Next Image"
        >
          <ChevronRight size={32} />
        </button>

        {/* Caption/Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm font-semibold">
          {currentImage.alt} ({currentImageIndex + 1} of {images.length})
        </div>
      </motion.div>
    </motion.div>
  );
};


// --- Main Page Component ---
const ShacmanDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

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

        {/* Hero Section */}
        <div className="relative min-h-[60vh] flex items-center justify-center text-center p-8 md:p-16 mb-16 rounded-none md:rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-sky-200 dark:from-zinc-950 dark:to-zinc-800">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-indigo-800 dark:from-blue-400 dark:to-indigo-400">
           SHACMAN Heavy-Duty <span className='text-black'>Truck Solutions</span>
              </span>
            </h1>
            <p className="text-lg md:text-xl font-light text-zinc-700 dark:text-zinc-300">
              Driving industrial growth across the region with reliable, high-performance cargo and construction vehicles.
            </p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">

          
          {/* 1. SHACMAN Main Title and Details Section (Unchanged) */}
          <AnimatedContentSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
                  Heavy-Duty SHACMAN Trucks: Superior Design for <span className='text-blue-600'>Cargo & Dump</span>
                </h2>
                <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Multiverse is proud to partner with SHACMAN, a globally recognized leader in heavy-duty truck manufacturing. With over 50 years of excellence since its founding in 1960, SHACMAN delivers unparalleled strength, reliability, and innovation. Their trucks are engineered to conquer the toughest terrains, providing world-class solutions for construction, mining, and logistics.
                </p>
                <ul className="list-none space-y-3 text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Award className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <span className="font-semibold">Proven Excellence:</span>Over 50 years of manufacturing high-quality heavy-duty trucks.
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <span className="font-semibold">Global Reach:</span>Trucks sold in over 100 countries across Africa, Middle East, Southeast Asia, and more.
                  </li>
                  <li className="flex items-center gap-2">
                    <Package className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <span className="font-semibold">Robust Network:</span>42 overseas offices and 380 service stations with strategically located parts warehouses.
                  </li>
                </ul>
              </div>
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/t1.jpg" // Main SHACMAN image
                  alt="SHACMAN heavy-duty truck in action"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </AnimatedContentSection>

          <Separator className="my-16" />

          {/* GALLERY 1: ADDED HERE (After Main Text Block) */}
          <AnimatedContentSection> 
            <h3 className="text-2xl font-bold tracking-tight text-center mb-12 text-zinc-900 dark:text-white"> 
                Key SHACMAN Truck <span className='text-blue-600'>Models</span> 
            </h3> 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
                {SHACMAN_IMAGES.slice(0, 3).map((image, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }} 
                        whileInView={{ opacity: 1, scale: 1 }} 
                        viewport={{ once: true, amount: 0.5 }} 
                        transition={{ duration: 0.5, delay: index * 0.1 }} 
                        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md cursor-pointer group"
                        onClick={() => openModal(index)} // <-- Click handler
                    > 
                        <Image 
                            src={image.src} 
                            alt={image.alt} 
                            fill 
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                            className="object-cover transition-transform duration-300 group-hover:scale-105" 
                        /> 
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-lg font-semibold p-2 bg-blue-600/70 rounded-lg">View</span>
                        </div>
                    </motion.div> 
                ))}
            </div> 
          </AnimatedContentSection>
          
          <Separator className="my-16" />

          {/* GALLERY 2: SHACMAN Specialized Fleet */}
          <AnimatedContentSection>
            <h3 className="text-2xl font-bold tracking-tight text-center mb-12 text-zinc-900 dark:text-white">
               SHACMAN <span className='text-blue-600'>Specialized Fleet</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> 
                {SHACMAN_IMAGES.slice(3).map((image, index) => (
                    <motion.div 
                        key={index + 3} // Maintain unique key
                        initial={{ opacity: 0, scale: 0.9 }} 
                        whileInView={{ opacity: 1, scale: 1 }} 
                        viewport={{ once: true, amount: 0.5 }} 
                        transition={{ duration: 0.5, delay: index * 0.1 }} 
                        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md cursor-pointer group"
                        onClick={() => openModal(index + 3)} // <-- Click handler with correct index offset (3)
                    >
                        <Image 
                            src={image.src} 
                            alt={image.alt} 
                            fill 
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 25vw" 
                            className="object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-lg font-semibold p-2 bg-blue-600/70 rounded-lg">View</span>
                        </div>
                    </motion.div>
                ))}
            </div>
          </AnimatedContentSection>

        </div>
      </div>
      
      {/* Gallery Modal - Only renders when isModalOpen is true */}
      <AnimatePresence>
        {isModalOpen && (
          <GalleryModal
            images={SHACMAN_IMAGES}
            selectedIndex={selectedImageIndex}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default ShacmanDetails;