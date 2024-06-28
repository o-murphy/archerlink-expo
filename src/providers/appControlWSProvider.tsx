import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import io, {Socket} from 'socket.io-client';

interface AppControlWSContextProps {
    socket: Socket | null;
}

const AppControlWSContext = createContext<AppControlWSContextProps | undefined>(undefined);

export const useAppControlWS = (): AppControlWSContextProps => {
    const context = useContext(AppControlWSContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface AppControlWSProviderProps {
    children: ReactNode;
}

const BASE_LOCATION = __DEV__ ? 'http://127.0.0.1:8000' : window.location.origin;

export const AppControlWSProvider: React.FC<AppControlWSProviderProps> = ({children}) => {
    const socketRef = useRef<Socket | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        connectSocket();
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const connectSocket = () => {
        if (!socketRef.current) {
            const newSocket = io(BASE_LOCATION); // Replace with your server URL
            socketRef.current = newSocket;
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket connected');
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                // Attempt to reconnect after a delay
                setTimeout(connectSocket, 3000);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connect error:', error);
            });

            newSocket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }
    }

    return (
        <AppControlWSContext.Provider value={{socket}}>
            {children}
        </AppControlWSContext.Provider>
    );
};
