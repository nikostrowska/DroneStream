import { useState } from "react";
import { Link } from "react-router-dom";
import settingIcon from "../../assets/settingIcon.svg";
import closeIcon from "../../assets/closeIcon.svg";
import { useTheme } from "../../contexts/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-screen bg-nav h-[84px] flex items-center overflow-hidden theme-transition">
      <Link
        to="/"
        className="relative text-3xl text-white ml-5 no-underline font-jersey font-bold"
      >
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
          onClick={() => {
            setIsSettingsOpen(true);
          }}
          className="text-white bg-accent hover:text-gray-300 transition-colors p-2 rounded-xl hover:bg-accent-dark flex items-center justify-center cursor-pointer"
        >
          <img src={settingIcon} alt="Settings" className="w-10 h-10" />
        </button>
      </nav>

      <div
        onClick={() => {
          setIsProfileOpen(false);
          setIsSettingsOpen(false);
        }}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isProfileOpen || isSettingsOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-1/5 bg-surface border-l border-theme p-5 transition-transform duration-300 z-50 ${
          isSettingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col w-full h-full justify-between">
          <div>
            <div className="flex justify-start mb-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-2 py-1 cursor-pointer"
              >
                <img src={closeIcon} alt="close" className="w-14 h-14" />
              </button>
            </div>

            <div className="flex flex-col items-center w-full -mt-12">
              <img
                src={settingIcon}
                alt="settings"
                className="w-80 h-70 mb-4 invert opacity-80"
              />

              <h3 className="text-primary text-6xl font-jaro tracking-wider -mt-12">
                Settings
              </h3>

              <div className="w-1/2 mt-6" />
            </div>

            <div className="w-full mt-8 text-primary text-center font-semibold" />

            <div className="mt-10">
              <div className="rounded-3xl border border-theme bg-surface-soft p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-primary text-lg font-semibold">Theme</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`relative inline-flex h-12 w-20 items-center rounded-full border-2 border-theme transition ${theme === "dark" ? "bg-[#7E2A2A]" : "bg-[#CECDCB]"}`}
                  >
                    <span
                      className={`absolute left-1 top-1 h-10 w-10 rounded-full bg-white shadow-sm transition-transform ${theme === "dark" ? "translate-x-8" : "translate-x-0"}`}
                    />
                  </button>
                </div>
                <div className="mt-3 text-sm text-secondary">
                  Current mode: {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mb-4" />
        </div>
      </div>
    </div>
  );
}
