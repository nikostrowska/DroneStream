import { useState } from "react";
import { Link } from "react-router-dom";
import profileIcon from "../../assets/profileIcon.svg";
import settingIcon from "../../assets/settingIcon.svg";
import closeIcon from "../../assets/closeIcon.svg";

export default function Navbar() {

const [isProfileOpen, setIsProfileOpen] = useState(false);
const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-screen bg-[#1E2126] h-[84px] flex items-center overflow-hidden">

      <Link to="/" className="relative text-3xl text-white ml-5 no-underline font-jersey font-bold">
        <div className="absolute inset-0 blur-[6px] opacity-60">
          <span className="text-[#FFFFFF]">DRONE</span>
          <span className="text-[#7E2A2A]">STREAM</span>
        </div>
        <div className="relative">
          <span className="text-[#FFFFFF]">DRONE</span>
          <span className="text-[#7E2A2A]">STREAM</span>
        </div>
      </Link>

      <nav className="ml-auto mr-5 flex items-center gap-4">
        <button
        onClick={() => setIsSettingsOpen(true)}
        className="text-white bg-[#7E2A2A] hover:text-gray-300 transition-colors p-2 rounded-xl hover:bg-[#5F2020] flex items-center justify-center cursor-pointer">
          <img src={settingIcon} alt="Settings" className="w-10 h-10" />
        </button>

        <button
        onClick={() => setIsProfileOpen(true)}
        className="text-white bg-[#7E2A2A] hover:text-gray-300 transition-colors p-2 rounded-xl hover:bg-[#5F2020] flex items-center justify-center cursor-pointer">
          <img src={profileIcon} alt="account" className="w-10 h-10" />
        </button>
      </nav>

      <div
      onClick={() => {
        setIsProfileOpen(false);
        setIsSettingsOpen(false);
      }}
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 z-40 ${
        isProfileOpen || isSettingsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}/>

      <div
      className={`fixed top-0 right-0 h-screen w-1/5 bg-[#CECDCB] border-l border-dark/10 p-5 transition-transform duration-300 z-50 ${
        isSettingsOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        <div className="flex flex-col w-full h-full justify-between">
          <div>

            <div className="flex justify-start mb-2">
              <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-2 py-1 cursor-pointer">
                <img src={closeIcon} alt="close" className="w-14 h-14" />
              </button>
            </div>

            <div className="flex flex-col items-center w-full -mt-12">
              <img
              src={settingIcon}
              alt="settings"
              className="w-80 h-70 mb-4 invert opacity-80" />
              
              <h3 className="text-[#1E2126] text-6xl font-jaro tracking-wider -mt-12">Settings</h3>

              <div className="w-1/2 mt-6" />
            </div>

            <div className="w-full mt-8 text-[#1E2126] text-center font-semibold"/>

          </div>
          
          <div className="w-full mb-4" />
        </div>
      </div>


      <div
      className={`fixed top-0 right-0 h-screen w-1/5 bg-[#CECDCB] border-l border-dark/10 p-5 transition-transform duration-300 z-50 ${
        isProfileOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        <div className="flex flex-col w-full h-full justify-between">
          <div>

            <div className="flex justify-start mb-2">
              <button
              onClick={() => setIsProfileOpen(false)}
              className="px-2 py-1 cursor-pointer">
                <img src={closeIcon} alt="close" className="w-14 h-14" />
              </button>
            </div>


            <div className="flex flex-col items-center w-full -mt-12">
              <img
              src={profileIcon}
              alt="account"
              className="w-80 h-70 mb-4 invert opacity-80"/>
              
              <h3 className="text-[#1E2126] text-6xl font-jaro tracking-wider -mt-12">Account</h3>

              <div className="w-1/2 mt-6" />
            </div>
          </div>


          <div className="w-full pt-4 mb-4 flex justify-center">
      
            <Link
            to="/login"
            onClick={() => setIsProfileOpen(false)}
            className="w-1/2 text-white bg-[#7E2A2A] hover:bg-[#5F2020] transition-colors py-4 rounded-2xl font-bold text-xl shadow-md flex items-center justify-center no-underline uppercase tracking-wider">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}