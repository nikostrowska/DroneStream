import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Link } from "react-router-dom";

import type { DroneDTO } from "../types/drone";
import type { DroneTelemetry } from "../components/widgets/TelemetryContext";

import WidgetBar from "../components/widgets/WidgetBar";
import Stream from "../components/stream/Stream";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  `http://${window.location.hostname}:4001/api`;

type TelemetryPayload = DroneTelemetry & {
  serialNumber?: string | null;
  gateway?: string | null;
};

export default function HomePage() {
  const [drones, setDrones] = useState<DroneDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [currDrone, setCurrDrone] = useState<DroneDTO | null>(null);

  const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});
  const [telemetryMap, setTelemetryMap] = useState<
    Record<string, DroneTelemetry>
  >({});
  const timeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const connectionRef = useRef<signalR.HubConnection | null>(null);
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
  useEffect(() => {
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

    loadDrones();
  }, []);

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

  const subscribeDroneTopic = async (serialNumber: string, force = false) => {
    const connection = connectionRef.current;
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      return;
    }

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

  const subscribeAllDrones = async (force = false) => {
    for (const drone of dronesRef.current) {
      await subscribeDroneTopic(drone.serialNumber.trim(), force);
    }
  };

  /**
   * Create and manage a single persistent SignalR connection.
   */
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://${window.location.hostname}:4001/droneTelemetryHub`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const telemetryHandler = (payload: TelemetryPayload) => {
      const rawSerial = payload.serialNumber ?? payload.gateway;
      if (!rawSerial) {
        console.warn(
          "Received telemetry without serialNumber or gateway:",
          payload,
        );
        return;
      }

      const serialNumber = String(rawSerial).trim();

      // Payload is already the full DroneTelemetry object
      setTelemetryMap((prev) => ({
        ...prev,
        [serialNumber]: payload,
      }));
      setOnlineMap((prev) => ({ ...prev, [serialNumber]: true }));
      resetDroneHeartbeat(serialNumber);
    };

    connection.on("ReceiveTelemetry", telemetryHandler);

    connection.onreconnected(() => {
      console.info("SignalR reconnected, restoring drone subscriptions...");
      subscribeAllDrones(true).catch((error) => {
        console.error("Failed to re-subscribe after reconnect:", error);
      });
    });

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR connected", connection.state);
        await subscribeAllDrones();
      } catch (error) {
        console.error("SignalR start failed:", error);
      }
    };

    startConnection();

    return () => {
      connection.off("ReceiveTelemetry", telemetryHandler);
      connection.stop().catch(() => {
        /* ignore stop errors during unmount */
      });
      Object.values(timeouts.current).forEach((timer) => clearTimeout(timer));
      timeouts.current = {};
    };
  }, []);

  /**
   * Subscribe to all loaded drone topics whenever the list changes
   * and the connection is already connected.
   */
  useEffect(() => {
    const conn = connectionRef.current;
    if (!conn || conn.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    const subscribeTopics = async () => {
      for (const drone of drones) {
        await subscribeDroneTopic(drone.serialNumber.trim());
      }
    };

    subscribeTopics().catch((error) => {
      console.error("Failed to subscribe drone topics:", error);
    });
  }, [drones]);

  const selectedDroneData =
    drones.find((drone) => drone.id === currDrone?.id) ?? null;
  const selectedTelemetry = selectedDroneData
    ? telemetryMap[selectedDroneData.serialNumber.trim()]
    : undefined;

  return (
    <div className="flex overflow-y-auto h-screen">
      <WidgetBar telemetry={selectedTelemetry} />

      <main className="flex-1 bg-[#BEBABA] flex flex-col p-8 overflow-hidden">
        <div className="flex justify-end items-center mr-3 mt-8 gap-4">
          <Link
            to="/myfleet"
            className="text-white hover:text-gray-300 font-semibold no-underline"
          >
            My Fleet
          </Link>

          <select
            className="w-[500px] bg-white rounded-xl px-4 py-3 border border-gray-300 shadow-lg focus:outline-none text-gray-800"
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
