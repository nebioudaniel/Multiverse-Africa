"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HeroPage() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/last.png',
    '/last2.png',
    '/last3.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleRedirect = () => {
    router.push("/am/register/step1");
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col md:flex-row items-center justify-center p-8 md:p-16 bg-white dark:bg-zinc-900 overflow-hidden text-center md:text-left">

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center md:items-start md:w-1/2 md:pr-16 max-w-2xl"
      >
        {/* Badge */}
        <Badge
          variant="outline"
          className="mb-6 px-4 py-2 text-sm font-medium text-gray-500 border-gray-300 dark:text-gray-400 dark:border-gray-700 rounded-full"
        >
          Electric Vehicle Registration | የኤሌክትሪክ ተሽከርካሪ ምዝገባ
        </Badge>

        {/* Description */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-zinc-900 dark:text-white font-bold tracking-tight mb-4">
          Start registering now <span className="text-blue-500">for your future</span>.
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto md:mx-0 mb-8 font-light leading-snug">
          Secure your registration and join the next generation of eco-friendly transport.
        </p>

        {/* Button */}
        <Button
          type="button"
          onClick={handleRedirect}
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Register now | ይመዝገቡ
        </Button>
      </motion.div>

      {/* Image Gallery on the right side */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
        <div className="relative w-full max-w-screen-sm h-64 sm:h-96 md:h-[450px] overflow-hidden rounded-3xl shadow-xl">
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={src}
                alt={`Image of an electric vehicle ${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}