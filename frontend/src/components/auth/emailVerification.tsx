import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "react-router";
import { getData } from "../lib/apiMethods";
import CONFIG from "../utils/config";
import { apiEndpoints } from "../lib/apiEndpoints";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const [status, setStatus] = useState("loading");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
        
      try {
        if (!uid || !token) {
          setErrorMessage('Invalid verification link.');
          setStatus("error");
          return;
        }

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VERIFY_EMAIL}${uid}/${token}`);

        console.log(resp);
        console.log(resp.status);
        const errorData = await resp.data;


        if (resp.status === 200) {
          setStatus("success");
          setSuccessMessage(resp.data.message || resp.data.detail || 'Your email has been verified successfully.');
        }
        else if (resp.status === 400) {
          setErrorMessage(errorData.detail || errorData.message || 'Invalid or expired verification link.');
          setStatus("error");
        }
        else if (resp.status === 404) {
          setErrorMessage(errorData.detail || errorData.message || 'Verification link not found. Please request a new one.');
          setStatus("error");
        }
        else {
          setErrorMessage(errorData.detail || errorData.message || 'An unexpected error occurred during verification. Please try again later.');
          setStatus("error");
        }

        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
      catch (error) {
        setErrorMessage('Failed to verify email. Please check your connection and try again.');
        setStatus("error");
      }
    };

    verifyEmail();
  }, [uid, token, navigate]);

  console.log(status);

  return (
    // <>
    //   <img src={EmailIcon} alt="Email Sent" className="mx-auto mb-4 w-16 h-16" />

    //   <div className="text-center mb-8">
    //     <h1 className="text-2xl font-semibold text-[#000000] mb-4">
    //       Email verification
    //     </h1>
    //     <p className="text-gray-600 text-sm leading-snug lg:w-[65%] mx-auto">
    //       Email verified successfully.
    //     </p>
    //   </div>

    //   <div className="flex justify-center mt-4">
    //     <button type="button" onClick={handleNext} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
    //       Go to Login
    //     </button>
    //   </div>
    // </>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
        )}

        {status === "success" && (
          <>
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Email Verification
              </h1>
              <p className="text-gray-600 text-sm leading-snug">
                {successMessage}
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-4 flex justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Verification Failed
              </h1>
              <p className="text-gray-600 text-sm leading-snug">
                {errorMessage}
              </p>
            </div>

            {/* <div className="flex flex-col gap-3 justify-center mt-6">
              <button type="button" onClick={} className="px-8 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
                Go to Login
              </button>
              <button type="button" onClick={() => navigate("/resend-verification")} className="px-8 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
                Request New Link
              </button>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;