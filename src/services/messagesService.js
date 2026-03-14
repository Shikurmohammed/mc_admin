import { io } from 'socket.io-client';
import apiService from './apiService';

export const messagesAPI = {
    getConversations: (page = 1, limit = 20) => 
        apiService.get(`/messages/conversations?page=${page}&limit=${limit}`),
    
    getConversation: (conversationId, page = 1, limit = 50) => 
        apiService.get(`/messages/conversations/${conversationId}?page=${page}&limit=${limit}`),
    
    startConversation: (data) => {
        console.log('📡 API Call - startConversation with data:', data);
        return apiService.post('/messages/conversations', data)
            .then(response => {
                console.log('📡 API Response - startConversation success:', response);
                return response;
            })
            .catch(error => {
                console.error('📡 API Error - startConversation:', error.response?.data || error.message);
                throw error;
            });
    },
    
    sendMessage: (data) => 
        apiService.post('/messages/messages', data),
    
    markAsRead: (conversationId) => 
        apiService.post(`/messages/conversations/${conversationId}/read`),
    
    deleteConversation: (conversationId) => 
        apiService.delete(`/messages/conversations/${conversationId}`),
    
    getUnreadCount: () => 
        apiService.get('/messages/unread'),
};

export class MessageWebSocket {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 2000;
        this.connectionPromise = null;
        this.pendingMessages = new Map();
        this.messageTimeouts = new Map();
        this.connected = false;
        this.reconnectTimer = null;
        this.userId = null;
        
        // Add debounce maps
        this.typingDebounceTimers = new Map();
        this.statusDebounceTimers = new Map();
        
