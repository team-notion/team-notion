import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Calendar, UserRound, X } from 'lucide-react';
import SelectDropdown from './SelectDropdown';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SelectDate from './SelectDate';

interface CreateReservationModalProps {
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
  notes: string;
}

const CreateReservationModal = ({ isOpen, onClose, onConfirm }: CreateReservationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors, isValid }, getValues, trigger } = useForm({});

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    email: '',
    selectedCar: '',
    pickupLocation: '',
    pickupDate: undefined,
    returnDate: undefined,
    notes: '',
  });

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCancel = () => {
    setCurrentStep(1);
    setFormData({
      customerName: '',
      email: '',
      selectedCar: '',
      pickupLocation: '',
      pickupDate: undefined,
      returnDate: undefined,
      notes: ''
    });
    onClose();
  };

  return (
    <dialog open={isOpen} className='modal'>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 lg:p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto trick">
          {/* Header */}
          <div className="sticky top-0 bg-[#F3F4F6] px-6 py-4 flex items-center justify-between z-20">
            <div>
              <h2 className="text-xl font-medium text-black">Create Reservation</h2>
              <p className="text-gray-600 text-sm mt-1">Step {currentStep} of 3</p>
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
                <div className={`w-9 lg9 md:w-10 md:h-10-24 h-0.5 mx-2 ${ currentStep >= 3 ? "bg-[#1E3A8A]" : "bg-gray-300" }`} />
                <div className={`w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-semibold ${ currentStep >= 3 ? "bg-[#1E3A8A] text-white" : "bg-gray-200 text-gray-500" }`} >
                  3
                </div>
              </div>
            </div>

            {/* Step 1: Vehicle Information */}
            {currentStep === 1 && (
              <div>
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
                    <input type="text" placeholder="Enter customer name" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value) } className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                    <input type="email" placeholder="Enter customer email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Features */}
            {currentStep === 2 && (
              <div>
                <div className="flex items-start gap-3 mb-6">
                  <UserRound className="size-6 text-[#4B61A1ED] mt-1" />
                  <div>
                    <h3 className="text-lg lg:text-xl font-medium text-black mb-1">Pricing & Features</h3>
                    <p className="text-sm text-gray-600">Set rental rate and select features</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <SelectDropdown
                        name="category"
                        control={control}
                        placeholder="Available Cars"
                        options={[
                          { label: 'Toyota Camry', value: 'toyota-camry' },
                          { label: 'Honda Accord', value: 'honda-accord' },]}
                        handleChange={(newValue) => field.onChange(newValue?.value) }
                      />
                    )}
                  />

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Pickup Location</label>
                    <input type="text" placeholder="e.g, Ikeja" value={formData.pickupLocation} onChange={(e) => handleInputChange("pickupLocation", e.target.value) } className="text-[#5C5C5C] text-sm w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Upload Photos */}
            {currentStep === 3 && (
              <div>
                <div className="flex items-start gap-3 mb-6">
                  <Calendar className="size-6 text-[#4B61A1ED] mt-1" />
                  <div>
                    <h3 className="text-lg lg:text-xl font-medium text-black mb-1">Dates & Review</h3>
                    <p className="text-sm text-gray-600">Set rental dates and review details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <SelectDate
                    label="Pickup Date"
                    placeholder="Select pickup date"
                    value={formData.pickupDate}
                    onChange={(date) => handleInputChange("pickupDate", date)}
                    minDate={new Date()}
                  />

                  <SelectDate
                    label="Return Date"
                    placeholder="Select return date"
                    value={formData.returnDate}
                    onChange={(date) => handleInputChange("returnDate", date)}
                    minDate={formData.pickupDate || new Date()}
                  />
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Notes (Optional)</label>
                    <input type="text" placeholder="Enter any notes" value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='bg-white px-6 py-4 flex items-center justify-end gap-4'>
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
                <button onClick={handleBack} className={`${currentStep === 3 ? 'hidden' : 'flex'} px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer`} >
                  Back
                </button>
                <button onClick={currentStep === 3 ? handleCancel : handleNext} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                  {currentStep === 3 ? 'Finish' : 'Next'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default CreateReservationModal