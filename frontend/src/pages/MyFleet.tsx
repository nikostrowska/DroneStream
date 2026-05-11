import RefreshButton from "../components/stream/RefreshButton";
import DroneOptionMenu from "../components/fleet/DroneOptionMenu";
import AddDroneForm from "../components/fleet/AddDroneForm";
import EditDroneForm from "../components/fleet/EditDroneForm";
import moreIcon from "../assets/moreIcon.svg";
import offlinePhoto from "../assets/offlinePhoto.png";
import noPhotoAvailable from "../assets/noPhotoAvailable.png";
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import type { AddDroneDTO, DroneDTO, UpdateDroneDTO } from "../types/drone";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  `http://${window.location.hostname}:4001/api`;

function formatLastActivity(value?: string | null) {
  if (!value) return "No activity";
  return new Date(value).toLocaleString();
}

export default function MyFleet() {
  const [drones, setDrones] = useState<DroneDTO[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeEditDrone, setActiveEditDrone] = useState<DroneDTO | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [onlineMap, setOnlineMap] = useState<Record<string, boolean>>({});
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const loadDrones = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/drone`);
      if (!response.ok) {
        console.error("Failed to load drones", response.statusText);
        return;
      }
      const data = (await response.json()) as DroneDTO[];
      setDrones(data);
      setOnlineMap(
        data.reduce<Record<string, boolean>>((map, drone) => {
          map[drone.serialNumber.trim()] = drone.isOnline;
          return map;
        }, {}),
      );
    } catch (error) {
      console.error("Error loading drones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrones();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://${window.location.hostname}:4001/droneTelemetryHub`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const statusHandler = (serialNumber: string, isOnline: boolean) => {
      const normalized = serialNumber.trim();
      console.log(`MyFleet SignalR: ${normalized} -> ${isOnline}`);
      setOnlineMap((prev) => ({ ...prev, [normalized]: isOnline }));
      setDrones((prev) =>
        prev.map((drone) =>
          drone.serialNumber.trim() === normalized
            ? { ...drone, isOnline }
            : drone,
        ),
      );
    };

    connection.on("DroneStatusUpdated", statusHandler);

    connection
      .start()
      .then(() => {
        console.log("MyFleet SignalR connected");
      })
      .catch((error) => {
        console.error("MyFleet SignalR connection failed:", error);
      });

    return () => {
      connection.off("DroneStatusUpdated", statusHandler);
      connection.stop();
    };
  }, []);

  const handleCreateDrone = async (payload: AddDroneDTO) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/drone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error("Failed to create drone", response.statusText);
        return;
      }
      const created = (await response.json()) as DroneDTO;
      setDrones((prev) => [created, ...prev]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating drone", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateDrone = async (id: string, payload: UpdateDroneDTO) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/drone/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error("Failed to update drone", response.statusText);
        return;
      }
      const updated = (await response.json()) as DroneDTO;
      setDrones((prev) =>
        prev.map((drone) => (drone.id === id ? updated : drone)),
      );
      setActiveEditDrone(null);
    } catch (error) {
      console.error("Error updating drone", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDrone = async (id: string) => {
    if (!window.confirm("Delete this drone permanently?")) return;
    try {
      const response = await fetch(`${apiBaseUrl}/drone/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error("Failed to delete drone", response.statusText);
        return;
      }
      setDrones((prev) => prev.filter((drone) => drone.id !== id));
    } catch (error) {
      console.error("Error deleting drone", error);
    }
  };

  const handleEditClick = (drone: DroneDTO) => {
    setActiveEditDrone(drone);
    setShowAddForm(false);
    setOpenMenuId(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden flex-col">
      <div className="flex flex-1 overflow-y-auto">
        <main className="flex-1 h-full bg-[#CECDCB] flex flex-col p-8 overflow-hidden items-center">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex items-end justify-between gap-4">
              <div className="flex-none">
                <RefreshButton onRefresh={loadDrones} />
              </div>

              <h1 className="flex-1 text-center text-[#7E2A2A] text-8xl font-jaro">
                <span className="tracking-[0.5em]">MY FLEET</span>
              </h1>

              <button
                type="button"
                className="flex-none w-[220px] bg-[#7E2A2A] hover:bg-[#701C1C] font-semibold text-white py-4 rounded-full focus:outline-none focus:shadow-outline"
                onClick={() => {
                  setShowAddForm(true);
                  setActiveEditDrone(null);
                }}
              >
                Add a new drone
              </button>
            </div>

            {showAddForm && (
              <AddDroneForm
                onSubmit={handleCreateDrone}
                onCancel={() => setShowAddForm(false)}
                submitting={submitting}
              />
            )}

            {activeEditDrone && (
              <EditDroneForm
                drone={activeEditDrone}
                onSubmit={handleUpdateDrone}
                onCancel={() => setActiveEditDrone(null)}
                submitting={submitting}
              />
            )}

            <div className="w-full max-w-7xl max-h-[70vh] overflow-y-auto pl-8 pr-6 mt-2 custom-scroll">
              {loading ? (
                <div className="text-center text-[#1E2126] py-8">
                  Loading drones…
                </div>
              ) : drones.length === 0 ? (
                <div className="text-center text-[#1E2126] py-8">
                  No drones available. Add one to start.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[66px] w-full max-w-7xl mb-2 mt-2">
                  {drones.map((drone) => {
                    const serial = drone.serialNumber.trim();
                    const isOnline = onlineMap[serial] ?? drone.isOnline;
                    return (
                      <div
                        key={drone.id}
                        className="group bg-white/20 border border-white/20 rounded-2xl p-5 w-[360px] flex flex-col gap-4 transition-all duration-300 hover:bg-white/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1"
                      >
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate overflow-hidden text-lg font-semibold text-[#1E2126] group-hover:text-black transition">
                            {drone.name}
                          </h3>
                          <p className="text-sm text-[#5F5F5F] truncate">
                            {drone.model ?? drone.serialNumber}
                          </p>
                        </div>

                        <div className="relative inline-block">
                          <button
                            className="p-1 hover:bg-white/30 rounded-md transition cursor-pointer"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === drone.id ? null : drone.id,
                              )
                            }
                          >
                            <img
                              src={moreIcon}
                              alt="options"
                              className="w-5 h-5"
                            />
                          </button>

                          {openMenuId === drone.id && (
                            <DroneOptionMenu
                              onEdit={() => handleEditClick(drone)}
                              onDelete={() => handleDeleteDrone(drone.id)}
                            />
                          )}
                        </div>
                      </div>

                      <div className="mx-auto">
                        <span className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                isOnline
                                  ? "bg-[#00A323] animate-pulse"
                                  : "bg-[#B00000]"
                              }`}
                            />

                            <p
                              className={`text-md font-medium ${
                                isOnline
                                  ? "text-[#00A323]"
                                  : "text-[#B00000]"
                              }`}
                            >
                              {isOnline ? "online" : "offline"}
                            </p>
                          </div>

                          <p
                            className={`text-md font-medium ${
                              isOnline
                                ? "text-[#00A323]"
                                : "text-[#B00000]"
                            }`}
                          >
                            {isOnline
                              ? formatLastActivity(drone.lastActivity)
                              : "Offline"}
                          </p>
                        </span>

                        <div className="w-[275px] h-[215px] mx-auto flex items-center justify-center rounded-xl overflow-hidden">
                          {isOnline ? (
                            <img
                              src={noPhotoAvailable}
                              alt={drone.name}
                              className="w-full h-full opacity-60"
                            />
                          ) : (
                            <img
                              src={offlinePhoto}
                              alt="offline"
                              className="w-full h-full opacity-60"
                            />
                          )}
                        </div>
                      </div>

                      <button className="bg-[#7E2A2A] hover:bg-[#701C1C] text-white mt-2 w-[133px] h-[28px] px-3 py-1 rounded-full text-sm mx-auto cursor-pointer">
                        View
                      </button>
                    </div>
                  );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
