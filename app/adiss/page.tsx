// src/app/am/projects/addis-ababa/page.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, Handshake, Banknote, Factory as FactoryIcon, Globe, CheckCircle, Lightbulb, UserCheck, User, Road, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/footer/page';
import Navbar from '@/components/Navbar/page';
import Link from 'next/link'; // Import Link for navigation
import { Button } from '@/components/ui/button';

// Component for side-by-side layout within a box
const ContentSection = ({ children, className = "" }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8 }}
    className={`mb-16 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg ${className}`}
  >
    {children}
  </motion.section>
);

const ImageGallery = () => {
  const images = [
    { src: '/images/ac1.jpg', alt: 'Addis Ababa city view' },
    { src: '/images/ac2.png', alt: 'Transportation project meeting' },
    { src: '/images/ac3.JPG', alt: 'Modern bus parked at a station' },
    { src: '/images/ac4.jpg', alt: 'Team members discussing plans' },
    { src: '/images/ac5.JPG', alt: 'Ethiopian landscape and road' },
    { src: '/images/ac6.JPG', alt: 'People waiting for public transport' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
      {images.map((img, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-110"
            priority={index < 3}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function AddisAbabaProjectDetailsPage() {
  return (
    <>
    <Navbar/>
    {/* Full-width Hero Section */}
    <div className="text-zinc-900 dark:text-white pt-16 pb-24">
      {/* ADDED: Back to Home Page button */}
      <div className="container mx-auto px-4 max-w-7xl">
        <Link href="/" passHref>
          <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold mb-8 transition-colors duration-200 hover:text-blue-500">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </div>
        </Link>
      </div>

      <div className="relative min-h-[70vh] flex flex-col md:flex-row items-center justify-center p-8 md:p-16 bg-white dark:bg-zinc-900 rounded-none md:rounded-3xl shadow-lg overflow-hidden text-center md:text-left mb-16">
        
        {/* Text content container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center md:items-start md:w-1/2 md:pr-16 max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-5xl text-zinc-900 dark:text-white font-bold tracking-tight mb-4">
            <span className="bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              <span className='text-black'>Urban Mobility</span> <span className='text-blue-600'>for Addis Ababa</span>
            </span>
          </h1>
          <p className="text-lg md:text-xl font-light text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto md:mx-0 mb-8 leading-snug">
            Multiverse is leading a transformative initiative to modernize Ethiopia’s public transportation and build a sustainable future.
          </p>
        </motion.div>
        
        {/* Video container now takes 1/2 width on medium screens and up */}
        <div className="relative z-10 w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl shadow-xl"
          >
            <video
              src="/videos/h1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              aria-label="Background video of Addis Ababa city and modern transport"
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>
    </div>
    
    {/* Main Content Container (all other sections are here) */}
    <div className="container mx-auto px-4 max-w-7xl">
      <Separator className="my-16" />

      {/* Project Overview Section */}
      <ContentSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
              Project <span className='text-blue-600'>Vision & Impact</span> 
            </h2>
            <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Our comprehensive project addresses key urban challenges in Addis Ababa by modernizing the transportation system. We aim to replace 5,000 aging minibuses and mid-buses with modern, efficient vehicles to alleviate traffic congestion, improve air quality, and enhance the daily lives of millions of commuters.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Replaced IconCard with direct div markup */}
              <div className="flex items-start gap-4 p-10 md:p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-all duration-300 hover:shadow-lg">
                <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Enhanced Safety</h4>
                  <p className="text-sm font-light text-zinc-600 dark:text-zinc-400">Safer and more reliable transport for all residents.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-10 md:p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-all duration-300 hover:shadow-lg">
                <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Sustainable Future</h4>
                  <p className="text-sm font-light text-zinc-600 dark:text-zinc-400">Contributing to a greener environment and cleaner air.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-10 md:p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-all duration-300 hover:shadow-lg">
                <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Reduced Congestion</h4>
                  <p className="text-sm font-light text-zinc-600 dark:text-zinc-400">Streamlining urban traffic flow for more efficient travel.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-80 lg:h-full rounded-2xl overflow-hidden shadow-xl lg:col-span-1">
            <Image
              src="/images/c22.png"
              alt="Project detail image"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        </div>
      </ContentSection>
      
      <Separator className="my-16" />

      {/* Strategic Partnerships & King Long Sections in new side-by-side format */}
      <ContentSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Strengthened <span className='text-blue-600'>Strategic Partnerships</span>
            </h2>
            <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Our initiative has solidified a strong collaboration with the Addis Ababa City Transport Bureau. We have executed a formal Memorandum of Understanding (MoU) that outlines our joint commitment to addressing the city's significant transportation challenges. This partnership ensures our efforts are aligned with public policy and urban development goals.
            </p>
            <div className="w-full relative h-72 rounded-2xl overflow-hidden shadow-xl mt-4 lg:hidden">
              <Image
                src="/images/a22.jpg"
                alt="Meeting about the project"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="relative h-96 hidden lg:block rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/a3.png"
              alt="Meeting about the project"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:grid-flow-col-dense">
          <div className="flex flex-col gap-4 order-2 lg:order-1">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Our Partnership with  <span className='text-blue-600'>King Long</span>
            </h2>
            <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We are proud to partner with King Long United Automotive Industry Co., Ltd., a globally recognized bus and coach manufacturer based in China. Since its founding in 1988, King Long has become a leader in innovation and quality. Their advanced technology and diverse product line make them a perfect fit for the Minibus Gradual Replacement Project.
            </p>
            <ul className="list-none space-y-4 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-blue-600 dark:text-blue-400" size={20} />
                Advanced Technology: King Long's vehicles are equipped with modern features that ensure safety and efficiency.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-blue-600 dark:text-blue-400" size={20} />
                Quality and Durability: Their focus on high-quality manufacturing ensures the long-term reliability of the new fleet.
              </li>
            </ul>
          </div>
          <div className="relative h-96 order-1 lg:order-2 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/a4.jpg"
              alt="King Long bus fleet"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </ContentSection>

      {/* Justification Section */}
      <ContentSection>
  <h2 className="text-3xl font-bold tracking-tight text-center mb-6 text-zinc-900 dark:text-white">
    Why We Are Transitioning to Electric Vehicles
  </h2>
  <p className="text-lg font-light text-zinc-700 dark:text-zinc-300 text-center mb-10 leading-relaxed">
    Our long-term vision is sustainability. That’s why we are phasing out diesel engines and embracing electric vehicles, ensuring cleaner, smarter, and more future-ready transport solutions.
  </p>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="flex items-start gap-4 p-10 md:p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-all duration-300 hover:shadow-lg">
      <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
        <Leaf size={32} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Environmental Benefits</h4>
        <p className="text-sm font-light text-zinc-600 dark:text-zinc-400">
          EVs produce zero tailpipe emissions, helping reduce air pollution and carbon footprint compared to diesel engines.
        </p>
      </div>
    </div>
    <div className="flex items-start gap-4 p-10 md:p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-all duration-300 hover:shadow-lg">
      <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
        <Banknote size={32} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Lower Running Costs</h4>
        <p className="text-sm font-light text-zinc-600 dark:text-zinc-400">
          Electricity is cheaper than diesel fuel, and EVs have fewer moving parts, reducing long-term operational costs.
        </p>
      </div>
    </div>
    <div className="flex items-start gap-4 p-10 md:p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-all duration-300 hover:shadow-lg">
      <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
        <FactoryIcon size={32} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Future-Ready Infrastructure</h4>
        <p className="text-sm font-light text-zinc-600 dark:text-zinc-400">
          With governments and private investors expanding charging networks, EVs are becoming increasingly practical for mass adoption.
        </p>
      </div>
    </div>
    <div className="flex items-start gap-4 p-10 md:p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl transition-all duration-300 hover:shadow-lg">
      <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
        <Handshake size={32} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Partnership & Innovation</h4>
        <p className="text-sm font-light text-zinc-600 dark:text-zinc-400">
          Our shift to EVs creates opportunities for collaboration with stakeholders who share our commitment to sustainability.
        </p>
      </div>
    </div>
  </div>
  <motion.p
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
    className="mt-10 text-xl font-bold text-center text-blue-600 dark:text-blue-400"
  >
    <span className="text-black">This is not just a change in engines—</span> it’s a step toward a cleaner, smarter future in transportation.
  </motion.p>
</ContentSection>

       {/* New Section with the Image Gallery and its title */}
      <ContentSection>
          <h2 className="text-3xl font-bold tracking-tight text-center mb-6 text-zinc-900 dark:text-white">
            <span className='text-blue-600'>Our Cars</span> and Associations Photos
          </h2>
          <ImageGallery />
      </ContentSection>
    
    </div>
    <Footer />
    </>
  );
}