import React from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurTerms from '../components/OurTerms';
import QuickServices from '../components/QuickServices';
import CategoryChips from '../components/CategoryChips';

const Home = () => {
  return (
    <div className="pb-16 sm:pb-0">
      {/* Swiggy-style delivery strip */}
      <div className="flex items-center justify-between bg-brand-light text-brand-dark px-4 sm:px-6 py-2 text-[11px] sm:text-sm font-semibold rounded-xl mt-3 sm:mt-5">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></span>
          30-40 min delivery in Panipat
        </span>
        <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-sm">
          🏥 Trusted Pharmacy
        </span>
      </div>

      {/* Category chips */}
      <CategoryChips />

      <Hero />

      <QuickServices />

      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <LatestCollection />
        <BestSeller />
      </section>

      <section className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
        <OurTerms />
      </section>
    </div>
  );
};

export default Home;