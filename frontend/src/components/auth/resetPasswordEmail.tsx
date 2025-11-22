import { EmailIcon } from "@/assets";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useNavigate } from "react-router";

interface ResetPasswordEmailVerificationProps {
  email: string;
  details: any;
  setDetails: Dispatch<SetStateAction<any>>;
}

const ResetPasswordEmail = ({ email, details, setDetails }: ResetPasswordEmailVerificationProps) => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/login');
  };


  // const handleProceedNow = () => {
  //   handleNext();
  // };


  // const handleClose = () => {
  //   navigate('/login')
  // };

  return (
    <div className="max-w-sm lg:max-w-md flex flex-col items-center justify-center p-1 lg:p-8">
      {/* <div className="max-w-sm lg:max-w-md flex flex-col items-center justify-center p-4 lg:p-8"> */}

        <div className="text-center items-center mb-8">
          <img src={EmailIcon} alt="Email Sent" className="mx-auto mb-4 w-16 h-16" />
          
          <div className="text-xl lg:text-2xl font-semibold text-[#000000] mb-8">
            Email sent successfully
          </div>
          <div className="text-gray-600 text-center text-sm md:text-base leading-snug w-full">
            {/* An email has been send to {details.email} containing instructions on how to reset your password */}
            We've sent password reset instructions to{" "}
            <span className="font-medium">{details.email || email}</span>. 
            Please check your inbox and follow the link to reset your password.
          </div>
        </div>

        {/* <div className="mb-6 p-2 lg:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 text-center">
            Proceeding to password reset in{" "}
            <span className="font-semibold text-blue-700">{countdown}s</span>
          </p>
        </div> */}

        {/* Action buttons */}
        {/* <div className="flex flex-row gap-3">
          <button type="button" onClick={handleProceedNow} className="px-4 py-2 bg-[#F97316] hover:bg-orange-600 text-white text-sm lg:text-base font-normal rounded-lg w-auto transition-colors duration-200 cursor-pointer" >
            Continue Now
          </button>
          <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-normal rounded-lg w-auto transition-colors duration-200" >
            Close
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Didn't receive the email? Check your spam folder or contact support.
        </p> */}
      {/* </div> */}

      <div className="flex justify-center mt-4">
        <button type="button" onClick={handleNext} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordEmail;
