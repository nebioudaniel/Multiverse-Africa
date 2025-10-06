// components/HeroWithProjectPreview.jsx (or integrated directly into your main page)
import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroWithProjectPreview = () => {
  return (
    <section className="relative overflow-hidden bg-white text-black dark:bg-gray-900 dark:text-white py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-gray-800 dark:text-white">
            Expanding Horizons: <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Logistics & Living</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our strategic ventures in heavy-duty logistics and transformative real estate, driving progress across Africa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Shacman Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-2xl shadow-xl flex flex-col justify-between h-full"
          >
            <div>
              <div className="relative w-full h-60 mb-6 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/sch.png" // Placeholder for a main Shacman image
                  alt="SHACMAN heavy-duty truck"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                SHACMAN: Powering African Logistics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                As a pioneer in heavy-duty truck manufacturing, SHACMAN delivers strength, reliability, and innovation. With over 50 years of excellence, we provide world-class solutions for construction, mining, and logistics.
              </p>
            </div>
            <Link href="/shacma" passHref>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full text-sm sm:text-base font-medium h-10 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300 w-full lg:w-auto"
              >
                Read More About SHACMAN
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Real Estate Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-2xl shadow-xl flex flex-col justify-between h-full"
          >
            <div>
              <div className="relative w-full h-60 mb-6 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/rel.jpg" // Placeholder for a main real estate image
                  alt="Mixed-use development in Addis Ababa"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                Real Estate: Transforming Addis Ababa
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our transformational 187,000 m² mixed-use development in central Addis Ababa integrates villas, commercial spaces, and high-rise residences, designed for modern urban living.
              </p>
            </div>
            <Link href="/real-state" passHref>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full text-sm sm:text-base font-medium h-10 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300 w-full lg:w-auto"
              >
                Explore Real Estate Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroWithProjectPreview;