import React from "react";
import { motion } from "framer-motion";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <motion.p 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-gray-500 font-medium"
      >
          {text1} 
          <span className="text-emerald-700 font-bold ml-2">{text2}</span>
      </motion.p>
      <motion.p 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2 }}
        className="w-8 sm:w-12 h-[2px] bg-emerald-700"
      ></motion.p>
    </div>
  );
};

export default Title;