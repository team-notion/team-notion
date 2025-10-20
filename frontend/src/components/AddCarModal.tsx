import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { AiOutlineCar } from "react-icons/ai"
import { IoImageOutline } from "react-icons/io5";
import { PiMoneyWavy } from "react-icons/pi";
import { PencilIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { postData } from "./lib/apiMethods";
import { apiEndpoints } from "./lib/apiEndpoints";
import CONFIG from "./utils/config";
import { LOCAL_STORAGE_KEYS } from "./utils/localStorageKeys";
import { toast } from "sonner";
import SelectDate from "./SelectDate";
import SelectMultipleDates from "./SelectMultipleDates";
import { uploadMultipleImages } from "./utils/imageUpload";

const addCarSchema = z.object({
  car_type: z.string().min(2, "Car type is required"),
  year_of_manufacture: z.number().min(1900).max(2100, "Invalid year"),
  color: z.string().min(1, "Color is required"),
  location: z.string().min(1, "Location is required"),
  license: z.string().min(1, "License plate is required"),
  mileage: z.number().min(0, "Mileage is required"),
  model: z.string().min(1, "Model is required"),
  available_dates: z.array(z.string()).min(1, "Availability dates required"),
  duration_non_paid: z.string().min(1, "Duration is required"),
  daily_rental_price: z.number().min(0, "Price is required"),
  deposit: z.number().min(0, "Deposit is required"),
  deposit_percentage: z.number().min(0).max(100),
  features: z.array(z.string()),
  rental_terms: z.string().min(10, "Rental terms required"),
  photos: z.array(z.object({
    image_url: z.string().url("Invalid image URL")
  })).min(1, "At least one photo is required"),
});

type AddCarFormData = z.infer<typeof addCarSchema>;
interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AddCarModal = ({ isOpen, onClose, onConfirm }: AddCarModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<number | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue, trigger } = useForm({
    resolver: zodResolver(addCarSchema),
    mode: 'onChange',
    defaultValues: {
      car_type: '',
      year_of_manufacture: new Date().getFullYear(),
      color: '',
      location: '',
      license: '',
      mileage: 0,
      model: '',
      available_dates: [],
      duration_non_paid: '',
      daily_rental_price: 0,
      deposit: 0,
      deposit_percentage: 25,
      features: [],
      rental_terms: '',
      photos: [],
    },
  });

  const formData = watch();
  const selectedFeatures = watch('features');
  const available_dates = watch('available_dates');

  const features = [
    'GPS Navigation', 'USB Charging', 'Android Auto',
    'Leather Seats', 'Cruise Control', 'Keyless Entry',
    'Apple Carplay', 'Heated Seats', 'Bluetooth',
    'Parking Sensors', 'Backup Camera', 'Sunroof'
  ];

  const handleFeatureToggle = (feature: string) => {
    const current = selectedFeatures || [];
    if (current.includes(feature)) {
      setValue('features', current.filter(f => f !== feature));
    } else {
      setValue('features', [...current, feature]);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImages(index);
    
      // uploadMultipleImages expects an array of File, so wrap single file in an array
      const uploadResult = await uploadMultipleImages([file]);
      // uploadResult might be an array of URLs or a single URL; normalize to a single string
      const imageUrl = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult;
    
      const currentPhotos = watch('photos') || [];
      const newPhotos = [...currentPhotos];
    
      if (newPhotos[index]) {
        newPhotos[index] = { image_url: imageUrl };
      } else {
        newPhotos[index] = { image_url: imageUrl };
      }
    
      setValue('photos', newPhotos.filter(photo => photo.image_url));
    
      const newFiles = [...photoFiles];
      newFiles[index] = file;
      setPhotoFiles(newFiles);
    
      toast.success('Image uploaded successfully!');
    
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingImages(null);
    }
  };


  const onSubmit = async (data: AddCarFormData) => {
    console.log('triggered')
    setLoading(true);

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    
    try {

      const formattedDates = data.available_dates.map(date => {
        return `${date}T00:00:00Z`;
      });

      const payload = {
        car_type: data.car_type,
        year_of_manufacture: data.year_of_manufacture,
        daily_rental_price: data.daily_rental_price,
        available_dates: formattedDates,
        rental_terms: data.rental_terms,
        deposit: data.deposit,
        deposit_percentage: data.deposit_percentage,
        license: data.license,
        photos: data.photos,
        color: data.color,
        location: data.location,
        mileage: data.mileage,
        model: data.model,
        duration_non_paid_in_hours: data.duration_non_paid,
        features: data.features,
      };

      console.log('Sending payload:', payload);

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_CAR}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resp) {
        toast.success(resp?.message || 'Vehicle added successfully');
        handleCancel();
        onConfirm();
      }
      else {
        toast.error(resp?.message || resp?.detail || 'Failed to add car');
      }
    }
    catch (err: any) {
      toast.error(err?.response?.message || err?.response?.detail || 'An error occurred');
    }
    finally{
      setLoading(false);
    }
  }


  const handleNext = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = await trigger([
          'car_type', 'model', 'year_of_manufacture', 'color', 
          'location', 'license', 'mileage', 'available_dates'
        ]);
        break;
      case 2:
        isValid = await trigger([
          'daily_rental_price', 'deposit', 'rental_terms'
        ]);
        break;
      case 3:
        isValid = await trigger(['photos']);
        break;
    }

    if (isValid && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      Object.keys(errors).forEach(key => {
        const error = errors[key as keyof typeof errors];
        if (error?.message) {
          toast.error(error.message as string);
        }
      });
    }
  };

  const handleFinish = async () => {
    const isValid = await trigger();
    if (isValid) {
      await handleSubmit(onSubmit)();
    } else {
      Object.keys(errors).forEach(key => {
        const error = errors[key as keyof typeof errors];
        if (error?.message) {
          toast.error(error.message as string);
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCancel = () => {
    setCurrentStep(1);
    setPhotoFiles([]);
    reset();
    onClose();
  };


  if (!isOpen) return null;


  return (
    <>
      <dialog open={true} className="modal">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto trick">
            {/* Header */}
            <div className="sticky top-0 bg-[#F3F4F6] px-6 py-4 flex items-center justify-between z-20">
              <div>
                <h2 className="text-xl font-medium text-black">Add new car</h2>
                <p className="text-sm text-gray-600 mt-1">Step {currentStep} of 4</p>
              </div>
              <button onClick={handleCancel} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer" >
                <IoIosClose size={30} />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-2 lg:px-6 py-8">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((step, idx) => (
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
              <form onSubmit={handleSubmit(onSubmit)}>
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
                        <input type="text" placeholder="e.g, Toyota" {...register('car_type')} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                        {errors.car_type && <p className="text-red-500 text-xs mt-1">{errors.car_type.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Model</label>
                        <input type="text" placeholder="e.g, Camry" {...register('model')} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                        {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Year of Manufacture</label>
                        <input type="text" placeholder="e.g, 2000" {...register('year_of_manufacture', { valueAsNumber: true })} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                        {errors.year_of_manufacture && <p className="text-red-500 text-xs mt-1">{errors.year_of_manufacture.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Color</label>
                        <input type="text" placeholder="e.g, Green" {...register('color')} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                        {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Location</label>
                        <input type="text" placeholder="e.g, Ikeja" {...register('location')} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">License Plate</label>
                        <input type="text" placeholder="e.g, ABC-367" {...register('license')} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                        {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Mileage</label>
                        <input type="number" placeholder="e.g, 12,000" {...register('mileage', { valueAsNumber: true })} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                        {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage.message}</p>}
                      </div>
                      <div>
                        {/* <label className="block text-sm font-medium text-black mb-2">Availability dates</label> */}
                        <SelectMultipleDates
                          label="Availability dates"
                          value={available_dates}
                          onChange={(dates: string[]) => setValue('available_dates', dates)}
                          minDate={new Date()}
                          placeholder="Select available dates"
                        />
                        {errors.available_dates && <p className="text-red-500 text-xs mt-1">{errors.available_dates.message}</p>}
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-black mb-2">Duration non-paid guest reservation</label>
                        <input type="text" placeholder="e.g, 1 day" {...register('duration_non_paid')} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 w-full rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                        {errors.duration_non_paid && <p className="text-red-500 text-xs mt-1">{errors.duration_non_paid.message}</p>}
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
                        <input type="number" placeholder="e.g, 65" {...register('daily_rental_price', { valueAsNumber: true })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.daily_rental_price && <p className="text-red-500 text-xs mt-1">{errors.daily_rental_price.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Enter deposit amount for potential damages ($)</label>
                        <input type="number" placeholder="e.g, 500" {...register('deposit', { valueAsNumber: true })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.deposit && <p className="text-red-500 text-xs mt-1">{errors.deposit.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-3">Features</label>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {features.map((feature) => (
                            <label key={feature} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={selectedFeatures?.includes(feature) || false} onChange={() => handleFeatureToggle(feature)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </label>
                          ))}
                        </div>
                        {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Rental terms</label>
                        <textarea placeholder="Let your customer know your terms and condition" {...register('rental_terms')} rows={6} className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        {errors.rental_terms && <p className="text-red-500 text-xs mt-1">{errors.rental_terms.message}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Upload Photos */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-start gap-3 mb-6">
                      <IoImageOutline className="size-11 lg:size-6 text-[#1E3A8A] mt-1" />
                      <div>
                        <h3 className="text-lg lg:text-xl font-semibold text-black mb-1">Upload Car Photo</h3>
                        <p className="text-sm text-gray-600">Put a face to your car, upload your photo and start earning with confidence.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[0, 1, 2, 3, 4, ].map((index) => (
                        <label key={index}  htmlFor={`photo-${index}`} className="aspect-video lg:aspect-square border border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors" >
                          <input type="file" id={`photo-${index}`} accept="image/*" className="hidden object-cover" onChange={(e) => handleImageSelect(e, index)} />
                          {photoFiles[index] ? (
                            <img src={URL.createObjectURL(photoFiles[index])} alt={`Photo ${index}`} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <IoImageOutline className="w-12 h-12 text-gray-400" />
                          )}
                        </label>
                      ))}
                      {errors.photos && <p className="text-red-500 text-xs mt-1">{errors.photos.message}</p>}
                    </div>
                  </div>
                )}

                {/* Step 4: Review Details */}
                {currentStep === 4 && (
                  <div>
                    <div className="space-y-6">
                      <div className='relative'>
                        <button type='button' onClick={() => setCurrentStep(3)} className="absolute z-10 bg-white -top-1 -right-0 lg:-right-2 lg:top-1 p-2.5 rounded-2xl flex items-center justify-center shadow-md border border-orange-500 hover:bg-orange-50 cursor-pointer transition-colors">
                          <PencilIcon className="w-4 h-4 text-orange-500" />
                        </button>

                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                          {/* Main large image */}
                          <div className="lg:col-span-2">
                            <div className="aspect-video lg:aspect-[16/10] border border-gray-300 rounded-xl flex items-center justify-center bg-gray-100 overflow-hidden">
                              {photoFiles[0] ? (
                                <img src={URL.createObjectURL(photoFiles[0])} alt="Main car" className="w-full h-full object-cover"/>
                              ) : (
                                <IoImageOutline className="w-20 h-20 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* Side thumbnails */}
                          <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3, 4].map((index) => (
                              <div key={index} className="relative aspect-video lg:aspect-7/2 border border-gray-300 rounded-xl flex items-center justify-center bg-gray-100 overflow-hidden">
                                {photoFiles[index] ? (
                                  <img src={URL.createObjectURL(photoFiles[index])} alt={`Photo ${index}`} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                  <IoImageOutline className="w-12 h-12 text-gray-400" />
                                )}
                              </div>
                            ))}
                          </div>
                          {/* Edit icon overlay */}
                        </div>
                      </div>

                      <h3 className="text-lg font-medium text-black mb-2">{formData.car_type} {formData.model} {formData.year_of_manufacture}</h3>
                    </div>

                    <div className='mt-6 divide-y divide-y-neutral-200'>
                      <div className='flex items-center justify-between'>
                        <h6 className="text-base font-medium text-black mb-1">Vehicle information</h6>
                        <button type='button' onClick={() => setCurrentStep(1)} className="bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-md border border-orange-500 hover:bg-orange-50 cursor-pointer transition-colors mb-2">
                          <PencilIcon className="w-4 h-4 text-orange-500" />
                        </button>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2'>
                        <div className='space-y-4'>
                          <div className='flex gap-1'>
                            <p className="text-xs font-semibold text-black">Make: </p>
                            <p className="text-xs text-gray-600">{formData.car_type}</p>
                          </div>
                          <div className='flex gap-1'>
                            <p className="text-xs font-semibold text-black">Model: </p>
                            <p className="text-xs text-gray-600">{formData.model}</p>
                          </div>
                          <div className='flex gap-1'>
                            <p className="text-xs font-semibold text-black">Color: </p>
                            <p className="text-xs text-gray-600">{formData.color}</p>
                          </div>
                          <div className='flex gap-1'>
                            <p className="text-xs font-semibold text-black">Location: </p>
                            <p className="text-xs text-gray-600">{formData.location}</p>
                          </div>
                        </div>

                        <div className='space-y-4'>
                          <div className='flex gap-1 items-center'>
                            <p className="text-xs font-semibold text-black">License Plate: </p>
                            <p className="text-xs text-gray-600">{formData.license}</p>
                          </div>
                          <div className='flex gap-1 items-center'>
                            <p className="text-xs font-semibold text-black">Mileage: </p>
                            <p className="text-xs text-gray-600">{formData?.mileage}</p>
                          </div>
                          <div className='flex gap-1 items-center'>
                            <p className="text-xs font-semibold text-black">Year of manufacture: </p>
                            <p className="text-xs text-gray-600">{formData.year_of_manufacture}</p>
                          </div>
                          <div className='flex gap-1 items-center'>
                            <p className="text-xs font-semibold text-black">Available Dates: </p>
                            <p className="text-xs text-gray-600">{formData.available_dates}</p>
                          </div>
                        </div>

                        <div className='space-y-4'>
                          <div className='flex gap-1 items-center'>
                            <p className="text-xs font-semibold text-black">Reservation duration for Guest: </p>
                            <p className="text-xs text-gray-600">{formData.duration_non_paid}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='mt-6 divide-y divide-y-neutral-200'>
                      <div className='flex items-center justify-between'>
                        <h6 className="text-base font-medium text-black mb-1">Price and deposit</h6>
                        <button type='button' onClick={() => setCurrentStep(2)} className="bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-md border border-orange-500 hover:bg-orange-50 cursor-pointer transition-colors mb-2">
                          <PencilIcon className="w-4 h-4 text-orange-500" />
                        </button>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2'>
                        <div className='space-y-4'>
                          <div className='flex gap-1'>
                            <p className="text-xs font-semibold text-black">Price: </p>
                            <p className="text-xs text-gray-600">{formData.daily_rental_price}</p>
                          </div>
                          <div className='flex gap-1'>
                            <p className="text-xs font-semibold text-black">Deposit: </p>
                            <p className="text-xs text-gray-600">{formData.deposit}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='mt-6 divide-y divide-y-neutral-200'>
                      <div className='flex items-center justify-between'>
                        <h6 className="text-base font-medium text-black mb-1">Features</h6>
                        <button type='button' onClick={() => setCurrentStep(2)} className="bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-md border border-orange-500 hover:bg-orange-50 cursor-pointer transition-colors mb-2">
                          <PencilIcon className="w-4 h-4 text-orange-500" />
                        </button>
                      </div>
                      <div className='pb-4 mt-2'>
                        <div className="flex flex-wrap gap-2">
                          {(formData.features || []).map(f => (
                            <span key={f} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className='mt-6 divide-y divide-y-neutral-200'>
                      <div className='flex items-center justify-between'>
                        <h6 className="text-base font-medium text-black mb-1">Rental Agreement</h6>
                        <button type='button' onClick={() => setCurrentStep(2)} className="bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-md border border-orange-500 hover:bg-orange-50 cursor-pointer transition-colors mb-2">
                          <PencilIcon className="w-4 h-4 text-orange-500" />
                        </button>
                      </div>
                      <div className='space-y-2 gap-2 mt-4'>
                        {formData.rental_terms}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="sticky bg-white bottom-0 px-6 py-4 flex items-center justify-end gap-4">
              {currentStep === 1 ? (
                <>
                  <button onClick={handleCancel} className="px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer" >
                    Cancel
                  </button>
                  <button onClick={handleNext} disabled={loading} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleBack} className={`${currentStep === 4 ? 'hidden' : 'flex'} px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer`} >
                    Back
                  </button>
                  {/* <button onClick={handleFinish} disabled={loading} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                    {loading ? 'Submitting...' : currentStep === 4 ? 'Finish' : 'Next'}
                  </button> */}
                  {currentStep === 4 ? (
                    <button type="submit" onClick={handleFinish} disabled={loading} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-orange-600 font-medium cursor-pointer disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Finish'}
                    </button>
                  ) : (
                    <button onClick={handleNext} disabled={loading} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer">
                      Next
                    </button>
                  )}
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