import UserForgotPassword from "@/components/auth/userForgotPassword"
import AuthLayout from "../components/layout/authlayout"
import { useState } from "react";
import ResetPasswordEmailModal from "@/components/auth/resetPasswordEmail";
import ConfirmedReset from "@/components/auth/confirmedReset";
import UserResetPassword from "@/components/auth/userResetPassword";

interface ForgotPassawordProps {
  email?: string;
}

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [details, setDetails] = useState<ForgotPassawordProps>({});
  const [showResetEmailModal, setShowResetEmailModal] = useState(false);

  const handleEmailSubmitted = (email: string) => {
    setDetails(prev => ({ ...prev, email }));
    setCurrentStep(2);
  }

  const handleEmailModalNext = () => {
    setShowResetEmailModal(false);
    setCurrentStep(2);
  }

  const handlePasswordResetComplete = (formData: any) => {
    setDetails(prev => ({ ...prev, ...formData }));
    setCurrentStep(3);
  }

  const handleNext = () => {
    setCurrentStep(2);
  }

  const handleResetPasswordEmailNext = () => {
    const message = `Password reset link sent successfully, please check your email`;
    console.log(message);
  }

  return (
    <AuthLayout>
      {currentStep === 1 && <UserForgotPassword details={details} setDetails={setDetails} onNext={handleEmailSubmitted} />}
      {currentStep === 2 && <ResetPasswordEmailModal email={details.email || ''} details={details} setDetails={setDetails} />}
      {/* {currentStep === 2 && <ResetPasswordEmailModal isOpen={showResetEmailModal} onClose={() => setShowResetEmailModal(false)} email={details.email || ''} details={details} setDetails={setDetails} />} */}
      {/* {currentStep === 2 && <UserResetPassword details={details} setDetails={setDetails} currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handlePasswordResetComplete} />}
      {currentStep === 3 && <ConfirmedReset currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handleResetPasswordEmailNext} />} */}
    </AuthLayout>
  )
}

export default ForgotPassword