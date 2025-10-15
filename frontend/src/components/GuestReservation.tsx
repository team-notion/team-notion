import { useState } from "react"
import { ChevronLeft, ChevronRight, CircleUser, Fuel, CarFront } from "lucide-react" 
import { WarningModal, ReservationModal, SuccessModal } from "./GuestReservationModal";
import NavLogo from "../assets/logo.png";
import { AvailabilitySection, RentalTermsSection, ReviewsSection } from "./AvailabilitySection";
import { Picks } from "./home/sections/Picks";
import Footer from "./home/Footer";
import Navbar from "./home/Navbar";

export default function GuestReservation() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Vehicle Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="flex gap-4">
              {/* Main Image */}
              <div className="flex-1 bg-gray-100 rounded-2xl relative overflow-hidden">
                <img
                  src={images[currentImageIndex] || "Infinix"}
                  alt="Infiniti QX50"
                  className="w-full h-full  object-fit object-fill"
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
              <div className="flex flex-col gap-3">
                {imeges.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-58 h-54 rounded-lg overflow-hidden border-2 ${
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
            <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="space-y-4 max-w-xl">
              <h1 className="text-4xl font-bold text-[#0D183A]">Infiniti QX50</h1>

              {/* Specs */}
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <CircleUser className="w-5 h-5 text-black" />
                  <span className="text-sm text-black">5</span>
                </div>
                <div className="flex items-center gap-2">
                  <CarFront className="w-5 h-5 text-black" />
                  <span className="text-sm text-black">Automatic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-black" />
                  <span className="text-sm text-black">100L</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <span className="text-sm text-[#F97316]">(6 reviews)</span>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4">
                {features.map((feature, index) => (
                  <span key={index} className="px-4 py-2 bg-[#4A5FD9] text-white text-sm rounded-full">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Price and Reserve Button */}
              <div className="pt-4">
                <div className="text-3xl font-bold text-[#0D183A]">₦ 49,000/day</div>
                <button 
                 onClick={handleReserveClick}
                className="px-8 py-5 mt-4 bg-[#F97316] text-base text-white rounded-xl hover:bg-orange-600 font-medium cursor-pointer">
                  Reserve Now
                </button>
              </div>
            </div>

                {/* Right Column - Vehicle Information */}
             
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 w-full md:w-80 mt-10 md:mt-0">
              <h2 className="text-xl font-bold text-[#0D183A] border-b border-gray-200 pb-4">Vehicle Information</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Year of manufacture:</span>
                  <span className="text-sm font-semibold text-[#0D183A]">2025</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Make:</span>
                  <span className="text-sm font-semibold text-[#0D183A]">Infiniti</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Color:</span>
                  <span className="text-sm font-semibold text-[#0D183A]">White</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Location:</span>
                  <span className="text-sm font-semibold text-[#0D183A]">Kaduna</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Mileage:</span>
                  <span className="text-sm font-semibold text-[#0D183A]">2000 miles</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Model:</span>
                  <span className="text-sm font-semibold text-[#0D183A]">QX50</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Deposit:</span>
                  <span className="text-sm font-semibold text-[#0D183A]">100,000 Naira</span>
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
        currentStep={currentStep}
        formData={formData}
        onFormChange={handleFormChange}
        onNext={handleNextStep}
        onBack={handleBackStep}
      />

      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} onDone={handleDone} />

        <Picks />

        <Footer />
    </div>
  )
}
