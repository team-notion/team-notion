import { useNavigate } from "react-router"
import { LogOut, User, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "./lib/authContext";

interface UserAvatarMenuProps {
  showDashboard?: boolean;
  onLogout?: () => void;
}

const UserAvatarMenu = ({ showDashboard = true, onLogout }: UserAvatarMenuProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  console.log(user)

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


  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
    navigate("/login");
  }

  const handleProfile = () => {
    if (user?.userType === "business" || user?.userType === "owner") {
      navigate("/settings");
    } else {
      navigate("/profile");
    }
  }

  const handleDashboard = () => {
    if (user?.userType === "business" || user?.userType === "owner") {
      navigate("/business-dashboard");
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 rounded-full transition">
          <Avatar className="h-10 w-10 cursor-pointer border border-[#F97316] hover:border-orange-600 transition-colors">
            <AvatarImage src={getAvatarUrl() || undefined} alt={user?.username || 'User'} />
            <AvatarFallback className="bg-[#F97316] text-white font-semibold text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {showDashboard && user?.userType === 'business' && (
          <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer text-gray-700">
            <User className="mr-2 h-4 w-4" />
            <span className="text-sm">Dashboard</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer text-gray-700">
          <Settings className="mr-2 h-4 w-4" />
          <span className="text-sm">Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span className="text-sm">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAvatarMenu