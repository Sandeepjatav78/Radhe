import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const items = [
  {
    img: 'quality_icon', // Ensure you have checkmark/star icon
    title: '100% Genuine Medicines',
    desc: 'Providing high-quality, 100% authentic medicines for you and your family.',
  },
  {
    img: 'exchange_icon', // Use a truck or clock icon if possible
    title: 'Superfast Delivery',
    desc: 'Get your medicines delivered within 24 hours.',
  },
  {
    img: 'support_img',
    title: 'Pharmacist Support',
    desc: 'Call us 24/7 for dosage or medicine help.',
  },
];

const OurTerms = () => {
  return (
    <section className="bg-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
          {items.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-emerald-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="mx-auto mb-4 w-14 h-14 grid place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <img src={assets[card.img]} alt={card.title} className="w-6 h-6 opacity-80" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTerms;