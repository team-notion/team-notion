import { register } from 'module';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { PiEyeSlashDuotone, PiEyeDuotone } from 'react-icons/pi';
import z from 'zod';
import PhoneNumberInput from '../ui/PhoneNumberInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { apiEndpoints } from '../lib/apiEndpoints';
import { postData } from '../lib/apiMethods';
import CONFIG from '../utils/config';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  details: any;
  setDetails: Dispatch<SetStateAction<any>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  onNext?: (formData: any) => void
}

const UserResetPassword = ({ details, setDetails, currentStep, setCurrentStep, onNext }: ResetPasswordFormProps) => {
const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isValid }, } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);

    try {
      const userData = {
        ...data,
      }
      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.RESET_PASSWORD}`, userData);

      if (resp.message === 'Business owner registered successfully.') {
        toast.success(resp?.message);

        setDetails((prev: any) => ({
          ...prev,
          newPassword: data.newPassword,
        }));

        if (onNext) {
          onNext(data);
        }
      }
      else {
        toast.error(resp?.message);
      }
    }
    catch (err: any) {
      toast.error(err?.response?.message);

      if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
<div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start h-full">
  <div className='w-full text-center sm:text-left'>
    <h2 className="text-2xl font-semibold mb-3">Sign up</h2>
    <p className="text-sm text-gray-600">Open a Business Account to list your cars, set your own rates, and get paid securely. <span className='hidden md:block'>Whether it’s one car or a fleet, you’re in control.</span></p>
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

      <p className="text-sm text-gray-500 text-center">Already have an account? <a href="/login" className="text-[#001EB4] font-medium hover:underline">Log in</a></p>
    </div>
  </form>
</div>
  )
}

export default UserResetPassword