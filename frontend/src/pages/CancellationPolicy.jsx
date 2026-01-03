import React from 'react'
import Title from '../components/Title'

const CancellationPolicy = () => {
  return (
    <div className='px-4 sm:px-10 py-10 max-w-7xl mx-auto'>
      <div className='text-center text-2xl pt-10 border-t mb-10'>
          <Title text1={'CANCELLATION'} text2={'POLICY'} />
      </div>

      <div className='flex flex-col gap-6 text-gray-600 text-sm leading-7 text-justify'>
        
        <h3 className='text-lg font-bold text-gray-800 mt-4'>1. Customer Cancellations</h3>
        <p>You can cancel your order directly from the "My Orders" section <strong>before the order is dispatched</strong> (usually within 1-2 hours of placing it). Once dispatched, cancellations are not accepted.</p>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>2. Cancellations by Radhe Pharmacy</h3>
        <p>We may cancel your order if:</p>
        <ul className='list-disc pl-5'>
            <li>The uploaded prescription is invalid or illegible.</li>
            <li>The product is out of stock.</li>
            <li>The delivery address is non-serviceable.</li>
        </ul>
        <p>In such cases, a full refund will be processed immediately.</p>
      </div>
    </div>
  )
}

export default CancellationPolicy