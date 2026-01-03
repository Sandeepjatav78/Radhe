import React from 'react'
import Title from '../components/Title'

const PrivacyPolicy = () => {
  return (
    <div className='px-4 sm:px-10 py-10 max-w-7xl mx-auto'>
      <div className='text-center text-2xl pt-10 border-t mb-10'>
          <Title text1={'PRIVACY'} text2={'POLICY'} />
      </div>

      <div className='flex flex-col gap-6 text-gray-600 text-sm leading-7 text-justify'>
        <p><strong>Effective Date:</strong> 01-Jan-2025</p>

        <p>At <strong>Radhe Pharmacy</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal and health information when you visit our website or mobile application.</p>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>1. Information We Collect</h3>
        <ul className='list-disc pl-5'>
            <li><strong>Personal Information:</strong> Name, address, phone number, email address.</li>
            <li><strong>Health Information:</strong> Prescriptions uploaded, medicine history, and doctor details.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, and device information.</li>
        </ul>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>2. How We Use Your Information</h3>
        <p>We use your data to:</p>
        <ul className='list-disc pl-5'>
            <li>Process and deliver your medicine orders.</li>
            <li>Verify prescriptions by our registered pharmacists.</li>
            <li>Send order updates and refill reminders.</li>
            <li>Comply with the Drugs and Cosmetics Act, 1940.</li>
        </ul>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>3. Data Security</h3>
        <p>We implement strict security measures to protect your sensitive health data. Your prescriptions and personal details are stored on secure servers and are accessible only to authorized personnel (Pharmacists and Support Staff).</p>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>4. Sharing of Information</h3>
        <p>We do not sell your data. We may share information with:</p>
        <ul className='list-disc pl-5'>
            <li>Delivery partners (Logistics) to fulfill orders.</li>
            <li>Government authorities if required by law (e.g., drug inspection).</li>
        </ul>

        <h3 className='text-lg font-bold text-gray-800 mt-4'>5. Contact Us</h3>
        <p>If you have questions about this policy, contact us at <strong>support@radhepharmacy.com</strong>.</p>
      </div>
    </div>
  )
}

export default PrivacyPolicy