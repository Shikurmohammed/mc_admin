import apiService from './apiService';
import { io } from "socket.io-client";
export const messagesAPI = {
    // Conversations
    getConversations: (page = 1, limit = 20) => 
        apiService.get(`/messages/conversations?page=${page}&limit=${limit}`),
    
    getConversation: (conversationId, page = 1, limit = 50) => 
        apiService.get(`/messages/conversations/${conversationId}?page=${page}&limit=${limit}`),
    
    startConversation: (data) => 
        apiService.post('/messages/conversations', data),
    
    // Messages
    sendMessage: (data) => 
        apiService.post('/messages/messages', data),
    
    markAsRead: (conversationId) => 
        apiService.post(`/messages/conversations/${conversationId}/read`),
    
    deleteConversation: (conversationId) => 
        apiService.delete(`/messages/conversations/${conversationId}`),
    
    getUnreadCount: () => 
        apiService.get('/messages/unread'),
};

// WebSocket service for real-time messaging
export class MessageWebSocket {
    constructor(token) {
        this.socket = null;
        this.token = token;
        this.listeners = new Map();
    }

    connect() {
        this.socket = io(`${process.env.REACT_APP_WS_URL}/messages`, {
            auth: { token: this.token },
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        this.socket.on('newMessage', (data) => {
            this.emit('newMessage', data);
        });

        this.socket.on('newMessageNotification', (data) => {
            this.emit('newMessageNotification', data);
        });

        this.socket.on('messagesRead', (data) => {
            this.emit('messagesRead', data);
        });

        this.socket.on('userTyping', (data) => {
            this.emit('userTyping', data);
        });

        this.socket.on('userStatus', (data) => {
            this.emit('userStatus', data);
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    sendMessage(data) {
        this.socket?.emit('sendMessage', data);
    }

    sendTyping(data) {
        this.socket?.emit('typing', data);
    }

    markAsRead(data) {
        this.socket?.emit('markAsRead', data);
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    }
}