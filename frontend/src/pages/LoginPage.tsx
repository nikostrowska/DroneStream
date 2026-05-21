import { useState } from "react";
import bg from "../assets/background.png";
import checkIcon from "../assets/checkIcon.svg";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <div>
        <main
          className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="absolute top-12 left-12 text-6xl font-jersey font-bold">
            <div className="absolute inset-0 blur-[6px] opacity-60">
              <Link to="/">
                <span className="text-[#1E2126]">DRONE</span>
                <span className="text-[#7E2A2A]">STREAM</span>
              </Link>
            </div>
            <div className="relative">
              <Link to="/">
                <span className="text-[#1E2126]">DRONE</span>
                <span className="text-[#7E2A2A]">STREAM</span>
              </Link>
            </div>
          </div>

          <div>
            <h1 className="text-[#7E2A2A] text-8xl font-jaro -mb-[0.750rem] relative z-10 text-center underline decoration-4 underline-offset-[10px] text-shadow">
              <span className="tracking-[0.5em]">SIGN IN</span>
            </h1>

            <form
              action=""
              className="bg-white/35 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl px-10 py-20 w-[678px]"
            >
              <div className="mb-10 w-[378px] mx-auto ">
                <label
                  htmlFor="email"
                  className="block text-[#1E2126] text-3xl font-medium mb-3"
                >
                  E-mail
                </label>

                <input
                  type="email"
                  id="email"
                  className="appearance-none border-[0.5px] border-[#787A7D] rounded-[10px] w-[378px] mx-auto py-2 px-3 bg-[#CECDCB] text-[#787A7D] leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-10 w-[378px] mx-auto ">
                <label
                  htmlFor="password"
                  className="block text-[#1E2126] text-3xl font-medium mb-3"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  className="appearance-none border-[0.5px] border-[#787A7D] rounded-[10px] w-[378px] mx-auto py-2 px-3 bg-[#CECDCB] text-[#787A7D] leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-10 flex items-center gap-2 w-[378px] mx-auto">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    className="hidden"
                  />

                  <div
                    className={`w-6 h-6 border-2 rounded-md flex items-center justify-center border-[#7E2A2A] ${
                      checked ? "bg-[#7E2A2A]" : "bg-transparent"
                    }`}
                  >
                    {checked && (
                      <img src={checkIcon} alt="checked" className="w-4 h-4" />
                    )}
                  </div>

                  <span className="text-[#1E2126] text-md">Remember me</span>
                </label>
              </div>

              <div className="flex items-center justify-center w-[378px] mx-auto">
                <button
                  type="submit"
                  className="bg-[#7E2A2A] hover:bg-[#701C1C] text-white font-bold py-3 px-20 rounded-full focus:outline-none focus:shadow-outline"
                >
                  SIGN IN
                </button>
              </div>

              <div className="mt-10 flex flex-col items-center gap-2">
                <p className="text-[#1E2126] text-xl">
                  Don’t have an account?{" "}
                  <a
                    href="#"
                    className="text-[#7E2A2A] font-medium hover:underline"
                  >
                    Sign up
                  </a>
                </p>
                <a
                  href="#"
                  className="mt-5 text-[#1E2126] text-xl hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
