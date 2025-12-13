import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory, productId }) => { // <--- Receive productId
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
        let productsCopy = products.slice();
        
        // Filter: Category match AND SubCategory match AND ID NOT matching current product
        productsCopy = productsCopy.filter((item) => 
            category === item.category && 
            subCategory === item.subCategory &&
            item._id !== productId // <--- Exclude current product
        );
        
        setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory, productId]);

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'MEDICINES'} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.length > 0 ? (
           related.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              mrp={item.mrp}
              image={item.image}
              
              salt={item.saltComposition}
              packSize={item.packSize}
              isRx={item.prescriptionRequired}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-sm">No related medicines found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;