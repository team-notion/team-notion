import { X, UserRound, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SelectDate from "./SelectDate";
import SelectDropdown from "./SelectDropdown";
import { Input } from "./ui/input";

interface RescheduleReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface FormData {
  customerName: string;
  email: string;
  selectedCar: string;
  pickupLocation: string;
  pickupDate?: Date;
  returnDate?: Date;
  startDate?: Date;
  endDate?: Date;
  notes: string;
}

const RescheduleReservationModal = ({ isOpen, onClose, onConfirm, }: RescheduleReservationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors, isValid }, getValues, trigger, } = useForm({});

  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    email: "",
    selectedCar: "",
    pickupLocation: "",
    pickupDate: undefined,
    returnDate: undefined,
    startDate: undefined,
    endDate: undefined,
    notes: "",
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
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
      selectedCar: "",
      pickupLocation: "",
      pickupDate: undefined,
      returnDate: undefined,
      startDate: undefined,
      endDate: undefined,
      notes: "",
    });
    onClose();
  };

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
                <div className={`w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-semibold ${ currentStep >= 1 ? "bg-[#1E3A8A] text-white" : "bg-gray-200 text-gray-500" }`} >
                  1
                </div>
                <div className={`w-9 lg9 md:w-10 md:h-10-24 h-0.5 mx-2 ${ currentStep >= 2 ? "bg-[#1E3A8A]" : "bg-gray-300" }`} />
                <div className={`w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-semibold ${ currentStep >= 2 ? "bg-[#1E3A8A] text-white" : "bg-gray-200 text-gray-500" }`} >
                  2
                </div>
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
                      <p className="text-sm text-gray-600">Customer: <span className='text-gray-900'>John Smith</span></p>
                      <p className="text-sm text-gray-600">Current Dates: <span className='text-gray-900'>25/5/2024-30/5/2024</span></p>
                    </div>
                    <div className='flex flex-col'>
                      <p className="text-sm text-gray-600">Vehicle: <span className='text-gray-900'>2023 Toyota Camry</span></p>
                      <p className="text-sm text-gray-600">Location: <span className='text-gray-900'>Liferoad, Kaduna</span></p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <SelectDate
                     label="New Start Date"
                     placeholder="Select start date"
                     value={formData.startDate}
                     onChange={(date) => handleInputChange("startDate", date)}
                     minDate={new Date()}
                   />

                   <SelectDate
                     label="New End Date"
                     placeholder="Select end date"
                     value={formData.endDate}
                     onChange={(date) => handleInputChange("endDate", date)}
                     minDate={formData.endDate || new Date()}
                   />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Pick-Up Time</label>
                      <Input type="time" id="pickup-time-picker" placeholder="Select Pickup Time" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none bg-background " />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Drop-Off Time</label>
                      <Input type="time" id="dropoff-time-picker" placeholder="Select Dropoff Time" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none bg-background " />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Reason for Rescheduling</label>
                    <Input type="text" placeholder="Enter reason for rescheduling" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                  </div>
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
                      <label className="block text-sm font-medium text-black mb-2">New Pick-Up Time</label>
                      <Input type="time" id="new-pickup-time-picker" placeholder="Select New Pickup Time" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none bg-background " />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">New Drop-Off Time</label>
                      <Input type="time" id="new-dropoff-time-picker" placeholder="Select New Dropoff Time" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none bg-background " />
                    </div>
                  </div>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <SelectDropdown
                        name="category"
                        control={control}
                        placeholder="Available Cars"
                        options={[
                          { label: "Toyota Camry", value: "toyota-camry" },
                          { label: "Honda Accord", value: "honda-accord" },
                        ]}
                        handleChange={(newValue) =>
                          field.onChange(newValue?.value)
                        }
                      />
                    )}
                  />
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
                <button onClick={currentStep === 1 ? handleCancel : handleNext} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                  {currentStep === 2 ? "Done" : "Next"}
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
