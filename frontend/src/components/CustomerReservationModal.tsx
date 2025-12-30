import { X, UserRound, Calendar, User } from "lucide-react";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import SelectDate from "./SelectDate";
import SelectDropdown from "./SelectDropdown";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { postData } from "./lib/apiMethods";
import CONFIG from "./utils/config";
import { apiEndpoints } from "./lib/apiEndpoints";
import { LOCAL_STORAGE_KEYS } from "./utils/localStorageKeys";

interface Car {
  id: number;
  car_type: string;
  model: string | null;
  year_of_manufacture: number;
  daily_rental_price: number;
  deposit: number;
  reserved_ranges?: { from: string; to: string }[];
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  car: Car;
}

const reservationSchema = z.object({
  customerName: z.string().min(2, 'Name is required (minimum 2 characters)'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  selectedCarId: z.number({ message: 'Vehicle selection is required' }),
  selectedCar: z.any().optional(),
  pickupDate: z.date({ message: "Pickup date is required" }),
  returnDate: z.date({ message: "Return date is required" }),
  pickupLocation: z.string().min(2, "Pickup location is required"),
  notes: z.string().optional(),
}).refine((data) => data.returnDate > data.pickupDate, {
    message: "Return date must be after pickup date",
    path: ["returnDate"],
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const CustomerReservationModal = ({ isOpen, onClose, onConfirm, car }: ReservationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    mode:'onChange',
    defaultValues: {
      customerName: '',
      email: '',
      selectedCarId: car.id,
      selectedCar: car,
      pickupDate: undefined,
      returnDate: undefined,
      pickupLocation: '',
      notes: '',
    }
  });

  const pickupDate = watch("pickupDate");
  const returnDate = watch("returnDate");

  const isDateReserved = (date: Date): boolean => {
    if (!car.reserved_ranges) return false;

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return car.reserved_ranges.some(range => {
      const fromDate = new Date(range.from);
      const toDate = new Date(range.to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      return checkDate >= fromDate && checkDate <= toDate;
    })
  }

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0] + 'T00:00:00Z';
  };


  const onSubmit = async (data: ReservationFormData) => {
    if (!car) {
      toast.error("Car information is missing");
      return;
    }

    if (!data.pickupDate || !data.returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }

    setLoading(true);
    
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

    try {
      const formattedPickupDate = data.pickupDate.toISOString();
      const formattedReturnDate = data.returnDate.toISOString();

      const reservationPayload = {
        car: car.id,
        guest_email: data.email,
        guest_phone: data.phone,
        reserved_from: formattedPickupDate,
        reserved_to: formattedReturnDate,
        pickup_location: data.pickupLocation,
        notes: data.notes || '',
      };

      
      const reservationResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MAKE_A_RESERVATION}`, reservationPayload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const reservationResp = reservationResponse.data;

      if (reservationResponse.status === 200 || reservationResponse.status === 201) {
        toast.success(reservationResp?.message);

        const initializePaymentData = {
          reservation_code: reservationResp.reservation_code,
          amount: Number(reservationResp.deposit_amount),
        }

        const paymentInitResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.INITIALIZE_PAYMENTS}`, initializePaymentData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const paymentInitResp = paymentInitResponse.data;

        if (paymentInitResponse.status === 200 || paymentInitResponse.status === 201) {
          const paymentId = paymentInitResp.payment_id;

          const completePaymentResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.COMPLETE_PAYMENTS.replace(':id', paymentId)}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const { authorization_url, payment_id } = completePaymentResponse.data;

          sessionStorage.setItem('pending_payment_id', paymentId);
          sessionStorage.setItem('reservation_code', reservationResp.reservation_code);

          window.location.href = authorization_url;
        }
      }

      onConfirm();
      
    } catch (err: any) {
      const errData = err?.response?.data;
    
      if (errData && typeof errData === 'object') {
        Object.keys(errData).forEach((key) => {
          if (Array.isArray(errData[key])) {
            errData[key].forEach((message: string) => {
              toast.error(message)
            });
          } else {
            toast.error(errData[key]);
          }
        });
      } else {
        toast.error("Failed to make reservation");
      }
    } finally {
      setLoading(false);
    }
  };


  const calculateRentalDetails = () => {
    if (!pickupDate || !returnDate) return null;
    
    const timeDiff = returnDate.getTime() - pickupDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = days * car.daily_rental_price;
    const deposit = totalPrice * 0.1;
    
    return { days, totalPrice, deposit };
  };

  const rentalDetails = calculateRentalDetails();

  return (
    <dialog open={isOpen} className="modal">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 lg:p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto trick">
          {/* Header */}
          <div className="sticky top-0 bg-[#F3F4F6] px-6 py-4 flex items-center justify-between z-20">
            <div>
              <h2 className="text-xl font-medium text-black">
                Create a reservation - {car.car_type} {car.model || ''}
              </h2>
              <p className="text-sm text-gray-600">₦{car.daily_rental_price?.toLocaleString()}/day</p>
            </div>
            <button onClick={onClose} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer" >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-2 lg:px-6 py-8">
            {/* Guest Information */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-3 mb-4">
                <User className="size-6 text-[#4B61A1ED] mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-black">Your Information</h3>
                  <p className="text-sm text-gray-600">We'll use this to confirm your reservation</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("customerName")}
                  className="text-[#5C5C5C] text-sm w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0]"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  className="text-[#5C5C5C] text-sm w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0]"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+234 801 234 5678"
                  {...register("phone")}
                  className="text-[#5C5C5C] text-sm w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0]"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-3 mb-6">
                <Calendar className="size-6 text-[#4B61A1ED] mt-1" />
                <div>
                  <h3 className="text-lg lg:text-xl font-medium text-black mb-1">
                    Rental Period
                  </h3>
                  <p className="text-sm text-gray-600">
                    Select your pickup and return dates
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <SelectDate
                  label="Start Date"
                  placeholder="Select start date"
                  value={pickupDate}
                  onChange={(date) => {
                    if (date) setValue("pickupDate", date, { shouldValidate: true });
                  }}
                  minDate={new Date()}
                />
                {errors.pickupDate && (
                  <p className="text-red-500 text-xs -mt-4">{errors.pickupDate.message}</p>
                )}

                <SelectDate
                  label="End Date"
                  placeholder="Select end date"
                  value={returnDate}
                  onChange={(date) => {
                    if (date) setValue("returnDate", date, { shouldValidate: true });
                  }}
                  minDate={pickupDate || new Date()}
                />
                {errors.returnDate && (
                  <p className="text-red-500 text-xs -mt-4">{errors.returnDate.message}</p>
                )}
                {/* <div>
                  <Label className="mb-4">Payment Options</Label>
                  <RadioGroup defaultValue="pay_on_delivery" onValueChange={(value: 'pay_on_delivery' | 'pay_now') => 
                      setValue('paymentOption', value, { shouldValidate: true })
                    }>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pay_on_delivery" id="r1" />
                      <Label htmlFor="r1" className='font-normal text-[#5C5C5C] text-sm'>Pay on Delivery</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pay_now" id="r2" />
                      <Label htmlFor="r2" className='font-normal text-[#5C5C5C] text-sm'>Pay Now</Label>
                    </div>
                  </RadioGroup>
                  {errors.paymentOption && (
                    <p className="text-red-500 text-xs mt-1">{errors.paymentOption.message}</p>
                  )}
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Pickup Location
                  </label>
                  <input type="text" placeholder="e.g, Ikeja" {...register('pickupLocation')} onChange={(e) => setValue("pickupLocation", e.target.value) } className="text-[#5C5C5C] text-sm w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                  {errors.pickupLocation && (
                    <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Notes (Optional)
                  </label>
                  <input type="text" placeholder="Enter any notes" {...register('notes')} onChange={(e) => setValue("notes", e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Rental Summary */}
            {rentalDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-3">Rental Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Rental Period:</span>
                    <span className="font-medium text-blue-900">{rentalDetails.days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Daily Rate:</span>
                    <span className="font-medium text-blue-900">
                      ₦{car.daily_rental_price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-300">
                    <span className="text-blue-700 font-semibold">Total Cost:</span>
                    <span className="font-bold text-blue-900">
                      ₦{rentalDetails.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Deposit Required:</span>
                    <span className="font-medium text-blue-900">
                      ₦{rentalDetails.deposit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h5 className="font-semibold text-yellow-800 mb-2">Important Notice</h5>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Your reservation will be confirmed via email</li>
                <li>• Payment will be made upon vehicle pickup</li>
                <li>• Please bring a valid ID and driver's license</li>
                <li>• Cancellation policy applies as per rental terms</li>
              </ul>
            </div>

            <div className="bg-white px-6 py-4 flex items-center justify-end gap-4">
              <button type="button" onClick={onClose} className={`flex px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer`} >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                {loading ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </dialog>
  );
};

export default CustomerReservationModal;
