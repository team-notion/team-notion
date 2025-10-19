import { Dispatch, SetStateAction, useState } from "react";
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import { register } from "module";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface EmailLinkProps {
  setCurrentStep: Dispatch<SetStateAction<number>>;
  currentStep: any;
  details: any;
  setDetails: Dispatch<SetStateAction<any>>;
  onNext?: (email: string) => void;
}

const EmailLinkSchema = z.object({
  email: z.string().email("Please enter a your email address"),
});

type EmailLinkFormData = z.infer<typeof EmailLinkSchema>;

const UserForgotPassword = ({ details, setDetails, currentStep, setCurrentStep, onNext, }: EmailLinkProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
  } = useForm<EmailLinkFormData>({
    resolver: zodResolver(EmailLinkSchema),
    mode: "onChange",
    defaultValues: {
      email: details.email || "",
    },
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8 justify-between items-start h-full">
      <div className="w-full text-center">
        <h2 className="text-2xl font-semibold mb-3">Password reset</h2>
        <p className="text-sm text-gray-600">Please enter your email</p>
      </div>

      {/* Business Sign up form */}
      <form className="w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" {...register("email")} placeholder="Enter email" required className={`bg-[#E9ECF2] text-[#5C5C5C] text-sm border ${ errors.email ? "border-[#F71414] focus:border-[#F71414]" : "border-gray-300 focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200" } p-2 w-full rounded-md focus:outline-none`} />
          {errors.email && (
            <div className="text-left  ml-3">
              <ErrorHandler errors={errors} />
            </div>
          )}
        </div>

        <div className="flex flex-col  items-center justify-center md:justify-end gap-3 mt-4">
          <button type="submit" disabled={loading} className="px-8 py-2 bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 w-[10rem] cursor-pointer" >
            {loading ? "Submitting" : "Send"}
          </button>

          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-[#001EB4] font-medium hover:underline" >
              Log in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserForgotPassword;