        // Task queue
        this.taskQueue = [];
        this.isProcessing = false;
    }

    processQueue = () => {
        if (this.isProcessing || this.taskQueue.length === 0) return;
        
        this.isProcessing = true;
        
        const processChunk = () => {
            const chunk = this.taskQueue.splice(0, 5);
            
            chunk.forEach(({ event, data }) => {
                const callbacks = this.listeners.get(event);
                if (callbacks) {
                    callbacks.forEach(callback => {
                        try {
                            callback(data);
                        } catch (error) {
                            console.error(`Error in ${event} listener:`, error);
                        }
                    });
                }
            });
            
            if (this.taskQueue.length > 0) {
                if (typeof requestIdleCallback === 'function') {
                    requestIdleCallback(processChunk, { timeout: 100 });
                } else {
                    setTimeout(processChunk, 16);
                }
            } else {
                this.isProcessing = false;
            }
        };
        
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(processChunk, { timeout: 100 });
        } else {
            setTimeout(processChunk, 16);
        }
    };

    connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                // Use the correct WebSocket URL
                const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
                
                console.log('🔌 [WebSocket] Connecting to:', `${WS_URL}/messages`);

                // Add connection options
                this.socket = io(`${WS_URL}/messages`, {
                    withCredentials: true,
                    transports: ['websocket', 'polling'],
                    reconnection: true,
                    reconnectionAttempts: this.maxReconnectAttempts,
                    reconnectionDelay: this.reconnectDelay,
                    reconnectionDelayMax: 10000,
                    timeout: 20000,
                    forceNew: true,
                    autoConnect: true,
                    // Add path if needed
                    path: '/socket.io/',
                });

                // Connection established
                this.socket.on('connect', () => {
                    console.log('✅ [WebSocket] Connected successfully! Socket ID:', this.socket.id);
                    this.connected = true;
                    this.reconnectAttempts = 0;
                    
                    // Clear any reconnect timer
                    if (this.reconnectTimer) {
                        clearTimeout(this.reconnectTimer);
                        this.reconnectTimer = null;
                    }
                    
                    this.emit('connect', { socketId: this.socket.id });
                    this.retryPendingMessages();
                    resolve(this.socket);
                });

                // Connection error
                this.socket.on('connect_error', (error) => {
                    console.error('❌ [WebSocket] Connection error:', error.message);
                    console.error('❌ [WebSocket] Error details:', error);
                    this.connected = false;
                    this.emit('error', error);
                    
                    this.reconnectAttempts++;
                    
                    // Reject if max attempts reached
                    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                        reject(error);
                        this.connectionPromise = null;
                    }
                });

                // Disconnect
                this.socket.on('disconnect', (reason) => {
                    console.log('📴 [WebSocket] Disconnected:', reason);
                    this.connected = false;
                    this.emit('disconnect', reason);
                    
                    // Attempt to reconnect if not manual disconnect
                    if (reason !== 'io client disconnect') {
                        this.reconnectTimer = setTimeout(() => {
                            console.log('🔄 [WebSocket] Attempting to reconnect...');
                            this.connectionPromise = null;
                            this.connect();
                        }, this.reconnectDelay);
                    }
                });

                // Error event
                this.socket.on('error', (error) => {
                    console.error('❌ [WebSocket] Error:', error);
                    this.emit('error', error);
                });

                // Message handlers
                this.socket.on('newMessage', (data) => {
                    this.taskQueue.push({ event: 'newMessage', data });
                    this.processQueue();
                });

                this.socket.on('messageSent', (data) => {
                    if (this.messageTimeouts.has(data.tempId)) {
                        clearTimeout(this.messageTimeouts.get(data.tempId));
                        this.messageTimeouts.delete(data.tempId);
                    }
                    this.pendingMessages.delete(data.tempId);
                    this.taskQueue.push({ event: 'messageSent', data });
                    this.processQueue();
                });

                this.socket.on('messageFailed', (data) => {
                    if (this.messageTimeouts.has(data.tempId)) {
                        clearTimeout(this.messageTimeouts.get(data.tempId));
                        this.messageTimeouts.delete(data.tempId);
                    }
                    this.taskQueue.push({ event: 'messageFailed', data });
                    this.processQueue();
                });

                this.socket.on('messagesRead', (data) => {
                    this.taskQueue.push({ event: 'messagesRead', data });
                    this.processQueue();
                });

                // Debounce typing events
                this.socket.on('userTyping', (data) => {
                    const key = `${data.conversationId}-${data.senderId}`;
                    
                    if (this.typingDebounceTimers.has(key)) {
                        clearTimeout(this.typingDebounceTimers.get(key));
                    }
                    
                    const timer = setTimeout(() => {
                        this.taskQueue.push({ event: 'userTyping', data });
                        this.processQueue();
                        this.typingDebounceTimers.delete(key);
                    }, 100);
                    
                    this.typingDebounceTimers.set(key, timer);
                });

                // Debounce status updates
                this.socket.on('userStatus', (data) => {
                    const key = `status-${data.userId}`;
                    
                    if (this.statusDebounceTimers.has(key)) {
                        clearTimeout(this.statusDebounceTimers.get(key));
                    }
                    
                    const timer = setTimeout(() => {
                        this.taskQueue.push({ event: 'userStatus', data });
                        this.processQueue();
                        this.statusDebounceTimers.delete(key);
                    }, 200);
                    
                    this.statusDebounceTimers.set(key, timer);
                });

                this.socket.on('onlineStatus', (data) => {
                    this.taskQueue.push({ event: 'onlineStatus', data });
                    this.processQueue();
                });

                this.socket.on('connected', (data) => {
                    console.log('🎉 [WebSocket] Server confirmed connection:', data);
                    this.userId = data.userId;
                    this.taskQueue.push({ event: 'connected', data });
                    this.processQueue();
                });

            } catch (error) {
                console.error('❌ [WebSocket] Failed to create socket:', error);
                reject(error);
                this.connectionPromise = null;
            }
        });

        return this.connectionPromise;
    }

    retryPendingMessages() {
        this.pendingMessages.forEach((message, tempId) => {
            console.log(`🔄 [WebSocket] Retrying message: ${tempId}`);
            this.sendMessage(message);
        });
    }

    disconnect() {
        if (this.socket) {
            // Clear all timers
            this.messageTimeouts.forEach((timeout) => clearTimeout(timeout));
            this.messageTimeouts.clear();
            this.pendingMessages.clear();
            
            this.typingDebounceTimers.forEach((timer) => clearTimeout(timer));
            this.typingDebounceTimers.clear();
            
            this.statusDebounceTimers.forEach((timer) => clearTimeout(timer));
            this.statusDebounceTimers.clear();
            
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.connectionPromise = null;
            
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        }
    }

    isConnected() {
        return this.socket?.connected || false;
    }

    sendMessage(data) {
        if (!this.isConnected()) {
            console.warn('⚠️ [WebSocket] Not connected, storing for retry');
            this.pendingMessages.set(data.tempId, data);
            this.connect().catch(err => {
                console.error('Reconnection failed:', err);
            });
            return false;
        }
        
        this.socket.emit('sendMessage', data);
        this.pendingMessages.set(data.tempId, data);
        
        const timeout = setTimeout(() => {
            if (this.pendingMessages.has(data.tempId)) {
                console.warn(`⚠️ Message ${data.tempId} not confirmed`);
                this.pendingMessages.delete(data.tempId);
                this.messageTimeouts.delete(data.tempId);
                this.emit('messageFailed', { 
                    tempId: data.tempId, 
                    error: 'Timeout' 
                });
            }
        }, 10000);
        
        this.messageTimeouts.set(data.tempId, timeout);
        
        return true;
    }

    sendTyping(data) {
        if (!this.isConnected()) return false;
        this.socket.emit('typing', data);
        return true;
    }

    markAsRead(data) {
        if (!this.isConnected()) return false;
        this.socket.emit('markAsRead', data);
        return true;
    }

    getOnlineStatus(userIds) {
        if (!this.isConnected()) return;
        this.socket.emit('getOnlineStatus', { userIds });
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }
}