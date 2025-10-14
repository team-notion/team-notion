import { X } from "lucide-react";
import SelectDate from "./SelectDate";
import { useState } from "react";

interface NewCardData {
  email: string;
  cardNumber: string;
  expirationDate: Date | undefined;
  securityCode: string;
  cardName: string;
  countryOrRegion: string;
}

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AddCardModal = ({ isOpen, onClose, onConfirm }: AddCardModalProps) => {
  const [cardData, setCardData] = useState<NewCardData>({
    email: "",
    cardNumber: "",
    expirationDate: undefined,
    securityCode: "",
    cardName: "",
    countryOrRegion: "",
  });

  const handleInputChange = (
    field: string,
    value: string | Date | undefined
  ) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <dialog open={isOpen} className="modal">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 lg:p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto trick">
          <div className="sticky top-0 px-6 py-4 flex items-center justify-end z-20">
            <button onClick={onClose} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer" >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row h-full bg-white">
            <div className="lg:w-[27rem] p-2 md:p-8 flex flex-col items-center lg:items-start">
              <div className="h-56 w-full max-w-lg bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-xl flex flex-col justify-end">
                <div className="text-lg tracking-wider">
                  •••• •••• •••• ••••
                </div>
                <div className="text-sm font-semibold">
                  {cardData.cardName || "JOHN DOE"}
                </div>
              </div>

              <button onClick={onConfirm} className="mt-8 px-6 py-2 border border-[#F97316] text-[#F97316] rounded-lg hover:bg-orange-50 transition font-medium cursor-pointer" >
                Save card
              </button>
            </div>

            <div className="lg:w-1/2 px-2 py-8 md:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input type="email" value={cardData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="Enter email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card number
                </label>
                <input type="text" value={cardData.cardNumber} onChange={(e) => handleInputChange("cardNumber", e.target.value)} placeholder="0000 0000 0000 0000" className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <SelectDate label="Expiration date" placeholder="MM/YY" value={cardData.expirationDate} onChange={(date) => handleInputChange("expirationDate", date) } minDate={new Date()} format="month-year" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security code
                  </label>
                  <input type="text" value={cardData.securityCode} onChange={(e) => handleInputChange("securityCode", e.target.value)} placeholder="CVV" className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name on the card
                </label>
                <input type="text" value={cardData.cardName} onChange={(e) => handleInputChange("cardName", e.target.value)} placeholder="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country or region
                </label>
                <input type="text" value={cardData.countryOrRegion} onChange={(e) => handleInputChange("countryOrRegion", e.target.value)} placeholder="Please enter your country" className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AddCardModal;