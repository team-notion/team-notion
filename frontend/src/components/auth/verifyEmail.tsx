import EmailIcon from '../../assets/Email Icon.svg';

interface EmailVerificationProps {
  onNext?: () => void
}

const VerifyEmail = ({ onNext }: EmailVerificationProps) => {
  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <>
      <img src={EmailIcon} alt='Email Sent' className='mx-auto mb-4' />

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-2xl font-semibold text-[#000000] mb-4">
          Email verification
        </h1>
        <p className="text-gray-600 text-base lg:w-[65%] mx-auto">
          A verification link has been sent to your email. Please check your inbox and click the link to continue.
        </p>
      </div>

      <div className="flex justify-center">
        <button type="button" onClick={handleNext} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
          Resend Mail
        </button>
      </div>
    </>
  )
}

export default VerifyEmail