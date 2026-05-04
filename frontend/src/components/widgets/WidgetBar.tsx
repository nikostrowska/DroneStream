import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from 'react';

import MapContext from "../map/MapContext";
import TelemetryContext, { type DroneTelemetry } from "./TelemetryContext";
import Widget from "./Widget";

export default function WidgetBar({ connection, droneName }: { connection: signalR.HubConnection | undefined, droneName: string | undefined }) {
  const [dtelemetry, setTelemetry] = useState<DroneTelemetry | undefined>(undefined);
  const [currDrone, setCurrDrone] = useState<String | undefined>("")

  useEffect(() => {
    if (!connection) return;
    connection.invoke("UnsubscribeTopic", currDrone);
    connection.invoke("SubscribeTopic", droneName);
    setCurrDrone(droneName);
    console.log("UnsubscribeTopic", currDrone);
    console.log("subscribeTopic", droneName);
  }, [droneName]);

  useEffect(() => {
    if (!connection) return;
    const handler = (dto: DroneTelemetry) => {
      console.log(dto)
      setTelemetry(dto);
    };
    connection.start().then(() => {
      connection.invoke("SubscribeTopic", droneName);
      console.log("Initial SubscribeTopic", droneName);
      setCurrDrone(droneName);
    }).catch(e => console.log("Connection failed: ", e));

    connection.on("ReceiveTelemetry", handler);

  }, [connection]);


  return (
    <aside className="relative w-[390px] h-full bg-sidebar-bg flex flex-col p-6 gap-4 overflow-y-auto border-r border-gray-200">
      <Widget title="Drone Name" value={dtelemetry?.gateway ?? undefined} />
      <TelemetryContext
        telemetry={{
          gateway: dtelemetry?.gateway ?? "DJI Matrice 400",
          data: { latitude: dtelemetry?.data.latitude ?? 59.1315, longitude: dtelemetry?.data.longitude ?? 20.2135, height: dtelemetry?.data.height ?? 20.3252 }
        }
        }
      />
      <MapContext telemetry={dtelemetry} />
      <Widget title="Coordinates" value={`${dtelemetry?.data.longitude, dtelemetry?.data.latitude}`} />
      <Widget title="Connection" value="75%" />

    </aside>
  );
}
