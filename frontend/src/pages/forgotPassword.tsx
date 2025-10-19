import UserForgotPassword from "@/components/auth/userForgotPassword"
import AuthLayout from "../components/layout/authlayout"
import { useState } from "react";
import ResetPasswordEmail from "@/components/auth/resetPasswordEmail";

interface ForgotPassawordProps {
  email?: string;
}

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [details, setDetails] = useState<ForgotPassawordProps>({});

  const handleNext = () => {
    setCurrentStep(2);
  }

  const handleResetPasswordEmailNext = () => {
    const message = `Password reset link sent successfully, please check your email`;
    console.log(message);
    // alert(message);
  }

  return (
    <AuthLayout>
      {currentStep === 1 && <UserForgotPassword details={details} setDetails={setDetails} currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handleNext} />}
      {currentStep === 2 && <ResetPasswordEmail email={details.email || ''} details={details} setDetails={setDetails} currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handleResetPasswordEmailNext} />}
    </AuthLayout>
  )
}

export default ForgotPassword