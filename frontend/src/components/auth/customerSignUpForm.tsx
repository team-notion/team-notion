import { useState } from "react";
import { PiEyeDuotone } from "react-icons/pi";
import { PiEyeSlashDuotone } from "react-icons/pi";
import PhoneNumberInput from "../ui/PhoneNumberInput";

interface CustomerSignUpFormProps {
  onNext?: (email: string) => void
}

const CustomerSignUpForm = ({ onNext }: CustomerSignUpFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      if (onNext) {
        onNext(email);
      }
    }, 2000)
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start h-full">
      <div className="w-full text-center sm:text-left">
        <h2 className="text-2xl font-semibold mb-3">Sign up</h2>
        <p className="text-sm text-gray-600">Sign up to explore our wide range of cars, get priority booking and hit the road with ease.</p>
      </div>

      {/* Business Sign up form */}
      <form onSubmit={handleNext} className="w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Name ( As written on driver’s license )
          </label>
          <input type="text" placeholder="Enter name ( As written on driver’s license )" required className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <PhoneNumberInput value={phoneNumber} onValueChange={setPhoneNumber} hasError={false} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Enter password" required className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer" >
              {showPassword ? (
                <PiEyeSlashDuotone size={20} />
              ) : (
                <PiEyeDuotone size={20} />
              )}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" required className="bg-[#E9ECF2] text-[#5C5C5C] text-sm border border-gray-300 p-2 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none pr-10" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer" >
              {showConfirmPassword ? (
                <PiEyeSlashDuotone size={20} />
              ) : (
                <PiEyeDuotone size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end mt-4">
          <button type="submit" disabled={loading} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 min-w-[10rem] cursor-pointer" >
            {loading ? "Submitting" : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerSignUpForm;
