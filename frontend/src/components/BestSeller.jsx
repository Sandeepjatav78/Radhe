import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import ProductSkeleton from "./ProductSkeleton"; // Make sure path is correct
import { motion } from "framer-motion";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (products && products.length > 0) {
        const filtered = products.filter((item) => item.bestsellar);
        setBestSeller(filtered.slice(0, 5));
        setLoading(false);
    }
  }, [products]);

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="my-16">
      <div className="text-center mb-10">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="text-gray-700">POPULAR</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            MEDICINES
          </span>
        </motion.h2>
        <motion.p
          className="w-full md:w-3/5 mx-auto text-gray-600 text-sm sm:text-base mt-2"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Most trusted and frequently purchased healthcare essentials.
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => <ProductSkeleton key={idx} />)
          : bestSeller.map((item, index) => (
              <motion.div key={item._id || index} variants={itemVariants}>
                {/* --- UPDATED PROPS HERE --- */}
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  // Pharmacy Specific Data
                  salt={item.saltComposition}
                  packSize={item.packSize}
                  isRx={item.prescriptionRequired}
                />
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
};

export default BestSeller;