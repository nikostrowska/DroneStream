import { useState } from "react";

interface Drone {
  id: number;
  name: string;
  status: string;
  battery: number;
}

export default function MyFleet() {
  const [drones, setDrones] = useState<Drone[]>([
    { id: 1, name: "Drone A", status: "Active", battery: 6 },
    { id: 2, name: "Drone B", status: "Inactive", battery: 69 },
    { id: 3, name: "Drone C", status: "Active", battery: 67 },
  ]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#BEBABA] flex-col">
      <div className="flex flex-1 overflow-y-auto">
        <main className="flex-1 h-full bg-[#BEBABA] flex flex-col p-8 overflow-hidden items-center">
          <h1 className="text-7xl font-bold mb-4 center text-[#7E2A2A]">
            MY FLEET
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[66px] w-full max-w-7xl mt-12">
            {drones.map((drone) => (
              <div
                key={drone.id}
                className="bg-white rounded-lg shadow-md p-4 w-[360px] flex flex-col gap-4"
              >
                <span className="flex justify-between">
                  <h3 className="text-lg font-semibold">{drone.name}</h3>
                  <button className="text-blue-500 hover:text-blue-700">
                    Edit
                  </button>
                </span>

                <div className="mx-auto">
                  <span className="flex justify-between">
                    <p className="text-gray-600">Status: {drone.status}</p>
                    <p className="text-gray-600">Battery: {drone.battery}%</p>
                  </span>

                  <img
                    src=""
                    alt="404 not found"
                    className="w-[275px] h-[215px] bg-gray-200 mx-auto"
                  />
                </div>
                <button className="mt-2 w-[133px] h-[28px] bg-blue-500 text-white px-3 py-1 rounded-xl text-sm mx-auto ">
                  View
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
