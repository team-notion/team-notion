import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '../lib/authContext';
import NavLogo from "../../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const links = [
  {
    id: 1,
    url: "/",
    text: "Home",
  },
  {
    id: 2,
    url: "/vehicle-page",
    text: "Vehicle",
  },
  {
    id: 3,
    url: "#",
    text: "About Us",
  },
  {
    id: 4,
    url: "#",
    text: "Business Account",
  },
];

  const getUserInitials = () => {
    if (!user) return 'U';

    if (user.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  }

  const getAvatarUrl = () => {
    return user?.avatar || null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  const handleProfile = () => {
    if (user?.userType === 'business' || user?.userType === 'owner') {
      navigate('business-dashboard/profile');
    }
    else {
      navigate('/profile');
    }
  }

  const handleDashboard = () => {
    if (user?.userType === 'business' || user?.userType === 'owner') {
      navigate('/business-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
  }

  return (
    <div className="bg-[#F5F5F5] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src={NavLogo} className="h-10" alt="Notion rides" />
          </div>
  
          <nav className="hidden md:flex space-x-8">
            {links.map((links) => (
              <Link to={links.url} key={links.id} className="hover:text-[#F97316] transition text-base"> 
                {links.text} 
              </Link>
            ))}
          </nav>
  
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-10 w-10 cursor-pointer border-2 border-[#F97316] hover:border-orange-600 transition">
                      <AvatarImage src={getAvatarUrl() || undefined} alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-[#F97316] text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 border-2 border-[#F97316] text-[#F97316] cursor-pointer rounded-md hover:bg-orange-50 transition"
                >
                  Log in
                </button>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-[#F97316] text-white rounded-md cursor-pointer hover:bg-orange-600 transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
  
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#F97316]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 space-y-4 border-t border-gray-200 pt-4">
          <a href="#" className="block hover:text-[#F97316] transition">
            Home
          </a>
          <a href="#" className="block hover:text-[#F97316] transition">
            Vehicle
          </a>
          <a href="#" className="block hover:text-[#F97316] transition">
            About us
          </a>
          <a href="#" className="block hover:text-[#F97316] transition">
            Business Account
          </a>

          {isAuthenticated ? (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 pb-3">
                <Avatar className="h-10 w-10 border-2 border-[#F97316]">
                  <AvatarImage src={getAvatarUrl() || undefined} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-[#F97316] text-white font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleDashboard();
                  setOpen(false);
                }}
                className="w-full px-6 py-2 border-2 border-[#F97316] text-[#F97316] rounded-md hover:bg-orange-50 transition text-left flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  handleProfile();
                  setOpen(false);
                }}
                className="w-full px-6 py-2 border-2 border-[#F97316] text-[#F97316] rounded-md hover:bg-orange-50 transition text-left flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="w-full px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-left flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/login');
                  setOpen(false);
                }}
                className="w-full px-6 py-2 border-2 border-[#F97316] text-[#F97316] rounded-md hover:bg-orange-50 transition"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setOpen(false);
                }}
                className="w-full px-6 py-2 bg-[#F97316] text-white rounded-md hover:bg-orange-600 transition"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Navbar