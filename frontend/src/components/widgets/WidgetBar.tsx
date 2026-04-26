import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from 'react';

import MapContext from "../map/MapContext";
import TelemetryContext from "./TelemetryContext";
import Widget from "./Widget";

export default function WidgetBar() {
  const [connection, setConnection] = useState(null);
  const [dtelemetry, setTelemetry] = useState();
  useEffect(() => {
      const newConnection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:4001/droneTelemetryHub").build();
      setConnection(newConnection);
  }, []);

  useEffect(() => {
      if (!connection) return
      const handler = (dto) => {
          console.log(dto)
          setTelemetry(dto);
      };
      connection.start()
          .then(() => {
          connection.invoke("SubscribeTopic", "test");
          }).catch(e => console.log("Connection failed: ", e));

          connection.on("ReceiveTelemetry", handler);

  }, [connection]);


  return (
    <aside className="relative w-[390px] h-full bg-sidebar-bg flex flex-col p-6 gap-4 overflow-y-auto border-r border-gray-200">
      <Widget title="DJI Matrice 400" />
      <Widget title="Battery Status" value="66%" />
      <Widget title="Battery Status" value="66%" />
      <Widget title="Battery Status" value="66%" />
      <TelemetryContext
         telemetry= {{
           gateway: dtelemetry?.gateway ?? "DJI Matrice 400",
           data: { latitude: dtelemetry?.data?.latitude ?? 59, longitude: dtelemetry?.data?.longitude ?? 12, height: dtelemetry?.data?.height ?? 20}
         }
        }
      />
      <MapContext />
      <Widget title="Connection" value="75%" />
      <Widget title="Connection" value="75%" />

      <Widget title="Coordinates" value={[dtelemetry?.data?.longitude," ", dtelemetry?.data?.latitude]} />
    </aside>
  );
}
