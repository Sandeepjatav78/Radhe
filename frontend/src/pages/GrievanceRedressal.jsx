import React from 'react'
import Title from '../components/Title'

const GrievanceRedressal = () => {
  return (
    <div className='px-4 sm:px-10 py-10 max-w-7xl mx-auto'>
      <div className='text-center text-2xl pt-10 border-t mb-10'>
          <Title text1={'GRIEVANCE'} text2={'REDRESSAL'} />
      </div>

      <div className='flex flex-col gap-6 text-gray-600 text-sm leading-7 text-justify'>
        <p>Your satisfaction is our priority. If you have any complaints regarding our service, products, or privacy, please contact our Grievance Officer.</p>

        <div className='bg-gray-50 p-6 rounded border'>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>Grievance Officer</h3>
            <p className='font-medium'>Mr. Deepanshu</p>
            <p><strong>Designation:</strong> Nodal Officer</p>
            <p><strong>Email:</strong> grievance@radhepharmacy.com</p>
            <p><strong>Phone:</strong> +91-98765-43210 (Mon-Sat, 10 AM - 6 PM)</p>
            <p><strong>Address:</strong> Radhe Pharmacy, Hari Singh Chowk, Panipat - 132103</p>
        </div>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>Escalation Process</h3>
        <ul className='list-disc pl-5'>
            <li><strong>Level 1:</strong> Customer Support (support@radhepharmacy.com) - 24 Hours Response Time.</li>
            <li><strong>Level 2:</strong> Grievance Officer (Details above) - 48 Hours Resolution Time.</li>
        </ul>
      </div>
    </div>
  )
}

export default GrievanceRedressal