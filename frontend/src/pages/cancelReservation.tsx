import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { getData } from "@/components/lib/apiMethods";
import CONFIG from "@/components/utils/config";
import { apiEndpoints } from "@/components/lib/apiEndpoints";
import { Skeleton } from "@/components/ui/skeleton";

const CancelReservation = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const confirmCancellation = async () => {
      try {
        if (!token) {
          setErrorMessage('Invalid cancellation link.');
          setStatus("error");
          return;
        }

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.CONFIRM_RESERVATION_CANCELLATION}?token=${token}`);
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
          navigate("/reservation-management");
        }, 3000)
      }
      catch (error) {
        setErrorMessage('Failed to verify email. Please check your connection and try again.');
        setStatus("error");
      }
    };

    confirmCancellation();
  }, [token, navigate]);

  console.log(status);

  return (
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
                Reservation Cancellation Successful
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
                Reservation Cancellation Failed
              </h1>
              <p className="text-gray-600 text-sm leading-snug">
                {errorMessage}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CancelReservation;