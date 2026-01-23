import React from 'react'
import Title from '../components/Title'

const GrievanceRedressal = () => {
  return (
    <div className='px-4 sm:px-10 py-10 max-w-7xl mx-auto'>
      <div className='text-center text-2xl pt-10 border-t mb-10'>
          <Title text1={'GRIEVANCE'} text2={'REDRESSAL'} />
      </div>

      <div className='flex flex-col gap-6 text-gray-600 text-sm leading-7 text-justify'>
        <p>
            In accordance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong> and <strong>Information Technology Act, 2000</strong>, the contact details of the Grievance Officer are provided below. 
            If you have any complaints regarding our service, products, or privacy policy, please contact us.
        </p>

        <div className='bg-gray-50 p-6 rounded border border-gray-200'>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>Grievance Officer Details</h3>
            
            {/* 🔴 FILL YOUR REAL DETAILS HERE */}
            <p className='font-medium text-black'>SEHGAL SUMIT</p>
            <p><strong>Designation:</strong> Proprietor </p>
            <p><strong>Email:</strong> grievance.radhepharmacy099@gmail.com</p>
            <p><strong>Phone:</strong> +91-9817500669 (Mon-Sat, 10:00 AM - 6:00 PM)</p>
            <p><strong>Address:</strong> Radhe Pharmacy, Hari Singh Chowk, Devi Mandir Road, Panipat, Haryana - 132103</p>
        </div>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>Grievance Redressal Mechanism & Timelines</h3>
        <ul className='list-disc pl-5 space-y-2'>
            <li>
                <strong>Level 1 - Customer Support:</strong> For immediate queries, contact <span className='text-blue-600'>support@radhepharmacy.com</span>. We aim to respond within 24 hours.
            </li>
            <li>
                <strong>Level 2 - Grievance Officer:</strong> If your issue is not resolved, escalate it to the Grievance Officer. 
            </li>
            <li className='text-emerald-700 font-medium'>
                <strong>Statutory Timeline:</strong> We will acknowledge your complaint within <strong>48 hours</strong> and resolve the issue within <strong>30 days</strong> from the date of receipt.
            </li>
        </ul>
      </div>
    </div>
  )
}

export default GrievanceRedressal