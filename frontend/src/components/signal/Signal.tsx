import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from 'react';
// import DroneTelemetry from "../widgets/TelemetryContext"

const messageComponent = () => {
    const [connection, setConnection] = useState(null);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:4001/droneTelemetryHub").build();
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (!connection) return
        const handler = (dto) => {
            console.log("Got a message", dto);
            setMessage((message) => (dto));
        };
        connection.start()
            .then(() => {
            connection.invoke("SubscribeTopic", "test");
            }).catch(e => console.log("Connection failed: ", e));

            connection.on("ReceiveTelemetry", handler);

    }, [connection]);

    // useEffect(() => {
    //   if (!message) {
    //         return;
    //   }
    //   console.log("Messages updated:", message.data);
    // }, [message]);
    
    return (
        <div>
            <h2>
                {JSON.stringify(message?.data?.longitude, message?.data.?latitude)}
            </h2>
        </div>
    );
}

export default messageComponent;

