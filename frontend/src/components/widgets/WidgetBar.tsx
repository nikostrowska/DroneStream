import { useMemo } from "react";

import MapContext from "../map/MapContext";
import TelemetryContext, { type DroneTelemetry } from "./TelemetryContext";
import Widget from "./Widget";

export default function WidgetBar({
  telemetry,
}: {
  telemetry: DroneTelemetry | undefined;
}) {
  function convertDDtoDMS(
    lon: number | null,
    lat: number | null,
  ): string | undefined {
    if (!lon || !lat) return;
    const dlon: number = Math.floor(lon);
    const mlon: number = (Number(lon) - dlon) * 60;
    const slon: number = Math.round((mlon - Math.floor(mlon)) * 60);

    const dlat: number = Math.floor(lat);
    const mlat: number = (Number(lat) - dlat) * 60;
    const slat: number = Math.round((mlat - Math.floor(mlat)) * 60);

    return `${dlon}°${Math.floor(mlon)}'${slon}"${dlon >= 0 ? "N" : "S"} ${dlat}°${Math.floor(mlat)}'${slat}"${dlon >= 0 ? "E" : "W"}`;
  }

  const telemetryWithFallback: DroneTelemetry = telemetry ?? {
    gateway: "DJI Matrice 400",
    data: {
      latitude: 59.1315,
      longitude: 20.2135,
      height: 20.3252,
      timestamp: null,
      absoluteAltitude: null,
      gimbalYaw: null,
      gimbalPitch: null,
      gimbalRoll: null,
      battery: null,
      connection: null,
    },
  };

  const location = useMemo(
    () =>
      telemetry
        ? convertDDtoDMS(telemetry.data.longitude, telemetry.data.latitude)
        : undefined,
    [telemetry],
  );

  return (
    <aside className="relative w-[390px] h-full bg-sidebar-bg flex flex-col p-6 gap-4 overflow-y-auto border-r border-gray-200">
      <Widget
        title="Pilot Name"
        value={telemetryWithFallback.gateway ?? undefined}
      />
      <TelemetryContext telemetry={telemetryWithFallback} />
      <MapContext telemetry={telemetry} />
      <Widget
        title="Coordinates"
        value={location ?? convertDDtoDMS(53.764341, 20.518751)}
      />
      <Widget
        title="Connection"
        value={telemetryWithFallback.data.connection ?? "67%"}
      />
      <Widget
        title="Batery"
        value={telemetryWithFallback.data.battery ?? "67%"}
      />
    </aside>
  );
}
