import React from 'react';
import { ChevronRight, ShieldCheck, Handshake, RefreshCw, Factory, Users, Lightbulb } from 'lucide-react';

// Our Values Data
const values = [
  {
    title: 'Excellence & Quality',
    description: 'We ensure superior quality and performance in every project, adhering to global standards.',
    icon: ShieldCheck,
  },
  {
    title: 'Transparency & Trust',
    description: 'Integrity is at the heart of our operations. We build partnerships on honesty and mutual trust.',
    icon: Handshake,
  },
  {
    title: 'Fair & Competitive Pricing',
    description: 'We are committed to providing exceptional value without compromising quality.',
    icon: Lightbulb,
  },
  {
    title: 'Timely Delivery',
    description: 'Our promise is reliable execution on schedule, managing projects with precision.',
    icon: RefreshCw,
  },
  {
    title: 'Sustainability & Innovation',
    description: 'We support green growth and facilitate technology transfer for a more sustainable future.',
    icon: Factory,
  },
  {
    title: 'Partnership & Commitment',
    description: 'We believe in building long-term, win-win relationships with all our stakeholders.',
    icon: Users,
  },
];

const OurValues = () => {
  return (
    <section className="bg-white dark:bg-zinc-950 py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="text-3xl font-semibold text-blue-600 dark:text-blue-400 uppercase">Our Values</span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2 mb-4">
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          We have a vision to help many other people to be even more successful. This is what we effectively work for every day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {values.map((value, index) => (
          <div key={index} className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-3 flex-shrink-0">
                <value.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{value.title}</h3>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurValues;