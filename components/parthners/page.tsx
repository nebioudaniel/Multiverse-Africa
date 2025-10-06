'use client';
import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// Partner logos (for the carousel)
const partnerLogos = [
  { src: '/p1.png', alt: 'Zapier' },
  { src: '/p2.png', alt: 'Spotify' },
  { src: '/p3.png', alt: 'Zoom' },
  { src: '/p4.png', alt: 'Amazon' },
  { src: '/p6.png', alt: 'Adobe' },
  { src: '/p7.png', alt: 'Salesforce' },
  { src: '/p8.png', alt: 'Google' },
  { src: '/p9.png', alt: 'Microsoft' },
  { src: '/p10.png', alt: 'Apple' },
  { src: '/p12.png', alt: 'Apple' },
];

// New partners data (for the new section)
const partners = [
  {
    title: 'Trade and Finance Partners',
    description: 'We are leaders in providing innovative financial and trade solutions, partnering with key institutions to fuel growth.',
    imageUrl: '/images/o1.png', 
    link: '#',
  },
  {
    title: 'Industrial & Vehicle Assembly',
    description: 'Our strategic partnerships drive local vehicle assembly and industrial manufacturing, supporting Ethiopia’s green mobility transition.',
    imageUrl: '/images/02.jpg', 
    link: '/adiss',
  },
  {
    title: 'Global Trading & Logistics',
    description: 'We connect Ethiopia to the world, managing complex logistics and securing access to essential raw materials through our trusted network.',
    imageUrl: '/images/o3.jpg', 
    link: '#',
  },
  {
    title: 'Strategic Partnerships',
    description: 'We build long-term relationships with key shareholders and stakeholders to reinforce our expansion strategy and foster a collaborative ecosystem.',
    imageUrl: '/images/o4.jpg', 
    link: 'adiss',
  },
];

const Partners = () => {
  const plugin = React.useRef(
    Autoplay({
      delay: 1500,
      stopOnInteraction: false,
    })
  );

  return (
    <div id="main-content" className="py-12 sm:py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-center text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Trusted by our{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Partners
          </span>
        </h2>

        {/* Sub text */}
        <p className="text-center text-base sm:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 sm:mb-16">
          Our partnerships are built on trust and a shared vision of success. We are proud to work with the industry’s best.
        </p>

        {/* Logos carousel */}
        <Carousel
          plugins={[plugin.current]}
          opts={{
            loop: true,
            align: 'start',
            slidesToScroll: 1,
          }}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.play}
        >
          <CarouselContent className="items-center">
            {partnerLogos.concat(partnerLogos).map((logo, index) => (
              <CarouselItem
                key={index}
                className="basis-1/3 sm:basis-1/5 md:basis-1/6 lg:basis-1/8"
              >
                <div className="p-3 sm:p-5 flex items-center justify-center">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={100}
                    height={40}
                    className="object-contain max-w-[80px] sm:max-w-[100px] md:max-w-[120px] h-auto"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Our Partners Section - New Section Added Here */}
      <section className="bg-white dark:bg-zinc-900 py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Discover the core areas that define our commitment to building a better future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((card, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500">
                <div className="relative h-56">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 flex-grow">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;