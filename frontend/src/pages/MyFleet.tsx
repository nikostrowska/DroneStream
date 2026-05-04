import RefreshButton from "../components/stream/RefreshButton";
import DroneOptionMenu from "../components/fleet/DroneOptionMenu";
import moreIcon from "../assets/moreIcon.svg";
import offlinePhoto from "../assets/offlinePhoto.png";
import noPhotoAvailable from "../assets/noPhotoAvailable.png";
import { useState } from "react";

interface Drone {
  id: number;
  name: string;
  status: string;
  battery: number;
  image?: string;
}

export default function MyFleet() {
  const [drones, setDrones] = useState<Drone[]>([
    { id: 1, name: "Drone A testowa bardoz dłuuuuuuga nazwa", status: "online", battery: 6 },
    { id: 2, name: "Drone B", status: "offline", battery: 69 },
    { id: 3, name: "Drone C", status: "online", battery: 35 },
    { id: 4, name: "Drone C", status: "online", battery: 67 },
    { id: 5, name: "Drone A testowa bardoz dłuuuuuuga nazwa", status: "online", battery: 6 },
    { id: 6, name: "Drone B", status: "offline", battery: 69 },
    { id: 7, name: "Drone C", status: "online", battery: 35 },
    { id: 8, name: "Drone C", status: "online", battery: 67 },
    { id: 9, name: "Drone A testowa bardoz dłuuuuuuga nazwa", status: "online", battery: 6 },
    { id: 10, name: "Drone B", status: "offline", battery: 69 },
    { id: 11, name: "Drone C", status: "online", battery: 35 },
    { id: 12, name: "Drone C", status: "online", battery: 67 },
  ]);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden flex-col">
      <div className="flex flex-1 overflow-y-auto">
        <main className="flex-1 h-full bg-[#CECDCB] flex flex-col p-8 overflow-hidden items-center">

          <div className="w-full max-w-7xl mx-auto flex items-end mb-6">
            <div className="flex-none">
              <RefreshButton onRefresh={() => console.log("refresh fleet")} />
            </div>

            <h1 className="flex-1 text-center text-[#7E2A2A] text-8xl font-jaro">
              <span className="tracking-[0.5em]">MY FLEE</span>
              <span>T</span>
            </h1>

            <div className="flex-none w-[40px]" />
          </div>

          <div className="w-full max-w-7xl max-h-[70vh] overflow-y-auto pl-8 pr-6 mt-12 custom-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[66px] w-full max-w-7xl mb-2 mt-2">
              {drones.map((drone) => (
                <div
                  key={drone.id}
                  className="group bg-white/20 border border-white/20 rounded-2xl p-5 w-[360px] flex flex-col gap-4 transition-all duration-300 hover:bg-white/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start gap-3">

                    <h3 className="truncate overflow-hidden text-lg font-semibold text-[#1E2126] group-hover:text-black transition">{drone.name}</h3>
                    <div className="relative inline-block">
                      <button className="p-1 hover:bg-white/30 rounded-md transition cursor-pointer"
                        onClick={() =>
                          setOpenMenuId(openMenuId === drone.id ? null : drone.id)
                        }>
                        <img src={moreIcon} alt="options" className="w-5 h-5" />
                      </button>

                      {openMenuId === drone.id && (
                        <DroneOptionMenu
                          onEdit={() => console.log("edit", drone.id)}
                          onDelete={() => console.log("delete", drone.id)}
                        />
                        )}
                    </div>
                 </div>

                  <div className="mx-auto">
                    <span className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            drone.status === "online"
                            ? "bg-[#00A323] animate-pulse"
                            : "bg-[#B00000]"
                          }`}
                        />

                        <p
                          className={`text-md font-medium ${
                            drone.status === "online"
                            ? "text-[#00A323]"
                            : drone.status === "offline"
                            ? "text-[#B00000]"
                            : "text-[#787A7D]"
                          }`}
                        >
                          {drone.status}
                        </p>
                      </div>

                      <p
                        className={`text-md font-medium ${
                          drone.status === "offline"
                          ? "text-[#B00000]"
                          : drone.battery >= 50
                          ? "text-[#00A323]"
                          : drone.battery >= 20
                          ? "text-[#A39500]"
                          : "text-[#B00000]"
                        }`}
                      >
                        {drone.status === "offline" ? "--- battery" : `${drone.battery}% battery`}
                      </p>
                    </span>

                    <div className="w-[275px] h-[215px] mx-auto flex items-center justify-center rounded-xl overflow-hidden">
                      {drone.status === "offline" ? (
                        <img
                          src={offlinePhoto}
                          alt="offline"
                          className="w-full h-full opacity-60"
                        />
                      ) : drone.image ? (
                        <img
                          src={drone.image}
                          alt={drone.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={noPhotoAvailable}
                          alt={drone.name}
                          className="w-full h-full opacity-60"
                        />
                      )}
                    </div>
                  </div>
                  
                  <button className="bg-[#7E2A2A] hover:bg-[#701C1C] text-white mt-2 w-[133px] h-[28px] px-3 py-1 rounded-full text-sm mx-auto cursor-pointer">
                    View
                  </button>
                </div>
              ))}

            </div>
          </div>

          <div className="flex items-center justify-center w-[360px] mx-auto mt-3">
            <button
              type="button"
              className="w-full bg-[#7E2A2A] hover:bg-[#701C1C] font-semibold text-white py-4 rounded-full focus:outline-none focus:shadow-outline cursor-pointer"
            >
              Add a new drone
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
