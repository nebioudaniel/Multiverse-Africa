import React from 'react';
import Image from 'next/image';
import { Lightbulb, Briefcase, Globe, ShieldCheck, Handshake, Landmark } from 'lucide-react';

const WhoWeAre = () => {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 text-black dark:text-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Main Heading and Subtext */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-white relative inline-block">
            <span className="relative z-10">Who We Are</span>
            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl mx-auto">
            Founded in 2000, Multiverse is a diversified business group shaping Ethiopia’s economic transformation.
          </p>
        </div>

        {/* Text Box with combined details */}
        <div className="p-6 lg:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center lg:text-left mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            A Bridge to Global Opportunities
          </h3>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            With over two decades of experience, we have earned the trust of governments, enterprises, financial institutions, and global suppliers. Through our subsidiaries, Multiverse aligns local expertise with international partnerships, making us a bridge between Ethiopia, Africa, and the world.
          </p>
          
          <div className="flex flex-col space-y-4 max-w-lg mx-auto lg:mx-0">
            <div className="flex items-start text-zinc-700 dark:text-zinc-300">
              <Lightbulb className="flex-shrink-0 mr-3 mt-1 h-6 w-6 text-blue-500" />
              <span className="text-sm sm:text-base"> Innovation-driven solutions that shape the future.</span>
            </div>
            <div className="flex items-start text-zinc-700 dark:text-zinc-300">
              <Briefcase className="flex-shrink-0 mr-3 mt-1 h-6 w-6 text-blue-500" />
              <span className="text-sm sm:text-base"> Strategic partnerships for global reach and impact.</span>
            </div>
            <div className="flex items-start text-zinc-700 dark:text-zinc-300">
              <Globe className="flex-shrink-0 mr-3 mt-1 h-6 w-6 text-blue-500" />
              <span className="text-sm sm:text-base"> Commitment to local growth with a global vision.</span>
            </div>
            
            <div className="pt-4 space-y-4">
              <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Our Core Business Areas</h4>
              
              <div className="flex items-start text-zinc-700 dark:text-zinc-300">
                <ShieldCheck className="flex-shrink-0 mr-3 mt-1 h-6 w-6 text-blue-500" />
                <span className="text-sm sm:text-base"> 
                  Financial Solutions: Offering a wide range of financial services, from trade finance to strategic investments, to support business growth and innovation.
                </span>
              </div>
              <div className="flex items-start text-zinc-700 dark:text-zinc-300">
                <Handshake className="flex-shrink-0 mr-3 mt-1 h-6 w-6 text-blue-500" />
                <span className="text-sm sm:text-base">
                  Logistics & Trade: Connecting Ethiopia to the global market with efficient and reliable logistics, import-export, and supply chain management services.
                </span>
              </div>
              <div className="flex items-start text-zinc-700 dark:text-zinc-300">
                <Landmark className="flex-shrink-0 mr-3 mt-1 h-6 w-6 text-blue-500" />
                <span className="text-sm sm:text-base"> 
                  Industrial Ventures: Engaging in local manufacturing and industrial projects that contribute to Ethiopia's economic and green mobility goals.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Single Image Section */}
      </div>
    </section>
  );
};

export default WhoWeAre;