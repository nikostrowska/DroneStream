export interface DroneTelemetry {

  serialNumber: string | null;
  gateway: string | null;
  data: {
    timestamp: number | null;
    latitude: number | null;
    longitude: number | null;
    height: number | null;
    absoluteAltitude: number | null;
    gimbalYaw: number | null;
    gimbalPitch: number | null;
    gimbalRoll: number | null;
    battery?: string | null;
    connection?: string | null;
  };
}

export default function TelemetryContext({
  telemetry,
}: {
  telemetry: DroneTelemetry;
}) {
  const { latitude, longitude, height } = telemetry.data;
  return (
    <>
      <div className="w-full bg-white/20  rounded-xl shadow-sm border border-white/20 p-4 flex gap-2 theme-transition">
        <div className="min-w-[300px] rounded-lg p-2 min-h-[40px] ">
          <span className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-muted uppercase">Latitude</p>
            <p className="text-lg font-mono font-bold text-accent">{latitude}</p>
          </span>
          <span className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-muted uppercase">Longitude</p>
            <p className="text-lg font-mono font-bold text-accent">{longitude}</p>
          </span>
          <span className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-muted uppercase">Height</p>
            <p className="text-lg font-mono font-bold text-accent">{height}</p>
          </span>
        </div>
      </div>
    </>
  );
}
