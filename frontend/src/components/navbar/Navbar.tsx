import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-screen bg-[#1E2126] h-[84px] flex items-center overflow-hidden">
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
      <nav className="ml-auto mr-5 flex gap-4">
        <Link
          to="/login"
          className="text-white hover:text-gray-300 no-underline"
        >
          LogIn
        </Link>
      </nav>
    </div>
  );
}
