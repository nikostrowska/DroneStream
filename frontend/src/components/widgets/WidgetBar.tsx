import MapContext from "../map/MapContext";
import TelemetryContext from "./TelemetryContext";
import Widget from "./Widget";

export default function WidgetBar() {
  return (
    <aside className="relative w-[390px] h-full bg-sidebar-bg flex flex-col p-6 gap-4 overflow-y-auto border-r border-gray-200 ">
      <Widget title="DJI Matrice 400" />
      <Widget title="Battery Status" value="66%" />
      <Widget title="Battery Status" value="66%" />
      <Widget title="Battery Status" value="66%" />
      <TelemetryContext
        telemetry={{
          gateway: "DJI Matrice 400",
          data: { latitude: 52.2297, longitude: 21.0122, height: 100 },
        }}
      />
      <MapContext />
      <Widget title="Connection" value="75%" />
      <Widget title="Connection" value="75%" />

      <Widget title="Coordinates" value="52.2297, 21.0122" />
    </aside>
  );
}
