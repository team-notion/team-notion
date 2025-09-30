import { useState } from "react";
import UserTypeSelection from "./../components/auth/userTypeSelection";
import AuthLayout from './../components/layout/authlayout';
import BusinessSignUpForm from "./../components/auth/businessSignUpForm";
import VerifyEmail from "./../components/auth/verifyEmail";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [userType, setUserType] = useState<string>("")

  const handleUserTypeNext = (selectedUserType: string) => {
    setUserType(selectedUserType)
    setCurrentStep(2)
  }

  const handleBusinessSignupNext = () => {
    setCurrentStep(3)
    console.log("Business signup completed, moving to next step")
  }

  const handleVerifyEmailNext = () => {
    console.log("Business email verified, moving to next landing page")
    alert("Business email verified, moving to next landing page")
  }
  
  return (
      <AuthLayout>
        {currentStep === 1 && <UserTypeSelection onNext={handleUserTypeNext} />}
        {currentStep === 2 && userType === "owner" && <BusinessSignUpForm onNext={handleBusinessSignupNext} />}
        {currentStep === 2 && userType === "customer" && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Customer Signup</h2>
            <p className="text-gray-600">Customer signup form coming soon...</p>
          </div>
        )}
        {currentStep === 3 && <VerifyEmail onNext={handleVerifyEmailNext} />}
      </AuthLayout>
  )
}

export default Signup