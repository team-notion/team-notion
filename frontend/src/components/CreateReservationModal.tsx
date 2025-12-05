import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Calendar, UserRound, X } from 'lucide-react';
import SelectDropdown from './SelectDropdown';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SelectDate from './SelectDate';
import AvailableCarsCarousel from './AvailableCarsCarousel';
import { toast } from 'sonner';
import { apiEndpoints } from './lib/apiEndpoints';
import { getData, postData } from './lib/apiMethods';
import CONFIG from './utils/config';
import { LOCAL_STORAGE_KEYS } from './utils/localStorageKeys';

interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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

const CreateReservationModal = ({ isOpen, onClose, onConfirm }: CreateReservationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors, isValid }, getValues, trigger } = useForm({});

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    email: '',
    selectedCarId: null,
    selectedCar: null,
    pickupLocation: '',
    pickupDate: undefined,
    returnDate: undefined,
    notes: '',
  });

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectCar = (carId: number, car: any) => {
    setFormData((prev) => ({
      ...prev,
      selectedCarId: carId,
      selectedCar: car,
    }))
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.customerName.trim() || !formData.email.trim()) {
        toast.error("Please fill in all customer information")
        return
      }
    } else if (currentStep === 2) {
      if (!formData.selectedCarId) {
        toast.error("Please select a car")
        return
      }
    } else if (currentStep === 3) {
      if (!formData.pickupDate || !formData.returnDate) {
        toast.error("Please select pickup and return dates")
        return
      }
    }
    
    if (currentStep < 3) {
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
      selectedCarId: null,
      selectedCar: null,
      pickupLocation: '',
      pickupDate: undefined,
      returnDate: undefined,
      notes: ''
    });
    onClose();
  };


  const handleFinish = async () => {
    // Validate all required fields
    if (!formData.selectedCarId) {
      toast.error("Please select a car");
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
      const reservationData = {
        car: formData.selectedCarId,
        reserved_from: formattedPickupDate,
        reserved_to: formattedReturnDate,
        customer_username: formData.customerName,
        customer_email: formData.email,
        pickup_location: formData.pickupLocation,
        notes: formData.notes,
      };

      // Make the API call
      const reservationResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MAKE_A_RESERVATION}`, reservationData , {
        headers: { Authorization: `Bearer ${token}` }
      });

      const reservationResp = reservationResponse.data;

      console.log(reservationResponse)
      console.log(reservationResp.data);

      if (reservationResponse.status === 200 || reservationResponse.status === 201) {
        const initilizePaymentData = {
          reservation_code: reservationResp.reservation_code,
          amount: Number(reservationResp.deposit_amount),
        }

        const paymentInitResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.INITIALIZE_PAYMENTS}`, initilizePaymentData, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const paymentInitResp = paymentInitResponse.data;

        if (paymentInitResponse.status === 200 || paymentInitResponse.status === 201) {
          const paymentId = paymentInitResp.payment_id;

          const completePaymentResponse = await getData(`${CONFIG.BASE_URL}${apiEndpoints.COMPLETE_PAYMENTS.replace(':id', paymentId)}`, {
            headers: { Authorization: `Bearer ${token}` }
          })

          const { authorization_url, payment_id } = completePaymentResponse.data;

          sessionStorage.setItem('pending_payment_id', paymentId);
          sessionStorage.setItem('reservation_code', reservationResp.reservation_code);

          window.location.href = authorization_url;
        }
      }

      
      handleCancel();
      onConfirm();

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
                  {[1, 2, 3].map((step, idx) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step}
                      </div>
                      {idx < 3 && (
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

                <AvailableCarsCarousel pickupDate={formData.pickupDate} returnDate={formData.returnDate} selectedCarId={formData.selectedCar} onSelectCar={handleSelectCar} />

                <div className="space-y-6">
                  {/* <Controller
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
                  /> */}

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
                <button onClick={handleBack} className={`flex px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer`} >
                  Back
                </button>
                <button onClick={currentStep === 3 ? handleFinish : handleNext} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" disabled={isSubmitting} >
                  {isSubmitting ? 'Creating...' : (currentStep === 3 ? 'Create Reservation' : 'Next')}
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