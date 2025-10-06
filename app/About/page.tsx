"use client";

import React, { useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Globe, Lightbulb, UserCheck } from "lucide-react";

// Glowing container component
const GlowContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: -9999, y: -9999 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: -9999, y: -9999 });
    };

    const current = containerRef.current;
    if (current) {
      current.addEventListener("mousemove", handleMouseMove);
      current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (current) {
        current.removeEventListener("mousemove", handleMouseMove);
        current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden p-[2px] group ${className}`}
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      {/* Glowing border */}
      <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.3), transparent 70%)`
        }}
      />
      {/* Inner content */}
      <div className="relative rounded-lg bg-white dark:bg-zinc-950 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-center mb-12">
          About Us
        </h1>

        {/* First two sections */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <GlowContainer>
            <div className="space-y-4 h-full">
              <div className="flex items-center gap-4">
                <Lightbulb className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-semibold tracking-tight">
                  Our Story
                </h2>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                Back in 2020, as the world was thrown into a global pandemic and
                entire supply chains were upended, uncertainty became the norm.
                Businesses faced production halts, delayed shipments, and broken
                links across every stage of the supply chain. In the midst of
                that chaos, we saw a chance to do things differently. With a
                deep background in manufacturing, sourcing, and logistics, we
                decided to step up using our expertise to create a reliable,
                end-to-end service that businesses could depend on.
              </p>
            </div>
          </GlowContainer>

          <GlowContainer>
            <div className="space-y-4 h-full">
              <div className="flex items-center gap-4">
                <Globe className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-semibold tracking-tight">
                  Our Mission
                </h2>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                We launched with one clear mission: to support organizations of
                all sizes, from multinational corporations to fast-moving
                startups, by offering a seamless, transparent, and efficient
                sourcing experience. We positioned ourselves as a partner
                throughout the entire business lifecycle handling everything
                from sourcing raw materials and managing production to
                overseeing quality control, organizing global shipping, and
                streamlining logistics and supply chain operations.
              </p>
            </div>
          </GlowContainer>
        </div>

        <Separator className="my-8" />

        {/* Values section */}
        <GlowContainer>
          <div className="space-y-4 h-full">
            <div className="flex items-center gap-4">
              <UserCheck className="h-6 w-6 text-purple-500" />
              <h2 className="text-2xl font-semibold tracking-tight">
                Our Values
              </h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Integrity, Quality, Innovation, and Collaboration are the pillars
              of our success and guide every decision we make. We believe in
              building strong, lasting relationships with our partners and
              clients.
            </p>
          </div>
        </GlowContainer>
      </div>
    </div>
  );
}
