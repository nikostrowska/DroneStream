export interface DroneTelemetry {
  gateway: string | null;
  topic: string | null;
  data: {
    timestamp: number | null;
    latitude: number | null;
    longitude: number | null;
    height: number | null;
    absoluteAltitude: number | null;
    gimbalYaw: number | null;
    gimbalPitch: number | null;
    gimbalRoll: number | null;
  };
}

export default function TelemetryContext({
  telemetry: {
    data: { latitude },
    data: { longitude },
    data: { height },
    gateway,
  },
}: {
  telemetry: DroneTelemetry;
}) {
  return (
    <>
      <div className="w-full bg-white">
        <h3>{gateway}</h3>
        <p>{latitude}</p>
        <p> {longitude}</p>
        <p> {height} m</p>
      </div>
    </>
  );
}
