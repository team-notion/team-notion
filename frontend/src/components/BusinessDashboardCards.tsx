import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { AiOutlineCar } from "react-icons/ai";
import { HiOutlineKey } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const BusinessDashboardCards: React.FC<{ data: any }> = ({ data }) => {
  const renderIcon = () => {
    switch (data.type) {
      case "revenue":
        return <FaArrowTrendUp className="size-4.5 lg:size-5 text-[#10B981]" />;
      case "rented cars":
        return <AiOutlineCar className="size-4.5 lg:size-5 text-[#31488A]" />;
      case "available cars":
        return <HiOutlineKey className="size-4.5 lg:size-5 text-[#31488A]" />;
      default:
        return null;
    }
  };

  const cardContent = (
    <div className="bg-white flex flex-row items-center justify-between rounded-lg hover:shadow-sm border border-[#EAECF0] px-5 py-6 h-full w-auto">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-[#667085] font-medium tracking-wide leading-5">
            {data.title}
          </span>
          {renderIcon()}
        </div>
        <span className="text-xl lg:text-2xl text-[#1D2939] font-semibold mb-2">
          {data.value}
        </span>
        {data.change && (
          <div className={`text-xs lg:text-sm flex items-center gap-1 ${ data.change.type === "increase" ? "text-[#10B981]" : data.change.type === 'decrease' ? "text-red-500" : 'text-neutral-700' }`}>
            {!data.change.period ? (
              // Format: "+10%" or "-5%"
              <span className="font-medium">
                {data.change.type === "increase" ? "+" : data.change.type === 'decrease' ? "-" : ""}
                {data.change.value}%
              </span>
            ) : (
              // Format: "↑ 8% this week" or "↓ 5% this week"
              <>
                {data.change.type === "increase" ? (
                  <IoIosArrowUp className="w-3 h-3" />
                ) : data.change.type === "decrease" ? (
                  <IoIosArrowDown className="w-3 h-3" />
                ) : null}
                <span>
                  {data.change.value}% {data.change.period}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
  return <div className="cursor-default">{cardContent}</div>;
};

export default BusinessDashboardCards;
