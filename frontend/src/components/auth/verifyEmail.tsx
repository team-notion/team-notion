import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import EmailIcon from '../../assets/Email Icon.svg';
import { useNavigate } from 'react-router';
// import { VerificationInput } from '../ui/VerificationInput';

interface EmailVerificationProps {
  email: string;
  userType: string;
  details: any;
  setDetails: Dispatch<SetStateAction<any>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  onNext?: () => void;
}

const VerifyEmail = ({ email, userType, details, setDetails, currentStep, setCurrentStep, onNext }: EmailVerificationProps) => {
  const [timeLeft, setTimeLeft] = useState(60) // 2 minutes
  // const [code, setCode] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleNext = () => {
    if (onNext) {
      navigate('/login')
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <>
      <img src={EmailIcon} alt='Email Sent' className='mx-auto mb-4 w-16 h-16' />

      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-[#000000] mb-4">
          Email verification
        </h1>
        <p className="text-gray-600 text-sm leading-snug lg:w-[65%] mx-auto">
          We sent a verification email to {details.email} Please follow the instructions in the mail to verify your email
        </p>
      </div>

      <div className="space-y-4 mx-auto">
        {/* <VerificationInput onChange={setCode} /> */}

        {/* <p className="text-sm text-center text-gray-500">
          {
            timeLeft > 0
            ? (
                <>
                  Resend code after <span className="text-[#175CD3]">{formatTime(timeLeft)}</span>
                </>
              )
            : (
                <>
                  Didn't get a code? <span className="text-[#175CD3] cursor-pointer hover:underline">Click to resend</span>
                </>
              )
          }
        </p> */}
      </div>

      <div className="flex justify-center mt-4">
        <button type="button" onClick={handleNext} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
          Go to Login
        </button>
      </div>
    </>
  )
}

export default VerifyEmail