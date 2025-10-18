import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Save } from "lucide-react";
import { useAuth } from "../components/lib/authContext";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useNavigate } from "react-router";
import { apiEndpoints } from "@/components/lib/apiEndpoints";
import { getData, putData } from "@/components/lib/apiMethods";
import CONFIG from "@/components/utils/config";
import { toast } from "sonner";
import { LOCAL_STORAGE_KEYS } from "@/components/utils/localStorageKeys";

const BusinessProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    businessId: user?.id || "",
    countryOrRegion: "",
  });


  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      console.log(token)
      try {
        console.log(token)
        // const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USER_PROFILE}`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USER_PROFILE}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log(resp)
        console.log(token)
        if (resp && resp.data) {
          const userData = resp.data;
          setProfileData((prev) => ({
            ...prev,
            name: userData.username || userData.business_name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            businessId: userData.id || user?.id || "",
            countryOrRegion: userData.country_or_region || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  console.log(profileData)

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        business_name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        country_or_region: profileData.countryOrRegion,
      };

      const resp = await putData(`${CONFIG.BASE_URL}${apiEndpoints.UPDATE_USER_PROFILE}`, updateData);

      if (resp && resp.statusCode === 200) {
        toast.success("Profile updated successfully");
        setIsEditingProfile(false);
      } else {
        toast.error(resp?.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(err?.response?.data?.message || "An error occurred while updating profile");
    } finally {
      setIsSaving(false);
    }
  };


  
  const getUserInitials = () => {
    if (!profileData?.name) return "U";
    const names = profileData.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const getAvatarUrl = () => {
    return user?.avatar || null;
  }

  console.log(profileData?.name)

  const handleInputChange = (
    field: string,
    value: string | Date | undefined
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 px-0 lg:px-4">
      {/* <div className="px-2 sm:px-6 lg:px-8 py-8"> */}
        <div className="block items-start">
          <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-1">
            Profile information
          </h2>

          <div className="flex flex-col gap-5 py-4 lg:py-6">
            <div className="flex justify-end items-center mb-1">
              <button onClick={() => { if (isEditingProfile) { handleSaveProfile(); } else { setIsEditingProfile(true); } }} disabled={isSaving} className={`p-2 rounded-lg transition cursor-pointer ${ isEditingProfile ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-gray-100 text-gray-600" }`} >
                {isEditingProfile ? ( <Save className="w-5 h-5" /> ) : ( <Pencil className="w-5 h-5" /> )}
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center lg:items-start justify-around gap-8">
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative">
                  <Avatar className="h-40 lg:h-48 w-40 lg:w-48 border border-gray-200">
                    <AvatarImage src={user?.avatar} alt={profileData?.name} />
                    <AvatarFallback className="bg-gray-300 text-white text-3xl font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-2 right-7 p-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-orange-50 transition cursor-pointer">
                    <Pencil className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-[60%] space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Id
                  </label>
                  <div className="w-full h-10 text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500">
                    {profileData.businessId}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Business Name
                  </label>
                  <input type="text" placeholder="Enter your name" value={profileData?.name} onChange={(e) => handleInputChange("name", e.target.value)} disabled={!isEditingProfile} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input type="email" placeholder="Enter your email" value={profileData?.email} onChange={(e) => handleInputChange("email", e.target.value)} disabled={!isEditingProfile} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <PhoneNumberInput value={profileData.phone} onValueChange={(value) => handleInputChange("phone", value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <input type="text" placeholder="Enter your address" value={profileData.address} onChange={(e) => handleInputChange("address", e.target.value)} disabled={!isEditingProfile} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country or Region
                  </label>
                  <input type="text" placeholder="Enter country or region" value={profileData.countryOrRegion} onChange={(e) => handleInputChange("countryOrRegion", e.target.value)} disabled={!isEditingProfile} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default BusinessProfile;
