// src/app/am/future-vision/page.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/footer/page';
import Navbar from '@/components/Navbar/page';
import { Car, Factory, Handshake, Network, BarChart2, Zap, UserCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const FutureVisionPage = () => {
  return (
    <>
      <Navbar />
      
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
          
          {/* Video container now takes 3/5 width on medium screens and up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="relative z-10 w-full md:w-3/5 flex justify-center mt-10 md:mt-0 order-2 md:order-1"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl shadow-xl">
              <video
                src="/videos/h21.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                aria-label="Background video of future vision concepts"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
          
          {/* Text container now takes 2/5 width on medium screens and up */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center md:items-end md:w-2/5 md:pl-16 max-w-2xl order-1 md:order-2"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight mb-4 text-right">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                <span className='text-black'>Building Beyond</span> the Present
              </span>
            </h1>
            <p className="text-lg md:text-xl font-light text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto md:mx-0 mb-8 leading-snug text-right">
              At Multiverse, our future strategy is anchored in sustainable, industrial, and technology-driven projects that position Ethiopia as a competitive force in Africa.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Container (all other sections are here) */}
      <div className="container mx-auto px-4 max-w-7xl">
        <Separator className="my-16" />

        {/* EV Ecosystem Section (Image Left, Text Right) */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-16 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/m1.png"
                alt="Electric vehicles charging"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
                EV Ecosystem <span className='text-blue-600'>Development</span>
              </h2>
              <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Building the backbone of Ethiopia’s green mobility future through local assembly and a nationwide EV charging network. This project aims to establish a robust infrastructure that supports the transition to electric vehicles, reducing the country's carbon footprint and dependence on fossil fuels.
              </p>
            </div>
          </div>
        </motion.section>

        <Separator className="my-16" />

        {/* Caustic Soda Project Section (Text Left, Image Right) */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-16 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
                Caustic Soda <span className='text-blue-600'>Project</span>
              </h2>
              <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Finalizing feasibility for a USD 60 million plant to supply essential chemicals and create local jobs. This industrial project is a strategic move to boost local production and reduce reliance on imports for critical materials.
              </p>
            </div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2">
              <Image
                src="/images/f3.png"
                alt="Industrial factory plant"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </motion.section>

        <Separator className="my-16" />

        {/* Afreximbank Partnership Section (Image Left, Text Right) */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-16 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/africa.jpg"
                alt="Business partnership meeting"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
                Afreximbank <span className='text-blue-600'>Partnership</span>
              </h2>
              <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Leveraging ATG, ATEX, and PAPSS to finance and scale projects. This partnership provides a powerful financial backbone for our projects, ensuring we can execute large-scale initiatives efficiently.
              </p>
            </div>
          </div>
        </motion.section>

        <Separator className="my-16" />
        
        {/* Detailed EV Ecosystem Section with image */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-16 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white text-center">
            Paving the Way for Widespread <span className="text-blue-600">EV Adoption</span>
          </h2>
          <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl mb-8">
            <Image
              src="/images/main21.png"
              alt="Diagram of interconnected network on a world map"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
            A critical enabler of widespread electric vehicle (EV) adoption is the development of a well-connected, reliable, and scalable charging infrastructure. To support the growing number of EVs on the road, stable electricity supply and an extensive charging network must be built proactively—well ahead of actual demand. This forward-looking approach is essential to reduce range anxiety, which remains one of the biggest concerns for potential EV users. Moreover, integrating smart grid technologies and renewable energy sources will further enhance the efficiency and sustainability of the charging ecosystem, paving the way for a cleaner, more resilient transportation future.
          </p>
          <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
            The Platform Consists of Three Tiers:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                <UserCheck className="h-5 w-5" />
                <h4 className="font-semibold">User Layer</h4>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Offers services like navigation, QR code charging, real-time status updates, full-charge alerts, and mobile payments.
              </p>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                <Network className="h-5 w-5" />
              <h4 className="font-semibold">Platform Layer</h4>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Enables operators to manage assets, monitor stations, handle orders, run marketing campaigns, and perform analytics.
              </p>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                <Zap className="h-5 w-5" />
                <h4 className="font-semibold">Equipment Layer</h4>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Integrates various charging piles—self-operated, third-party, or public—via the Internet of Things (IoT).
              </p>
            </div>
          </div>
        </motion.section>

        <Separator className="my-16" />

        {/* Trade Financing Section with image */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg mb-16"
        >
          <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl mb-8">
            <Image
              src="/images/main1.jpg"
              alt="Global trade finance concept with handshake"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white text-center">
            Global Trade <span className="text-blue-600">Financing Expertise</span>
          </h2>
          <p className="text-lg font-light text-zinc-600 dark:text-zinc-400 leading-relaxed text-center">
            We excel in trade financing, securing supplier credits through strategic collaborations with global partners, and offering tailored financial solutions to meet diverse business needs.
          </p>
        </motion.section>

      </div>
      <Footer />
    </>
  );
};

export default FutureVisionPage;