import { useEffect, useState } from "react";

import WidgetBar from "../components/widgets/WidgetBar";
import Stream from "../components/stream/Stream";
import { Link } from "react-router-dom";
import { useSignalR } from "../components/signalRContext/SignalRProvider";

/**
 * @interface Drone
 * Defines the structure of a drone object with properties:
 * - id: A unique identifier for the drone (number).
 * - name: The name of the drone (string).
 * - status: The current status of the drone (string), e.g., "Active" or "Inactive".
 */
interface Drone {
  id: number;
  name: string;
  status: string;
}

/**
 * @function HomePage - The main component for the home page of the drone streaming application.
 * Fetches a test message from the backend API and displays a list of drones in the fleet.
 * Includes a link to the "My Fleet" page and renders the live stream using the Stream component.
 * @returns {JSX.Element} The rendered home page component.
 */
export default function HomePage() {
  const [message, setMessage] = useState("");
  const { connection } = useSignalR();
  useEffect(() => {
    fetch("/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  const [drones, _] = useState<Drone[]>([
    { id: 1, name: "DroneA", status: "Active" },
    { id: 2, name: "DroneB", status: "Inactive" },
    { id: 3, name: "DroneC", status: "Active" },
  ]);

  const [currDrone, setCurrDrone] = useState<Drone>(drones[0]);

  return (
    <div className="flex overflow-y-auto">
      <WidgetBar connection={connection} droneName={currDrone.name} />

      <main className="flex-1 h-full bg-[#BEBABA] flex flex-col p-8 overflow-hidden">
        <div className="flex justify-end items-center mr-3 mt-8">
          <Link
            to="/myfleet"
            className="text-white hover:text-gray-300 no-underline"
          >
            {message} My Fleet
          </Link>
          <select className="list-disc w-[300px] ml-4 bg-white rounded px-3 py-2"
            onChange={d => setCurrDrone(drones[Number(d.target.value) - 1])}
          >
            {drones.map((drone) => (
              <option key={drone.id} value={drone.id}>
                {drone.name} - {drone.status}
              </option>
            ))}
          </select>
        </div>
        <Stream droneName={currDrone.name} />
      </main>
    </div>
  );
}
