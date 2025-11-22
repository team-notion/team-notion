import { AlertCircle, Mail } from "lucide-react"
import { useNavigate } from "react-router"

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  accessToken?: string;
}

export function EmailVerificationModal({ isOpen, onClose, userEmail, accessToken }: EmailVerificationModalProps) {
  const navigate = useNavigate();

  const handleRequestNewEmail = () => {
    onClose();
    navigate("/request-verification-email", {
      state: {
        email: userEmail,
        accessToken: accessToken,
      }
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-3 lg:p-8 max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2">Verify Your Email</h2>

        <p className="text-sm text-gray-600 text-center mb-4">
          We've sent a verification link to <strong>{userEmail}</strong>. Please check your inbox and click the link to verify your email address.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 lg:p-4 mb-6">
          <p className="text-sm text-gray-700 flex items-start gap-2">
            <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
            If you don't see the email, check your spam folder or request a new verification link below.
          </p>
        </div>

        <button onClick={handleRequestNewEmail} className="w-full bg-[#4258C7] hover:bg-[#324A9E] text-white font-normal py-2 px-2 lg:px-4 rounded-lg transition-colors text-center cursor-pointer" >
          Request New Verification Email
        </button>
      </div>
    </div>
  )
}