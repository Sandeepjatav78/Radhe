import React from 'react'
import Title from '../components/Title'

const TermsConditions = () => {
  return (
    <div className='px-4 sm:px-10 py-10 max-w-7xl mx-auto'>
      <div className='text-center text-2xl pt-10 border-t mb-10'>
          <Title text1={'TERMS &'} text2={'CONDITIONS'} />
      </div>

      <div className='flex flex-col gap-6 text-gray-600 text-sm leading-7 text-justify'>
        <p>Welcome to Radhe Pharmacy. By accessing our website/app, you agree to the following terms.</p>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>1. Eligibility</h3>
        <p>You must be at least 18 years old to purchase medicines. By using this site, you confirm that you are of legal age.</p>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>2. Medicine Purchase</h3>
        <ul className='list-disc pl-5'>
            <li>All orders for Schedule H, H1, and X drugs require a valid prescription from a registered medical practitioner.</li>
            <li>Radhe Pharmacy reserves the right to cancel orders if the prescription is invalid, unclear, or expired.</li>
            <li>We do not sell banned or narcotic substances.</li>
        </ul>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>3. Pricing & Payments</h3>
        <p>Prices are subject to change without notice. The final price will be confirmed at checkout. We accept UPI, Cards, and Cash on Delivery (COD).</p>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>4. Consultation Disclaimer</h3>
        <p>Information provided on this website is for educational purposes only and does not substitute professional medical advice. Always consult your doctor before taking any medication.</p>
      </div>
    </div>
  )
}

export default TermsConditions