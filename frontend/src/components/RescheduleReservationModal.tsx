import { X, UserRound, Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SelectDate from "./SelectDate";
import SelectDropdown from "./SelectDropdown";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { LOCAL_STORAGE_KEYS } from "./utils/localStorageKeys";
import CONFIG from "./utils/config";
import { apiEndpoints } from "./lib/apiEndpoints";
import { postData } from "./lib/apiMethods";
import { Textarea } from "./ui/textarea";

interface RescheduleReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingData?: {
    reservation_code: string;
    customer_name: string;
    customer_email: string;
    vehicle_name: string;
    plate_number: string;
    pickup_location: string;
    reserved_from: string;
    reserved_to: string;
    car_id: number;
    customer_id: string;
  } | null;
}

interface FormData {
  customerName: string;
  email: string;
  selectedCarId: number | null;
  selectedCar: any;
  pickupLocation: string;
  pickupDate?: Date;
  returnDate?: Date;
  notes: string;
}

const RescheduleReservationModal = ({ isOpen, onClose, onConfirm, bookingData }: RescheduleReservationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors, isValid }, getValues, trigger, } = useForm({});

  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    email: "",
    selectedCarId: null,
    selectedCar: null,
    pickupLocation: "",
    pickupDate: undefined,
    returnDate: undefined,
    notes: "",
  });

  
  useEffect(() => {
    if (bookingData && isOpen) {
      setFormData({
        customerName: bookingData.customer_name || bookingData.customer_id,
        email: bookingData.customer_email || "",
        selectedCarId: bookingData.car_id || null,
        selectedCar: bookingData.vehicle_name || null,
        pickupLocation: bookingData.pickup_location || "",
        pickupDate: bookingData.reserved_from ? new Date(bookingData.reserved_from) : undefined,
        returnDate: bookingData.reserved_to ? new Date(bookingData.reserved_to) : undefined,
        notes: "",
      })
    }
  }, [bookingData, isOpen])


  const handleInputChange = (
    field: keyof FormData,
    value: string | Date | undefined | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSelectCar = (carId: number, car: any) => {
    setFormData((prev) => ({
      ...prev,
      selectedCarId: carId,
      selectedCar: car,
    }));
  };


  const handleNext = () => {
    if (currentStep === 2) {
      if (!formData.selectedCarId) {
        toast.error("Please select a car");
        return;
      }
      if (!formData.pickupDate || !formData.returnDate) {
        toast.error("Please select pickup and return dates");
        return;
      }
    }

    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  };


  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };


  const handleCancel = () => {
    setCurrentStep(1);
    setFormData({
      customerName: "",
      email: "",
      selectedCarId: null,
      selectedCar: null,
      pickupLocation: "",
      pickupDate: undefined,
      returnDate: undefined,
      notes: "",
    });
    onClose();
  };



  const handleUpdate = async () => {
    if (!bookingData) {
      toast.error('No booking data found');
      return;
    }

    if (!formData.pickupDate || !formData.returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

    try {
      // Format dates as YYYY-MM-DD for the API
      const formattedPickupDate = formData.pickupDate.toISOString();
      const formattedReturnDate = formData.returnDate.toISOString();

      // Prepare the reservation data
      const updateData = {
        car: formData.selectedCarId,
        reserved_from: formattedPickupDate,
        reserved_to: formattedReturnDate,
        customer_username: formData.customerName,
        customer_email: formData.email,
        pickup_location: formData.pickupLocation,
        notes: formData.notes,
      };

      // Make the API call
      const updateResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MAKE_A_RESERVATION}`, updateData , {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updateResp = updateResponse.data;

      if (updateResponse.status === 200 || updateResponse.status === 201) {
        toast.success(updateResp?.message || 'Reservation updated successfully');
        handleCancel();
        onConfirm();
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
          } else {
            toast.error(errData[key]);
          }
        });
      } else {
        toast.error("Failed to create reservation. Please try again.");
      }
    }
    finally {
      setIsSubmitting(false);
    }
  }



  return (
    <dialog open={isOpen} className="modal">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 lg:p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto trick">
          {/* Header */}
          <div className="sticky top-0 bg-[#F3F4F6] px-6 py-4 flex items-center justify-between z-20">
            <div>
              <h2 className="text-xl font-medium text-black">Reschedule Reservation</h2>
              <p className="text-gray-600 text-sm mt-1">Step {currentStep} of 2</p>
            </div>
            <button onClick={handleCancel} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer" >
              <X size={20} />
            </button>
          </div>

          <div className="px-2 lg:px-6 py-8">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                  {[1, 2].map((step, idx) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step}
                      </div>
                      {idx < 2 && (
                        <div className={`w-9 h-0.5 mx-2 ${currentStep > step ? 'bg-[#1E3A8A]' : 'bg-gray-300'}`} />
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Step 1: Vehicle Information */}
            {currentStep === 1 && (
              <div>
                <div className="flex items-start gap-3 mb-6">
                  <Calendar className="size-6 text-[#4B61A1ED] mt-1" />
                  <div>
                    <h3 className="text-base font-medium text-black mb-1">Dates & Review</h3>
                    <p className="text-sm text-gray-600">Set rental dates and review details</p>
                  </div>
                </div>

                <div className='flex flex-col items-start gap-4 justify-between bg-[#F3F4F6] p-2 rounded-md mb-8'>
                  <h3 className="text-base font-medium text-black mb-1">Current Reservation</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 w-full items-center justify-between gap-4'>
                    <div className='flex flex-col'>
                      <p className="text-sm text-gray-600">Customer: <span className='text-gray-900'>{formData.customerName}</span></p>
                      <p className="text-sm text-gray-600">Current Dates: <span className='text-gray-900'>{formData?.pickupDate?.toLocaleDateString()} - {formData.returnDate?.toLocaleDateString()}</span></p>
                    </div>
                    <div className='flex flex-col'>
                      <p className="text-sm text-gray-600">Vehicle: <span className='text-gray-900'>{formData.selectedCar}</span></p>
                      <p className="text-sm text-gray-600">Location: <span className='text-gray-900'>{formData.pickupLocation}</span></p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectDate
                      label="New Start Date"
                      placeholder="Select start date"
                      value={formData.pickupDate}
                      onChange={(date) => handleInputChange("pickupDate", date)}
                      minDate={new Date()}
                    />

                    <SelectDate
                      label="New End Date"
                       placeholder="Select end date"
                      value={formData.returnDate}
                      onChange={(date) => handleInputChange("returnDate", date)}
                      minDate={formData.pickupDate || new Date()}
                    />
                  </div>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Drop-Off Time</label>
                      <Input type="time" id="dropoff-time-picker" placeholder="Select Dropoff Time" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none bg-background " />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Reason for Rescheduling</label>
                    <Input type="text" placeholder="Enter reason for rescheduling" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                  </div> */}
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Features */}
            {currentStep === 2 && (
              <div>
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="size-6 text-[#4B61A1ED] mt-1" />
                  <div>
                    <h3 className="text-base font-medium text-black mb-1">Location & Vehicle</h3>
                    <p className="text-sm text-gray-600">Update new location and vehicle selection</p>
                  </div>
                </div>


                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Selected Car</label>
                      <div className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none bg-background ">{formData.selectedCar}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">New Pick-Up Location</label>
                      <Input type="text" placeholder="Select New Pickup Location" value={formData.pickupLocation} onChange={(e) => handleInputChange("pickupLocation", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-4.5 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none bg-background " />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Reason for Rescheduling</label>
                      <Textarea placeholder="Add reason for rescheduling" value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none bg-background " />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="bg-white px-6 py-4 flex items-center justify-end gap-4">
            {currentStep === 1 ? (
              <>
                <button onClick={handleCancel} className="px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer" >
                  Cancel
                </button>
                <button onClick={handleNext} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                  Next
                </button>
              </>
            ) : (
              <>
                <button onClick={handleBack} className={`${ currentStep === 1 ? "hidden" : "flex" } px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer`} >
                  Back
                </button>
                <button onClick={currentStep === 2 ? handleUpdate : handleNext} disabled={isSubmitting} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                  {isSubmitting ? 'Updating...' : currentStep === 2 ? "Update Reservation" : "Next"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default RescheduleReservationModal;
