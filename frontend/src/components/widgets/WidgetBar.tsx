import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from 'react';

import MapContext from "../map/MapContext";
import TelemetryContext, { type DroneTelemetry } from "./TelemetryContext";
import Widget from "./Widget";

export default function WidgetBar({ connection }: { connection: signalR.HubConnection | undefined }) {
  const [dtelemetry, setTelemetry] = useState<DroneTelemetry | undefined>();

  useEffect(() => {
    if (!connection) return;
    const handler = (dto: DroneTelemetry) => {
      console.log(dto)
      setTelemetry(dto);
    };
    connection.start().then(() => {
      connection.invoke("SubscribeTopic", "test");
    }).catch(e => console.log("Connection failed: ", e));

    connection.on("ReceiveTelemetry", handler);

  }, [connection]);


  return (
    <aside className="relative w-[390px] h-full bg-sidebar-bg flex flex-col p-6 gap-4 overflow-y-auto border-r border-gray-200">
      <Widget title="Drone Name" value={dtelemetry?.gateway ?? "DJI"} />
      <Widget title="Battery Status" value="66%" />
      <TelemetryContext
        telemetry={{
          gateway: dtelemetry?.gateway ?? "DJI Matrice 400",
          data: { latitude: dtelemetry?.data.latitude ?? 59.1315, longitude: dtelemetry?.data.longitude ?? 20.2135, height: dtelemetry?.data.height ?? 20.3252 }
        }
        }
      />
      <MapContext telemetry={dtelemetry} />
      <Widget title="Connection" value="75%" />

      <Widget title="Coordinates" value={([dtelemetry?.data?.longitude, " ", dtelemetry?.data?.latitude]).toString()} />
    </aside>
  );
}
