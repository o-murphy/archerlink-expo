import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

interface DevControlWSContextProps {
    socket: WebSocket | null;
}

const DevControlWSContext = createContext<DevControlWSContextProps | undefined>(undefined);

export const useDevControlWS = (): DevControlWSContextProps => {
    const context = useContext(DevControlWSContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface DevControlWSProviderProps {
    children: ReactNode;
}

const BASE_LOCATION = __DEV__ ?
    'ws://stream.trailcam.link:8080/websocket'
    : 'ws://192.168.100.1:8080/websocket';

export const DevControlWSProvider: React.FC<DevControlWSProviderProps> = ({ children }) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        connectSocket();
        return () => {
            disconnectSocket();
        };
    }, []);

    const connectSocket = () => {
        if (!socketRef.current) {
            const newSocket = new WebSocket(BASE_LOCATION);
            socketRef.current = newSocket;
            setSocket(newSocket);

            newSocket.onopen = () => {
                console.log('WebSocket connected');
            };

            newSocket.onclose = () => {
                console.log('WebSocket disconnected');
                socketRef.current = null;
                setSocket(null);
                // Attempt to reconnect after a delay
                setTimeout(connectSocket, 1000);
            };

            newSocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                socketRef.current = null;
                setSocket(null);
                // Attempt to reconnect after a delay
                setTimeout(connectSocket, 1000);
            };
        }
    };

    const disconnectSocket = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
            setSocket(null);
        }
    };

    return (
        <DevControlWSContext.Provider value={{ socket }}>
            {children}
        </DevControlWSContext.Provider>
    );
};
