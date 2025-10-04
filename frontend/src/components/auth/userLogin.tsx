import { useState } from "react";
import { PiEyeSlashDuotone, PiEyeDuotone } from 'react-icons/pi';
import CustomCheckbox from "../ui/Checkbox";
import { useForm } from "react-hook-form"
import ErrorHandler from "../ErrorHandler/ErrorHandler";

const UserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<({
    email: string;
    password: string;
  })>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const handleNext = (data: { email: string; password: string }) => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
        console.log("Login successful!", data)
        alert("Login successful!")
    }, 2000)
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start h-full">
      <div className="w-full text-center sm:text-left">
        <h2 className="text-2xl font-semibold mb-3">Login</h2>
        <p className="text-sm text-gray-600">Log in to manage your bookings, pick up where you left off, and get on the road faster.</p>
      </div>

      {/* Business Sign up form */}
      <form onSubmit={handleSubmit(handleNext)} className="w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" {...register("email")} placeholder="Enter email" required className={`bg-[#E9ECF2] text-[#5C5C5C] text-sm border ${errors.email ? "border-[#F71414] focus:border-[#F71414]" : "border-gray-300 focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200"} p-2 w-full rounded-md focus:outline-none`} />
          {errors.email && (
            <div className="text-left  ml-3">
              <ErrorHandler errors={errors} />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="Enter password" required className={`bg-[#E9ECF2] text-[#5C5C5C] text-sm border ${errors.password ? "border-[#F71414] focus:border-[#F71414]" : "border-gray-300 focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200"} p-2 w-full rounded-md focus:outline-none pr-10`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer" >
              {showPassword ? ( <PiEyeSlashDuotone size={20} /> ) : ( <PiEyeDuotone size={20} /> )}
            </button>
          </div>
          {errors.password && (
            <div className="text-left ml-3">
              <ErrorHandler errors={errors} />
            </div>
          )}
        </div>

        <div className="mb-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-x-1 text-xs md:text-sm">
            <CustomCheckbox name='rememberMe' /> Remember me
          </div>
          <a href="#" className="text-xs md:text-sm text-[#001EB4] font-medium hover:underline">Forgot password?</a>
        </div>

        <div className='flex flex-col gap-3 justify-center'>
          <div className="flex justify-center mt-4">
            <button type="submit" disabled={loading} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
              {loading ? "Submitting" : "Login"}
            </button>
          </div>
          <div className=" text-center">
            <p className="text-xs md:text-sm text-gray-500">Don't have an account? <a href="/business-signup" className="text-[#001EB4] font-medium hover:underline">Sign up</a></p>
          </div>
        </div>

      </form>
    </div>
  );
}

export default UserLogin