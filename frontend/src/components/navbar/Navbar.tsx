import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-screen bg-[#1E2126] h-[84px] flex items-center overflow-hidden">
      <Link
        to="/"
        className="text-3xl font-bold text-white ml-5 animated-gradient no-underline"
      >
        DRONE
        <span className="text-3xl font-bold text-red-900">STREAM</span>
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
