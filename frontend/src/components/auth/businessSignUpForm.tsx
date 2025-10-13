import { Dispatch, SetStateAction, useState } from "react";
import { PiEyeDuotone } from "react-icons/pi";
import { PiEyeSlashDuotone } from "react-icons/pi";
import PhoneNumberInput from "../ui/PhoneNumberInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postData } from "../lib/apiMethods";
import CONFIG from "../utils/config";
import { apiEndpoints } from "../lib/apiEndpoints";
import { LOCAL_STORAGE_KEYS } from "../utils/localStorageKeys";
import { toast } from "sonner";

const businessSignUpSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type BusinessSignUpFormData = z.infer<typeof businessSignUpSchema>;
interface BusinessSignUpFormProps {
  details: any;
  setDetails: Dispatch<SetStateAction<any>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  onNext?: (email: string, formData: any) => void
}

const BusinessSignUpForm = ({ details, setDetails, currentStep, setCurrentStep, onNext }: BusinessSignUpFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isValid }, } = useForm<BusinessSignUpFormData>({
    resolver: zodResolver(businessSignUpSchema),
    mode: "onChange",
    defaultValues: {
      businessName: details.businessName || "",
      email: details.email || "",
      phoneNumber: details.phoneNumber || "",
      password: "",
      confirmPassword: "",
    },
  });

  const phoneNumber = watch("phoneNumber");

  const onSubmit = async (data: BusinessSignUpFormData) => {
    setLoading(true);

    try {
      const userData = {
        ...data,
        userType: "business"
      }
      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.BUSINESS_SIGNUP}`, userData);

      if (resp.status === 201) {
        toast.success(resp?.data?.message);

        setDetails((prev: any) => ({
          ...prev,
          business_name: data.businessName,
          email: data.email,
          phone: data.phoneNumber,
          password: data.password,
          userType: "business"
        }));

        if (onNext) {
          onNext(data.email, data);
        }
      }
      else {
        toast.error(resp?.data?.message);
      }
    }
    catch (err: any) {
      setLoading(false);
      toast.error(err?.response?.message);
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
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
          <label className="block text-sm font-medium mb-2">
            Business Name
          </label>
          <input type="text" {...register("businessName")} placeholder='Enter business name' required className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
          {errors.businessName && (
            <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" {...register("email")} placeholder='Enter email' required className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <PhoneNumberInput value={phoneNumber} onValueChange={(value) => setValue("phoneNumber", value, { shouldValidate: true })} hasError={!!errors.phoneNumber} />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className='relative'>
            <input type={showPassword ? "text" : "password"} placeholder='Enter password' {...register("password")} required className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none pr-10" />
            <button type='button' onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer">
              {showPassword ? <PiEyeSlashDuotone size={20} /> : <PiEyeDuotone size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
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
            {loading ? 'Submitting' : 'Sign Up'}
          </button>

          <p className="text-sm text-gray-500 text-center">Already have an account? <a href="/login" className="text-[#001EB4] font-medium hover:underline">Log in</a></p>
        </div>
      </form>
    </div>
  );
};

export default BusinessSignUpForm;
