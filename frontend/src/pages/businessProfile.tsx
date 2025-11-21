import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Save } from "lucide-react";
import { useAuth } from "../components/lib/authContext";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useNavigate } from "react-router";
import { apiEndpoints } from "@/components/lib/apiEndpoints";
import { getData, patchData } from "@/components/lib/apiMethods";
import CONFIG from "@/components/utils/config";
import { toast } from "sonner";
import { LOCAL_STORAGE_KEYS } from "@/components/utils/localStorageKeys";
import Loader from "@/components/ui/Loader/Loader";

const BusinessProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone_no: "",
    address: "",
    businessId: "",
    countryOrRegion: "",
    first_name: "",
    last_name: "",
    country_code: "",
  });


  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);

      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USER_PROFILE}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const resp = response.data;

        if (resp) {
          const userData = resp;
          setProfileData({
            username: userData.username || "",
            email: userData.email || "",
            phone_no: userData.phone_no || "",
            address: userData.address || "",
            businessId: userData.id || user?.id || "",
            countryOrRegion: userData.country_or_region || "",
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            country_code: userData.country_code || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);


  const handleSaveProfile = async () => {
    setIsSaving(true);

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

    try {
      const updateData = {
        username: profileData.username,
        email: profileData.email,
        phone_no: profileData.phone_no,
        address: profileData.address,
        country_or_region: profileData.countryOrRegion,
        country_code: profileData.country_code,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
      };

      const response = await patchData(`${CONFIG.BASE_URL}${apiEndpoints.UPDATE_USER_PROFILE}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const resp = response.data;

      if (resp) {
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
    if (!profileData?.username) return "U";
    const names = profileData.username.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const getAvatarUrl = () => {
    return user?.profile_image || null;
  }

  const handleInputChange = (
    field: string,
    value: string | Date | undefined
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (phone_no: string, country_code?: string) => {
    setProfileData((prev) => ({ 
      ...prev, 
      phone_no: phone_no,
      country_code: country_code || prev.country_code 
    }));

    console.log("Phone changed:", `${phone_no}, Country code: ${country_code}`);
  };

  if (loading || isSaving) {
    return <div className="flex justify-center items-center h-dvh">
      <Loader type="tailSpin" color="#175CD3" height={40} width={40} />
    </div>;
  }

  return (
    <div className="space-y-6 px-0 lg:px-4">
      {/* <div className="px-2 sm:px-6 lg:px-8 py-8"> */}
        <div className="block items-start">
          <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-1">
            Profile information
          </h2>

          <div className="flex flex-col gap-5 py-4 lg:py-6">

            <div className="flex flex-col md:flex-row items-center lg:items-start justify-around gap-8">
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative">
                  <Avatar className="h-40 lg:h-48 w-40 lg:w-48 border border-gray-200">
                    <AvatarImage src={user?.profile_image} alt={profileData?.username} />
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
                <div className="flex justify-end items-center mb-1">
                  <button onClick={() => { if (isEditingProfile) { handleSaveProfile(); } else { setIsEditingProfile(true); } }} disabled={isSaving} className={`p-2 rounded-lg transition cursor-pointer ${ isEditingProfile ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-gray-100 text-gray-600" }`} >
                    {isEditingProfile ? ( <Save className="w-5 h-5" /> ) : ( <Pencil className="w-5 h-5" /> )}
                  </button>
                </div>
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
                  <div className="w-full h-10 text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" >
                    {profileData?.username}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input type="text" placeholder="Enter your first name" value={profileData?.first_name} onChange={(e) => handleInputChange("first_name", e.target.value)} disabled={!isEditingProfile} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input type="text" placeholder="Enter your last name" value={profileData?.last_name} onChange={(e) => handleInputChange("last_name", e.target.value)} disabled={!isEditingProfile} className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#C8CCD0] disabled:bg-gray-100 disabled:border-gray-200 focus:ring focus:ring-neutral-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <PhoneNumberInput value={profileData.phone_no} onValueChange={handlePhoneChange} />
                  {profileData.country_code && (
                    <p className="text-xs text-gray-500 mt-1">
                      Country Code: {profileData.country_code}
                    </p>
                  )}
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
