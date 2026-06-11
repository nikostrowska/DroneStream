import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as signalR from "@microsoft/signalr";

interface Components {
    children?: ReactNode
};

interface ISignalRContext {
    connection: signalR.HubConnection | undefined;
    isConnected: boolean;
};

const SignalRContext = createContext<ISignalRContext>({ connection: undefined, isConnected: false });

export const SignalRProvider = ({ children }: Components) => {
    const [connection, setConnection] = useState<signalR.HubConnection | undefined>();
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (isConnected) return;
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`http://${window.location.hostname}:4001/droneTelemetryHub`)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        newConnection.onreconnecting(() => setIsConnected(false));
        newConnection.onreconnected(() => setIsConnected(true));
        newConnection.onclose(() => setIsConnected(false));

        newConnection.start().then(() => {
            setConnection(newConnection);
            setIsConnected(true);
            console.log("SignalR Connected.");
        }).catch((err) => {
            console.error("SignalR Connection Error: ", err);
        });

        return () => {
            newConnection.stop().then(() => console.log("SignalR Disconnected."));
        };
    }, []);

    return (
        <SignalRContext.Provider value={{ connection, isConnected }}>
            {children}
        </SignalRContext.Provider >
    );
};

export const useSignalR = () => useContext(SignalRContext);
