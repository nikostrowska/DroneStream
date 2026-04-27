import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from 'react';
import type { DroneTelemetry } from "../map/MapContext";

const messageComponent = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [telemetry, setTelemetry] = useState<DroneTelemetry | null>(null);
    useEffect(() => {
        const newConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:4001/droneTelemetryHub").build();
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (!connection) return;
        const handler = ({ dto }: { dto: DroneTelemetry }) => {
            console.log("Got a message", dto);
            setTelemetry(dto);
        };
        connection.start()
            .then(() => {
                connection.invoke("SubscribeTopic", "test");
            }).catch(e => console.log("Connection failed: ", e));

        connection.on("ReceiveTelemetry", handler);

    }, [connection]);

    return (
        <div>
            <h2>
                {JSON.stringify(telemetry?.data.longitude)}, {JSON.stringify(telemetry?.data.latitude)}
            </h2>
        </div>
    );
}

export default messageComponent;

