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
      url: "/vehicle-catalogue",
      text: "Vehicle",
    },
    {
      id: 3,
      url: "/bookings",
      text: "Bookings",
      show: isAuthenticated && user?.username && user.username !== 'User' && user?.userType === 'customer'
    },
    // {
    //   id: 4,
    //   url: "#",
    //   text: "About Us",
    // },
    {
      id: 5,
      url: "/signup",
      text: "Business Account",
    },
  ];

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
    navigate('/login');
  }

  const handleProfile = () => {
    if (user?.userType === 'business' || user?.userType === 'owner') {
      navigate('/settings');
    }
    else {
      navigate('/profile');
    }
  }

  const handleDashboard = () => {
    if (user?.userType === 'business' || user?.userType === 'owner') {
      navigate('/business-dashboard');
    } else {
      return;
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
            <img src={NavLogo} className="h-8 sm:h-10" alt="Notion rides" />
          </div>
  
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {links.map((link) => {
              if (link.show === undefined || link.show) {
                return (
                  <Link 
                    to={link.url} 
                    key={link.id} 
                    className="text-gray-700 hover:text-[#F97316] transition-colors duration-200 text-sm lg:text-base font-medium" 
                  > 
                    {link.text} 
                  </Link>
                )
              }
              return null;
            })}
          </nav>
  
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
            {isAuthenticated ? (
              <DropdownMenu>
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
                  {user?.userType === 'business' && (
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
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 lg:px-6 py-2 border border-[#F97316] text-[#F97316] font-semibold rounded-lg hover:bg-orange-50 transition-colors duration-200 text-sm lg:text-base"
                >
                  Log in
                </button>
                <Link
                  to="/signup"
                  className="px-4 lg:px-6 py-2 bg-[#F97316] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm lg:text-base"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
  
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#F97316] hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 sm:px-6 py-4 space-y-3">
            {links.map((link) => {
              if (link.show === undefined || link.show) {
                return (
                  <Link
                    key={link.id}
                    to={link.url}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-gray-700 hover:text-[#F97316] hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {link.text}
                  </Link>
                )
              }
              return null;
            })}

            <div className="border-t border-gray-200 pt-3 mt-3">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <Avatar className="h-10 w-10 border border-[#F97316] flex-shrink-0">
                      <AvatarImage src={getAvatarUrl() || undefined} alt={user?.username || 'User'} />
                      <AvatarFallback className="bg-[#F97316] text-white font-semibold text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.username || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleDashboard();
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2.5 border border-[#F97316] text-[#F97316] rounded-lg hover:bg-orange-50 transition-colors flex items-center"
                  >
                    <User className="mr-2 h-4 w-4 flex-shrink-0" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleProfile();
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2.5 border border-[#F97316] text-[#F97316] rounded-lg hover:bg-orange-50 transition-colors flex items-center"
                  >
                    <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2.5 border border-[#F97316] text-[#F97316] rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar