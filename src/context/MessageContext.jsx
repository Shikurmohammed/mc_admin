import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { messagesAPI, MessageWebSocket } from '../services/messagesService';
import { useAuth } from './AuthContext';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [ws, setWs] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);

    // Initialize WebSocket
    useEffect(() => {
        if (user && token) {
            const socket = new MessageWebSocket(token);
            socket.connect();
            setWs(socket);

            socket.on('newMessage', handleNewMessage);
            socket.on('messagesRead', handleMessagesRead);
            socket.on('userTyping', handleUserTyping);
            socket.on('userStatus', handleUserStatus);

            return () => {
                socket.disconnect();
            };
        }
    }, [user, token]);

    // Load conversations
    useEffect(() => {
        if (user) {
            loadConversations();
            loadUnreadCount();
        }
    }, [user]);

    const loadConversations = async () => {
        setLoading(true);
        try {
            const data = await messagesAPI.getConversations();
            setConversations(data.conversations || []);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const data = await messagesAPI.getUnreadCount();
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to load unread count:', error);
        }
    };

    const handleNewMessage = (message) => {
        // Update conversations list
        setConversations(prev => {
            const index = prev.findIndex(c => c.id === message.conversationId);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    lastMessage: {
                        content: message.content,
                        createdAt: message.createdAt,
                        senderId: message.senderId,
                    },
                    unreadCount: message.senderId !== user.id 
                        ? (updated[index].unreadCount || 0) + 1 
                        : updated[index].unreadCount,
                };
                return updated;
            }
            return prev;
        });

        // Update active conversation if open
        if (activeConversation?.id === message.conversationId) {
            setActiveConversation(prev => ({
                ...prev,
                messages: [...(prev.messages || []), message],
            }));
        }

        // Update unread count
        if (message.senderId !== user?.id) {
            setUnreadCount(prev => prev + 1);
        }
    };

    const handleMessagesRead = ({ conversationId }) => {
        setConversations(prev => prev.map(c => 
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
        ));
        setUnreadCount(prev => Math.max(0, prev - (activeConversation?.unreadCount || 0)));
    };

    const handleUserTyping = ({ conversationId, isTyping }) => {
        setConversations(prev => prev.map(c => 
            c.id === conversationId ? { ...c, isTyping } : c
        ));
    };

    const handleUserStatus = ({ userId, isOnline }) => {
        setConversations(prev => prev.map(c => {
            if (c.participant?.id === userId) {
                return { ...c, participant: { ...c.participant, isOnline } };
            }
            return c;
        }));
    };

    const sendMessage = useCallback((conversationId, content) => {
        ws?.sendMessage({
            conversationId,
            content,
            recipientId: conversations.find(c => c.id === conversationId)?.participant?.id,
        });
    }, [ws, conversations]);

    const sendTyping = useCallback((conversationId, isTyping, recipientId) => {
        ws?.sendTyping({ conversationId, isTyping, recipientId });
    }, [ws]);

    const markAsRead = useCallback((conversationId) => {
        ws?.markAsRead({ conversationId, senderId: activeConversation?.participant?.id });
        messagesAPI.markAsRead(conversationId).catch(console.error);
    }, [ws, activeConversation]);

    const startConversation = useCallback(async (data) => {
        try {
            const conversation = await messagesAPI.startConversation(data);
            await loadConversations();
            return conversation;
        } catch (error) {
            console.error('Failed to start conversation:', error);
            throw error;
        }
    }, []);

    const value = {
        conversations,
        unreadCount,
        loading,
        activeConversation,
        setActiveConversation,
        sendMessage,
        sendTyping,
        markAsRead,
        startConversation,
        loadConversations,
        loadUnreadCount,
        isUserOnline: (userId) => {
            const conv = conversations.find(c => c.participant?.id === userId);
            return conv?.participant?.isOnline || false;
        },
    };

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages must be used within MessageProvider');
    }
    return context;
};