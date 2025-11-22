import { CircleCheck, OctagonX } from "lucide-react";
import { useNavigate } from "react-router";
import AuthLayout from "../layout/authlayout";
import { Dispatch, SetStateAction } from "react";

interface ConfirmedResetPasswordProps {
  details: any;
  setDetails: Dispatch<SetStateAction<any>>;
}

const ConfirmedReset = ({ details, setDetails }: ConfirmedResetPasswordProps) => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/login");
  };

  return (
    <div className="max-w-md flex flex-col items-center justify-center p-4 lg:p-8">
      {details.status === 'error' ? (
        <OctagonX className="mx-auto text-red-500 mb-4 size-20" />
      ) : (
        <CircleCheck className="mx-auto text-[#10B981] mb-4 size-20" />
      )}

      <div className="text-center mb-2">
        <div className="text-lg lg:text-xl font-medium text-[#000000] mb-4">
          {details.message}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button type="button" onClick={handleNext} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
          Login
        </button>
      </div>
    </div>
  )
}

export default ConfirmedReset