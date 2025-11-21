import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "./lib/authContext";

interface UserAvatarProps {
  showUsername?: boolean;
  className?: string;
}

const UserAvatar = ({ showUsername = true, className = '' }: UserAvatarProps) => {
  const { user } = useAuth();

  const getUserInitials = () => {
    if (!user) return 'U';

    if (user.username) {
      const names = user.username.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  }

  const getAvatarUrl = () => {
    return user?.profile_image || null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className="h-10 w-10 cursor-pointer border border-[#F97316] hover:border-orange-600 transition-colors">
        <AvatarImage src={getAvatarUrl() || undefined} alt={user?.username || "User"} />
        <AvatarFallback className="bg-[#F97316] text-white font-semibold text-sm">{getUserInitials()}</AvatarFallback>
      </Avatar>
      {showUsername && (
        <span className="hidden sm:block text-sm text-[#344054] leading-5 font-normal">
          {user?.username || user?.email || "User"}
        </span>
      )}
    </div>
  )
}

export default UserAvatar