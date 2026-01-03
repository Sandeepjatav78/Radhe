import React from 'react'
import Title from '../components/Title'

const ReturnPolicy = () => {
  return (
    <div className='px-4 sm:px-10 py-10 max-w-7xl mx-auto'>
      <div className='text-center text-2xl pt-10 border-t mb-10'>
          <Title text1={'RETURN &'} text2={'REFUND POLICY'} />
      </div>

      <div className='flex flex-col gap-6 text-gray-600 text-sm leading-7 text-justify'>
        <p>At Radhe Pharmacy, we strive to ensure you receive the correct medicines. However, if there is an issue, our policy is as follows:</p>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>1. Eligibility for Returns</h3>
        <p>You can return items within <strong>7 days</strong> of delivery if:</p>
        <ul className='list-disc pl-5'>
            <li>The product is damaged, leaking, or tampered with during transit.</li>
            <li>You received the wrong medicine or product.</li>
            <li>The product has expired upon delivery.</li>
        </ul>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>2. Non-Returnable Items</h3>
        <p>We cannot accept returns for:</p>
        <ul className='list-disc pl-5'>
            <li>Opened or partially used medicine strips/bottles.</li>
            <li>Injections, Vaccines, and temperature-sensitive items (Cold Chain).</li>
            <li>Personal hygiene products (e.g., diapers, masks).</li>
        </ul>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>3. Refund Process</h3>
        <p>Once we receive the returned item and verify its condition, the refund will be initiated within 48 hours. The amount will be credited to your original payment method (or bank account for COD orders) within 5-7 working days.</p>
      </div>
    </div>
  )
}

export default ReturnPolicy