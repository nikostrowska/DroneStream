export interface DroneTelemetry {
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
      <div className="w-full bg-white/20  rounded-xl shadow-sm border border-white/20 p-4 flex gap-2">
        <div className="min-w-[300px] rounded-lg p-2 min-h-[40px] ">
          <span className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-[#676262] uppercase">Latitude</p>
            <p className="text-lg font-mono font-bold text-[#7E2A2A]">{latitude}</p>
          </span>
          <span className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-[#676262] uppercase">Longitude</p>
            <p className="text-lg font-mono font-bold text-[#7E2A2A]">{longitude}</p>
          </span>
          <span className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-[#676262] uppercase">Height</p>
            <p className="text-lg font-mono font-bold text-[#7E2A2A]">{height}</p>
          </span>
        </div>
      </div>
    </>
  );
}
