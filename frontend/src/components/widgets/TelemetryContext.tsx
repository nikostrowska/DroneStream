export interface DroneTelemetry {
  gateway: string;
  data: {
    latitude: number;
    longitude: number;
    height: number;
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
