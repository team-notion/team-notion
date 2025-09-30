import { useState } from "react";

interface UserTypeSelectionProps {
  onNext?: (userType: string) => void
}

const UserTypeSelection = ({ onNext }: UserTypeSelectionProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleNext = () => {
    if (selectedOption && onNext) {
      onNext(selectedOption);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-[#000000] mb-4">
          Start Your Journey With Us!
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-snug">
          Tell us if you're an Owner or a Customer so we can tailor the experience for you
        </p>
      </div>

      {/* Owner option */}
      <div className="space-y-6 mb-12">
        <label className="flex items-start space-x-4 cursor-pointer group">
          <div className="flex items-center h-6 mt-1">
            <input type="radio" name="userType" value="owner" checked={selectedOption === "owner"} onChange={(e) => setSelectedOption(e.target.value)} className="w-3 h-3 text-gray-600 border-gray-300 focus:ring-gray-500" />
          </div>
          <div className="flex-1 md:flex md:gap-2">
            <div className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
              Business Owner
            </div>
            <div className="text-sm italic text-gray-500 mt-1">
              (You wish rent out cars to people)
            </div>
          </div>
        </label>

        {/* Customer option */}
        <label className="flex items-start space-x-4 cursor-pointer group">
          <div className="flex items-center h-6 mt-1">
            <input type="radio" name="userType" value="customer" checked={selectedOption === "customer"} onChange={(e) => setSelectedOption(e.target.value)} className="w-3 h-3 text-gray-600 border-gray-300 focus:ring-gray-500" />
          </div>
          <div className="flex-1 md:flex md:gap-2">
            <div className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
              Customer
            </div>
            <div className="text-sm italic text-gray-500 mt-1">
              (You wish to rent from our catalog of cars)
            </div>
          </div>
        </label>
      </div>

      <div className="flex justify-center md:justify-end">
        <button type="button" disabled={!selectedOption} onClick={handleNext} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
          Next
        </button>
      </div>
    </>
  );
};

export default UserTypeSelection;
