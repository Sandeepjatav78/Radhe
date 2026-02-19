import React from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurTerms from '../components/OurTerms';
import QuickServices from '../components/QuickServices'

const Home = () => {
  return (
    <div className="pb-16 sm:pb-0">
      <QuickServices />
      <Hero />
      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <LatestCollection />
        <BestSeller />
      </section>
      <OurTerms />
      <section className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* <NewsLetterBox /> */}
      </section>
    </div>
  );
};

export default Home;
