// src/components/layout/ProfileHeader.tsx
import { useNavigate } from 'react-router';
import { useAuth } from './lib/authContext';
import NavLogo from '../assets/logo.png';

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src={NavLogo} className="h-10" alt="Notion rides" />
          </div>

          <button onClick={handleLogout} className="px-6 py-2 border-2 border-[#F97316] text-[#F97316] rounded-lg hover:bg-orange-50 transition font-medium">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;