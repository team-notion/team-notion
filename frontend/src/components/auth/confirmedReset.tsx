import { EmailIcon } from "@/assets";
import { CircleCheck } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router";

interface ConfirmPasswordResetProps {
  email: string;
  details: any;
  setDetails: Dispatch<SetStateAction<any>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  onNext?: () => void;
}

const ConfirmedReset = ({ email, details, setDetails, currentStep, setCurrentStep, onNext, }: ConfirmPasswordResetProps) => {
const navigate = useNavigate();

const handleNext = () => {
    if (onNext) {
      navigate("/login");
    }
  };
  return (
<>
  <CircleCheck className="mx-auto mb-4 w-16 h-16" />

  <div className="text-center mb-8">
    <h1 className="text-3xl font-semibold text-[#000000] mb-4">
        Password reset successful
    </h1>
  </div>

  <div className="flex justify-center mt-4">
    <button type="button" onClick={handleNext} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
      Go to Login
    </button>
  </div>
</>
  )
}

export default ConfirmedReset