import { useState, useEffect, useCallback, useRef } from 'react';

type WebSocketHook = {
  sendMessage: (message: string) => Promise<string>;
  response: string | null;
  error: Event | null;
};

const useDevControlWS = (webSocketUrl: string, timeout: number = 30000): WebSocketHook => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const pendingPromises = useRef<{ resolve: (value: string) => void, reject: (reason?: any) => void }[]>([]);
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

  const openWebSocket = () => {
    if (ws.current) {
      return;
    }

    ws.current = new WebSocket(webSocketUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (event: MessageEvent) => {
      console.log('Message received from server');
      setResponse(event.data);
      if (pendingPromises.current.length > 0) {
        const { resolve } = pendingPromises.current.shift()!;
        resolve(event.data);
      }
    };

    ws.current.onerror = (event: Event) => {
      console.error('WebSocket error:', event);
      setError(event);
      if (pendingPromises.current.length > 0) {
        const { reject } = pendingPromises.current.shift()!;
        reject(event);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      ws.current = null;
    };
  };

  const closeWebSocket = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const resetInactivityTimeout = () => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(() => {
      closeWebSocket();
    }, timeout);
  };

  const sendMessage = useCallback((message: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      openWebSocket();
      resetInactivityTimeout();
      
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        pendingPromises.current.push({ resolve, reject });
        ws.current.send(message);
      } else {
        ws.current!.onopen = () => {
          pendingPromises.current.push({ resolve, reject });
          ws.current!.send(message);
        };
        ws.current!.onerror = (event: Event) => {
          reject(event);
        };
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
      closeWebSocket();
    };
  }, []);

  return { sendMessage, response, error };
};

export default useDevControlWS;
