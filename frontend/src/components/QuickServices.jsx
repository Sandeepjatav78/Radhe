import React from 'react';
import { toast } from 'react-toastify';

const QuickServices = () => {
  const handleComingSoon = () => {
    toast.info("🚧 Coming Soon! Our team is working on this feature.", {
      toastId: "coming-soon",
    });
  };

  const handleCallOrder = () => {
    window.location.href = "tel:9817500669";
  };

  const services = [
    {
      id: 1,
      title: "Rx Order",
      subtitle: "Upload Slip",
      icon: "📝",
      action: handleComingSoon
    },
    {
      id: 2,
      title: "Call Order",
      subtitle: "Talk to Us",
      icon: "📞",
      action: handleCallOrder
    },
    {
      id: 3,
      title: "Lab Tests",
      subtitle: "Home Visit",
      icon: "🧪",
      action: handleComingSoon
    }
  ];

  return (
    <div className="mt-3 sm:mt-6">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={service.action}
            className="bg-brand-light rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 border border-brand/10"
          >
            <div className="text-xl sm:text-3xl bg-white p-2 sm:p-3 rounded-full shadow-sm">
              {service.icon}
            </div>
            <span className="text-[11px] sm:text-sm font-bold text-gray-800 mt-2 leading-tight">
              {service.title}
            </span>
            <span className="text-[9px] sm:text-xs font-semibold text-brand-dark mt-0.5">
              {service.subtitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickServices;