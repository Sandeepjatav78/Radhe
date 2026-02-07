import React from 'react';
import { toast } from 'react-toastify';

const QuickServices = () => {
  
  // 1. Default handler for features not ready yet
  const handleComingSoon = () => {
    toast.info("🚧 Coming Soon! Our team is working on this feature.", {
      toastId: "coming-soon", 
    });
  };

  // 2. ✅ NEW HANDLER: Triggers the phone dialer
  const handleCallOrder = () => {
    window.location.href = "tel:9817500669";
  };

  const services = [
    {
      id: 1,
      title: "Rx Order",
      subtitle: "Upload Slip",
      icon: "📝",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      textColor: "text-blue-600",
      action: handleComingSoon 
    },
    {
      id: 2,
      title: "Call Order",
      subtitle: "Talk to Us",
      icon: "📞",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      textColor: "text-emerald-600",
      action: handleCallOrder // <--- Updated to use the call function
    },
    {
      id: 3,
      title: "Lab Tests",
      subtitle: "Home Visit",
      icon: "🧪",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      textColor: "text-purple-600",
      action: handleComingSoon 
    }
  ];

  return (
    <div className="mt-4 sm:mt-8">
      
      {/* 3 BOXES IN ONE LINE */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        
        {services.map((service) => (
          <div
            key={service.id}
            onClick={service.action}
            // Mobile par flex-col (Icon upar, text niche) aur Desktop par flex-row
            className={`${service.bgColor} border ${service.borderColor} p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left cursor-pointer hover:shadow-lg transition-all active:scale-95 group`}
          >
            {/* Icon */}
            <div className={`text-xl sm:text-3xl bg-white p-2 sm:p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform`}>
              {service.icon}
            </div>

            {/* Text Wrapper */}
            <div className="flex flex-col mt-2 sm:mt-0 sm:ml-3">
              <span className="text-[11px] sm:text-base font-bold text-gray-800 leading-tight">
                {service.title}
              </span>
              <span className={`text-[9px] sm:text-xs font-semibold mt-0.5 ${service.textColor}`}>
                {service.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickServices;