"use client";
import { WorldMap } from "@/components/ui/world-map";
import { motion } from "framer-motion";

export function WorldMapDemo() {
  const ethiopiaHub = { lat: 9.03, lng: 38.74 }; // Updated to Addis Ababa coordinates
  return (
    <div className="py-8 dark:bg-black bg-white w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl dark:text-white text-blue-600">
          Global{" "}
          <span className="text-neutral-400">
            {"Reach".split("").map((letter, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          From Ethiopia to the world, Multiverse bridges industries, markets, and opportunities. Our international networks connect African enterprises with global suppliers, financiers, and buyers — unlocking trade, industrialization, and sustainable development across the continent.
        </p>
      </div>
      <WorldMap
        dots={[
          // Connections from Ethiopia to the specified countries
          { start: ethiopiaHub, end: { lat: 39.9042, lng: 116.4074 } }, // China (Beijing)
          { start: ethiopiaHub, end: { lat: 28.6139, lng: 77.209 } }, // India (New Delhi)
          { start: ethiopiaHub, end: { lat: 11.8251, lng: 42.5903 } }, // Djibouti (Djibouti City)
          { start: ethiopiaHub, end: { lat: -1.2921, lng: 36.8219 } }, // Kenya (Nairobi)
          { start: ethiopiaHub, end: { lat: 30.0444, lng: 31.2357 } }, // Egypt (Cairo)
          { start: ethiopiaHub, end: { lat: -26.2041, lng: 28.0473 } }, // South Africa (Johannesburg)
          { start: ethiopiaHub, end: { lat: 35.7877, lng: -78.643 } }, // North Carolina, USA (Raleigh)
          { start: ethiopiaHub, end: { lat: -14.235, lng: -51.9253 } }, // Brazil
          { start: ethiopiaHub, end: { lat: 55.7558, lng: 37.6173 } }, // Russia (Moscow)
        ]}
      />
    </div>
  );
}