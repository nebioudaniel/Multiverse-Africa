'use client';

import React from 'react';
import Hero from '@/components/hero/page';
import Navbar from '@/components/Navbar/page';
import Partners from '@/components/parthners/page';
import WhatWeOffer from '@/components/what-we-offer/page';
import WhatsNew from '@/components/whatNew/page';
import WhatWeDo from '@/components/service/page';
import Footer from '@/components/footer/page';
import Last from '@/components/last/page';
import { WorldMapDemo } from '@/components/world/page';
import WhoWeAre from '@/components/whoweare/page';
import HeroWithProjectPreview from '@/components/sh/page';
import OxytaneProductPage from '@/components/ol/page';
// The useTranslation hook was not used in the original component, so it's been removed for cleaner code.
// If you need to add translation later, you can re-import and use it.

export default function Page() {
  return (
    <div className="bg-white min-h-screen dark:bg-zinc-900 dark:text-white">
      <div className="flex flex-col items-center justify-center">
        <Navbar />
        <Hero />
        <Partners />
        <WhoWeAre />
        <WhatWeOffer />
        <WhatsNew />
        <WhatWeDo />
        <HeroWithProjectPreview />
        <OxytaneProductPage />
        <Last />
        <WorldMapDemo />
        <Footer />
      </div>
    </div>
  );
}
