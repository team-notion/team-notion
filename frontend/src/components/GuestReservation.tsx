import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react" 
import { WarningModal, ReservationModal, SuccessModal } from "./GuestReservationModal";
import { AvailabilitySection, RentalTermsSection, ReviewsSection } from "./AvailabilitySection";
import { Picks } from "./home/sections/Picks";
import Footer from "./home/Footer";
import Navbar from "./home/Navbar";
import { useAuth } from "./lib/authContext";
import CustomerReservationModal from "./CustomerReservationModal";
import { useParams, useSearchParams } from "react-router";
import { apiEndpoints } from "./lib/apiEndpoints";
import CONFIG from "./utils/config";
import { LOCAL_STORAGE_KEYS } from "./utils/localStorageKeys";
import { toast } from "sonner";
import { getData, postData } from "./lib/apiMethods";
import { useNumberFormatter } from "./utils/formatters";

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
  available_dates: string[];
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
  features: string[] | null;
}

export default function GuestReservation() {
  const { isAuthenticated, user } = useAuth();
  const { carId } = useParams<{ carId: string }>();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [showCustomerReservationModal, setShowCustomerReservationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1);
  const formatPrice = useNumberFormatter({ decimals: 2 });
  const [formData, setFormData] = useState({
    customerName: user?.username || "",
    phoneNumber: "",
    email: "",
    pickupDate: "",
    returnDate: "",
    driverName: "",
    driverLastName: "",
    dateOfBirth: "",
    issueDate: "",
    issuingCountry: "",
    licenseClass: "",
  });


  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!carId) {
        toast.error("No car selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const resp = await fetch(`${CONFIG.BASE_URL}${apiEndpoints.GET_CAR_DETAILS}${carId}`);

        if (!resp.ok) {
          throw new Error("Failed to fetch car details");
        }

        const carData = await resp.json();
        setCar(carData);
        
      } catch (error) {
        console.error("Error fetching car details:", error);
        toast.error("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);


  const handleReserveClick = () => {
    if (!car) {
      toast.error("Car information not loaded");
      return;
    }

    if (isAuthenticated) {
      setShowCustomerReservationModal(true);
      return;
    }

    if (isAuthenticated && user?.userType === 'business' || user?.userType === 'owner') {
      return;
    }

    setShowWarningModal(true)
  }

  const handleContinueAsGuest = () => {
    setShowWarningModal(false)
    setShowReservationModal(true)
    setCurrentStep(1)
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      handleGuestReservation();
    }
  }


  const handleGuestReservation = async () => {
    if (!car) return;

    try {
      const reservationData = {
        car: car.id,
        reserved_from: formData.pickupDate + 'T00:00:00Z',
        reserved_to: formData.returnDate + 'T23:59:59Z',
        customer_username: formData.customerName,
        guest_email: formData.email,
        guest_phone: formData.phoneNumber,
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MAKE_A_RESERVATION}`, reservationData, {
        headers: {'Content-Type': 'application/json'}
      });

      if (resp) {
        setShowReservationModal(false);
        setShowSuccessModal(true);
        toast.success("Reservation created successfully!");
      }
      else {
        throw new Error(resp?.detail || "Failed to make reservation");
      }
      
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error("Failed to make reservation");
    }
  };



  const handleCustomerReservation = async (reservationData: any) => {
    if (!car) return;
    
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    
      if (!token) {
        toast.error("Please log in to make a reservation");
        return;
      }

      const reservationDataWithCar = {
        ...reservationData,
        customer_username: formData?.customerName,
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MAKE_A_RESERVATION}`, reservationDataWithCar, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resp) {
        setShowCustomerReservationModal(false);
        setShowSuccessModal(true);
        toast.success("Reservation created successfully!");
      }
      else {
        throw new Error(resp?.detail || "Failed to make reservation");
      }
    
    } catch (error: any) {
      console.error("Reservation error:", error);
      toast.error(error?.message || "Failed to make reservation");
    }
  };


  const handleBackStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }



  const handleFormChange = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  const handleDone = () => {
    setShowSuccessModal(false)
    setCurrentStep(1)
    setFormData({
      customerName: "",
      phoneNumber: "",
      email: "",
      pickupDate: "",
      returnDate: "",
      driverName: "",
      driverLastName: "",
      dateOfBirth: "",
      issueDate: "",
      issuingCountry: "",
      licenseClass: "",
    })
  }

  const images = (car?.photos?.map(photo => photo.image_url ?? photo.photo) ?? []).filter((p): p is string => p != null && p !== '') as string[];
  const features = car?.features || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Car not found</h2>
          <p className="text-gray-500 mt-2">The car you're looking for doesn't exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Vehicle Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="flex flex-col lg:flex-row gap-4 h-[20rem] lg:h-[35rem]">
              {/* Main Image - Takes full width on mobile, most space on desktop */}
              <div className="flex-1 bg-gray-100 rounded-2xl relative overflow-hidden h-full">
                {images.length > 0 ? (
                  <img
                    src={images[currentImageIndex]}
                    alt={car.car_type}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-0 lg:left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-0 lg:right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails - Hidden on mobile, shown on desktop */}
              {images.length > 0 && (
                <div className="hidden lg:flex flex-col gap-3 h-full overflow-y-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-32 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        currentImageIndex === index 
                          ? "border-[#0066CC] scale-105" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mt-4">
              <div className="space-y-4 w-full lg:max-w-xl">
                <h1 className="text-xl lg:text-2xl font-semibold text-[#0D183A]">{car.car_type} {car.model ? `- ${car.model}` : ''} {car.year_of_manufacture}</h1>

                {/* Specs */}
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2 text-sm">
                    <p>Mileage: </p>
                    <p>{car.mileage || 'N/A'} miles</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="fill fill-amber-300 size-5 lg:size-6"/>
                    ))}
                  </div>
                  <span className="text-sm text-[#F97316]">(6 reviews)</span>
                </div>

                {/* Features */}
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {features.slice(0, 7).map((feature, index) => (
                      <span key={index} className="px-4 py-2 bg-[#4A5FD9] text-white text-sm rounded-lg">
                        {feature}
                      </span>
                    ))}
                    {features.length > 7 && (
                      <span className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg">
                        +{features.length - 7} more
                      </span>
                    )}
                  </div>
                )}

                {/* Price and Reserve Button */}
                <div className="lg:pt-4">
                  <div className="text-lg lg:text-xl font-medium text-[#0D183A]">₦ {formatPrice(car.daily_rental_price)}/day</div>
                  <button 
                  onClick={handleReserveClick}
                  className="px-4 lg:px-8 py-3 mt-4 bg-[#F97316] text-sm lg:text-base text-white rounded-xl hover:bg-orange-600 font-medium cursor-pointer">
                    Reserve Now
                  </button>
                </div>
              </div>

                {/* Right Column - Vehicle Information */}
             
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 w-full sm:w-[95%] md:w-[18rem] mx-auto lg:mx-0 mt-10 md:mt-0">
                <h2 className="text-xl font-semibold text-[#0D183A] border-b border-gray-200 pb-4">Vehicle Information</h2>

                <div className="space-y-3">
                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Year of manufacture:</span>
                    <span className="text-sm font-normal text-gray-600">{car.year_of_manufacture}</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Make:</span>
                    <span className="text-sm font-normal text-gray-600">{car.car_type}</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Color:</span>
                    <span className="text-sm font-normal text-gray-600">{car.color || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Location:</span>
                    <span className="text-sm font-normal text-gray-600">{car.location || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Mileage:</span>
                    <span className="text-sm font-normal text-gray-600">{car.mileage || 'N/A'} miles</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Model:</span>
                    <span className="text-sm font-normal text-gray-600">{car.model || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Deposit:</span>
                    <span className="text-sm font-normal text-gray-600">₦ {car.deposit?.toLocaleString() || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">License Plate:</span>
                    <span className="text-sm font-normal text-gray-600">{car.license}</span>
                  </div>
                </div>
              </div>
       
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <AvailabilitySection availableDates={car.available_dates} />
          <RentalTermsSection rentalTerms={car.rental_terms} />
          <ReviewsSection />
        </div>
      </div>



      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onSignUp={() => setShowWarningModal(false)}
        onContinue={handleContinueAsGuest}
      />

      <ReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        onNext={handleGuestReservation}
        onBack={() => setShowReservationModal(false)}
        car={car}
      />

      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} onDone={handleDone} />

      <Picks />

      <Footer />

      <CustomerReservationModal isOpen={showCustomerReservationModal} onClose={() => setShowCustomerReservationModal(false)} onNext={handleCustomerReservation} onConfirm={handleCustomerReservation} car={car} />
    </div>
  )
}
