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
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-2">
        <div className="min-w-[300px] bg-gray-50 rounded-lg p-2 min-h-[40px] ">
          <span className="text-lg font-mono font-bold text-slate-700 flex items-center justify-between">
            <p>Latitude</p> <p>{latitude}</p>
          </span>
          <span className="text-lg font-mono font-bold text-slate-700 flex items-center justify-between">
            <p>Longitude</p> <p>{longitude}</p>
          </span>
          <span className="text-lg font-mono font-bold text-slate-700 flex items-center justify-between">
            <p>Height</p> <p>{height}</p>
          </span>
        </div>
      </div>
    </>
  );
}
