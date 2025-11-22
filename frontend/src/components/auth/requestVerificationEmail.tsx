import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router"
import { toast } from "sonner"
import { useAuth } from "../lib/authContext";
import CONFIG from "../utils/config";
import { apiEndpoints } from "../lib/apiEndpoints";
import { postData } from "../lib/apiMethods";
import Loader from "../ui/Loader/Loader";
import { LOCAL_STORAGE_KEYS } from "../utils/localStorageKeys";
import AuthLayout from "../layout/authlayout";

const RESEND_VERIFICATION_COOLDOWN = 120; // 2 mins in seconds

const RequestVerificationEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [email, setEmail] = useState(location.state?.email || user?.email || "");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lastVerificationRequestTime');
    if (stored) {
      const storedTime = Number.parseInt(stored);
      const timePassed = Math.floor((Date.now() - storedTime) / 1000);
      const remaining = Math.max(0, RESEND_VERIFICATION_COOLDOWN - timePassed);
      if (remaining > 0) {
        setTimeLeft(remaining);
        setLastRequestTime(storedTime);
      }
      else {
        localStorage.removeItem('lastVerificationRequestTime');
      }
    }
  }, [])


  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem('lastVerificationRequestTime');
        }
        return prev - 1;
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft]);


  const formatTime = (Seconds: number) => {
    const mins = Math.floor(Seconds / 60);
    const secs = Seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const handleRequestVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);

    try {
      const accessToken = location.state?.accessToken || sessionStorage.getItem('temp_verification_token') || localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      
      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.RESEND_VERIFICATION_EMAIL}`, { email }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    

      if (resp.status === 200) {
        toast.success(resp?.data?.message || "Verification email sent successfully");
        setEmail("");
        const currentTime = Date.now();
        setLastRequestTime(Date.now());
        localStorage.setItem('lastVerificationRequestTime', currentTime.toString());
        setTimeLeft(RESEND_VERIFICATION_COOLDOWN);

        setTimeout(() => navigate('/login'), 3000);
      }
    }
    catch (err: any) {
      const errData = err?.response?.data;

      if (errData && typeof errData === 'object') {
        Object.keys(errData).forEach((key) => {
          if (Array.isArray(errData[key]) && errData[key].length > 0) {
            errData[key].forEach((message: string) => {
              toast.error(message);
            });
          }
          else {
            toast.error(errData[key]);
          }
        });
      }
    }
    finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <Loader type="tailSpin" color="#175CD3" height={40} width={40} />
    </div>;
  }

  return (
    <AuthLayout>
      <div className="flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              Enter your email to receive a verification link
            </p>
          </div>

          <form onSubmit={handleRequestVerification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300" disabled={loading} required />
            </div>

            <button type="submit" disabled={loading || timeLeft > 0} className="w-full bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-normal py-2 px-4 rounded-lg transition-colors" >
              {loading ? "Sending..." : "Send Verification Email"}
            </button>

            {/* Countdown timer display */}
            <p className="text-sm text-center text-gray-500 mt-4">
              {timeLeft > 0 ? (
                <>
                  You can resend in{" "}
                  <span className="text-[#4258C7] font-semibold">
                    {formatTime(timeLeft)}
                  </span>
                </>
              ) : (
                <>
                  Didn't get a link?{" "}
                  <span className="text-[#4258C7] cursor-pointer hover:underline font-semibold">
                    Click to resend
                  </span>
                </>
              )}
            </p>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => navigate("/")} className="text-sm text-gray-600 hover:text-gray-900 underline" >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RequestVerificationEmail;
