import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from 'react';

import MapContext from "../map/MapContext";
import TelemetryContext, { type DroneTelemetry } from "./TelemetryContext";
import Widget from "./Widget";

export default function WidgetBar({ connection, droneName }: { connection: signalR.HubConnection | undefined, droneName: string | undefined }) {

  function convertDDtoDMS(lon: number | null, lat: number | null): string | undefined {
    if (!lon || !lat) return;
    const dlon: number = Math.floor(lon);
    const mlon: number = (Number(lon) - dlon) * 60;
    const slon: number = Math.round((mlon - Math.floor(mlon)) * 60);

    const dlat: number = Math.floor(lat);
    const mlat: number = (Number(lat) - dlat) * 60;
    const slat: number = Math.round((mlat - Math.floor(mlat)) * 60);


    return `${dlon}°${Math.floor(mlon)}'${slon}"${dlon >= 0 ? 'N' : 'S'} ${dlat}°${Math.floor(mlat)}'${slat}"${dlon >= 0 ? 'E' : 'W'}`;
  }

  const [dtelemetry, setTelemetry] = useState<DroneTelemetry | undefined>(undefined);
  const [currDrone, setCurrDrone] = useState<string | undefined>("")
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [pilotSN, setPilotSN] = useState<string | null>(null);
  const [pilotTelemetry, setPilotTelemetry] = useState<DroneTelemetry | undefined>(undefined);

  useEffect(() => {
    if (!connection) return;
    connection.invoke("UnsubscribeTopic", currDrone);
    connection.invoke("SubscribeTopic", droneName);
    if (pilotSN) {
      connection.invoke("UnsubscribeTopic", pilotSN);
      console.log("UnsubscribeTopic", pilotSN);
    }
    setCurrDrone(droneName);
    console.log("UnsubscribeTopic", currDrone);
    console.log("subscribeTopic", droneName);
  }, [droneName]);

  useEffect(() => {
    if (!connection) return;
    const handler = (dto: DroneTelemetry) => {
      console.log(dto);
      setPilotSN(dto.gateway);
      if (dto.topic == dto.gateway) {
        setPilotTelemetry(dto);
      } else {
        setTelemetry(dto);
        setLocation(convertDDtoDMS(dto.data.latitude, dto.data.longitude));
      }
    };
    connection.start().then(() => {
      connection.invoke("SubscribeTopic", droneName);
      console.log("Initial SubscribeTopic", droneName);
      setCurrDrone(droneName);
    }).catch(e => console.log("Connection failed: ", e));

    connection.on("ReceiveTelemetry", handler);

  }, [connection]);

  useEffect(() => {
    if (!connection || !pilotSN) return;
    connection.invoke("SubscribeTopic", pilotSN);
    console.log("SubscribeTopic", pilotSN);
  }, [pilotSN]);


  return (
    <aside className="relative w-[390px] h-full bg-sidebar-bg flex flex-col p-6 gap-4 overflow-y-auto border-r border-gray-200">
      <Widget title="Drone Name" value={dtelemetry?.gateway ?? undefined} />
      <TelemetryContext
        telemetry={{
          gateway: dtelemetry?.gateway ?? "DJI Matrice 400",
          topic: dtelemetry?.gateway ?? "DJI Matrice 400",
          data: {
            latitude: dtelemetry?.data.latitude ?? 59.1315, longitude: dtelemetry?.data.longitude ?? 20.2135, height: dtelemetry?.data.height ?? 20.3252,
            timestamp: null,
            absoluteAltitude: null,
            gimbalYaw: null,
            gimbalPitch: null,
            gimbalRoll: null
          }
        }
        }
      />
      <MapContext telemetry={dtelemetry} pilot={pilotTelemetry} />
      <Widget title="Coordinates" value={location ?? convertDDtoDMS(53.764341, 20.518751)} />
      <Widget title="Connection" value="75%" />

    </aside>
  );
}
