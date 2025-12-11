import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
        let productsCopy = products.slice();
        
        // Filter logic: Category aur SubCategory match honi chahiye
        productsCopy = productsCopy.filter((item) => category === item.category && subCategory === item.subCategory);
        
        setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        {/* Changed 'Collections' to 'Medicines' */}
        <Title text1={'RELATED'} text2={'MEDICINES'} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
            
            // --- NEW: Pharmacy Props pass kiye ---
            salt={item.saltComposition}
            packSize={item.packSize}
            isRx={item.prescriptionRequired}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;