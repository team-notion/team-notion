import { X, UserRound, Calendar } from "lucide-react";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import SelectDate from "./SelectDate";
import SelectDropdown from "./SelectDropdown";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface Car {
  id: number;
  car_type: string;
  model: string | null;
  year_of_manufacture: number;
  daily_rental_price: number;
  deposit: number;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (reservationData: any) => void;
  onConfirm: (reservationData: any) => void;
  car: Car;
}

const reservationSchema = z.object({
  pickupLocation: z.string().min(2, "Pickup location is required"),
  notes: z.string().optional(),
  startDate: z.date({ message: "Pickup date is required" }),
  endDate: z.date({ message: "Return date is required" }),
  paymentOption: z.enum(['pay_on_delivery', 'pay_now'], {
    message: "Please select a payment option"
  }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Return date must be after pickup date",
    path: ["returnDate"],
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const CustomerReservationModal = ({
  isOpen,
  onClose,
  onNext,
  onConfirm,
  car,
}: ReservationModalProps) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    mode:'onChange',
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      paymentOption: 'pay_on_delivery',
      pickupLocation: '',
      notes: '',
    }
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0] + 'T00:00:00Z';
  };


  const onSubmit = (data: ReservationFormData) => {
    if (!car) {
      toast.error("Car information is missing");
      return;
    }

    setLoading(true);
    try {
      const reservationPayload = {
        car: car.id,
        reserved_from: formatDateForAPI(data.startDate),
        reserved_to: formatDateForAPI(data.endDate),
        pickup_location: data.pickupLocation,
        notes: data.notes || '',
        payment_option: data.paymentOption,
      };

      
      onNext(reservationPayload);
      
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error("Failed to process reservation");
    } finally {
      setLoading(false);
    }
  };


  const calculateRentalDetails = () => {
    if (!startDate || !endDate) return null;
    
    const timeDiff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = days * car.daily_rental_price;
    
    return { days, totalPrice };
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

          <div className="px-2 lg:px-6 py-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-start gap-3 mb-6">
                <Calendar className="size-6 text-[#4B61A1ED] mt-1" />
                <div>
                  <h3 className="text-lg lg:text-xl font-medium text-black mb-1">
                    Dates & Review
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set rental dates and review details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <SelectDate
                  label="Start Date"
                  placeholder="Select start date"
                  value={startDate}
                  onChange={(date) => {
                    if (date) setValue("startDate", date, { shouldValidate: true });
                  }}
                  minDate={new Date()}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs -mt-4">{errors.startDate.message}</p>
                )}

                <SelectDate
                  label="End Date"
                  placeholder="Select end date"
                  value={endDate}
                  onChange={(date) => {
                    if (date) setValue("endDate", date, { shouldValidate: true });
                  }}
                  minDate={startDate || new Date()}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs -mt-4">{errors.endDate.message}</p>
                )}
                <div>
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
                </div>
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
              <div className="bg-white px-6 py-4 flex items-center justify-end gap-4">
                <button type="button" onClick={onClose} className={`flex px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer`} >
                  Cancel
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
  );
};

export default CustomerReservationModal;
