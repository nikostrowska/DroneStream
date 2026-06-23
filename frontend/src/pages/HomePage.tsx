import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { DroneDTO } from "../types/drone";
import type { DroneTelemetry } from "../components/widgets/TelemetryContext";
import WidgetBar from "../components/widgets/WidgetBar";
import RefreshButton from "../components/stream/RefreshButton";
import Stream from "../components/stream/Stream";
import { useSignalR } from "../components/signalRContext/SignalRProvider";
import gridIcon from "../assets/grid.svg"

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  `http://${window.location.hostname}:4001/api`;

type TelemetryPayload = DroneTelemetry & {
  serialNumber?: string | null;
  gateway?: string | null;
};

export default function HomePage() {
  const location = useLocation();
  const passedCurrDrone = location.state?.currDrone || null;
  const [drones, setDrones] = useState<DroneDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [currDrone, setCurrDrone] = useState<DroneDTO | null>(passedCurrDrone);

  const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});
  const [droneTelemetryMap, setDroneTelemetryMap] = useState<
    Record<string, DroneTelemetry>
  >({});
  const [pilotTelemetryMap, setPilotTelemetryMap] = useState<
    Record<string, DroneTelemetry>
  >({});
  const timeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const { connection, isConnected } = useSignalR();
  const dronesRef = useRef<DroneDTO[]>([]);
  const subscribedTopicsRef = useRef<Set<string>>(new Set());

  /**
   * Keep the latest drone list available for reconnect and subscription logic.
   */
  useEffect(() => {
    dronesRef.current = drones;
  }, [drones]);

  /**
   * Load drones independently from SignalR connection.
   * Online/offline state is derived from telemetry heartbeats only.
   */
  const loadDrones = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/drone`);
      if (!response.ok) {
        throw new Error("Failed to load drones");
      }
      const data = (await response.json()) as DroneDTO[];
      setDrones(data);

      const initialStatuses: Record<string, boolean> = {};
      data.forEach((drone) => {
        initialStatuses[drone.serialNumber.trim()] = false;
      });
      setOnlineMap(initialStatuses);
    } catch (error) {
      console.error("Error loading drones:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset or start inactivity timeout for a drone serial number.
   * When timer expires, the drone is marked offline.
   */
  const resetDroneHeartbeat = (serialNumber: string) => {
    if (timeouts.current[serialNumber]) {
      clearTimeout(timeouts.current[serialNumber]);
    }

    timeouts.current[serialNumber] = setTimeout(() => {
      setOnlineMap((prev) => ({ ...prev, [serialNumber]: false }));
      delete timeouts.current[serialNumber];
    }, 5000);
  };

  const subscribePilotTopic = async (serialNumber: string, force = false) => {
    if (!connection || !isConnected) return;
    if (!serialNumber) return;
    if (!force && subscribedTopicsRef.current.has(serialNumber)) {
      return;
    }
    try {
      console.log("SubscribeTopic");
      console.log(serialNumber);
      await connection.invoke("SubscribeTopic", serialNumber);
      subscribedTopicsRef.current.add(serialNumber);
    } catch (error) {
      console.error("Unable to subscribe to pilot topic:", serialNumber, error);
    }
  };

  const subscribeDroneTopic = async (serialNumber: string, force = false) => {

    if (!connection || !isConnected) return;

    if (!serialNumber) return;
    if (!force && subscribedTopicsRef.current.has(serialNumber)) {
      return;
    }

    try {
      await connection.invoke("SubscribeTopic", serialNumber);
      subscribedTopicsRef.current.add(serialNumber);
    } catch (error) {
      console.error("Unable to subscribe to drone topic:", serialNumber, error);
    }

  };

  useEffect(() => {
    loadDrones();
    return () => {
      Object.values(timeouts.current).forEach((timer) => clearTimeout(timer));
      timeouts.current = {};
    };
  }, []);

  useEffect(() => {
    if (!connection || !isConnected) return;

    const pilotTelemetryHandler = (payload: TelemetryPayload) => {
      if (!payload) return;
      const serialNumber = String(payload.gateway).trim();
      setPilotTelemetryMap((prev) => ({
        ...prev, [serialNumber]: payload,
      }));
    };

    const droneTelemetryHandler = (payload: TelemetryPayload) => {
      const rawSerial = payload.serialNumber;

      if (!rawSerial) {
        console.warn(
          "Received telemetry without serialNumber or gateway:",
          payload,
        );
        return;
      }

      const serialNumber = rawSerial.trim();

      // Payload is already the full DroneTelemetry object
      setDroneTelemetryMap((prev) => ({
        ...prev,
        [serialNumber]: payload,
      }));
      setOnlineMap((prev) => ({ ...prev, [serialNumber]: true }));
      resetDroneHeartbeat(serialNumber);
    };

    connection.on("ReceiveTelemetry", droneTelemetryHandler);
    connection.on("PilotTelemetry", pilotTelemetryHandler);

    return () => {
      connection.off("ReceiveTelemetry", droneTelemetryHandler);
      connection.off("PilotTelemetry", pilotTelemetryHandler);
    };
  }, [connection, isConnected]);

  /**
   * Subscribe to all loaded drone topics whenever the list changes
   * and the connection is already connected.
   */
  useEffect(() => {
    if (!connection || !isConnected) {
      return;
    }

    const subscribeTopics = async () => {
      for (const drone of drones) {
        await subscribeDroneTopic(drone.serialNumber.trim());
        await subscribePilotTopic(drone.pilotSerialNumber.trim());
      }
    };

    subscribeTopics().catch((error) => {
      console.error("Failed to subscribe drone topics:", error);
    });
  }, [connection, isConnected, drones]);

  const selectedDroneData =
    drones.find((drone) => drone.id === currDrone?.id) ?? null;
  const selectedDroneTelemetry = selectedDroneData
    ? droneTelemetryMap[selectedDroneData.serialNumber.trim()]
    : undefined;

  const selectedPilotTelemetry = selectedDroneData
    ? pilotTelemetryMap[selectedDroneData.pilotSerialNumber.trim()]
    : undefined;


  return (
    <div className="flex overflow-y-auto h-screen">
      <WidgetBar droneTelemetry={selectedDroneTelemetry} pilotTelemetry={selectedPilotTelemetry} />

      <main className="flex-1 bg-surface flex flex-col p-8 overflow-hidden theme-transition">
        <div className="flex justify-end items-center mr-3 mt-8 gap-4">
          <RefreshButton onRefresh={loadDrones} />
          <Link
            to="/myfleet"
            className="text-white hover:text-gray-300 font-semibold no-underline"
          >
            <img
              src={gridIcon}
              alt="grid view"
              title="MyFleet"
            />
          </Link>

          <select
            className="w-[500px] bg-surface-strong rounded-xl px-4 py-3 border border-theme shadow-lg focus:outline-none text-primary"
            onChange={(event) => {
              const selectedId = event.target.value;
              const drone =
                drones.find((item) => item.id === selectedId) ?? null;
              setCurrDrone(drone);
            }}
            value={currDrone?.id ?? ""}
          >
            <option value="">
              {loading ? "Loading fleet..." : "Select drone to monitor"}
            </option>

            {drones.map((drone) => {
              const serial = drone.serialNumber.trim();
              const isOnline = onlineMap[serial] ?? false;

              return (
                <option key={drone.id} value={drone.id}>
                  {isOnline ? "🟢 ONLINE" : "🔴 OFFLINE"} — {drone.name} (
                  {serial})
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex-1 mt-6">
          <Stream SerialNumber={selectedDroneData?.serialNumber ?? null} />
        </div>
      </main>
    </div>
  );
}
