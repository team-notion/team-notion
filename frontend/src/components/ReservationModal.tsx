import { X, AlertCircle, CheckCircle2, Users, Calendar, UserRound } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm, Controller } from "react-hook-form"
import SelectDate from "./SelectDate"
import SelectDropdown from "./SelectDropdown"
import { useState } from "react"
import PhoneNumberInput from "./ui/PhoneNumberInput"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

export interface ReservationFormData {
  customerName: string
  phoneNumber: string
  email: string
  pickupDate: string
  returnDate: string
  driverName: string
  driverLastName: string
  dateOfBirth: string
  issueDate: string
  issuingCountry: string
  licenseClass: string
}

interface Car {
  id: number;
  car_type: string;
  model: string | null;
  year_of_manufacture: number;
  daily_rental_price: number;
  deposit: number;
}

// Warning Modal
interface WarningModalProps {
  isOpen: boolean
  onClose: () => void
  onSignUp: () => void
  onContinue: () => void
}

export function WarningModal({ isOpen, onClose, onSignUp, onContinue }: WarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-3xl p-0 gap-0">
        <div className="px-2 py-4 lg:p-10 space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-4 border-[#F97316] flex items-center justify-center">
              <AlertCircle className="size-8 text-[#F97316]" />
            </div>
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl lg:text-3xl font-medium text-center text-[#0D183A]">Warning</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm text-gray-700">
            <p className="text-center">You are currently using a guest account. Which means:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Any reservation made will be soft reserved ( can be overruled )</li>
              <li>You will not be able to pay for the reservation until you sign up or log into your account</li>
              <li>
                Account holders have priority over rentals ( i.e They can take your spot once they pay the rental fee )
              </li>
              <li>
                If payment has not been made within a specified time period. If payment has not been made by then, your
                reservation will be cancelled.
              </li>
            </ol>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSignUp}
              className="flex-1 px-4 py-2 border-2 border-[#F97316] text-[#F97316] rounded-lg hover:bg-orange-50 font-medium cursor-pointer"
            >
              Sign up
            </button>
            <button
              onClick={onContinue}
              className="flex-1 px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Customer Info Form Component
interface CustomerFormData {
  customerName: string
  phoneNumber: string
  email: string
  pickupDate: string
  returnDate: string
}

interface CustomerInfoFormProps {
  formData: CustomerFormData
  onFormChange: (data: Partial<CustomerFormData>) => void
}

function CustomerInfoForm({ formData, onFormChange }: CustomerInfoFormProps) {
  return (
    <>
      <div 
        className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-[#0D183A]">Customer information</h3>
        </div>
        <p className="text-sm text-gray-600">Enter customer detail</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={formData.customerName}
            onChange={(e) => onFormChange({ customerName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
          <input
            type="tel"
            placeholder="000-0000-0000"
            value={formData.phoneNumber}
            onChange={(e) => onFormChange({ phoneNumber: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="www.hotel@gmail.com"
            value={formData.email}
            onChange={(e) => onFormChange({ email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pick up date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.pickupDate}
                onChange={(e) => onFormChange({ pickupDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.returnDate}
                onChange={(e) => onFormChange({ returnDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Driver Info Form Component
interface DriverFormData {
  driverName: string
  driverLastName: string
  dateOfBirth: string
  issueDate: string
  issuingCountry: string
  licenseClass: string
}

interface DriverInfoFormProps {
  formData: DriverFormData
  onFormChange: (data: Partial<DriverFormData>) => void
}

function DriverInfoForm({ formData, onFormChange }: DriverInfoFormProps) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-[#0D183A]">Driver information</h3>
        </div>
        <p className="text-sm text-gray-600">Enter driver detail</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name / Last Name</label>
            <input
              type="text"
              placeholder="First name"
              value={formData.driverName}
              onChange={(e) => onFormChange({ driverName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
            <input
              type="text"
              placeholder="Last name"
              value={formData.driverLastName}
              onChange={(e) => onFormChange({ driverLastName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.dateOfBirth}
                onChange={(e) => onFormChange({ dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.issueDate}
                onChange={(e) => onFormChange({ issueDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Country</label>
            <input
              type="text"
              placeholder="Enter issuing country"
              value={formData.issuingCountry}
              onChange={(e) => onFormChange({ issuingCountry: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Driver's License Class</label>
            <input
              type="text"
              placeholder="Enter license class"
              value={formData.licenseClass}
              onChange={(e) => onFormChange({ licenseClass: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
          </div>
        </div>
      </div>
    </>
  )
}




// Reservation Modal (Multi-step)
interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  onNext: (reservationData: any) => void
  onBack: () => void
  car: Car
}


const reservationSchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  pickupDate: z.date({ message: "Pickup date is required" }),
  returnDate: z.date({ message: "Return date is required" }),
  pickupLocation: z.string().min(2, "Pickup location is required"),
  })
  .refine((data) => data.returnDate > data.pickupDate, {
    message: "Return date must be after pickup date",
    path: ["returnDate"],
});
  
  
export function ReservationModal({
  isOpen,
  onClose,
  onNext,
  onBack,
  car,
}: ReservationModalProps) {
  const [loading, setLoading] = useState(false);
  type ReservationFormData = z.infer<typeof reservationSchema>;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    mode: 'onChange',
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      pickupDate: undefined,
      returnDate: undefined,
      pickupLocation: '',
    },
  });

  const pickupDate = watch('pickupDate');
  const returnDate = watch('returnDate');

  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0] + 'T00:00:00Z';
  };

  const onSubmit = async (data: ReservationFormData) => {
    if (!car) {
      toast.error("Car information is missing");
      return;
    }

    setLoading(true);
    try {
      const reservationPayload = {
        car: car.id,
        reserved_from: formatDateForAPI(data.pickupDate),
        reserved_to: formatDateForAPI(data.returnDate),
        guest_name: data.customerName,
        guest_email: data.email,
        guest_phone: data.phone,
        pickup_location: data.pickupLocation,
      };

      console.log("Guest reservation payload:", reservationPayload);
      
      onNext(reservationPayload);
      
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error("Failed to process reservation");
    } finally {
      setLoading(false);
    }
  };

  const calculateRentalDetails = () => {
    if (!pickupDate || !returnDate) return null;
    
    const timeDiff = returnDate.getTime() - pickupDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = days * car.daily_rental_price;
    
    return { days, totalPrice };
  };

  const rentalDetails = calculateRentalDetails();

  if (!isOpen) return null;
  
  return (
    <dialog open={isOpen} className='modal'>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 lg:p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto trick">
          {/* Header */}
          <div className="sticky top-0 bg-[#F3F4F6] px-6 py-4 flex items-center justify-between z-20">
            <div>
              <h2 className="text-xl font-medium text-black">Guest Reservation - {car.car_type} {car.model || ''}</h2>
              <p className="text-sm text-gray-600">₦{car.daily_rental_price?.toLocaleString()}/day</p>
            </div>
            <button onClick={onClose} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer" >
              <X size={20} />
            </button>
          </div>

          <div className="px-2 lg:px-6 py-8">

            {/* Step 1: Vehicle Information */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-start gap-3 mb-6">
                <UserRound className="size-6 text-[#4B61A1ED] mt-1" />
                <div>
                  <h3 className="text-lg lg:text-xl font-medium text-black mb-1">Customer Information</h3>
                  <p className="text-sm text-gray-600">Enter customer details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Customer Name</label>
                  <input type="text" placeholder="Enter customer name" {...register('customerName')} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                  <PhoneNumberInput value={watch('phone')} onValueChange={(value) => setValue("phone", value, { shouldValidate: true })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                  <input type="email" placeholder="Enter customer email" {...register('email')} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className='grid grid-cols-1'>
                    <SelectDate
                      label="Pickup Date"
                      placeholder="Select pickup date"
                      value={pickupDate}
                      onChange={(date) => {
                        if (date) setValue("pickupDate", date, { shouldValidate: true });
                      }}
                      minDate={new Date()}
                    />
                    {errors.pickupDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.pickupDate.message}</p>
                    )}
                  </div>

                  <div className='grid grid-cols-1'>
                    <SelectDate
                      label="Return Date"
                      placeholder="Select return date"
                      value={returnDate}
                      onChange={(date) => {
                        if (date) setValue("returnDate", date, { shouldValidate: true })
                      }}
                      minDate={pickupDate || new Date()}
                    />
                    {errors.returnDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.returnDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Pickup Location
                    </label>
                    <input type="text" placeholder="e.g, Ikeja" {...register('pickupLocation')} className="text-[#5C5C5C] text-sm w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                    {errors.pickupLocation && (
                      <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>
                    )}
                  </div>
                </div>

                {rentalDetails && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Rental Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Rental Days:</span>
                        <span>{rentalDetails.days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Rate:</span>
                        <span>₦{car.daily_rental_price?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total Price:</span>
                        <span>₦{rentalDetails.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Deposit:</span>
                        <span>₦{car.deposit?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='bg-white px-6 py-4 flex items-center justify-end gap-4 mt-4'>
                <button onClick={onBack} className={`flex px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer`} >
                  Back
                </button>
                <button type="submit" disabled={loading} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                  {loading ? 'Processing...' : 'Make Reservation'}
                </button>
              </div>
            </form>

          </div>

        </div>
      </div>
    </dialog>
  )
}










// Success Modal
interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onDone: () => void
}

export function SuccessModal({ isOpen, onClose, onDone }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0">
        <div className="px-2 py-4 lg:p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-12 lg:w-20 h-12 lg:h-20 rounded-full border-4 border-[#10B981] flex items-center justify-center">
              <CheckCircle2 className="size-8 text-[#10B981]" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-[#0D183A]">Temporary Reservation Successful</h2>
            <p className="text-sm text-gray-600">
              Your car is soft reserved for 24 hours. An Email will be sent containing instructions on how to confirm
              booking.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onDone}
              className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
