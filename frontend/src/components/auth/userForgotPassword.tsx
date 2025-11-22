import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postData } from "../lib/apiMethods";
import CONFIG from "../utils/config";
import { apiEndpoints } from "../lib/apiEndpoints";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";

const RESEND_PASSWORD_RESET_COOLDOWN = 120; // 2 mins in seconds

interface EmailLinkProps {
  details: any;
  setDetails: Dispatch<SetStateAction<any>>;
  onNext?: (email: string) => void;
}

const EmailLinkSchema = z.object({
  email: z.string().email("Please enter a your email address"),
});

type EmailLinkFormData = z.infer<typeof EmailLinkSchema>;

const UserForgotPassword = ({ details, setDetails, onNext, }: EmailLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors }, } = useForm<EmailLinkFormData>({
    resolver: zodResolver(EmailLinkSchema),
    mode: "onChange",
    defaultValues: {
      email: details.email || location.state?.email || "",
    },
  });


  useEffect(() => {
    const stored = localStorage.getItem('lastPasswordRequestTime');
    if (stored) {
      const storedTime = Number.parseInt(stored);
      const timePassed = Math.floor((Date.now() - storedTime) / 1000);
      const remaining = Math.max(0, RESEND_PASSWORD_RESET_COOLDOWN - timePassed);
      if (remaining > 0) {
        setTimeLeft(remaining);
        setLastRequestTime(storedTime);
      }
      else {
        localStorage.removeItem('lastPasswordRequestTime');
      }
    }
  }, [])


  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem('lastPasswordRequestTime');
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

  const onSubmit = async (data: EmailLinkFormData) => {
    setLoading(true);
    
    try {
      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.REQUEST_PASSWORD_RESET}`, { email: data.email });

      if (resp.status === 200) {
        toast.success(resp?.data?.message || "Reset password email sent successfully");

        const currentTime = Date.now();
        setLastRequestTime(Date.now());
        localStorage.setItem('lastPasswordRequestTime', currentTime.toString());
        setTimeLeft(RESEND_PASSWORD_RESET_COOLDOWN);

        setDetails((prev: any) => ({
          ...prev,
          email: data.email,
        }));

        reset({ email: '' });

        onNext && onNext(data.email);
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


  return (
    <div className="flex items-center justify-center px-2 lg:px-4">
      <div className="max-w-md w-full">
        <div className="w-full text-center mb-8">
          <h2 className="text-xl lg:text-2xl font-semibold mb-1">Password reset</h2>
          <p className="text-sm text-gray-600">Please enter your email</p>
        </div>

        {/* Business Sign up form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" {...register("email")} placeholder="Enter email" required className={`bg-[#E9ECF2] text-[#5C5C5C] text-sm border ${ errors.email ? "border-[#F71414] focus:border-[#F71414]" : "border-gray-300 focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200" } p-2 w-full rounded-md focus:outline-none`} />
            {errors.email && (
              <div className="text-left  ml-3">
                <ErrorHandler errors={errors} />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center md:justify-end gap-5 mt-4">
            <button type="submit" disabled={loading} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 w-full md:w-[10rem] cursor-pointer" >
              {loading ? "Submitting" : "Send"}
            </button>

            {/* Countdown timer display */}
            <p className="text-xs text-center text-gray-500 mt-4">
              {timeLeft > 0 ? (
                <>
                  You can resend in{" "}
                  <span className="text-[#4258C7] font-semibold">
                    {formatTime(timeLeft)}
                  </span>
                </>
              ) : (
                <>
                  Didn't get a code?{" "}
                  <span className="text-[#4258C7] cursor-pointer hover:underline font-semibold">
                    Click to resend
                  </span>
                </>
              )}
            </p>

          </div>
          <p className="text-xs text-gray-500 text-center">
            Remember your password?{" "}
            <a href="/login" className="text-[#001EB4] font-medium hover:underline" >
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserForgotPassword;
