import React from 'react'
import Title from '../components/Title'

const PrescriptionPolicy = () => {
  return (
    <div className='px-4 sm:px-10 py-10 max-w-7xl mx-auto'>
      <div className='text-center text-2xl pt-10 border-t mb-10'>
          <Title text1={'PRESCRIPTION'} text2={'POLICY'} />
      </div>

      <div className='flex flex-col gap-6 text-gray-600 text-sm leading-7 text-justify'>
        <p className='bg-yellow-50 p-4 border border-yellow-200 rounded text-yellow-800 font-medium'>
            <strong>Note:</strong> In compliance with Indian Laws, valid prescriptions are mandatory for Schedule H & H1 drugs.
        </p>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>1. Valid Prescription Criteria</h3>
        <p>A prescription must contain:</p>
        <ul className='list-disc pl-5'>
            <li>Doctor's Name, Registration Number, and Signature.</li>
            <li>Patient's Name and Age.</li>
            <li>Date of prescription (must not be older than 6 months for chronic care, or as per doctor's advice).</li>
            <li>Name of Medicines, Strength, and Dosage.</li>
        </ul>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>2. Verification Process</h3>
        <p>Before dispatch, every order is reviewed by our registered pharmacists (Mr. Rahul Sharma, Reg No: PMC/54321). If any discrepancy is found, our pharmacist will call you for clarification.</p>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>3. How to Upload</h3>
        <p>You can upload a photo or PDF of your prescription on the Product Page, Cart Page, or via WhatsApp.</p>
      </div>
    </div>
  )
}

export default PrescriptionPolicy