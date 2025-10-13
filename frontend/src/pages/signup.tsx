import { useState } from "react";
import UserTypeSelection from "./../components/auth/userTypeSelection";
import AuthLayout from './../components/layout/authlayout';
import BusinessSignUpForm from "./../components/auth/businessSignUpForm";
import VerifyEmail from "./../components/auth/verifyEmail";
import CustomerSignUpForm from "./../components/auth/customerSignUpForm";

interface SignupDetailsProps {
  userType?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  businessName?: string;
  userName?: string;
  fullName?: string;
}

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [details, setDetails] = useState<SignupDetailsProps>({});
  const [userType, setUserType] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const handleUserTypeNext = (selectedUserType: string) => {
    setUserType(selectedUserType)
    setCurrentStep(2)
  }

  const handleBusinessSignupNext = (email: string, formData: any) => {
    setDetails(prev => ({ 
      ...prev, 
      email,
      ...formData 
    }));
    setCurrentStep(3);
    console.log("Business signup completed, moving to next step");
  }

  const handleCustomerSignupNext = (email: string, formData: any) => {
    setDetails(prev => ({ 
      ...prev, 
      email,
      ...formData 
    }));
    setCurrentStep(3);
    console.log("Customer signup completed, moving to next step");
  }

  const handleVerifyEmailNext = () => {
    const userRole = userType === "owner" ? "Business" : "Customer";
    const message = `${userRole} email verified, moving next to landing page`;
    console.log(message);
    // alert(message);
  }
  
  return (
    <AuthLayout>
      {currentStep === 1 && <UserTypeSelection details={details} setDetails={setDetails} currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handleUserTypeNext} />}
      {currentStep === 2 && userType === "owner" && <BusinessSignUpForm details={details} setDetails={setDetails} currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handleBusinessSignupNext} />}
      {currentStep === 2 && userType === "customer" && <CustomerSignUpForm details={details} setDetails={setDetails} currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handleCustomerSignupNext} />}
      {currentStep === 3 && <VerifyEmail email={details.email || ''} userType={details.userType || ""} details={details} setDetails={setDetails} currentStep={currentStep} setCurrentStep={setCurrentStep} onNext={handleVerifyEmailNext} />}
    </AuthLayout>
  )
}

export default Signup