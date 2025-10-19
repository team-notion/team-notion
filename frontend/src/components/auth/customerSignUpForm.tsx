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
import { UserRound } from 'lucide-react';
import Loader from "../ui/Loader/Loader";

const customerSignUpSchema = z.object({
  username: z.string().min(2, "UserName must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone_no: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CustomerSignUpFormData = z.infer<typeof customerSignUpSchema>;
interface CustomerSignUpFormProps {
  details: any;
  setDetails: Dispatch<SetStateAction<any>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  onNext?: (email: string, formData: any) => void
}

const CustomerSignUpForm = ({ details, setDetails, currentStep, setCurrentStep, onNext }: CustomerSignUpFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [backendErrors, setBackendErrors] = useState<{
    email?: string[];
    phone_no?: string[];
    username?: string[];
  }>({});

  const { register, handleSubmit, setValue, watch, formState: { errors, isValid }, } = useForm<CustomerSignUpFormData>({
    resolver: zodResolver(customerSignUpSchema),
    mode: "onChange",
    defaultValues: {
      username: details.username || "",
      email: details.email || "",
      phone_no: details.phone_no || "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const phone_no = watch("phone_no");

  const onSubmit = async (data: CustomerSignUpFormData) => {
    setLoading(true);
    setBackendErrors({});

    try {
      const userData = {
        ...data,
        userType: "customer"
      }
      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.USER_SIGNUP}`, userData);

      if (resp) {
        toast.success(resp?.message);

        setDetails((prev: any) => ({
          ...prev,
          username: data.username,
          email: data.email,
          phone_no: data.phone_no,
          password: data.password,
        }));

        if (onNext) {
          onNext(data.email, data);
        }
      }
      else {
        toast.error(resp?.username || resp?.phone_no || resp?.email);

        if (resp?.errors) {
          setBackendErrors(resp.errors);
        }
      }
    }
    catch (err: any) {
      toast.error(err?.response?.message);

      if (err?.response?.errors) {
        setBackendErrors(err.response.errors);
      }

      if (data.password !== data.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    }
    finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <Loader type="tailSpin" color="#175CD3" height={40} width={40} />
    </div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start h-full">
      <div className="w-full text-center sm:text-left">
        <h2 className="text-2xl font-semibold mb-3">Sign up</h2>
        <p className="text-sm text-gray-600">Sign up to explore our wide range of cars, get priority booking and hit the road with ease.</p>
      </div>

      {/* Business Sign up form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Name ( As written on driver’s license )
          </label>
          <input type="text" {...register("username")} placeholder="Enter name ( As written on driver’s license )" className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
          )}
          {backendErrors.username && (
            <p className="text-red-500 text-xs mt-1">{backendErrors.username[0]}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" placeholder="Enter email" {...register("email")} className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
          {backendErrors.email && (
            <p className="text-red-500 text-xs mt-1">{backendErrors.email[0]}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <PhoneNumberInput value={phone_no} onValueChange={(value) => setValue("phone_no", value, { shouldValidate: true })} hasError={!!errors.phone_no} />
          {errors.phone_no && (
            <p className="text-red-500 text-xs mt-1">{errors.phone_no.message}</p>
          )}
          {backendErrors.phone_no && (
            <p className="text-red-500 text-xs mt-1">{backendErrors.phone_no[0]}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Enter password" {...register("password")} className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer" >
              {showPassword ? (
                <PiEyeSlashDuotone size={20} />
              ) : (
                <PiEyeDuotone size={20} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" {...register("confirmPassword")} className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none pr-10" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer" >
              {showConfirmPassword ? (
                <PiEyeSlashDuotone size={20} />
              ) : (
                <PiEyeDuotone size={20} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex flex-col  items-center justify-center md:justify-end gap-3 mt-4">
          <button type="submit" disabled={loading} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
            {loading ? "Submitting" : "Sign Up"}
          </button>

          <p className="text-sm text-gray-500 text-center">Already have an account? <a href="/login" className="text-[#001EB4] font-medium hover:underline">Log in</a></p>
        </div>
      </form>
    </div>
  );
};

export default CustomerSignUpForm;
