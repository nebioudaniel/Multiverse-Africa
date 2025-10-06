import React from 'react';
import { Factory, TrendingUp, Zap } from 'lucide-react';
import Image from 'next/image';
import { CardSpotlight } from '../ui/card-spotlight';

const GroupStructure = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Our <span className="text-blue-600 dark:text-blue-400">Group Structure</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            Our diversified group is built on a foundation of specialized companies, each a leader in its respective sector, working together to drive economic growth and innovation across Ethiopia and Africa.
          </p>
        </div>

        {/* Group Structure Cards */}
        <div className="grid gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

          {/* Card 1: Multiverse Enterprise PLC */}
          <CardSpotlight className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex-shrink-0 mb-6 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Factory className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Multiverse Enterprise PLC</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">
              The flagship company of the group, responsible for vehicle assembly, trade finance, real estate development, and manufacturing. It is also an exclusive agent for the Africa Trade Gateway (ATG), Africa Trade Exchange (ATEX), and a registered marketplace agent for PAPSS.
            </p>
            <div className="relative w-full h-48 rounded-lg overflow-hidden mt-auto">
              <Image 
                src="/images/t1.jpg"
                alt="Multiverse Enterprise PLC"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </CardSpotlight>

          {/* Card 2: Multiverse Trading PLC */}
          <CardSpotlight className="p-8 bg-zinc-50  rounded-xl shadow-lg border border-zinc-100">
            <div className="flex-shrink-0 mb-6 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Multiverse Trading PLC</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">
              The group’s international trade arm, specializing in imports, exports, and tenders. It ensures Ethiopia’s access to essential goods, promotes Ethiopian commodities abroad, and strengthens foreign currency inflows.
            </p>
            <div className="relative w-full h-48 rounded-lg overflow-hidden mt-auto">
              <Image 
                src="/images/t2.png"
                alt="Multiverse Trading PLC"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </CardSpotlight>

          {/* Card 3: Multiverse Electronics PLC */}
          <CardSpotlight className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex-shrink-0 mb-6 w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Multiverse Electronics PLC</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">
              A dedicated company supplying consumer electronics, IT solutions, appliances, and EV charging infrastructure. In partnership with Cardinal Industries PLC, it is spearheading Ethiopia’s first large-scale EV charging network.
            </p>
            <div className="relative w-full h-48 rounded-lg overflow-hidden mt-auto">
              <Image 
                src="/images/t3.png"
                alt="Multiverse Electronics PLC"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </CardSpotlight>

        </div>

        {/* Final sentence */}
        <div className="mt-16 text-center text-lg text-zinc-600 dark:text-zinc-400 max-w-4xl mx-auto">
          <p>
            Together, these subsidiaries form Multiverse: a forward-looking group that blends local expertise with global reach to deliver sustainable solutions for Ethiopia and Africa.
          </p>
        </div>

      </div>
    </section>
  );
};

export default GroupStructure;