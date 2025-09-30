import { useState, useEffect } from 'react';
import EmailIcon from '../../assets/Email Icon.svg';
import { VerificationInput } from '../ui/VerificationInput';

interface EmailVerificationProps {
  onNext?: () => void
}

const VerifyEmail = ({ onNext }: EmailVerificationProps) => {
  const [timeLeft, setTimeLeft] = useState(60) // 2 minutes
  const [code, setCode] = useState("")

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleNext = () => {
    if (onNext) {
      onNext();
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
          Verify your email
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-snug lg:w-[65%] mx-auto">
          A 4 digit OTP has been sent to your mail.
        </p>
      </div>

      <div className="space-y-4 mx-auto">
        <VerificationInput onChange={setCode} />

        <p className="text-sm text-center text-gray-500">
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
        </p>
      </div>

      <div className="flex justify-center mt-4">
        <button type="button" disabled={code.length !== 4} onClick={handleNext} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
          Verify
        </button>
      </div>
    </>
  )
}

export default VerifyEmail