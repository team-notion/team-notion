import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { LogOut, Menu, Settings, User, X } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import NotificationBell from '../NotificationBell';
import UserAvatarMenu from '../UserAvatarMenu';
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


  const isActiveLink = (url: string) => {
    if (url === '/') {
      return location.pathname === '/';
    }
    
    return location.pathname.startsWith(url);
  };


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

  const handleDashboard = () => {
    if (user?.userType === 'business' || user?.userType === 'owner') {
      navigate('/business-dashboard');
    } else {
      return;
    }
  }


  return (
    // <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     <div className="flex justify-between items-center h-16">
    //       <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
    //         <img src={NavLogo} className="h-8 sm:h-10" alt="Notion rides" />
    //       </div>
  
    //       {/* Desktop Navigation */}
    //       <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
    //         {links.map((link) => {
    //           if (link.show === undefined || link.show) {
    //             const isActive = isActiveLink(link.url);
    //             return (
    //               <Link 
    //                 to={link.url} 
    //                 key={link.id} 
    //                 className={`transition-colors duration-200 text-sm lg:text-base font-medium ${ isActive ? 'text-[#F97316]' : 'text-gray-700 hover:text-[#F97316]' }`}
    //               > 
    //                 {link.text} 
    //               </Link>
    //             )
    //           }
    //           return null;
    //         })}
    //       </nav>
  
    //       {/* Desktop Auth Section */}
    //       <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
    //         {isAuthenticated ? (
    //           <>
    //             <NotificationBell />
    //             <UserAvatarMenu showDashboard onLogout={() => setOpen(false)} />
    //           </>
    //         ) : (
    //           <>
    //             <button
    //               onClick={() => navigate('/login')}
    //               className="px-4 lg:px-6 py-2 border border-[#F97316] text-[#F97316] font-semibold rounded-lg hover:bg-orange-50 transition-colors duration-200 text-sm lg:text-base"
    //             >
    //               Log in
    //             </button>
    //             <Link
    //               to="/signup"
    //               className="px-4 lg:px-6 py-2 bg-[#F97316] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm lg:text-base"
    //             >
    //               Sign up
    //             </Link>
    //           </>
    //         )}
    //       </div>
  
    //       {/* Mobile Menu Button */}
    //       <button
    //         className="md:hidden p-2 text-[#F97316] hover:bg-gray-100 rounded-lg transition-colors"
    //         onClick={() => setOpen(!open)}
    //       >
    //         {open ? <X size={24} /> : <Menu size={24} />}
    //       </button>
    //     </div>
    //   </div>

    //   {/* Mobile Menu */}
    //   {open && (
    //     <div className="md:hidden bg-white border-t border-gray-200">
    //       <div className="px-4 sm:px-6 py-4 space-y-3">
    //         {links.map((link) => {
    //           if (link.show === undefined || link.show) {
    //             const isActive = isActiveLink(link.url);
    //             return (
    //               <Link
    //                 key={link.id}
    //                 to={link.url}
    //                 onClick={() => setOpen(false)}
    //                 className={`block px-3 py-2 rounded-lg transition-colors ${ isActive ? 'text-[#F97316] bg-orange-50' : 'text-gray-700 hover:text-[#F97316] hover:bg-gray-50' }`}
    //               >
    //                 {link.text}
    //               </Link>
    //             )
    //           }
    //           return null;
    //         })}

    //         <div className="border-t border-gray-200 pt-3 mt-3">
    //           {isAuthenticated ? (
    //             <div className="space-y-3">
    //               <div className="flex items-center space-x-3 px-3 py-2">
    //                 <UserAvatarMenu showDashboard onLogout={() => setOpen(false)} />
    //               </div>
    //             </div>
    //           ) : (
    //             <div className="space-y-3">
    //               <button
    //                 onClick={() => {
    //                   navigate('/login');
    //                   setOpen(false);
    //                 }}
    //                 className="w-full px-3 py-2.5 border border-[#F97316] text-[#F97316] rounded-lg hover:bg-orange-50 transition-colors"
    //               >
    //                 Log in
    //               </button>
    //               <button
    //                 onClick={() => {
    //                   navigate('/signup');
    //                   setOpen(false);
    //                 }}
    //                 className="w-full px-3 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 transition-colors"
    //               >
    //                 Sign up
    //               </button>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <>
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img src={NavLogo} className="h-8 sm:h-10" alt="Notion rides" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {links.map((link) => {
                if (link.show === false) return null;
                const isActive = isActiveLink(link.url);
                return (
                  <Link key={link.id} to={link.url}
                    className={`px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-[#F97316] bg-orange-50'
                        : 'text-gray-700 hover:text-[#F97316] hover:bg-gray-50'
                    }`}
                  >
                    {link.text}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <UserAvatarMenu showDashboard={true} onLogout={() => setOpen(false)} />
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="px-4 lg:px-5 py-2 border-2 border-[#F97316] text-[#F97316] font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 text-sm lg:text-base" >
                    Log in
                  </button>
                  <button onClick={() => navigate('/signup')} className="px-4 lg:px-5 py-2 bg-[#F97316] text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 text-sm lg:text-base shadow-sm" >
                    Sign up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-700 hover:text-[#F97316] hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setOpen(!open)} aria-label="Toggle menu" >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu (slides from right) */}
      <>
        {/* Backdrop */}
        {open && (
          <div className="fixed bg-white bg-opacity-50 z-40 md:hidden transition-opacity duration-300"onClick={() => setOpen(false)} />
        )}

        {/* Sliding Menu */}
        <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${ open ? 'translate-x-0' : 'translate-x-full' }`} >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <img src={NavLogo} className="h-8" alt="Notion rides" onClick={() => { navigate('/'); setOpen(false); }} />
              <button onClick={() => setOpen(false)} className="p-2 text-gray-700 hover:text-[#F97316] hover:bg-gray-50 rounded-lg transition-colors" >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-1">
                {links.map((link) => {
                  if (link.show === false) return null;
                  const isActive = isActiveLink(link.url);
                  return (
                    <Link key={link.id} to={link.url} onClick={() => setOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-[#F97316] bg-orange-50'
                          : 'text-gray-700 hover:text-[#F97316] hover:bg-gray-50'
                      }`}
                    >
                      {link.text}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Auth Section at Bottom */}
            <div className="p-4 border-t border-gray-200 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#F97316] rounded-full flex items-center justify-center text-white font-semibold">
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                      </div>
                    </div>
                    <NotificationBell />
                  </div>
                  {user?.userType === 'business' && (
                    <button onClick={() => { handleDashboard(); setOpen(false); }} className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center" >
                      <User className="mr-2 h-4 w-4" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </button>
                  )}
                  {user?.userType === 'customer' ? (
                    <button onClick={() => { navigate('/profile'); setOpen(false); }} className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center" >
                      <Settings className="mr-2 h-4 w-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </button>
                  ) : (
                    <button onClick={() => { navigate('/settings'); setOpen(false); }} className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center" >
                      <Settings className="mr-2 h-4 w-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </button>
                  )}
                  <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center" >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate('/login'); setOpen(false); }} className="w-full px-4 py-3 border-2 border-[#F97316] text-[#F97316] font-semibold rounded-lg hover:bg-orange-50 transition-colors" >
                    Log in
                  </button>
                  <button onClick={() => { navigate('/signup'); setOpen(false); }} className="w-full px-4 py-3 bg-[#F97316] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-sm" >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    </>
  )
}

export default Navbar