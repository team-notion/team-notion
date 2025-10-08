import { useState } from "react";
import UserTypeSelection from "./../components/auth/userTypeSelection";
import AuthLayout from './../components/layout/authlayout';
import BusinessSignUpForm from "./../components/auth/businessSignUpForm";
import VerifyEmail from "./../components/auth/verifyEmail";
import CustomerSignUpForm from "./../components/auth/customerSignUpForm";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const handleUserTypeNext = (selectedUserType: string) => {
    setUserType(selectedUserType)
    setCurrentStep(2)
  }

  const handleBusinessSignupNext = (email: string) => {
    setUserEmail(email);
    setCurrentStep(3);
    console.log("Business signup completed, moving to next step");
  }

  const handleCustomerSignupNext = (email: string) => {
    setUserEmail(email);
    setCurrentStep(3);
    console.log("Customer signup completed, moving to next step");
  }

  const handleVerifyEmailNext = () => {
    const userRole = userType === "owner" ? "Business" : "Customer";
    const message = `${userRole} email verified, moving next to landing page`;
    console.log(message);
    alert(message);
  }
  
  return (
    <AuthLayout>
      {currentStep === 1 && <UserTypeSelection onNext={handleUserTypeNext} />}
      {currentStep === 2 && userType === "owner" && <BusinessSignUpForm onNext={handleBusinessSignupNext} />}
      {currentStep === 2 && userType === "customer" && <CustomerSignUpForm onNext={handleCustomerSignupNext} />}
      {currentStep === 3 && <VerifyEmail email={userEmail} onNext={handleVerifyEmailNext} />}
    </AuthLayout>
  )
}

export default Signup