import React from 'react';
import { motion } from 'framer-motion';

const NewsLetterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-600 p-8 sm:p-12 shadow-xl text-center text-white"
      >
        <p className="text-2xl sm:text-3xl font-bold">Stay Healthy & Updated!</p>
        <p className="text-emerald-100 mt-3 max-w-xl mx-auto">
          Subscribe to Radhe Pharmacy for health tips, medicine refill reminders, and exclusive discounts on your first order.
        </p>

        <form onSubmit={onSubmitHandler} className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
          <input
            className="w-full flex-1 rounded-full border-none px-5 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-emerald-300"
            type="email"
            placeholder="Enter your email address"
            required
          />
          <button type="submit" className="w-full sm:w-auto rounded-full bg-white text-emerald-700 px-8 py-3 font-bold hover:bg-gray-100 transition shadow-md">
            Subscribe
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default NewsLetterBox;