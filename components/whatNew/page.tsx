import React from 'react';
import Image from 'next/image';
import { Leaf, Handshake, Banknote, Car, Lightbulb, Factory as FactoryIcon, Globe, ArrowRight,Hotel} from 'lucide-react';
import { Separator } from '@/components/ui/separator'; // Make sure this is imported
import Link from 'next/link';
import { ReactNode } from "react";

interface ImpactCardProps {
  icon: ReactNode; // anything that can be rendered (SVG, component, etc.)
  title: string;
  description: string;
}

const WhatsNew = () => {
  return (
    <section className="bg-white text-zinc-900 dark:bg-gray-950 dark:text-white py-16 sm:py-24">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Main Heading and Intro Section */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-3xl uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-2">
            What’s New
          </p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Multiverse is leading a transformative initiative to modernize Ethiopia’s public transportation and build a sustainable future.
          </p>
        </div>

        {/* Project Section: Addis Ababa & Sheger City Transportation Alleviation Project */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          {/* Left Column: Image Gallery with Separators */}
          <div className="lg:w-full flex flex-col items-center">
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/c1.jpg" 
                alt="Main Project Image" 
                width={800}
                height={500}
                className="w-full h-auto object-cover" 
              />
            </div>
            
            <Separator className="my-6 w-full lg:w-3/4 mx-auto" />
            
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/c22.png" 
                  alt="Project detail image 1" 
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover" 
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/c3.jpg" 
                  alt="Project detail image 2" 
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover" 
                />
              </div>
            </div>
          </div>
          
          {/* Right Column: Text Content */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Addis Ababa & Sheger City Transportation Alleviation Project
            </h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Multiverse is leading Ethiopia’s largest urban mobility transformation. In collaboration with the Addis Ababa City Transport Bureau and minibus owners’ associations, we are replacing 5,000 aging minibuses and mid-buses with modern, efficient, and eco-friendly vehicles.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <ImpactCard
                icon={<Car className="h-6 w-6 text-blue-500" />}
                title="Safe, modern transport"
                description="For millions of commuters."
              />
              <ImpactCard
                icon={<Handshake className="h-6 w-6 text-indigo-500" />}
                title="Strong collaboration"
                description="With the Addis Ababa City Transport Bureau."
              />
              <ImpactCard
                icon={<Banknote className="h-6 w-6 text-green-500" />}
                title="Flexible financing"
                description="Ensures affordability for operators."
              />
              <ImpactCard
                icon={<Leaf className="h-6 w-6 text-lime-500" />}
                title="Reduced emissions"
                description="Supporting Ethiopia’s Green Legacy."
              />
            </div>
            <Link href='/adiss'>
            <button className="flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-500 transition-colors self-start">
              Read More
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            </Link>
          </div>
        </div>

        {/* Future Vision Section - Using a similar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Future Vision
            </h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              At Multiverse, we believe in building beyond the present. Our future strategy is anchored in sustainable, industrial, and technology-driven projects that position Ethiopia as a competitive force in Africa.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <ImpactCard 
                icon={<Lightbulb className="h-6 w-6 text-blue-500" />}
                title="Electric Mobility "
                description="Building the backbone of Ethiopia’s green mobility future through local assembly and a nationwide EV charging network."
              />
              <ImpactCard 
                icon={<FactoryIcon className="h-6 w-6 text-purple-500" />}
                title="Caustic Soda Project"
                description="Finalizing feasibility for a USD 60 million plant to supply essential chemicals and create local jobs."
              />
              <ImpactCard 
                icon={<Globe className="h-6 w-6 text-indigo-500" />}
                title="Afreximbank Partnership"
                description="Leveraging ATG, ATEX, and PAPSS to finance and scale projects."
              />
               <ImpactCard 
                icon={<Hotel className="h-6 w-6 text-indigo-500" />}
                title="Real State"
                description="Building  Addis Ababa integrates villas, commercial spaces, and high-rise residences, designed for modern urban living."
              />
            </div>
            <Link href='/more-info'>
            <button className="flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-500 transition-colors self-start">
              Read More
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            </Link>
          </div>
          
          {/* Right Column: Image Gallery with Separators (similar to the above section) */}
          <div className="lg:w-full flex flex-col items-center">
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/f1.png" 
                  alt="Future vision image 1" 
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover" 
                />
              </div>
              <div className="col-span-1 rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/f2.jpg" 
                  alt="Future vision image 2" 
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover" 
                />
              </div>
            </div>
            
            <Separator className="my-6 w-full lg:w-3/4 mx-auto" />
            
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/f3.png" 
                alt="Future vision image 3" 
                width={800}
                height={500}
                className="w-full h-auto object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Reusable Card Component */
const ImpactCard = ({ icon, title, description }: ImpactCardProps) => (
  <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg flex items-start gap-4">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h4 className="text-base font-semibold text-zinc-800 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  </div>
);

export { ImpactCard };
export default WhatsNew;