import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { AiOutlineCar } from "react-icons/ai"
import { IoImageOutline } from "react-icons/io5";
import { PiMoneyWavy } from "react-icons/pi";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  make: string;
  yearOfManufacture: string;
  color: string;
  location: string;
  licensePlate: string;
  mileage: string;
  model: string;
  availabilityDates: string;
  durationNonPaid: string;
  dailyRentalPrice: string;
  depositAmount: string;
  features: string[];
  rentalTerms: string;
  photos: File[];
}

const AddCarModal = ({ isOpen, onClose }: AddCarModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    make: '',
    yearOfManufacture: '',
    color: '',
    location: '',
    licensePlate: '',
    mileage: '',
    model: '',
    availabilityDates: '',
    durationNonPaid: '',
    dailyRentalPrice: '',
    depositAmount: '',
    features: [],
    rentalTerms: '',
    photos: []
  });

  const features = [
    'GPS Navigation', 'USB Charging', 'Android Auto',
    'Leather Seats', 'Cruise Control', 'Keyless Entry',
    'Apple Carplay', 'Heated Seats', 'Bluetooth',
    'Parking Sensors', 'Backup Camera', 'Sunroof'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleNext = () => {
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
      make: '',
      yearOfManufacture: '',
      color: '',
      location: '',
      licensePlate: '',
      mileage: '',
      model: '',
      availabilityDates: '',
      durationNonPaid: '',
      dailyRentalPrice: '',
      depositAmount: '',
      features: [],
      rentalTerms: '',
      photos: []
    });
    onClose();
  };

  if (!isOpen) return null;


  return (
    <>
      <dialog open={true} className="modal">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl">
            {/* Header */}
            <div className="sticky top-0 bg-[#F3F4F6] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-black">Add new car</h2>
                <p className="text-sm text-gray-600 mt-1">Step {currentStep} of 3</p>
              </div>
              <button onClick={handleCancel} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer" >
                <IoIosClose size={30} />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-2 lg:px-6 py-8 max-h-[80vh] overflow-y-auto trick">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-semibold ${ currentStep >= 1 ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-500' }`}>
                    1
                  </div>
                  <div className={`w-10 lg:w-24 h-0.5 mx-2 ${ currentStep >= 2 ? 'bg-[#1E3A8A]' : 'bg-gray-300' }`} />
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-semibold ${ currentStep >= 2 ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-500' }`}>
                    2
                  </div>
                  <div className={`w-10 lg:w-24 h-0.5 mx-2 ${ currentStep >= 3 ? 'bg-[#1E3A8A]' : 'bg-gray-300' }`} />
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-semibold ${ currentStep >= 3 ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-500' }`}>
                    3
                  </div>
                </div>
              </div>

              {/* Step 1: Vehicle Information */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-start gap-3 mb-6">
                    <AiOutlineCar className="size-6 text-[#1E3A8A] mt-1" />
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-black mb-1">Vehicle Information</h3>
                      <p className="text-sm text-gray-600">Enter basic details about the car</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Make</label>
                      <input type="text" placeholder="e.g, Toyota" value={formData.make} onChange={(e) => handleInputChange('make', e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Year of Manufacture</label>
                      <input type="text" placeholder="e.g, 2000" value={formData.yearOfManufacture} onChange={(e) => handleInputChange('yearOfManufacture', e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Color</label>
                      <input type="text" placeholder="e.g, Green" value={formData.color} onChange={(e) => handleInputChange('color', e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Location</label>
                      <input type="text" placeholder="e.g, Ikeja" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">License Plate</label>
                      <input type="text" placeholder="e.g, ABC-367" value={formData.licensePlate} onChange={(e) => handleInputChange('licensePlate', e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Mileage</label>
                      <input type="text" placeholder="e.g, 12,000" value={formData.mileage} onChange={(e) => handleInputChange('mileage', e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Model</label>
                      <input type="text" placeholder="e.g, Camry" value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Availability dates</label>
                      <input type="text" placeholder="e.g, Monday-Friday" value={formData.availabilityDates} onChange={(e) => handleInputChange('availabilityDates', e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-black mb-2">Duration non-paid guest reservation</label>
                      <input type="text" placeholder="e.g, 1 day" value={formData.durationNonPaid} onChange={(e) => handleInputChange('durationNonPaid', e.target.value)} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing & Features */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-start gap-3 mb-6">
                    <PiMoneyWavy className="size-6 text-[#1E3A8A] mt-1" />
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-black mb-1">Pricing & Features</h3>
                      <p className="text-sm text-gray-600">Set rental rate and select features</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Daily Rental Price ($)</label>
                      <input type="text" placeholder="e.g, 65" value={formData.dailyRentalPrice} onChange={(e) => handleInputChange('dailyRentalPrice', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Enter deposit amount for potential damages ($)</label>
                      <input type="text" placeholder="e.g, 500" value={formData.depositAmount} onChange={(e) => handleInputChange('depositAmount', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-3">Features</label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature) => (
                          <label key={feature} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.features.includes(feature)} onChange={() => handleFeatureToggle(feature)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Rental terms</label>
                      <textarea placeholder="Let your customer know your terms and condition" value={formData.rentalTerms} onChange={(e) => handleInputChange('rentalTerms', e.target.value)} rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Upload Photos */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-start gap-3 mb-6">
                    <IoImageOutline className="size-11 text-[#1E3A8A] mt-1" />
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-black mb-1">Upload Car Photo</h3>
                      <p className="text-sm text-gray-600">Put a face to your car, upload your photo and start earning with confidence.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((index) => (
                        <label key={index}  htmlFor={`photo-${index}`} className="aspect-square border-2 border-[#1E3A8A] rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors" >
                          <input type="file" id={`photo-${index}`} accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { console.log(`Photo ${index} selected:`, file.name); } }} />
                          <IoImageOutline className="w-16 h-16 text-gray-400" />
                        </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="sticky bg-white bottom-0 px-6 py-4 flex items-center justify-end gap-4">
              {currentStep === 1 ? (
                <>
                  <button onClick={handleCancel} className="px-8 py-3 border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer" >
                    Cancel
                  </button>
                  <button onClick={handleNext} className="px-8 py-3 bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleBack} className="px-8 py-3 border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer" >
                    Back
                  </button>
                  <button onClick={currentStep === 3 ? handleCancel : handleNext} className="px-8 py-3 bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                    {currentStep === 3 ? 'Submit' : 'Next'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
 );
};

export default AddCarModal;
