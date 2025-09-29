import Logo from "../../assets/logo.png";
import BackgroundImage from "../../assets/logo background.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="bg-[#F3F4F6] min-h-screen overflow-hidden relative flex flex-col">
      <header className="relative z-10 p-6">
        <div className="flex items-center">
          <img src={Logo} alt="Notion Rides Logo" />
        </div>
      </header>

      <div className="absolute inset-0 pointer-events-none w-full">
        <div className="absolute bottom-0 left-0 w-full h-64 md:h-auto">
          <img src={BackgroundImage} alt="Notion Rides Logo" className="w-full object-cover" />
        </div>
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-6 py-12">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm shadow-[#0D183A] border border-gray-200 p-5 md:p-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
