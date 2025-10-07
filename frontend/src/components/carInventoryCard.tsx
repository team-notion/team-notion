import React from "react";
import { AiOutlineCar } from "react-icons/ai";
import { HiOutlineKey } from "react-icons/hi";

const CarInventoryCard: React.FC<{ data: any }> = ({ data }) => {
  const renderIcon = () => {
    switch (data.type) {
      case "total fleet":
        return (
          <div className="flex gap-0">
            <AiOutlineCar className="size-6 text-blue-300" />
            <AiOutlineCar className="size-6 text-blue-500" />
            <AiOutlineCar className="size-6 text-blue-300" />
          </div>
        );
      case "rented cars":
        return <AiOutlineCar className="size-6 text-[#31488A]" />;
      case "available cars":
        return <HiOutlineKey className="size-6 text-[#31488A]" />;
      default:
        return null;
    }
  };

  const cardContent = (
    <div className="bg-white flex flex-row items-center justify-between rounded-lg hover:shadow-sm border border-[#EAECF0] px-5 py-6 h-full w-auto">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs lg:text-sm text-[#667085] font-medium tracking-wide leading-5">
            {data.title}
          </span>
          {renderIcon()}
        </div>
        <span className="text-xl lg:text-2xl text-[#1D2939] font-semibold mb-2">
          {data.value}
        </span>
      </div>
    </div>
  );
  return <div className="cursor-default">{cardContent}</div>;
};

export default CarInventoryCard;
