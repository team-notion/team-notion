import { register } from 'module';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PiEyeSlashDuotone, PiEyeDuotone } from 'react-icons/pi';
import z from 'zod';
import PhoneNumberInput from '../ui/PhoneNumberInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { apiEndpoints } from '../lib/apiEndpoints';
import { postData } from '../lib/apiMethods';
import CONFIG from '../utils/config';
import AuthLayout from '../layout/authlayout';
import { useNavigate, useParams } from 'react-router';
import ConfirmedReset from './confirmedReset';
import Loader from '../ui/Loader/Loader';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const UserResetPassword = () => {
  const { uid, token } = useParams();
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("loading");
  const [linkValid, setLinkValid] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [verifyingLink, setVerifyingLink] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const verifyResetLink = async () => {
      if (!uid || !token) {
        setErrorMessage('Invalid password reset link.');
        setStatus("error");
        setLinkValid(false);
        setVerifyingLink(false);
        setDetails({ status: "error", message: "Invalid password reset link." });
        setCurrentStep(2);
        return;
      }

      setLinkValid(true);
      setVerifyingLink(false);
    };

    verifyResetLink();
  }, [uid, token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);

    try {
      if (!uid || !token) {
        setErrorMessage('Invalid password reset link.');
        setStatus("error");
        return;
      }
      
      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.RESET_PASSWORD}${uid}/${token}/`, { password: data.newPassword });
      const errorData = await resp.data;

      if (resp.status === 200) {
        setStatus("success");
        setSuccessMessage(resp.data.message || resp.data.detail || 'Your email has been verified successfully.');
        setDetails(prev => ({ ...prev, status: status, message: successMessage }));
        setCurrentStep(2);
      }
      else if (resp.status === 400) {
        setErrorMessage(errorData.detail || errorData.message || 'Invalid or expired verification link.');
        setDetails(prev => ({ ...prev, status: status, message: errorMessage }));
        setStatus("error");
      }
      else if (resp.status === 404) {
        setErrorMessage(errorData.detail || errorData.message || 'Verification link not found. Please request a new one.');
        setDetails(prev => ({ ...prev, status: status, message: errorMessage }));
        setStatus("error");
      }
      else {
        setErrorMessage(errorData.detail || errorData.message || 'An unexpected error occurred during verification. Please try again later.');
        setDetails(prev => ({ ...prev, status: status, message: errorMessage }));
        setStatus("error");
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

      if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
    }
    finally {
      setLoading(false);
    }
  };


  if (verifyingLink) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader type="tailSpin" color="#175CD3" height={40} width={40} />
        </div>
      </AuthLayout>
    );
  }


  if (!linkValid && currentStep === 1) {
    return (
      <AuthLayout>
        <ConfirmedReset details={details} setDetails={setDetails} />
      </AuthLayout>
    );
  }


  return (
    <AuthLayout>
      {currentStep === 1 && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start h-full">
          <div className='w-full text-center sm:text-left'>
            <h2 className="text-2xl font-semibold mb-3">Password reset</h2>
            <p className="text-sm text-gray-600">Create a new password to secure your account. Make sure it’s strong and something you’ll remember.</p>
          </div>

          {/* Business Sign up form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className='relative'>
                <input type={showPassword ? "text" : "password"} placeholder='Enter your new password' {...register("newPassword")} required className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none pr-10" />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer">
                  {showPassword ? <PiEyeSlashDuotone size={20} /> : <PiEyeDuotone size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className='relative'>
                <input type={showConfirmPassword ? "text" : "password"} placeholder='Confirm password' {...register("confirmPassword")} required className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none pr-10" />
                <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer">
                  {showConfirmPassword ? <PiEyeSlashDuotone size={20} /> : <PiEyeDuotone size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex flex-col  items-center justify-center md:justify-end gap-3 mt-4">
              <button type="submit" disabled={loading} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 w-[10rem] cursor-pointer" >
                {loading ? 'Submitting' : 'Confirm'}
              </button>

              {/* <p className="text-xs text-gray-500 text-center">Remember your password? <a href="/login" className="text-[#001EB4] font-medium hover:underline">Log in</a></p> */}
            </div>
          </form>
        </div>
      )}
      {currentStep === 2 && (<ConfirmedReset details={details} setDetails={setDetails} />)}
    </AuthLayout>
  )
}

export default UserResetPassword