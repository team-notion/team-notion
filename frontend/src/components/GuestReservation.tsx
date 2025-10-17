import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react" 
import { WarningModal, ReservationModal, SuccessModal } from "./GuestReservationModal";
import { AvailabilitySection, RentalTermsSection, ReviewsSection } from "./AvailabilitySection";
import { Picks } from "./home/sections/Picks";
import Footer from "./home/Footer";
import Navbar from "./home/Navbar";
import { useAuth } from "./lib/authContext";
import CustomerReservationModal from "./CustomerReservationModal";

export default function GuestReservation() {
  const { isAuthenticated, user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [showCustomerReservationModal, setShowCustomerReservationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
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


  const handleReserveClick = () => {
    // if (isAuthenticated && user?.userType === 'customer') {
    //   setShowCustomerReservationModal(true);
    //   return;
    // }

    if (isAuthenticated) {
      setShowCustomerReservationModal(true);
      return;
    }

    // if (isAuthenticated && user?.userType === 'business' || user?.userType === 'owner') {
    //   return;
    // }

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
      setShowReservationModal(false)
      setShowSuccessModal(true)
    }
  }

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

  const handleCustomerReservationNext = () => {
    setShowCustomerReservationModal(false);
  }

  const images = [
    "/infie.svg",
    "/infi.svg",
    "/infii.svg",
  ]

  const imeges = [
    "/infi.svg",
    "/infi.svg",
    "/infii.svg",
  ]

  const features = [
    "USB Charging",
    "Sunroof",
    "Bluetooth",
    "Heated seats",
    "Back up Camera",
    "Cruise control",
    "Apple Carplay",
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
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
            <div className="flex gap-4 items-center lg:items-start justify-center">
              {/* Main Image */}
              <div className="flex-1 bg-gray-100 rounded-2xl relative overflow-hidden hidden lg:flex">
                <img
                  src={images[currentImageIndex] || "Infinix"}
                  alt="Infiniti QX50"
                  className="w-full h-full object-cover"
                />
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-3 items-center">
                {imeges.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-58 h-54 lg:h-40 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? "border-[#0066CC]" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mt-4">
              <div className="space-y-4 max-w-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-[#0D183A]">Infiniti QX50</h1>

                {/* Specs */}
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <p>Mileage: </p>
                    <p>20,000 miles</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="fill fill-amber-300"/>
                    ))}
                  </div>
                  <span className="text-sm text-[#F97316]">(6 reviews)</span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-4">
                  {features.map((feature, index) => (
                    <span key={index} className="px-4 py-2 bg-[#4A5FD9] text-white text-sm rounded-lg">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price and Reserve Button */}
                <div className="pt-4">
                  <div className="text-2xl font-semibold text-[#0D183A]">₦ 49,000/day</div>
                  <button 
                  onClick={handleReserveClick}
                  className="px-8 py-3 mt-4 bg-[#F97316] text-sm lg:text-base text-white rounded-xl hover:bg-orange-600 font-medium cursor-pointer">
                    Reserve Now
                  </button>
                </div>
              </div>

                {/* Right Column - Vehicle Information */}
             
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 w-[95%] sm:w-[80%] mx-auto lg:mx-0 md:w-auto mt-10 md:mt-0">
                <h2 className="text-xl font-semibold text-[#0D183A] border-b border-gray-200 pb-4">Vehicle Information</h2>

                <div className="space-y-3">
                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Year of manufacture:</span>
                    <span className="text-sm font-normal text-gray-600">2025</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Make:</span>
                    <span className="text-sm font-normal text-gray-600">Infiniti</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Color:</span>
                    <span className="text-sm font-normal text-gray-600">White</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Location:</span>
                    <span className="text-sm font-normal text-gray-600">Kaduna</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Mileage:</span>
                    <span className="text-sm font-normal text-gray-600">2000 miles</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Model:</span>
                    <span className="text-sm font-normal text-gray-600">QX50</span>
                  </div>

                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-medium text-[#0D183A]">Deposit:</span>
                    <span className="text-sm font-normal text-gray-600">100,000 Naira</span>
                  </div>
                </div>
              </div>
       
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <AvailabilitySection />
          <RentalTermsSection />
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
        onNext={handleNextStep}
        onBack={handleBackStep}
      />

      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} onDone={handleDone} />

      <Picks />

      <Footer />

      <CustomerReservationModal isOpen={showCustomerReservationModal} onClose={() => setShowCustomerReservationModal(false)} onNext={handleCustomerReservationNext} onConfirm={handleCustomerReservationNext} />
    </div>
  )
}
