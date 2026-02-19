import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useWebSocket = (url, options = {}) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const connect = useCallback(() => {
    if (!token || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `${url}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      if (options.onConnect) {
        options.onConnect();
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      if (options.onDisconnect) {
        options.onDisconnect(event);
      }

      // Attempt to reconnect after delay
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          if (options.reconnect !== false) {
            connect();
          }
        }, options.reconnectDelay || 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (options.onError) {
        options.onError(error);
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev.slice(-9), data]); // Keep last 10 messages
        
        // Call message handler based on type
        if (options.onMessage) {
          options.onMessage(data);
        }

        // Specific handlers for calendar events
        if (data.type === 'EVENT_CREATED' && options.onEventCreated) {
          options.onEventCreated(data.data);
        } else if (data.type === 'EVENT_UPDATED' && options.onEventUpdated) {
          options.onEventUpdated(data.data);
        } else if (data.type === 'EVENT_DELETED' && options.onEventDeleted) {
          options.onEventDeleted(data.data);
        } else if (data.type === 'NOTIFICATION' && options.onNotification) {
          options.onNotification(data.data);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    wsRef.current = ws;
  }, [url, token, options]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    disconnect,
    connect,
    isConnected,
    messages,
    getSocket: () => wsRef.current,
  };
};

export default useWebSocket;