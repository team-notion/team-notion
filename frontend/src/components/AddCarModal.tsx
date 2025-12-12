import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { AiOutlineCar } from "react-icons/ai"
import { IoImageOutline } from "react-icons/io5";
import { PiMoneyWavy } from "react-icons/pi";
import { PencilIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { patchData, postData } from "./lib/apiMethods";
import { apiEndpoints } from "./lib/apiEndpoints";
import CONFIG from "./utils/config";
import { LOCAL_STORAGE_KEYS } from "./utils/localStorageKeys";
import { toast } from "sonner";
// import SelectDate from "./SelectDate";
// import SelectMultipleDates from "./SelectMultipleDates";
import { uploadMultipleImages } from "./utils/imageUpload";
import SelectDropdown from "./SelectDropdown";

const addCarSchema = z.object({
  car_type: z.string().min(2, "Car type is required"),
  year_of_manufacture: z.number().min(1900).max(2100, "Invalid year"),
  color: z.string().min(1, "Color is required"),
  location: z.string().min(1, "Location is required"),
  license: z.string().min(1, "License plate is required"),
  mileage: z.number().min(0, "Mileage is required"),
  model: z.string().min(1, "Model is required"),
  // available_dates: z.array(z.string()).min(1, "Availability dates required"),
  is_available: z.boolean().default(true),
  duration_non_paid: z.string().min(1, "Duration is required"),
  duration_unit: z.string().min(1, 'Duration unit is required'),
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
interface CarPhoto {
  id: number;
  photo: string | null;
  image_url: string;
}

interface Car {
  id: number;
  owner: string;
  photos: CarPhoto[];
  car_type: string;
  year_of_manufacture: number;
  daily_rental_price: number;
  // available_dates: string[];
  rental_terms: string;
  deposit: number;
  deposit_percentage: number;
  is_available: boolean;
  license: string;
  color: string | null;
  location: string | null;
  mileage: number | null;
  model: string | null;
  duration_non_paid_in_hours: number | null;
  duration_unit: string;
  features: string[] | null;
}

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  carData?: Car | null;
  mode?: 'add' | 'edit';
}

const AddCarModal = ({ isOpen, onClose, onConfirm, carData = null, mode = 'add' }: AddCarModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [uploadingImages, setUploadingImages] = useState<number | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const isEditMode = mode === 'edit' && carData !== null;

  const { register, handleSubmit, watch, control, formState: { errors }, reset, setValue, trigger } = useForm({
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
      is_available: true,
      // available_dates: [],
      duration_non_paid: '',
      duration_unit: '',
      daily_rental_price: 0,
      deposit: 0,
      deposit_percentage: 25,
      features: [],
      rental_terms: '',
      photos: [],
    },
  });


  useEffect(() => {
    if (isEditMode && carData) {
      // const formattedDates = carData.available_dates.map(date => date.split('T')[0]);

      setValue('car_type', carData.car_type);
      setValue('year_of_manufacture', carData.year_of_manufacture);
      setValue('color', carData.color || '');
      setValue('location', carData.location || '');
      setValue('license', carData.license);
      setValue('mileage', carData.mileage || 0);
      setValue('model', carData.model || '');
      setValue('is_available', carData.is_available !== false);
      // setValue('available_dates', formattedDates);

      const hours = carData.duration_non_paid_in_hours || 0;
      let durationValue = '';
      let durationUnit = 'day';
    
      if (hours >= 24 * 30) {
        durationValue = Math.ceil(hours / (24 * 30)).toString();
        durationUnit = 'month';
      } else if (hours >= 24 * 7) {
        durationValue = Math.ceil(hours / (24 * 7)).toString();
        durationUnit = 'week';
      } else {
        durationValue = Math.ceil(hours / 24).toString();
        durationUnit = 'day';
      }
    
      setValue('duration_non_paid', durationValue);
      setValue('duration_unit', durationUnit);
      
      setValue('daily_rental_price', carData.daily_rental_price);
      setValue('deposit', carData.deposit);
      setValue('deposit_percentage', carData.deposit_percentage);
      setValue('features', carData.features || []);
      setValue('rental_terms', carData.rental_terms);
      
      // const photos = carData.photos.map(photo => ({
      //   image_url: photo.image_url || photo.photo || ''
      // }));
      // setValue('photos', photos);


      const existingUrls = carData.photos
        .filter(photo => photo.image_url || photo.photo)
        .map(photo => ({
          image_url: photo.image_url || photo.photo || ''
        }));
      
      setValue('photos', existingUrls);
      setExistingImageUrls(carData.photos.map(photo => photo.image_url || photo.photo || ''));
    }
  }, [isEditMode, carData, setValue]);

  const formData = watch();
  const selectedFeatures = watch('features');
  // const available_dates = watch('available_dates');

  const features = [
    'GPS Navigation', 'USB Charging', 'Android Auto',
    'Leather Seats', 'Cruise Control', 'Keyless Entry',
    'Apple Carplay', 'Heated Seats', 'Bluetooth',
    'Parking Sensors', 'Backup Camera', 'Sunroof'
  ];

  const durationUnitOptions = [
    { value: "day", label: "Day(s)" },
    { value: "week", label: "Week(s)" },
    { value: "month", label: "Month(s)" },
  ];

  const availabilityOptions = [
    { value: true, label: "Available" },
    { value: false, label: "Not Available" },
  ];

  const handleFeatureToggle = (feature: string) => {
    const current = selectedFeatures || [];
    if (current.includes(feature)) {
      setValue('features', current.filter(f => f !== feature));
    } else {
      setValue('features', [...current, feature]);
    }
  };


  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

    const newFiles = [...photoFiles];
    
    // If replacing an existing file at this index
    if (newFiles[index]) {
      newFiles[index] = file;
    } else {
      // Add new file
      newFiles[index] = file;
    }
    
    setPhotoFiles(newFiles);
    
    // For edit mode, we keep track of which images are new vs existing
    if (isEditMode) {
      // Remove the existing URL from this position if it exists
      const newExistingUrls = [...existingImageUrls];
      if (newExistingUrls[index]) {
        newExistingUrls[index] = '';
      }
      setExistingImageUrls(newExistingUrls);
    }
  };


  const uploadAllImages = async (): Promise<string[]> => {
    if (photoFiles.length === 0) {
      // In edit mode, return existing URLs that haven't been replaced
      return existingImageUrls.filter(url => url !== '');
    }

    setUploadingImages(true);
    try {
      const uploadedUrls = await uploadMultipleImages(photoFiles.filter(file => file !== undefined));
      return uploadedUrls;
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images');
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };


  const onSubmit = async (data: AddCarFormData) => {
    setLoading(true);

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    
    try {
      // // Upload all images at once
      let imageUrls: string[] = [];
      
      if (photoFiles.length > 0) {
        imageUrls = await uploadAllImages();
        
        // In edit mode, combine new URLs with existing ones that weren't replaced
        if (isEditMode) {
          const combinedUrls = existingImageUrls.map(url => {
            return url !== '' ? url : imageUrls.shift() || '';
          });
          // Add any remaining new URLs
          combinedUrls.push(...imageUrls);
          imageUrls = combinedUrls.filter(url => url !== '');
        }
      } else if (isEditMode) {
        // Use existing URLs in edit mode when no new files are added
        imageUrls = existingImageUrls.filter(url => url !== '');
      } else {
        // For add mode, we need at least one image
        if (data.photos.length === 0) {
          toast.error('Please add at least one photo');
          setLoading(false);
          return;
        }
        imageUrls = data.photos.map(photo => photo.image_url);
      }

      const durationValueNum = parseInt(data.duration_non_paid) || 0;
      let durationInHours = durationValueNum * 24; // Default to days
    
      if (data.duration_unit === 'week') {
        durationInHours = durationValueNum * 24 * 7;
      } else if (data.duration_unit === 'month') {
        durationInHours = durationValueNum * 24 * 30;
      }

      const payload = {
        car_type: data.car_type,
        year_of_manufacture: data.year_of_manufacture,
        daily_rental_price: data.daily_rental_price,
        is_available: data.is_available,
        // available_dates: formattedDates,
        rental_terms: data.rental_terms,
        deposit: data.deposit,
        deposit_percentage: data.deposit_percentage,
        license: data.license,
        photos: imageUrls.map(url => ({ image_url: url })),
        color: data.color,
        location: data.location,
        mileage: data.mileage,
        model: data.model,
        duration_non_paid_in_hours: durationInHours,
        features: data.features,
      };

      console.log(payload);
      console.log(carData)

      if (isEditMode && carData) {
        const updateEndpoint = apiEndpoints.UPDATE_CAR.replace(':id', carData.id.toString());
        
        const response = await patchData(`${CONFIG.BASE_URL}${updateEndpoint}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const resp = response.data;

        if (resp) {
          toast.success(resp?.message || 'Vehicle updated successfully');
          handleCancel();
          onConfirm();
        }
        else {
          toast.error(resp?.message || resp?.detail || 'Failed to updated car');
        }
      }
      else {
        const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_CAR}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const resp = response.data;
  
        if (resp) {
          toast.success(resp?.message || 'Vehicle added successfully');
          handleCancel();
          onConfirm();
        }
        else {
          toast.error(resp?.message || resp?.detail || 'Failed to add car');
        }
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
          'location', 'license', 'mileage', 'is_available', /* 'available_dates' */
        ]);
        break;
      case 2:
        isValid = await trigger([
          'daily_rental_price', 'deposit', 'rental_terms'
        ]);
        break;
      case 3:
        // isValid = await trigger(['photos']);
        // break;
        const hasImages = photoFiles.length > 0 || (isEditMode && existingImageUrls.length > 0);
        if (hasImages) {
          isValid = true;
        } else {
          toast.error('Please add at least one photo');
        }
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
    const hasNewImages = photoFiles.some(file => file !== undefined);
    const hasExistingImages = isEditMode && existingImageUrls.some(url => url !== '');
    const hasFormImages = watch('photos') && watch('photos')!.length > 0;

    if (!hasNewImages && !hasExistingImages && !hasFormImages) {
      toast.error('Please add at least one photo');
      return;
    }

    try {
      const isValid = await trigger([
        'car_type', 'model', 'year_of_manufacture', 'color',
        'location', 'license', 'mileage', 'is_available',
        'duration_non_paid', 'duration_unit',
        'daily_rental_price', 'deposit', 'rental_terms'
      ]);

      if (!isValid) {
        Object.keys(errors).forEach(key => {
          const error = errors[key as keyof typeof errors];
          if (error?.message) {
            toast.error(error.message as string);
          }
        });
        return;
      }

      const formValues = watch();
      const formData: AddCarFormData = {
        ...formValues,
        is_available: formValues.is_available ?? true
      };
      await onSubmit(formData);
    } catch (error) {
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
    setExistingImageUrls([]);
    reset();
    onClose();
  };


  const getImagePreview = (index: number) => {
    // First check if there's a new file selected
    if (photoFiles[index]) {
      return URL.createObjectURL(photoFiles[index]);
    }
    
    // Then check if there's an existing image URL (edit mode)
    if (isEditMode && existingImageUrls[index]) {
      return existingImageUrls[index];
    }
    
    return null;
  };

  const hasImageAtIndex = (index: number) => {
    return photoFiles[index] !== undefined || (isEditMode && existingImageUrls[index] !== undefined);
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
                <h2 className="text-xl font-medium text-black">{isEditMode ? 'Edit car' : 'Add new car'}</h2>
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
                        <label className="block text-sm font-medium text-black mb-2">Select Availability</label>
                        <Controller
                          name='is_available' 
                          control={control} 
                          render={({ field }) => {
                            return (
                              <SelectDropdown
                                name='is_available'
                                control={control}
                                className="w-full"
                                placeholder="Select availability"
                                options={availabilityOptions}
                                defaultValue={watch('is_available')}
                                handleChange={(selectedAvailability) => { setValue('is_available', selectedAvailability?.value === true) }}
                              />
                            )
                          }}
                        />
                        {errors.is_available && <p className="text-red-500 text-xs mt-1">{errors.is_available.message}</p>}
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-black mb-2">Reservation Duration for Guest</label>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="e.g, 1" {...register('duration_non_paid')} className=" text-[#5C5C5C] text-sm border border-gray-300 px-4 py-3 rounded-md focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:outline-none" />
                          <Controller
                            name='duration_unit' 
                            control={control}
                            render={({ field }) => (
                              <SelectDropdown
                                name='duration_unit'
                                control={control}
                                className="w-full"
                                placeholder="Day"
                                options={durationUnitOptions}
                                defaultValue={durationUnitOptions.find(option => option.value === field.value) || null}
                                handleChange={(selectedOption) => field.onChange(selectedOption?.value)}
                              />
                            )}
                          />
                        </div>
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
                        <p className="text-sm text-gray-600">{isEditMode ? 'Update car photos' : 'Put a face to your car, upload your photo and start earning with confidence.'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* {[0, 1, 2, 3, 4].map((index) => {
                        const currentPhotos = watch('photos') || [];
                        const existingPhoto = currentPhotos[index];
        
                        return (
                          <label key={index} htmlFor={`photo-${index}`} className="aspect-video lg:aspect-square border-2 border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors relative overflow-hidden" >
                            <input type="file" id={`photo-${index}`} accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, index)} disabled={uploadingImages === index}/>
            
                            {uploadingImages === index ? (
                              <div className="flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                                <span className="text-xs text-gray-500">Uploading...</span>
                              </div>
                            ) : existingPhoto?.image_url ? (
                              <>
                                <img src={existingPhoto.image_url} alt={`Photo ${index}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                  <span className="text-white text-sm opacity-0 hover:opacity-100">Change</span>
                                </div>
                              </>
                            ) : photoFiles[index] ? (
                              <img src={URL.createObjectURL(photoFiles[index])} alt={`Photo ${index}`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-gray-400">
                                <IoImageOutline className="w-8 h-8 mb-2" />
                                <span className="text-xs">Add Photo</span>
                              </div>
                            )}
                          </label>
                        );
                      })} */}

                      {[0, 1, 2, 3, 4].map((index) => {
                        const imagePreview = getImagePreview(index);
                        const hasImage = hasImageAtIndex(index);
                        
                        return (
                          <div key={index} className="relative aspect-video lg:aspect-square border-2 border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
                            {hasImage ? (
                              <>
                                <img src={imagePreview || ''} alt={`Photo ${index}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                {/* <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <IoIosClose size={20} />
                                  </button>
                                  <label htmlFor={`photo-${index}`} className="cursor-pointer">
                                    <span className="text-white text-sm opacity-0 hover:opacity-100">Change</span>
                                  </label>
                                </div> */}
                                <input type="file" id={`photo-${index}`} accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, index)} disabled={uploadingImages}/>
                              </>
                            ) : (
                              <label htmlFor={`photo-${index}`} className="flex flex-col items-center justify-center text-gray-400 cursor-pointer w-full h-full">
                                <input type="file" id={`photo-${index}`} accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, index)} disabled={uploadingImages}/>
                                <IoImageOutline className="w-8 h-8 mb-2" />
                                <span className="text-xs">Add Photo</span>
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
    
                    {errors.photos && <p className="text-red-500 text-xs mt-1">{errors.photos.message}</p>}
    
                    {/* Show current photo URLs for debugging */}
                    {isEditMode && (formData.photos || []).length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-700 mb-2">
                          {(formData.photos || []).length} photo(s) currently set
                        </p>
                      </div>
                    )}

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
                              {/* {photoFiles[0] ? (
                                <img src={URL.createObjectURL(photoFiles[0])} alt="Main car" className="w-full h-full object-cover"/>
                              ) : (
                                <IoImageOutline className="w-20 h-20 text-gray-400" />
                              )} */}
                              {getImagePreview(0) ? (
                                <img src={getImagePreview(0) || ''} alt="Main car" className="w-full h-full object-cover"/>
                              ) : (
                                <IoImageOutline className="w-20 h-20 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* Side thumbnails */}
                          <div className="grid grid-cols-1 gap-4">
                            {/* {[1, 2, 3, 4].map((index) => (
                              <div key={index} className="relative aspect-video lg:aspect-7/2 border border-gray-300 rounded-xl flex items-center justify-center bg-gray-100 overflow-hidden">
                                {photoFiles[index] ? (
                                  <img src={URL.createObjectURL(photoFiles[index])} alt={`Photo ${index}`} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                  <IoImageOutline className="w-12 h-12 text-gray-400" />
                                )}
                              </div>
                            ))} */}
                            {[1, 2, 3, 4].map((index) => (
                              <div key={index} className="relative aspect-video lg:aspect-7/2 border border-gray-300 rounded-xl flex items-center justify-center bg-gray-100 overflow-hidden">
                                {getImagePreview(index) ? (
                                  <img src={getImagePreview(index) || ''} alt={`Photo ${index}`} className="w-full h-full object-cover rounded-xl" />
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
                            <p className="text-xs font-semibold text-black">Availability: </p>
                            <p className="text-xs text-gray-600">
                              {formData.is_available ? 'Available' : 'Not Available'}
                            </p>
                            {/* <p className="text-xs text-gray-600">{Array.isArray(formData.available_dates) ? formData.available_dates.join(', ') : 'No dates selected'}</p> */}
                          </div>
                        </div>

                        <div className='space-y-4'>
                          <div className='flex gap-1 items-center'>
                            <p className="text-xs font-semibold text-black">Reservation duration for Guest: </p>
                            {/* <p className="text-xs text-gray-600">{formData.duration_non_paid}</p> */}
                            <p className="text-xs text-gray-600">{formData.duration_non_paid} {formData.duration_unit}(s)</p>
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
                      <div className='space-y-2 gap-2 mt-4 text-sm'>
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
                  <button type="button" onClick={handleCancel} className="px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer" >
                    Cancel
                  </button>
                  <button type="button" onClick={handleNext} disabled={loading} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer" >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={handleBack} className={`${currentStep === 4 ? 'hidden' : 'flex'} px-8 py-3 text-sm border-2 border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer`} >
                    Back
                  </button>
                  {currentStep === 4 ? (
                    <button type="submit" onClick={handleFinish} disabled={loading || uploadingImages} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-orange-600 font-medium cursor-pointer disabled:opacity-50">
                      {loading ? 'Submitting...' : uploadingImages ? 'Uploading Images...' : 'Finish'}
                    </button>
                  ) : (
                    <button type="button" onClick={handleNext} disabled={loading} className="px-8 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer">
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