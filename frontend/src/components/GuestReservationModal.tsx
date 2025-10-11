import { X, AlertCircle, CheckCircle2, Users, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Types
export interface ReservationFormData {
  customerName: string
  phoneNumber: string
  email: string
  pickupDate: string
  returnDate: string
  driverName: string
  driverLastName: string
  dateOfBirth: string
  issueDate: string
  issuingCountry: string
  licenseClass: string
}

// Warning Modal
interface WarningModalProps {
  isOpen: boolean
  onClose: () => void
  onSignUp: () => void
  onContinue: () => void
}

export function WarningModal({ isOpen, onClose, onSignUp, onContinue }: WarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-3xl p-0 gap-0">
        <div className="p-10 space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#F97316] flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-[#F97316]" />
            </div>
          </div>

          <DialogHeader>
            <DialogTitle className="text-3xl font-medium text-center text-[#0D183A]">Warning</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm text-gray-700">
            <p className="text-center">You are currently using a guest account. Which means:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Any reservation made will be soft reserved ( can be overruled )</li>
              <li>You will not be able to pay for the reservation until you sign up or log into your account</li>
              <li>
                Account holders have priority over rentals ( i.e They can take your spot once they pay the rental fee )
              </li>
              <li>
                If payment has not been made within a specified time period. If payment has not been made by then, your
                reservation will be cancelled.
              </li>
            </ol>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSignUp}
              className="flex-1 px-6 py-3 border-2 border-[#F97316] text-[#F97316] rounded-lg hover:bg-orange-50 font-medium cursor-pointer"
            >
              Sign up
            </button>
            <button
              onClick={onContinue}
              className="flex-1 px-6 py-3 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Customer Info Form Component
interface CustomerFormData {
  customerName: string
  phoneNumber: string
  email: string
  pickupDate: string
  returnDate: string
}

interface CustomerInfoFormProps {
  formData: CustomerFormData
  onFormChange: (data: Partial<CustomerFormData>) => void
}

function CustomerInfoForm({ formData, onFormChange }: CustomerInfoFormProps) {
  return (
    <>
      <div 
        className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-[#0D183A]">Customer information</h3>
        </div>
        <p className="text-sm text-gray-600">Enter customer detail</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={formData.customerName}
            onChange={(e) => onFormChange({ customerName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
          <input
            type="tel"
            placeholder="000-0000-0000"
            value={formData.phoneNumber}
            onChange={(e) => onFormChange({ phoneNumber: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="www.hotel@gmail.com"
            value={formData.email}
            onChange={(e) => onFormChange({ email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pick up date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.pickupDate}
                onChange={(e) => onFormChange({ pickupDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.returnDate}
                onChange={(e) => onFormChange({ returnDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Driver Info Form Component
interface DriverFormData {
  driverName: string
  driverLastName: string
  dateOfBirth: string
  issueDate: string
  issuingCountry: string
  licenseClass: string
}

interface DriverInfoFormProps {
  formData: DriverFormData
  onFormChange: (data: Partial<DriverFormData>) => void
}

function DriverInfoForm({ formData, onFormChange }: DriverInfoFormProps) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-[#0D183A]">Driver information</h3>
        </div>
        <p className="text-sm text-gray-600">Enter driver detail</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name / Last Name</label>
            <input
              type="text"
              placeholder="First name"
              value={formData.driverName}
              onChange={(e) => onFormChange({ driverName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
            <input
              type="text"
              placeholder="Last name"
              value={formData.driverLastName}
              onChange={(e) => onFormChange({ driverLastName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.dateOfBirth}
                onChange={(e) => onFormChange({ dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.issueDate}
                onChange={(e) => onFormChange({ issueDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Country</label>
            <input
              type="text"
              placeholder="Enter issuing country"
              value={formData.issuingCountry}
              onChange={(e) => onFormChange({ issuingCountry: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Driver's License Class</label>
            <input
              type="text"
              placeholder="Enter license class"
              value={formData.licenseClass}
              onChange={(e) => onFormChange({ licenseClass: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
          </div>
        </div>
      </div>
    </>
  )
}

// Reservation Modal (Multi-step)
interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  currentStep: number
  formData: ReservationFormData
  onFormChange: (data: Partial<ReservationFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function ReservationModal({
  isOpen,
  onClose,
  currentStep,
  formData,
  onFormChange,
  onNext,
  onBack,
}: ReservationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[700px] p-0 gap-0">
            
        {/* Header */}
        <div className="border-b border-gray-200 p-4 bg-[#F3F4F6]">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#0D183A]">Reservation</h2>
              <p className="text-sm text-gray-600">Step {currentStep} of 2</p>
            </div>
            <button onClick={onClose} className="text-[#F97316] hover:text-orange-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 py-6">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= 1 ? "bg-[#0066CC] text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div className="w-24 h-1 bg-gray-200">
            <div className={`h-full transition-all ${currentStep >= 2 ? "bg-[#0066CC] w-full" : "bg-gray-200 w-0"}`} />
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= 2 ? "bg-[#0066CC] text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {currentStep === 1 ? (
            <CustomerInfoForm
              formData={{
                customerName: formData.customerName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                pickupDate: formData.pickupDate,
                returnDate: formData.returnDate,
              }}
              onFormChange={onFormChange}
            />
          ) : (
            <DriverInfoForm
              formData={{
                driverName: formData.driverName,
                driverLastName: formData.driverLastName,
                dateOfBirth: formData.dateOfBirth,
                issueDate: formData.issueDate,
                issuingCountry: formData.issuingCountry,
                licenseClass: formData.licenseClass,
              }}
              onFormChange={onFormChange}
            />
          )}
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
          {currentStep === 2 && (
            <button
              onClick={onBack}
              className="px-6 py-3 border-1 border-[#F97316] text-[#F97316] rounded-lg hover:bg-gray-50 font-medium cursor-pointer"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className="px-8 py-3 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
          >
            {currentStep === 1 ? "Next" : "Submit"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Success Modal
interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onDone: () => void
}

export function SuccessModal({ isOpen, onClose, onDone }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0">
        <div className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-[#10B981] flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-[#0D183A]">Temporary Reservation Successful</h2>
            <p className="text-sm text-gray-600">
              Your car is soft reserved for 24 hours. An Email will be sent containing instructions on how to confirm
              booking.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onDone}
              className="px-12 py-3 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
