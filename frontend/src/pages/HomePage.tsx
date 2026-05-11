import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Link } from "react-router-dom";

import type { DroneDTO } from "../types/drone";

import WidgetBar from "../components/widgets/WidgetBar";
import Stream from "../components/stream/Stream";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  `http://${window.location.hostname}:4001/api`;

export default function HomePage() {
  const [drones, setDrones] = useState<DroneDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [currDrone, setCurrDrone] = useState<DroneDTO | null>(null);

  /**
   * STAN ONLINE - Klucz do kolorów kropek
   * Przechowuje status: serialNumber -> true/false
   */
  const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});
  const timeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  /**
   * 1. POBIERANIE LISTY DRONÓW Z API
   */
  const loadDrones = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/drone`);
      if (!response.ok) throw new Error("Failed to load drones");

      const data = (await response.json()) as DroneDTO[];
      setDrones(data);

      // Inicjalizacja mapy statusów na podstawie danych z bazy
      const initialMap: Record<string, boolean> = {};
      data.forEach((d) => {
        initialMap[d.serialNumber] = d.isOnline ?? false;
      });
      setOnlineMap(initialMap);
    } catch (error) {
      console.error("Error loading drones:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 2. KONFIGURACJA SIGNALR
   */
  useEffect(() => {
    loadDrones();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://${window.location.hostname}:4001/droneTelemetryHub`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const telemetryHandler = (telemetry: any) => {
      const sn = telemetry.serialNumber ?? telemetry.gateway;

      if (sn) {
        const cleanSn = String(sn).trim();
        console.log(`[SignalR] Rozpoznano drona: "${cleanSn}"`, telemetry);

        setOnlineMap((prev) => ({
          ...prev,
          [cleanSn]: true,
        }));

        // Reset timeoutu (jak wcześniej)
        if (timeouts.current[cleanSn]) clearTimeout(timeouts.current[cleanSn]);
        timeouts.current[cleanSn] = setTimeout(() => {
          setOnlineMap((prev) => ({ ...prev, [cleanSn]: false }));
        }, 5000);
      } else {
        console.warn("Otrzymano dane bez pola 'gateway'!", telemetry);
      }
    };

    const statusHandler = (serialNumber: string, isOnline: boolean) => {
      console.log(
        `Status update: ${serialNumber} is now ${isOnline ? "ONLINE" : "OFFLINE"}`,
      );
      setOnlineMap((prev) => ({
        ...prev,
        [serialNumber]: isOnline,
      }));
    };
    const startConnection = async () => {
      try {
        // WAŻNE: Najpierw .on, potem .start
        connection.on("ReceiveTelemetry", telemetryHandler);
        connection.on("DroneStatusUpdated", statusHandler);

        await connection.start();
        console.log("SignalR Connected ✅ State:", connection.state);

        // Subskrybuj drony, które już zostały załadowane
        await subscribeExistingDrones(connection);
      } catch (err) {
        console.error("SignalR Connection Error ❌:", err);
      }
    };

    startConnection();

    return () => {
      connection.off("ReceiveTelemetry");
      connection.off("DroneStatusUpdated");
      connection.stop();
    };
  }, []);

  /**
   * 3. FUNKCJA SUBSKRYPCJI
   */
  const subscribeExistingDrones = async (conn: signalR.HubConnection) => {
    if (conn.state !== signalR.HubConnectionState.Connected) return;

    // Używamy aktualnego stanu drones (dostępnego w momencie wywołania)
    // Jeśli lista jest pusta, subskrypcja zadziała w useEffect poniżej
    for (const drone of drones) {
      try {
        await conn.invoke("SubscribeTopic", drone.serialNumber);
      } catch (e) {
        console.error("Initial subscription failed for", drone.serialNumber, e);
      }
    }
  };

  /**
   * 4. SUBSKRYPCJA NOWO DODANYCH DRONÓW
   */
  useEffect(() => {
    const conn = connectionRef.current;
    if (
      conn?.state === signalR.HubConnectionState.Connected &&
      drones.length > 0
    ) {
      drones.forEach((d) => {
        conn.invoke("SubscribeTopic", d.serialNumber).catch(() => {});
      });
    }
  }, [drones]);

  /**
   * DANE WYBRANEGO DRONA
   */
  const selectedDroneData = drones.find((d) => d.id === currDrone?.id);

  return (
    <div className="flex overflow-y-auto h-screen">
      <WidgetBar
        connection={connectionRef.current ?? undefined}
        SerialNumber={selectedDroneData?.serialNumber}
      />

      <main className="flex-1 bg-[#BEBABA] flex flex-col p-8 overflow-hidden">
        <div className="flex justify-end items-center mr-3 mt-8 gap-4">
          <Link
            to="/myfleet"
            className="text-white hover:text-gray-300 font-semibold no-underline"
          >
            My Fleet
          </Link>

          <select
            className="w-[350px] bg-white rounded-xl px-4 py-3 border border-gray-300 shadow-lg focus:outline-none text-gray-800"
            onChange={(e) => {
              const selectedId = e.target.value;
              const drone = drones.find((d) => d.id === selectedId);
              setCurrDrone(drone || null);
            }}
            value={currDrone?.id || ""}
          >
            <option value="">
              {loading ? "Loading fleet..." : "Select drone to monitor"}
            </option>

            {drones.map((drone) => {
              const isOnline = onlineMap[drone.serialNumber.trim()];
              return (
                <option key={drone.id} value={drone.id}>
                  {isOnline ? "🟢 ONLINE" : "🔴 OFFLINE"} — {drone.name} (
                  {drone.serialNumber})
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
