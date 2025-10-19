import UserForgotPassword from "@/components/auth/userForgotPassword"
import AuthLayout from "../components/layout/authlayout"
import { useState } from "react";
import ResetPasswordEmail from "@/components/auth/resetPasswordEmail";
import UserResetPassword from "@/components/auth/userResetPassword";
import ConfirmedReset from "@/components/auth/confirmedReset";

interface ResetPasswordProps {
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ResetPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [details, setDetails] = useState<ResetPasswordProps>({});

  const handleNext = () => {
    setCurrentStep(2);
  }

  const handleResetPasswordEmailNext = () => {
    const message = `Password updated successfully, moving next to landing page`;
    console.log(message);
    // alert(message);
  }

  return (
    <AuthLayout>
      {currentStep === 1 && <UserResetPassword details={details} setDetails={setDetails} currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handleNext} />}
      {currentStep === 2 && <ConfirmedReset email={details.email || ''} details={details} setDetails={setDetails} currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handleResetPasswordEmailNext} />}
    </AuthLayout>
  )
}

export default ResetPassword