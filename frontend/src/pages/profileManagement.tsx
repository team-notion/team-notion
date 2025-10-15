// src/pages/Profile.tsx or CustomerProfile.tsx
import { useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Save, Trash2, Upload } from "lucide-react";
import { useAuth } from "../components/lib/authContext";
import { Logo } from "@/assets";
import SelectDate from "@/components/SelectDate";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Footer from "@/components/home/Footer";
import ActionModal from "@/components/ActionModal";
import AddCardModal from "@/components/AddCardModal";

interface Card {
  id: number;
  name: string;
  lastFourDigits: string;
  type: 'VISA' | 'MASTERCARD';
  color: string;
}

const DUMMY_CARDS: Card[] = [
  { id: 1, name: "JOHN DOE", lastFourDigits: "1234", type: "VISA", color: "from-blue-600 to-blue-800" },
  { id: 2, name: "JANE SMITH", lastFourDigits: "5678", type: "MASTERCARD", color: "from-red-500 to-red-700" },
  { id: 3, name: "PETER JONES", lastFourDigits: "9012", type: "VISA", color: "from-green-600 to-green-800" },
];

const ProfileManagement = () => {
  const { user } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingLicense, setIsEditingLicense] = useState(false);
  const [isEditingBillingInfo, setIsEditingBillingInfo] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: "",
    licenseNumber: "",
    dateOfBirth: undefined as Date | undefined,
    issueDate: undefined as Date | undefined,
    issuingCountry: "",
    expiryDate: undefined as Date | undefined,
    issuingAuthority: "",
    driverLicenseClass: "",
    cardName: "",
    cardNumber: "",
    expirationDate: undefined as Date | undefined,
    securityCode: "",
    countryOrRegion: "",
  });

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isDeleteCardModalOpen, setIsDeleteCardModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>(DUMMY_CARDS);
  const currentCard = cards[currentCardIndex];

  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCardConfirm = () => {
    setIsAddCardModalOpen(false);
  };

  const handleDeleteCardClick = (card: Card) => {
    setCardToDelete(card);
    setIsDeleteCardModalOpen(true);
  };

  const handleDeleteCardConfirm = () => {
    if (cardToDelete) {
    setCards(cards.filter(c => c.id !== cardToDelete.id));

    if (currentCardIndex >= cards.length - 1) {
      setCurrentCardIndex(Math.max(0, cards.length - 2));
    }

    setCardToDelete(null);
    }
    setIsDeleteCardModalOpen(false);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => 
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => 
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  };

  
  const currentCardFormDetails = {
    cardName: currentCard?.name || "",
    cardNumber: currentCard ? `•••• •••• •••• ${currentCard.lastFourDigits}` : "",
    expirationDate: "03/27",
    securityCode: "123",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />

      <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="block items-start">
          <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-3">
            Profile information
          </h2>

          <div className="bg-white flex flex-col gap-8 p-2 py-4 lg:p-6 rounded-xl shadow-sm">
            <div className="flex justify-end items-center mb-1 lg:mb-6">
              <button onClick={() => setIsEditingProfile(!isEditingProfile)}className={`p-2 rounded-lg transition cursor-pointer ${isEditingProfile ? 'bg-green-600 hover:bg-green-700 text-white': 'hover:bg-gray-100 text-gray-600'}`}>
                {isEditingProfile ? ( <Save className="w-5 h-5" /> ) : ( <Pencil className="w-5 h-5" /> )}
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-48 w-48 border border-gray-200">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gray-300 text-white text-3xl font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-7 p-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-orange-50 transition cursor-pointer">
                    <Pencil className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-[60%] space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (as written on driver's license)
                  </label>
                  <input type="text" value={profileData.name} onChange={(e) => handleInputChange("name", e.target.value)} disabled={!isEditingProfile} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input type="email" value={profileData.email} onChange={(e) => handleInputChange("email", e.target.value)} disabled={!isEditingProfile} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <input type="tel" value={profileData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value) } placeholder="000-0000-0000" disabled={!isEditingProfile} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Driver's License */}
        <div className="block items-start">
          <div className='flex flex-col gap-1'>
            <h2 className="text-lg lg:text-xl font-medium text-gray-900">
              Drivers License
            </h2>  
            <p className="text-sm text-gray-600 mb-3">
              Upload a picture of your drivers license or fill in the information below
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 py-4 lg:p-6">
            <div className="flex justify-end items-center mb-1 lg:mb-6">
              <button onClick={() => setIsEditingLicense(!isEditingLicense)} className={`p-2 rounded-lg transition cursor-pointer ${isEditingLicense ? 'bg-green-600 hover:bg-green-700 text-white': 'hover:bg-gray-100 text-gray-600'}`}>
                {isEditingLicense ? ( <Save className="w-5 h-5" /> ) : ( <Pencil className="w-5 h-5" /> )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((index) => {
                const isFront = index === 1;
                const description = isFront ? "The front of your drivers license" : "The back of your drivers license";
                const inputId = `photo-${index}`;

                return (
                  <label key={index}  htmlFor={inputId} className="h-52 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-gray-300 transition cursor-pointer" >
                    <input type="file" id={inputId} accept="image/*" className="hidden object-cover" onChange={(e) => { const file = e.target.files?.[0]; if (file) { console.log(`Photo ${index} selected:`, file.name); } }} />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />

                    <p className="text-sm text-gray-600">Upload an image</p>
                    <p className="text-xs text-gray-400 mt-1">
                      ({description})
                    </p>
                  </label>
              )})}
            </div>

            <div className="text-center my-6">
              <span className="text-sm text-gray-500 font-medium">And</span>
            </div>

            {/* License Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input type="text" placeholder="John Doe" disabled={!isEditingLicense} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number
                </label>
                <input type="text" placeholder="XXXXXXXXX" disabled={!isEditingLicense} onChange={(e) => handleInputChange("licenseNumber", e.target.value)} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
              </div>

              <div>
                <SelectDate
                  label="Date of Birth"
                  placeholder="MM/DD/YY"
                  value={profileData.dateOfBirth}
                  onChange={(date) => handleInputChange("returnDate", date)}
                  minDate={new Date()}
                  format='short'
                  disabled={!isEditingLicense}
                />
              </div>

              <div>
                <SelectDate
                  label="Issue Date"
                  placeholder="MM/DD/YYYY"
                  value={profileData.issueDate}
                  onChange={(date) => handleInputChange("returnDate", date)}
                  minDate={new Date()}
                  format='short'
                  disabled={!isEditingLicense}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing country
                </label>
                <input type="text" placeholder="Please issuing country" disabled={!isEditingLicense} onChange={(e) => handleInputChange("issuingCountry", e.target.value)} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
              </div>

              <div>
                <SelectDate
                  label="Expiry date (optional)"
                  placeholder="MM/DD/YYYY"
                  value={profileData.expiryDate}
                  onChange={(date) => handleInputChange("returnDate", date)}
                  minDate={profileData.issueDate || new Date()}
                  format='short'
                  disabled={!isEditingLicense}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Authority
                </label>
                <input type="text" placeholder="Your issuing Authority" disabled={!isEditingLicense} onChange={(e) => handleInputChange("issuingAuthority", e.target.value)} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver's license class
                </label>
                <input type="text" placeholder="(e.g. A, B, C, or A1)" disabled={!isEditingLicense} onChange={(e) => handleInputChange("driverLicenseClass", e.target.value)} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
              </div>
            </div>
          </div>
        </div>



        {/* Billing Information */}
        <div className="block items-start">
          <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-3">
            Billing Information
          </h2>
          <div className="bg-white flex flex-col rounded-xl shadow-sm p-2 py-4 lg:p-6">
            <div className="flex justify-end items-center mb-1 lg:mb-6">
              <button onClick={() => setIsEditingBillingInfo(!isEditingBillingInfo)} className={`p-2 rounded-lg transition cursor-pointer ${isEditingBillingInfo ? 'bg-green-600 hover:bg-green-700 text-white': 'hover:bg-gray-100 text-gray-600'}`}>
                {isEditingBillingInfo ? ( <Save className="w-5 h-5" /> ) : ( <Pencil className="w-5 h-5" /> )}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-start space-y-4 w-full md:max-w-[27rem]">
                <div className="flex justify-start items-center mb-3 lg:mb-6">
                  <button onClick={() => currentCard && handleDeleteCardClick(currentCard)} disabled={cards.length === 0} className="p-2 hover:bg-[#FE130A] text-[#FE130A] hover:text-white border border-[#FE130A] rounded-lg transition cursor-pointer">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>    
                <Carousel className="w-full">
                  <CarouselContent>
                    {cards.map((card, index) => (
                      <CarouselItem key={card.id} className='basis-full'>
                        <div className={`h-56 bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-xl flex flex-col justify-between`}>
                          <div className="flex justify-between items-start">
                            <div className="text-xs opacity-80">CREDIT CARD</div>
                            <div className="text-xl font-bold">{card.type}</div>
                          </div>
                          <div className="text-lg tracking-wider">
                            •••• •••• •••• {card.lastFourDigits}
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="text-sm font-semibold">{card.name}</div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <div className="text-sm text-gray-600 flex items-center justify-center gap-2 mt-4">
                    {/* <CarouselPrevious className="relative top-auto left-auto h-8 w-8 bg-white border border-gray-300 shadow-md hover:bg-gray-100 transition" /> */}
                    <span className="font-semibold">{`Card ${currentCardIndex + 1}`}</span>
                    <span>of</span>
                    <span className="font-semibold">{cards.length}</span>
                    {/* <CarouselNext className="relative top-auto h-8 w-8 bg-white border border-gray-300 shadow-md hover:bg-gray-100 transition" /> */}
                  </div>
                </Carousel>

                <button onClick={() => setIsAddCardModalOpen(true)} className="px-6 py-2 border border-[#F97316] text-[#F97316] rounded-lg hover:bg-orange-50 transition font-medium">
                  Add card
                </button>
            </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on the card
                  </label>
                  <input type="text" placeholder='John Doe' disabled={!isEditingBillingInfo} onChange={(e) => handleInputChange("cardName", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card number
                  </label>
                  <input type="text" placeholder="0000 0000 0000 0000" disabled={!isEditingBillingInfo} onChange={(e) => handleInputChange("cardNumber", e.target.value)} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <SelectDate
                      label="Expiration date"
                      placeholder="MM/YY"
                      value={profileData.expirationDate}
                      onChange={(date) => handleInputChange("expirationDate", date)}
                      minDate={new Date()}
                      format='month-year'
                      disabled={!isEditingBillingInfo}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security code
                    </label>
                    <input type="text" placeholder="CVV" disabled={!isEditingBillingInfo} onChange={(e) => handleInputChange("securityCode", e.target.value)} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country or region
                  </label>
                  <input type="text" placeholder="Please enter your country" disabled={!isEditingBillingInfo} onChange={(e) => handleInputChange("countryOrRegion", e.target.value)} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <AddCardModal isOpen={isAddCardModalOpen} onClose={() => setIsAddCardModalOpen(false)} onConfirm={handleAddCardConfirm} />

      {isDeleteCardModalOpen && cardToDelete && (
        <ActionModal isOpen={isDeleteCardModalOpen} onClose={() => setIsDeleteCardModalOpen(false)} title="Delete Card" description="Are you sure you want to delete this card?" onConfirm={handleDeleteCardConfirm} cancelText="Cancel" confirmVariant='danger' />
      )}
    </div>
  );
};

export default ProfileManagement;
