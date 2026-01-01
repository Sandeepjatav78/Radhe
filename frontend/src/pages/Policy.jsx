import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Title from '../components/Title';

const Policy = () => {
  const location = useLocation();
  const [content, setContent] = useState({ title: "", text: [] });

  // --- Policy Content Data ---
  const policyData = {
    '/privacy-policy': {
      title: "Privacy Policy",
      text: [
        "At Radhe Pharmacy, we value your privacy. We collect personal information solely to process your orders and improve your experience.",
        "We do not share your medical history or prescription details with third parties for marketing purposes.",
        "All payment transactions are secured using industry-standard encryption."
      ]
    },
    '/terms-conditions': {
      title: "Terms & Conditions",
      text: [
        "By using Radhe Pharmacy, you agree to comply with Indian laws regarding the purchase of medication.",
        "We reserve the right to cancel orders if we suspect misuse of prescriptions.",
        "Prices are subject to change without prior notice."
      ]
    },
    '/return-policy': {
      title: "Return & Refund Policy",
      text: [
        "Medicines can be returned within 7 days if the packaging is unopened and sealed.",
        "Cold storage items (like Insulin) cannot be returned once delivered due to temperature sensitivity.",
        "Refunds are processed within 5-7 business days to the original payment method."
      ]
    },
    '/cancellation-policy': {
      title: "Cancellation Policy",
      text: [
        "You can cancel your order before it is 'Shipped' from our warehouse.",
        "Once the order is out for delivery, it cannot be cancelled.",
        "If a prepaid order is cancelled, the amount will be refunded automatically."
      ]
    },
    '/prescription-policy': {
      title: "Prescription Policy",
      text: [
        "A valid Doctor's Prescription is mandatory for Schedule H and H1 drugs.",
        "The prescription must be dated, signed, and contain the doctor's registration number.",
        "We do not dispense narcotics or banned substances under any circumstances."
      ]
    },
    '/dispatch-policy': {
      title: "Verification Before Dispatch",
      text: [
        "Every order is verified by a certified pharmacist before packing.",
        "We check the medicine name, dosage, and expiry date against your prescription.",
        "If the prescription is unclear, our pharmacist will call you for clarification."
      ]
    },
    '/grievance-redressal': {
      title: "Grievance & Support",
      text: [
        "If you have any complaints, please email us at support@radhepharmacy.com.",
        "Our Grievance Officer will respond within 48 hours.",
        "For urgent medical issues, please visit your nearest hospital; do not rely solely on online support."
      ]
    },
    '/upload-guide': {
      title: "How to Upload Prescription",
      text: [
        "Click on the 'Choose File' button on the checkout page.",
        "Ensure the image is clear and not blurry.",
        "The doctor's name, patient's name, and date must be visible.",
        "Supported formats: JPG, PNG, PDF."
      ]
    }
  };

  useEffect(() => {
    // Current URL (e.g., '/privacy-policy') ke hisaab se data set karo
    const path = location.pathname;
    if (policyData[path]) {
      setContent(policyData[path]);
      window.scrollTo(0, 0); // Scroll to top when page opens
    } else {
      setContent({ 
          title: "Page Not Found", 
          text: ["The policy you are looking for does not exist."] 
      });
    }
  }, [location]);

  return (
    <div className='pt-10 border-t mb-20 px-4 max-w-7xl mx-auto'>
        
        <div className='text-2xl mb-8'>
            <Title text1={content.title.split(" ")[0]} text2={content.title.split(" ").slice(1).join(" ")} />
        </div>

        <div className='flex flex-col gap-4 text-gray-600 leading-relaxed text-sm md:text-base'>
            {content.text.map((paragraph, index) => (
                <p key={index} className='border-l-4 border-emerald-500 pl-4 py-1 bg-gray-50 rounded-r-lg'>
                    {paragraph}
                </p>
            ))}
        </div>

    </div>
  )
}

export default Policy;